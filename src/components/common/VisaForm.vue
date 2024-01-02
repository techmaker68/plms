<!--
***********************************
@author Mohanned Hassan
@create_date 1st July 2023

***********************************
-->
<template>
  <div
    class="visaDetails modal-form p-5"
    :class="{
      'view-only-container': viewOnly,
      'disable-validation': isItemValid,
    }"
  >
    <div class="visaBackground">
      <div class="d-flex flex-row align-items-stretch">
        <div
          class="d-flex flex-row justify-content-start align-items-stretch flex-grow-1"
          style="gap: 2rem"
        >
          <div
            class="d-flex flex-column justify-content-start align-items-stretch"
            style="gap: 1rem"
          >
            <div class="image-upload profile-img">
              <img
                v-if="passportProfile"
                :src="passportProfile"
                height="250"
                width="250"
              />
              <img
                v-else
                src="@/assets/img/profile.svg"
                height="250"
                width="250"
              />
            </div>
            <div class="text-center username">
              <h4>{{ visa.full_name }}</h4>
            </div>
          </div>
          <div
            class="popup-form d-flex flex-column justify-content-start align-items-stretch flex-grow-1"
            style="gap: 2rem"
          >
            <div class="horizontal-form-container" v-if="isItemValid">
              <div class="vertical-form-field required-form-control">
                <label class="form-label" v-t="'Visa Status'"></label>
                <span
                  class="align-self-start"
                  :class="{
                    'expired-visa-status-badge':
                      visaStatusID == visaStatusRiskEnum.Expired ||
                      visaStatusID == visaStatusRiskEnum.Cancelled,
                    'text-danger upsized-text':
                      visaStatusID == visaStatusRiskEnum.ToBeRenewedNew,
                    'text-warning upsized-text':
                      visaStatusID == visaStatusRiskEnum.ToBeRenewedOld,
                  }"
                  >{{ item?.status }}</span
                >
              </div>
            </div>

            <div
              :class="{
                'horizontal-form-container': isFormVisible,
                'empty-form-container': !isFormVisible,
              }"
            >
              <template v-if="isFormVisible">
                <div class="vertical-form-field">
                  <label class="form-label" v-t="'LOI NO'"></label>
                  <span class="upsized-text">{{ v$.visa.loi_no.$model }}</span>
                </div>

                <div class="vertical-form-field">
                  <label class="form-label" v-t="'Passport NO'"></label>
                  <span class="upsized-text">{{
                    v$.visa.passport_no.$model
                  }}</span>
                </div>
              </template>

              <div
                class="vertical-form-field required-form-control"
                :class="{
                  'flex-grow-0': !isFormVisible,
                }"
                style="flex-basis: 100%"
              >
                <label for="Profile" class="form-label" v-t="'PAX ID'"></label>
                <div
                  class="form_control_search-container"
                  :class="{
                    'no-cursor': !enablePaxIDField,
                  }"
                  @click="searchProfile"
                >
                  <input
                    :class="{
                      'no-borders-form-control': !enablePaxIDField,
                    }"
                    id="searchPlmsId"
                    class="form-control form-control__search passport-number-control"
                    :placeholder="$t('Search')"
                    disabled
                    v-model="v$.visa.pax_id.$model"
                  />
                  <span
                    v-if="enablePaxIDField"
                    class="icon-searchIcon cursor-pointer"
                  ></span>
                </div>
              </div>

              <template v-if="isFormVisible">
                <div class="vertical-form-field required-form-control">
                  <label class="form-label" v-t="'Date of Issue'"></label>
                  <CustomDatepicker
                    class="visa-date-field"
                    v-model:value="v$.visa.date_of_issue.$model"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    :disabled-date="issueDisabledDates"
                    :disabled="viewOnly"
                  />
                </div>

                <div class="vertical-form-field required-form-control">
                  <label class="form-label" v-t="'Date of Expiry'"></label>
                  <CustomDatepicker
                    class="visa-date-fields"
                    :input-class="
                      viewOnly && {
                        'bg-transparent': true,
                        'expired-visa-date':
                          visaStatusID == visaStatusRiskEnum.Expired ||
                          visaStatusID == visaStatusRiskEnum.Cancelled,
                        'text-danger':
                          visaStatusID == visaStatusRiskEnum.ToBeRenewedNew,
                        'text-warning':
                          visaStatusID == visaStatusRiskEnum.ToBeRenewedOld,
                      }
                    "
                    v-model:value="v$.visa.date_of_expiry.$model"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    :disabled-date="expiryDisabledDates"
                    :disabled="viewOnly"
                  />
                </div>

                <div class="vertical-form-field required-form-control">
                  <label class="form-label" v-t="'Visa Type'"></label>
                  <BaseDropDown
                    v-model="v$.visa.type.$model"
                    :options="visaStore.visaType"
                    :disabled="viewOnly"
                  />
                  <ErrorMessages :errors="v$.visa.type.$errors" />
                </div>

                <div class="vertical-form-field required-form-control">
                  <label class="form-label" v-t="'Visa Location'"></label>
                  <BaseDropDown
                    class="text-capitalize"
                    v-model="v$.visa.visa_location.$model"
                    :options="visaStore.visaLocation"
                    :disabled="viewOnly"
                  />
                  <ErrorMessages :errors="v$.visa.visa_location.$errors" />
                </div>

                <div class="vertical-form-field required-form-control">
                  <label class="form-label" v-t="'Visa Sticker'"></label>
                  <input
                    type="text"
                    class="form-control visa-fields"
                    :disabled="viewOnly"
                    v-model="v$.visa.visa_no.$model"
                  />
                  <ErrorMessages :errors="v$.visa.visa_no.$errors" />
                </div>
                <template v-if="!viewOnly">
                  <div class="vertical-form-field" style="flex-basis: 100%">
                    <div
                      class="d-flex flex-row justify-content-between align-items-center"
                    >
                      <label for="" class="form-label"
                        ><span v-t="'Visa Scanned Copy'"></span>
                        <span
                          class="noteClass"
                          v-if="scannedVisaFile"
                          v-t="
                            '(Note: Click on arrow icon for previously uploaded photocopy)'
                          "
                        >
                        </span>
                      </label>
                      <a
                        v-if="scannedVisaFile"
                        :href="scannedVisaFile"
                        target="_blank"
                        class="btn btn-link btn-icon"
                        type="button"
                      >
                        <span class="icon-downloadIcon passportDownloadIcon">
                        </span>
                      </a>
                    </div>
                    <div>
                      <input
                        type="file"
                        class="form-control"
                        placeholder=""
                        ref="fileInput"
                        :disabled="viewOnly"
                        @input="scannedCopyUpload"
                      />
                      <InputFileTooltip />
                    </div>
                    <span class="text-danger text-capitalize">{{
                      fileErr
                    }}</span>
                  </div>
                </template>

                <template v-else>
                  <div style="flex-basis: 100%">
                    <button
                      v-if="scannedVisaFile"
                      class="btn btn-primary btn-icon btn-large"
                      @click="openTab(scannedVisaFile)"
                    >
                      <span v-t="'Download Visa'"></span>
                    </button>
                  </div>
                </template>

                <div class="vertical-form-field" v-if="isVisaCancelled">
                  <label class="form-label" v-t="'Cancellation Reason'"></label>
                  <p>{{ item?.reason }}</p>
                </div>
              </template>

              <template v-else>
                <div class="row">
                  <div
                    class="col-12 loi-no-error"
                    v-if="v$.visa.loi_no.$errors?.length"
                  >
                    <ErrorMessages :errors="v$.visa.loi_no.$errors">
                      <template #extra>
                        <button
                          @click="navigateToLoi"
                          class="btn btn-outline-primary"
                        >
                          <span v-t="'Navigate to LOI'"></span>
                        </button>
                      </template>
                    </ErrorMessages>
                  </div>
                </div>
              </template>
            </div>

            <div
              class="save-buttons-container"
              v-if="!viewOnly && isFormVisible"
            >
              <div
                class="delete-button-container"
                v-if="isItemValid && hasDeletePermission"
              >
                <DeleteButton @click="showDeleteModal" />

                <DeleteButton
                  v-if="!isVisaCancelled"
                  :icon="faRectangleXmark"
                  @click="showCancelModal"
                >
                  <span>{{ $t("Revoke Visa") }}</span>
                </DeleteButton>
              </div>

              <CancelButton
                v-if="isItemValid"
                type="button"
                class="btn btn-secondary"
                @click="disableEditing"
              >
              </CancelButton>
              <SaveButton
                type="button"
                class="btn btn-blue"
                @click="onSubmit"
                :disabled="v$.visa.$invalid"
              >
                {{ isItemValid ? $t("Update") : $t("Save") }}
              </SaveButton>
            </div>
          </div>
        </div>

        <div
          class="d-flex flex-column justify-content-start align-items-center"
          style="gap: 1rem"
        >
          <button
            v-if="viewOnly && !isVisaCancelled && hasEditPermission"
            class="btn btn-link btn-icon company-edit-icon edit-details ms-0 mb-4"
            type="button"
            @click="enableEditing"
          >
            <span class="icon-edit"></span>
          </button>
        </div>
      </div>

      <div class="visa-historic-datatable" v-if="isItemValid">
        <div class="row mt-4">
          <div class="mb-2">
            <div
              class="d-flex justify-content-between align-items-center card-popup-header mb-4"
            >
              <h3 class="popup-subtile">
                <span v-t="'Historical Visa'"></span>
              </h3>
              <div class="d-flex"></div>
            </div>
          </div>
          <EasyDataTable
            class="easy-data-table"
            :headers="historicDataHeaders"
            :items="visaHistory"
            alternating
            v-bind="extraOptions"
          >
            <template #item-status="{ status, status_id }">
              <span
                :class="{
                  'expired-visa-status-badge':
                    status_id == visaStatusRiskEnum.Expired ||
                    status_id == visaStatusRiskEnum.Cancelled,
                  'text-danger': status_id == visaStatusRiskEnum.ToBeRenewedNew,
                  'text-warning':
                    status_id == visaStatusRiskEnum.ToBeRenewedOld,
                }"
              >
                {{ status }}
              </span>
            </template>
            <template #item-attachments="{ file }">
              <div v-if="file">
                <img src="@/assets/img/pdf.svg" class="pdf-spacing" />
                <a
                  href="javascript:void(0)"
                  @click="
                    configStore.downloadFileFromURL(
                      file,
                      showAttachmentName(file)
                    )
                  "
                >
                  {{ $t("Attachment") }}
                </a>
              </div>
              <div v-else>
                <span v-t="'No attachment'"></span>
              </div>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>

  <VueModal v-model="paxTableModal" wrapperClass="vm-lg">
    <GenericModal :title="$t('Select Pax')" @close="paxTableModal = false">
      <PaxTable
        :included-headers="paxTableHeaders"
        @row-click="autofillVisa"
        latest-loi
        latest-passport
      >
      </PaxTable>
    </GenericModal>
  </VueModal>

  <VueModal v-model="cancelVisaModal" wrapperClass="vm-md">
    <VisaCancelForm @close="hideCancelModal" @submit="cancelVisa" />
  </VueModal>

  <VueModal v-model="deleteModal">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="deleteVisa"
      delete
      :title="$t('Delete Visa')"
      :message="$t('Are you sure you want to delete this visa?')"
    />
  </VueModal>
