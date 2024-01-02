<!--
***********************************
@author Mohanned Hassan, Umair
@create_date 1st April 2023

Contractors table
Add contractor

***********************************
-->
<template>
  <DefineTemplate v-slot="{ data }">
    <div class="filter-list d-flex justify-content-start">
      <SearchField v-model="searchCompanyTable" hide-buttons />
    </div>
    <EasyDataTable
      :headers="headers"
      :items="data"
      :search-value="searchCompanyTable"
      body-row-class-name="cursor-pointer"
      @click-row="showRow"
      alternating
      v-bind="extraOptions"
    >
      <template #item-phone="{ phone }">
        {{ checkValidValue(phone) }}
      </template>
      <template #item-industry="{ industry }">
        {{ checkValidValue(industry) }}
      </template>
      <template #item-country="{ country }">
        {{ checkValidValue(country?.country_name_short_en) }}
      </template>
      <template #item-status="{ status }">
        {{ companyStore.getCompanyStatus(status).status }}
      </template>
    </EasyDataTable>
  </DefineTemplate>

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
            @click="showModal"
          >
            <span v-t="'New Company'"></span>
          </AddButton>
        </div>
      </div>

      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="all-tab"
            data-bs-toggle="tab"
            data-bs-target="#all-companies-pane"
            type="button"
            role="tab"
            aria-controls="all-companies-pane"
            aria-selected="false"
          >
            <span v-t="'All Companies'"></span>
            <span class="reqCount reqCount--allCompany">{{
              companyStore.approvedCompaniesCount
            }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="expired-tab"
            data-bs-toggle="tab"
            data-bs-target="#pending-request-pane"
            type="button"
            role="tab"
            aria-controls="pending-request-pane"
            aria-selected="true"
          >
            <span v-t="'Pending request'"></span>
            <span class="reqCount reqCount--pendingReq">{{
              companyStore.pendingCompaniesCount
            }}</span>
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="all-companies-pane"
          role="tabpanel"
          aria-labelledby="all-tab"
          tabindex="0"
        >
          <ReuseTemplate :data="companyStore.approvedCompanies" />
        </div>
        <div
          class="tab-pane fade"
          id="pending-request-pane"
          role="tabpanel"
          aria-labelledby="expired-tab"
          tabindex="0"
        >
          <ReuseTemplate :data="companyStore.pendingCompanies" />
        </div>
      </div>

      <VueModal
        v-model="showCompanyModal"
        @closed="resetValues"
        wrapperClass="vm-lg vm-body-no-padding"
      >
        <GenericModal
          :title="$t('Employer Company Information')"
          @close="hideModal"
        >
          <CompanyManagementForm
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
import { useCompanyStore, useConfigStore, useUserStore } from "@/stores";
import { ref } from "vue";
import CompanyManagementForm from "./components/CompanyManagementForm.vue";
import GenericModal from "@/components/common/GenericModal.vue";
import { mapStores } from "pinia";
import { PermissionsEnum } from "@/data";
import { useTable } from "@/composables";
import AddButton from "@/components/common/AddButton.vue";
import SearchField from "@/components/common/SearchField.vue";
import { checkValidValue } from "@/helpers";
import { createReusableTemplate } from "@vueuse/core";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

export default defineComponent({
  name: "ContractorRegister",
  setup() {
    const { extraOptions } = useTable();
    return { extraOptions };
  },
  data: function () {
    return {
      headers: [
        { text: "No.", value: "phone", sortable: true },
        { text: "Company Name", value: "name", sortable: true },
        { text: "Short Name", value: "short_name" },
        { text: "Type", value: "type", sortable: true },
        { text: "Industry", value: "industry" },
        { text: "City", value: "city" },
        { text: "Country", value: "country" },
        { text: "Paxes", value: "paxes" },
        { text: "Status", value: "status", sortable: true },
      ],
      searchCompanyTable: ref(""),
      item: {},
      showCompanyModal: false,
      checkValidValue,
    };
  },
  components: {
    GenericModal,
    CompanyManagementForm,
    AddButton,
    SearchField,
    DefineTemplate,
    ReuseTemplate,
    BreadCrumbs,
  },
  async mounted() {
    await this.getTableData();
  },
  async unmounted() {
    await this.configStore.getCompanies(true);
  },
  methods: {
    async showRow(item) {
      try {
        this.item = await this.companyStore.getCompanyDetail(item.id);

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
        this.getTableData();
      }
    },
    async getTableData() {
      try {
        await this.companyStore.getCompanyList(undefined, {
          all: true,
        });
      } catch (error) {
        console.log("error", error);
      }
    },
    resetValues() {
      // We can't send null, so empty object it is
      this.item = {};
    },
  },
  computed: {
    ...mapStores(useCompanyStore, useConfigStore, useUserStore),
    hasAddPermission() {
      return this.userStore.hasPermission(PermissionsEnum.COMPANY_ADD);
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
