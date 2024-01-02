<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

View/Add/Edit/Delete visas

***********************************
-->
<template>
  <div class="wrapper">
    <main class="filters-page-container">
      <div class="filters-page-content">
        <BreadCrumbs />
        <div class="table-responsive flex-grow-1">
          <VisaTable
            ref="visaTable"
            @row-click="showRow($event)"
            enable-accordion
            enable-legend
          >
            <template #header-actions>
              <AddButton
                v-if="hasAddPermission"
                class="btn btn-primary btn-icon text-nowrap button-table-action"
                @click="showVisaFormModal"
              >
                <span>{{ $t("Add Visa") }}</span>
              </AddButton>
            </template>
          </VisaTable>
        </div>
      </div>
    </main>
  </div>

  <VueModal
    v-model="visaFormModal"
    @closed="resetValues"
    wrapperClass="vm-lg vm-body-no-padding"
  >
    <GenericModal :title="modalTitle" @close="hideVisaFormModal">
      <VisaForm
        :item="item"
        @updateTableRequest="updateTable"
        @close="hideVisaFormModal"
      />
    </GenericModal>
  </VueModal>

  <ImportConfirmModal
    v-model="importModal"
    :type="excelTypeEnum.Visa"
    @upload-success="updateTable"
  ></ImportConfirmModal>
</template>

<script>
import { defineComponent } from "vue";
import { useVisaStore, useConfigStore, useUserStore } from "@/stores";
import { mapStores } from "pinia";
import GenericModal from "@/components/common/GenericModal.vue";
import VisaForm from "@/components/common/VisaForm.vue";
import { isValidObject } from "@/helpers";
import { ExcelTypeEnum, PermissionsEnum } from "@/data";
import ImportConfirmModal from "@/components/common/ImportConfirmModal.vue";
import SplitButton from "primevue/splitbutton";
import VisaTable from "./components/VisaTable.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import AddButton from "@/components/common/AddButton.vue";

export default defineComponent({
  name: "VisaManagement",
  data() {
    return {
      item: {},
      visaFormModal: false,
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
    };
  },
  components: {
    GenericModal,
    VisaForm,
    ImportConfirmModal,
    SplitButton,
    VisaTable,
    BreadCrumbs,
    AddButton,
  },
  methods: {
    updateTable() {
      this.$refs.visaTable.triggerServerRefresh();
    },
    async showRow({ id }) {
      try {
        const [visaDetails] = await Promise.all([
          this.visaStore.getVisaDetail(id),
        ]);
        this.item = {
          ...visaDetails.data,
          historical_visa: visaDetails.historical_visa,
        };
        this.showVisaFormModal();
      } catch (error) {
        console.log("Error getting visa details", error);
      }
    },
    showVisaFormModal() {
      this.visaFormModal = true;
    },
    hideVisaFormModal() {
      this.visaFormModal = false;
    },
    resetValues() {
      this.item = {};
    },
  },
  computed: {
    ...mapStores(useVisaStore, useConfigStore, useUserStore),
    isItemValid() {
      return isValidObject(this.item);
    },
    modalTitle() {
      return this.isItemValid
        ? this.$t("Visa Details")
        : this.$t("New Visa Sticker");
    },
    hasAddPermission() {
      return this.userStore.hasPermission(PermissionsEnum.VISA_ADD);
    },
  },
});
</script>

<style scoped>
.VisaCancelled .label-value li label {
  width: 40%;
}

.visaadd .label-value li label {
  width: 45%;
}

p {
  text-align: left;
}

.bg-white {
  background: white;
}

.icon-grey.icon-userIcon:before {
  color: #ccc !important;
}
</style>