</template>

<script>
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { useTable, useRouterHelpers } from "@/composables";
import { required, helpers, alphaNum } from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useConfigStore, useUserStore, useVisaStore } from "@/stores";
import {
  EnvironmentEnum,
  PAXHeaders,
  PermissionsEnum,
  Routes,
  VisaStatusRiskEnum,
} from "@/data";
import PaxTable from "@/components/common/PaxTable.vue";
import { mapStores } from "pinia";
import GenericModal from "@/components/common/GenericModal.vue";
import VisaCancelForm from "./VisaCancelForm.vue";
import {
  isValidObject,
  issueDisabledDates,
  expiryDisabledDates,
  resetValidationObject,
  sanitizeObject,
  uploadFile,
  removeInvalidFields,
} from "@/helpers";
import BaseDropDown from "./BaseDropDown.vue";
import ConfirmModal from "./ConfirmModal.vue";
import InputFileTooltip from "./InputFileTooltip.vue";
import Fa from "vue-fa";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import FadeInTransition from "./FadeInTransition.vue";
import DeleteButton from "./DeleteButton.vue";
import CancelButton from "./CancelButton.vue";
import SaveButton from "./SaveButton.vue";
import CustomDatepicker from "./CustomDatepicker.vue";

export default defineComponent({
  setup() {
    const v$ = useVuelidate();
    const { extraOptions } = useTable();
    const { navigateToRouteInNewTab } = useRouterHelpers();
    return { v$, extraOptions, navigateToRouteInNewTab };
  },
  async mounted() {
    /* v$ is defined on mounted so we trigger a $touch
    to check for loi_no validity if we want to show error on mount*/

    if (!this.enablePaxIDField) {
      this.v$.visa.loi_no.$touch();
    }
  },
  data() {
    return {
      visa: {
        pax_id: "",
        loi_no: "",
        loi_id: "",
        passport_id: "",
        passport_no: "",
        full_name: "",
        visa_no: "",
        type: "",
        visa_location: "",
        date_of_issue: "",
        date_of_expiry: "",
        pax_profile: "",
        file: "",
      },
      viewOnly: false,
      baseUrl: import.meta.env[EnvironmentEnum.StorageBaseURL],
      fileErr: "",
      faRectangleXmark: faRectangleXmark,
      paxTableModal: false,
      cancelVisaModal: false,
      deleteModal: false,
      paxTableHeaders: [
        PAXHeaders.PAX,
        PAXHeaders.FullName,
        PAXHeaders.PAXType,
        PAXHeaders.Employer,
        PAXHeaders.PassportNo,
        PAXHeaders.Email,
        PAXHeaders.Position,
        PAXHeaders.Department,
        PAXHeaders.Visa,
      ],
      historicDataHeaders: [
        { text: "Visa Sticker", value: "visa_no", sortable: true },
        { text: "Date of Issue", value: "date_of_issue" },
        { text: "Date of Expiry", value: "date_of_expiry", sortable: true },
        { text: "Status", value: "status" },
        { text: "Photo Copy of Visa", value: "attachments" },
      ],
      visaStatusRiskEnum: VisaStatusRiskEnum,
      issueDisabledDates,
      expiryDisabledDates,
    };
  },
  props: {
    item: {
      type: Object,
      default: null,
      required: false,
    },
    initialData: {
      type: Object,
      default: null,
      required: false,
    },
    historicalRecords: {
      type: Array,
      default: () => [],
    },
    disableDelete: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["updateTableRequest", "close", "submit"],
  validations() {
    const rules = {
      pax_id: {
        required: helpers.withMessage("This field is required", required),
      },
      visa_no: {
        required: helpers.withMessage("This field is required", required),
      },
      type: {
        required: helpers.withMessage("This field is required", required),
      },
      visa_location: {
        required: helpers.withMessage("This field is required", required),
      },
      date_of_issue: {
        required: helpers.withMessage("This field is required", required),
      },
      date_of_expiry: {
        required: helpers.withMessage("This field is required", required),
      },
      files: {},
      loi_id: {},
      passport_id: {},
      passport_no: {},
      loi_no: {
        required: helpers.withMessage(
          "This Pax does not have any active LOI number",
          required
        ),
      },
      file: {},
    };

    return this.isItemValid
      ? {
          visa: resetValidationObject(rules),
        }
      : {
          visa: rules,
        };
  },
  components: {
    ErrorMessages,
    DatePicker,
    PaxTable,
    GenericModal,
    VisaCancelForm,
    BaseDropDown,
    ConfirmModal,
    InputFileTooltip,
    Fa,
    FadeInTransition,
    DeleteButton,
    CancelButton,
    SaveButton,
    CustomDatepicker,
  },
  methods: {
    showAttachmentName(file) {
      return file.split("/").pop();
    },
    showDeleteModal() {
      this.deleteModal = true;
    },
    hideDeleteModal() {
      this.deleteModal = false;
    },
    showCancelModal() {
      this.cancelVisaModal = true;
    },
    hideCancelModal() {
      this.cancelVisaModal = false;
    },
    scannedCopyUpload() {
      const { file, error } = uploadFile(this.$refs.fileInput);
      this.fileErr = error;
      this.v$.visa.file.$model = file;
      this.v$.visa.file.$touch();
    },
    async onSubmit() {
      try {
        if (this.v$.visa.$invalid) {
          return;
        }

        const { full_name, pax_profile, loi_no, passport_no, ...formData } =
          this.v$.visa.$model;

        const data = sanitizeObject({
          ...formData,
        });

        if (this.isItemValid) {
          await this.visaStore.updateVisa(
            this.visaID,
            removeInvalidFields(data)
          );
        } else {
          await this.visaStore.addVisa(data);
        }

        this.$emit("updateTableRequest");
        this.$emit("close");
        this.$emit("submit");
      } catch (error) {
        console.log("Error saving visa", error);
      }
    },
    async cancelVisa(form) {
      try {
        await this.visaStore.cancelVisa(this.visaID, form);
        this.hideCancelModal();
        this.$emit("updateTableRequest");
        this.$emit("close");
      } catch (error) {
        console.log("Error cancel visa", error);
      }
    },
    enableEditing() {
      this.viewOnly = false;
    },
    disableEditing() {
      this.viewOnly = true;

      this.syncFormWithItem(this.item);
    },
    async searchProfile() {
      if (this.enablePaxIDField) {
        this.paxTableModal = true;
      }
    },
    autofillVisa(autofill) {
      this.visa = {
        ...this.visa,
        pax_id: +autofill.pax_id,
        full_name: autofill.eng_full_name,
        pax_profile: autofill?.image,
        loi_no: autofill?.latest_loi?.loi_no,
        loi_id: autofill?.latest_loi?.id,
        passport_id: autofill?.latest_passport?.id,
        passport_no: autofill?.latest_passport?.passport_no,
      };

      this.v$.visa.loi_no.$touch();

      this.paxTableModal = false;
    },
    async deleteVisa() {
      try {
        await this.visaStore.deleteVisa(this.visaID);
        this.hideDeleteModal();
        this.$emit("updateTableRequest");
        this.$emit("close");
        this.$emit("submit");
      } catch (error) {
        console.log("Error deleting visa", error);
      }
    },
    openTab(url) {
      window.open(url, "_blank");
    },
    syncFormWithItem(newItem) {
      this.visa = {
        ...this.visa,
        pax_id: +newItem?.pax?.pax_id,
        full_name: newItem?.pax?.eng_full_name,
        visa_no: newItem?.visa_no,
        type: newItem?.type,
        visa_location: newItem?.visa_location,
        date_of_issue: newItem?.date_of_issue,
        date_of_expiry: newItem?.date_of_expiry,
        pax_profile: newItem?.pax?.image,
        loi_no: newItem?.loi?.loi_no,
        loi_id: newItem?.loi?.id,
        passport_id: newItem?.passport?.id,
        passport_no: newItem?.passport?.passport_no,
      };
    },
    navigateToLoi() {
      this.navigateToRouteInNewTab(Routes.LOIApplications);
    },
  },
  computed: {
    ...mapStores(useVisaStore, useConfigStore, useUserStore),
    isItemValid() {
      return isValidObject(this.item);
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.VISA_EDIT);
    },
    hasDeletePermission() {
      console.log(
        "Has delete permission",
        this.userStore.hasPermission(PermissionsEnum.VISA_DELETE)
      );
      return this.userStore.hasPermission(PermissionsEnum.VISA_DELETE);
    },
    visaHistory() {
      return this.item.historical_visa || [];
    },
    passportProfile() {
      return this.visa.pax_profile
        ? `${this.baseUrl}/${this.visa.pax_profile}`
        : null;
    },
    scannedVisaFile() {
      return this.item?.file ? `${this.baseUrl}/${this.item?.file}` : null;
    },
    scannedAndNotView() {
      return this.scannedVisaFile && !this.viewOnly;
    },
    visaStatusID() {
      return this.item?.status_id;
    },
    isVisaCancelled() {
      return this.visaStatusID == this.visaStatusRiskEnum.Cancelled;
    },
    isLOINoInvalid() {
      return this.v$.visa.loi_no.$invalid;
    },
    isFormVisible() {
      return !this.isLOINoInvalid || this.isItemValid;
    },
    enablePaxIDField() {
      return !(this.viewOnly || this.isItemValid || this.initialData);
    },
    visaID() {
      return this.item?.id;
    },
  },
  watch: {
    item: {
      handler(newItem) {
        if (this.isItemValid) {
          this.viewOnly = true;

          this.syncFormWithItem(newItem);
        } else {
          this.visa = {
            ...this.visa,
            ...this.initialData,
          };
        }
      },
      immediate: true,
    },
  },
});
</script>
<style scoped lang="scss">
.noteClass {
  font-size: 1rem;
  color: red;
  margin: 0px 1rem;
}

.pdf-spacing {
  margin-inline-end: 7px;
}

.easy-data-table {
  --easy-table-body-row-background-color: transparent;
  background-color: transparent !important;
}
.icon-searchIcon::before {
  color: #8493a5;
}

.loi-no-error {
  font-size: 125%;
  font-weight: bold;
}

.vertical-form-field {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}

.upsized-text {
  font-size: 1.5rem;
  line-height: 4rem;
}

.horizontal-form-container {
  $gap: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  gap: $gap;
  flex-wrap: wrap;

  .vertical-form-field {
    flex: 1 1 calc(50% - #{$gap});
  }
}

.empty-form-container {
  @extend .vertical-form-field;
  width: 50%;
  gap: 1rem;
}
</style>
