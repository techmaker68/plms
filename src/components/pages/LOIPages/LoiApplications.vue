<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

LOI applications table

***********************************
-->
<template>
  <div class="wrapper loi-req">
    <main class="filters-page-container">
      <div class="filters-page-content">
        <BreadCrumbs />
        <LOIApplicationsTable
          ref="requestsTable"
          :included-headers="LOIHheaders"
          enable-multi-selection
          enable-export
          :initial-filters="initialQueries"
          @row-click="updateLoiRequest"
          enable-accordion
        >
          <template #header-actions>
            <button
              @click="downloadPresentations"
              class="btn btn-outline-primary"
              v-t="'Download Presentation'"
            ></button>

            <SplitButton
              v-if="hasAddPermission"
              :label="$t('New Request')"
              icon="pi pi-plus"
              @click="showRequestModal"
              :model="splitButtonItems"
            />
          </template>
        </LOIApplicationsTable>
      </div>
    </main>
  </div>

  <VueModal v-model="loiRequestModal">
    <GenericModal
      :title="$t('LOI / New LOI Request')"
      @close="hideRequestModal"
    >
      <div class="modal-form">
        <label
          v-t="
            '** Please Create a new LOI request batch here first. Then complete request information and track the progress in the LOI management'
          "
        >
        </label>
        <div class="container my-5">
          <div class="row">
            <div class="col-md-3 d-flex align-items-center">
              <label v-t="'Nation Category'"></label>
            </div>
            <div class="col-md-9">
              <BaseDropDown
                v-model="v$.loiForm.nation_category.$model"
                :options="loiStore.nationCategories"
                optionValue="id"
                optionLabel="value"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 d-flex align-items-center">
              <label v-t="'LOI type'"></label>
            </div>
            <div class="col-md-9">
              <BaseDropDown
                v-model="v$.loiForm.loi_type.$model"
                :options="loiStore.loiTypes"
                optionValue="id"
                optionLabel="value"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3 d-flex align-items-center">
              <label v-t="'LOI Priority'"></label>
            </div>
            <div class="col-md-9">
              <BaseDropDown
                v-model="v$.loiForm.priority.$model"
                :options="loiStore.loiPriorities"
                optionValue="id"
                optionLabel="value"
              />
            </div>
          </div>
        </div>
        <AddButton
          :disabled="v$.loiForm.$invalid"
          class="btn btn-blue float-end"
          aria-label="Close"
          @click="createNewLoiRequest()"
        >
        </AddButton>
      </div>
    </GenericModal>
  </VueModal>

  <ImportConfirmModal
    v-model="importModal"
    :type="excelTypeEnum.Loi"
    @upload-success="updateTable"
  ></ImportConfirmModal>
</template>

<script>
import { defineComponent } from "vue";
import { useLOIStore, useUserStore } from "@/stores";
import GenericModal from "@/components/common/GenericModal.vue";
import LOIApplicationsTable from "./components/LOIApplicationsTable.vue";
import { mapStores } from "pinia";
import {
  Routes,
  LOIApplicationsHeaders,
  PermissionsEnum,
  ExcelTypeEnum,
  LOITypes,
  LOINationCategories,
  LOIPriority,
} from "@/data";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import ImportConfirmModal from "@/components/common/ImportConfirmModal.vue";
import SplitButton from "primevue/splitbutton";
import AddButton from "@/components/common/AddButton.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

export default defineComponent({
  name: "LoiManagement",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    const { status } = this.$route.query;

    const initialQueries = {
      status: +status,
    };

    return {
      loiForm: {
        nation_category: LOINationCategories.Arab,
        loi_type: LOITypes.ThreeMonths,
        priority: LOIPriority.Normal,
      },
      loiRequestModal: false,
      LOIHheaders: [
        LOIApplicationsHeaders.BatchNo,
        LOIApplicationsHeaders.NationCategory,
        LOIApplicationsHeaders.ApplicantsCount,
        LOIApplicationsHeaders.SubmissionDate,
        LOIApplicationsHeaders.BOCMFD,
        LOIApplicationsHeaders.BOCHQDate,
        LOIApplicationsHeaders.MOODate,
        LOIApplicationsHeaders.MOIPaymentDate,
        LOIApplicationsHeaders.LOINo,
        LOIApplicationsHeaders.LOIIssueDate,
        LOIApplicationsHeaders.LOIIssued,
        LOIApplicationsHeaders.Priority,
        LOIApplicationsHeaders.Status,
      ],
      excelTypeEnum: ExcelTypeEnum,
      importModal: false,
      initialQueries,
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
  validations() {
    return {
      loiForm: {
        nation_category: {
          required: helpers.withMessage("This field is required", required),
        },
        loi_type: {
          required: helpers.withMessage("This field is required", required),
        },
        priority: {
          required: helpers.withMessage("This field is required", required),
        },
      },
    };
  },
  components: {
    GenericModal,
    LOIApplicationsTable,
    BaseDropDown,
    ImportConfirmModal,
    SplitButton,
    AddButton,
    BreadCrumbs,
  },
  methods: {
    async updateLoiRequest({ id }) {
      this.navigateToLOIRequest(id);
    },
    async downloadPresentations() {
      try {
        await this.loiStore.downloadPresentationFiles();
      } catch (error) {
        console.log("Error", error);
      }
    },
    async createNewLoiRequest() {
      try {
        this.hideRequestModal();
        const { id } = await this.loiStore.addLoiApplication(this.loiForm);
        this.navigateToLOIRequest(id);
      } catch (error) {
        console.log("Error", error);
      }
    },
    navigateToLOIRequest(id) {
      if (id) {
        this.$router.push({
          name: Routes.LOIRequest,
          params: {
            id,
          },
        });
      }
    },
    updateTable() {
      this.$refs.requestsTable?.triggerServerRefresh();
    },
    showRequestModal() {
      this.loiRequestModal = true;
    },
    hideRequestModal() {
      this.loiRequestModal = false;
    },
  },
  computed: {
    ...mapStores(useLOIStore, useUserStore),
    hasAddPermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_ADD);
    },
  },
});
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 1rem;
}

.col-md-9 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}
</style>
