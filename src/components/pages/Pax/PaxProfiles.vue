<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Display all PAXes
Add new PAX

***********************************
-->
<template>
  <div class="wrapper">
    <main class="filters-page-container">
      <div class="filters-page-content">
        <BreadCrumbs />
        <PaxTable
          ref="paxTable"
          :initial-filters="initialQueries"
          :included-headers="paxTableHeaders"
          @row-click="showRow($event)"
          enable-accordion
          enable-legend
        >
          <template #header-actions>
            <SplitButton
              v-if="hasAddPermission"
              :label="$t('Add Pax')"
              icon="pi pi-plus"
              @click="showProfileFormModal"
              :model="splitButtonItems"
            />
          </template>
        </PaxTable>
      </div>
    </main>
  </div>

  <VueModal
    v-model="profileFormModal"
    @closed="resetValues"
    wrapperClass="vm-lg vm-body-no-padding"
  >
    <GenericModal
      :title="$t('Create PAX Profile')"
      @close="hideProfileFormModal"
    >
      <PaxProfileForm
        @close="hideProfileFormModal"
        @updatePaxTable="updatePaxMainTable"
        @create="createPax"
      />
    </GenericModal>
  </VueModal>

  <VueModal
    v-model="profileViewModal"
    @closed="resetValues"
    wrapperClass="vm-xlg vm-body-no-padding"
  >
    <GenericModal :title="$t('PAX Profile')" @close="hideProfileViewModal">
      <PaxProfile
        @close="hideProfileViewModal"
        @updateTable="updatePaxMainTable"
        :id="plmsProfile?.id"
      />
    </GenericModal>
  </VueModal>

  <ImportConfirmModal
    v-model="importModal"
    :type="excelTypeEnum.Pax"
    @upload-success="updatePaxMainTable"
  ></ImportConfirmModal>
</template>

<script>
import { defineComponent } from "vue";
import PaxTable from "@/components/common/PaxTable.vue";
import PaxProfileForm from "./components/PaxProfileForm.vue";
import { mapStores } from "pinia";
import { useConfigStore, usePLMSStore, useUserStore } from "@/stores";
import { ExcelTypeEnum, PAXHeaders, PermissionsEnum } from "@/data";
import GenericModal from "@/components/common/GenericModal.vue";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import {
  convertQueryStringToArray,
  convertQueryStringToBoolean,
} from "@/helpers";
import PaxProfile from "./PaxProfile.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import ImportConfirmModal from "@/components/common/ImportConfirmModal.vue";
import SplitButton from "primevue/splitbutton";

export default defineComponent({
  name: "PaxProfiles",
  data() {
    const { status, type, noVisas, noPassports } = this.$route.query;

    const initialQueries = {
      status: +status,
      type: convertQueryStringToArray(type),
      pax_without_visa: convertQueryStringToBoolean(noVisas),
      pax_without_passport: convertQueryStringToBoolean(noPassports),
    };

    return {
      paxTableHeaders: [
        PAXHeaders.PAX,
        PAXHeaders.FullName,
        PAXHeaders.PAXType,
        PAXHeaders.BadgeNo,
        PAXHeaders.Position,
        PAXHeaders.Department,
        PAXHeaders.Employer,
        PAXHeaders.Docs,
      ],
      plmsProfile: {},
      profileFormModal: false,
      profileViewModal: false,
      excelTypeEnum: ExcelTypeEnum,
      importModal: false,
      splitButtonItems: [
        {
          label: this.$t("Import Excel"),
          command: () => {
            this.importModal = true;
          },
        },
      ],
      initialQueries,
    };
  },
  computed: {
    ...mapStores(usePLMSStore, useConfigStore, useUserStore),
    hasAddPermission() {
      return this.userStore.hasPermission(PermissionsEnum.PAX_ADD);
    },
  },
  components: {
    GenericModal,
    PaxProfileForm,
    PaxTable,
    BaseDropDown,
    PaxProfile,
    BreadCrumbs,
    ImportConfirmModal,
    SplitButton,
  },
  methods: {
    updatePaxMainTable() {
      this.$refs.paxTable.triggerServerRefresh();
    },
    async showRow(item) {
      this.plmsProfile = item;
      this.showProfileViewModal();
    },
    showProfileFormModal() {
      this.profileFormModal = true;
    },
    hideProfileFormModal() {
      this.profileFormModal = false;
    },
    showProfileViewModal() {
      this.profileViewModal = true;
    },
    hideProfileViewModal() {
      this.profileViewModal = false;
    },
    resetValues() {
      this.plmsProfile = null;
    },
    async createPax(data) {
      try {
        await this.plmsStore.addPax(data);
        this.updatePaxMainTable();
        this.hideProfileFormModal();
      } catch (error) {
        console.log("Error creating pax", error);
      }
    },
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

.gray.icon-userIcon:before {
  color: #ccc !important;
}
</style>
