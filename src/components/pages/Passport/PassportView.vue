<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Display passports table

***********************************
-->
<template>
  <div class="wrapper">
    <main class="filters-page-container">
      <div class="filters-page-content">
        <BreadCrumbs />
        <div class="table-responsive">
          <PassportTable
            :initial-filters="initialQueries"
            ref="passportTable"
            @row-click="showRow($event)"
            enable-accordion
            enable-legend
          >
            <template #header-actions>
              <AddButton
                class="btn btn-primary btn-icon text-nowrap button-table-action"
                v-if="hasAddPermission"
                :title="$t('Add Passport')"
                @click="showPassportModal"
              >
                <span v-t="'Add Passport'"></span>
              </AddButton>
            </template>
          </PassportTable>
        </div>
      </div>
    </main>
  </div>

  <VueModal
    v-model="passportModal"
    @closed="resetValues"
    wrapperClass="vm-lg vm-body-no-padding"
  >
    <GenericModal :title="modalTitle" @close="hidePassportModal">
      <PassportForm
        :item="item"
        @updateTableRequest="updateTable"
        @close="hidePassportModal"
      />
    </GenericModal>
  </VueModal>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import {
  useConfigStore,
  usePassportStore,
  usePLMSStore,
  useUserStore,
} from "@/stores";
import { useTable } from "@/composables";
import { isValidObject } from "@/helpers";
import GenericModal from "@/components/common/GenericModal.vue";
import { mapStores, storeToRefs } from "pinia";
import PassportForm from "@/components/common/PassportForm.vue";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { PermissionsEnum } from "@/data";
import { useRoute } from "vue-router";
import ExportButton from "@/components/common/ExportButton.vue";
import AddButton from "@/components/common/AddButton.vue";
import SearchField from "@/components/common/SearchField.vue";
import PassportTable from "./components/PassportTable.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

export default defineComponent({
  setup(props) {
    const { query } = useRoute();
    const { status } = query;

    const initialQueries = {
      status: +status,
    };

    return { initialQueries };
  },
  data() {
    return {
      item: {},
      passportModal: false,
    };
  },
  methods: {
    updateTable() {
      this.$refs.passportTable.triggerServerRefresh();
    },
    async showRow({ id }) {
      try {
        let response = await this.passportStore.getPassportDetails(id);
        this.item = response;
        this.showPassportModal();
      } catch (error) {
        console.log("error", error);
      }
    },
    showPassportModal() {
      this.passportModal = true;
    },
    hidePassportModal() {
      this.passportModal = false;
    },
    resetValues() {
      this.item = {};
    },
  },
  computed: {
    ...mapStores(useConfigStore, usePassportStore, usePLMSStore, useUserStore),
    isItemValid() {
      return isValidObject(this.item);
    },
    modalTitle() {
      return this.isItemValid
        ? this.$t("Edit Passport")
        : this.$t("Add Passport");
    },
    hasAddPermission() {
      return this.userStore.hasPermission(PermissionsEnum.PASSPORT_ADD);
    },
  },
  components: {
    PassportForm,
    GenericModal,
    BaseDropDown,
    ExportButton,
    AddButton,
    SearchField,
    PassportTable,
    BreadCrumbs,
  },
});
</script>

<style scoped>
.bg-white {
  background: white;
}

.bg-gray {
  background: #f6f6f6;
}
.icon-grey.icon-userIcon:before {
  color: #ccc !important;
}
</style>
