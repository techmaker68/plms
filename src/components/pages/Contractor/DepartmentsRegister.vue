<!--
***********************************
@author Mohanned Hassan, Umair
@create_date 1st April 2023

Departments table

***********************************
-->
<template>
  <div class="wrapper">
    <main>
      <div
        class="page-header d-flex justify-content-between align-items-center"
      >
        <BreadCrumbs />
        <div class="btns">
          <AddButton
            class="btn btn-primary btn-icon"
            v-if="hasAddPermission"
            @click="showModal(true)"
          >
            <span v-t="'New Department'"></span>
          </AddButton>
        </div>
      </div>

      <div
        class=""
        id="all-companies-pane"
        role="tabpanel"
        aria-labelledby="all-tab"
        tabindex="0"
      >
        <div class="filter-list d-flex justify-content-start">
          <SearchField
            v-model="extraFilters.search"
            :showClearSearch="showClearSearch"
            @submit="search"
            @cancel="clearSearch"
          />
        </div>
        <EasyDataTable
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :headers="headers"
          :items="serverItems"
          :alternating="true"
          :loading="loading"
          body-row-class-name="cursor-pointer"
          @click-row="showRow"
          v-bind="extraOptions"
        >
          <template #item-company="{ company }">
            {{ checkValidValue(company?.name) }}
          </template>
        </EasyDataTable>
      </div>

      <VueModal
        v-model="showCompanyModal"
        @closed="resetValues"
        wrapperClass="vm-lg vm-body-no-padding"
      >
        <GenericModal
          :title="
            isItemValid ? $t('Create Department') : $t('Update Department')
          "
          @close="hideModal"
        >
          <DepartmentsManagementForm
            @close="(shouldUpdate) => hideModal(shouldUpdate)"
            :item="item"
          />
        </GenericModal>
      </VueModal>
    </main>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useDepartmentStore, useConfigStore, useUserStore } from "@/stores";
import { useTable } from "@/composables";
import { ref } from "vue";
import DepartmentsManagementForm from "./components/DepartmentsManagementForm.vue";
import GenericModal from "@/components/common/GenericModal.vue";
import { mapStores } from "pinia";
import { checkValidValue, isValidObject, resetObject } from "@/helpers";
import { PermissionsEnum } from "@/data";
import AddButton from "@/components/common/AddButton.vue";
import SearchField from "@/components/common/SearchField.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

export default defineComponent({
  setup(props) {
    const extraFilters = ref({
      search: "",
    });
    const { getDepartmentList } = useDepartmentStore();
    const apiCall = (pagination) => {
      return getDepartmentList(pagination, {
        ...extraFilters.value,
      });
    };

    const defaultHeaders = ref([
      { text: "ID", value: "id" },
      { text: "Name", value: "name" },
      { text: "Abbreviation", value: "abbreviation" },
      { text: "Manager", value: "manager_name" },
      { text: "Company", value: "company" },
    ]);
    const {
      headers,
      serverItems,
      serverItemsLength,
      serverOptions,
      extraOptions,
      vModelWorkaround,
      loading,
      triggerServerRefresh,
    } = useTable(defaultHeaders, props, apiCall, {
      sortBy: "",
      sortType: "",
    });

    return {
      serverItems,
      headers,
      triggerServerRefresh,
      serverItemsLength,
      serverOptions,
      extraFilters,
      extraOptions,
      vModelWorkaround,
      loading,
    };
  },
  data() {
    return {
      item: {},
      modalType: false,
      showCompanyModal: false,
      showClearSearch: false,
      checkValidValue,
    };
  },
  components: {
    GenericModal,
    DepartmentsManagementForm,
    AddButton,
    SearchField,
    BreadCrumbs,
  },
  async unmounted() {
    await this.configStore.getDepartments(true);
  },
  methods: {
    async showRow({ id }) {
      try {
        this.item = await this.departmentStore.getDepartmentDetail(id);
        this.showModal();
      } catch (error) {
        console.log("error", error);
      }
    },
    showModal() {
      this.showCompanyModal = true;
    },
    hideModal(shouldUpdate) {
      this.showCompanyModal = false;

      if (shouldUpdate) {
        this.triggerServerRefresh(true);
      }
    },
    search() {
      this.triggerServerRefresh(true);
      this.showClearSearch = true;
    },
    clearSearch() {
      this.extraFilters = resetObject(this.extraFilters);
      this.triggerServerRefresh(true);
      this.showClearSearch = false;
    },
    resetValues() {
      this.item = {};
    },
  },
  computed: {
    ...mapStores(useDepartmentStore, useConfigStore, useUserStore),
    hasAddPermission() {
      return this.userStore.hasPermission(PermissionsEnum.DEPARTMENT_ADD);
    },
    isItemValid() {
      return isValidObject(this.item);
    },
  },
});
</script>
<style scoped>
.reqCount {
  font-size: 1.2rem;
  margin-inline-start: 2rem;
  font-weight: 700;
}
.reqCount--allCompany {
  color: #0e6eb8;
}
.reqCount--pendingReq {
  color: #ff6600;
}
</style>
