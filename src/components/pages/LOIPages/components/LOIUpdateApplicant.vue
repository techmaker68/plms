<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Update LOI applicant form
Shows applicant's documents and details

***********************************
-->
<template>
  <div
    class="add-passport d-flex px-0 py-6"
    :class="{
      'multiple-applicants-container': isMultipleApplicants,
      'view-only-container': viewOnly,
    }"
  >
    <div class="card card-background applicant-info-container">
      <div class="tabel-head">
        <h5 class="main-heading"><span v-t="'PAX PROFILE'"></span></h5>
      </div>
      <table class="card-table">
        <tr>
          <td><span v-t="'Full Name:'"></span></td>
          <td>
            <strong>{{ applicant?.pax?.eng_full_name }}</strong>
          </td>
        </tr>
        <tr>
          <td><span v-t="'PAX ID:'"></span></td>
          <td>
            <strong>{{ applicant?.pax?.pax_id }}</strong>
          </td>
        </tr>
        <tr>
          <td><span v-t="'Position:'"></span></td>
          <td>
            <strong>{{ applicant?.pax?.position }}</strong>
          </td>
        </tr>
        <tr>
          <td><span v-t="'Department:'"></span></td>
          <td>
            <strong>{{ applicant?.pax?.department?.name }}</strong>
          </td>
        </tr>
        <tr>
          <td><span v-t="'Employer:'"></span></td>
          <td>
            <strong>{{ applicant?.pax?.company?.name }}</strong>
          </td>
        </tr>
        <tr>
          <td><span v-t="'Passport No:'"></span></td>
          <td>
            <strong>{{ applicant?.pax?.latest_passport?.passport_no }}</strong>
          </td>
        </tr>
      </table>
      <div class="pax-profile-btn" v-if="!viewOnly">
        <SaveButton
          class="btn btn-blue"
          :disabled="isApplicationClosed"
          @click="onSubmit"
        >
          {{ $t("Save") }}
        </SaveButton>
        <DeleteButton
          class="btn btn-secondary mt-4"
          @click="showRemoveApplicantModal"
          aria-label="Close"
          :disabled="isApplicationClosed"
          v-t="'Remove from list'"
        ></DeleteButton>
      </div>
    </div>

    <div class="background flex-grow-1 modal-form">
      <div class="loi-application-card">
        <div class="card-body">
          <span class="current-loi-heading"
            ><span v-t="'CURRENT LOI APPLICATION'"></span
          ></span>
          <hr class="loi-spearator" />
          <div class="row">
            <div class="col-6">
              <ul class="label-value ps-0 m-0">
                <li class="w-100">
                  <label v-t="'Batch No:'"></label>
                  <strong>{{ applicant?.batch_no }}</strong>
                </li>
              </ul>
            </div>
            <div class="col-6">
              <ul class="label-value ps-0 m-0">
                <li class="w-100">
                  <label v-t="'LOI No:'"></label>
                  <strong>{{ application?.loi_no }}</strong>
                </li>
              </ul>
            </div>
          </div>
          <div class="row d-flex align-items-center">
            <div
              class="col-6 mt-1 d-flex flex-column justify-content-center align-items-start loi-request-date-input"
            >
              <label v-t="'LOI Request Date:'"></label>
              <input
                :value="requestDate"
                :disabled="viewOnly"
                value-type="YYYY-MM-DD"
                format="DD/MM/YYYY"
                readonly
              />
            </div>
            <div class="col-6 mt-1">
              <label v-t="'Approval Status:'"></label>
              <BaseDropDown
                :disabled="viewOnly"
                v-model="v$.applicantForm.status.$model"
                class="clear-borders"
                :options="loiApplicantStatus"
                optionValue="id"
                optionLabel="value"
              />
            </div>

            <div class="col-6 mt-4">
              <label v-t="'LOI Payment Date:'"></label>
              <CustomDatepicker
                :disabled="viewOnly"
                v-model:value="applicantForm.loi_payment_date"
                value-type="YYYY-MM-DD"
                format="DD/MM/YYYY"
                :disabled-date="defaultDisabledDates"
              />
            </div>
            <div class="col-6 mt-4">
              <label v-t="'Deposit Amount:'"></label>
              <input
                :disabled="viewOnly"
                type="number"
                v-model="v$.applicantForm.deposit_amount.$model"
                class="form-control personal-fields"
              />
              <ErrorMessages
                :errors="v$.applicantForm.deposit_amount.$errors"
              />
            </div>
            <div class="col-12 mt-4">
              <label v-t="'LOI Payment Receipt No'"></label>
              <input
                :disabled="viewOnly"
                type="number"
                class="form-control personal-fields"
                v-model="v$.applicantForm.loi_payment_receipt_no.$model"
              />
              <ErrorMessages
                :errors="v$.applicantForm.loi_payment_receipt_no.$errors"
              />
            </div>
          </div>
          <div class="row mt-3">
            <label v-t="'Payment letter copy'"></label>
            <div>
              <input
                :disabled="viewOnly"
                type="file"
                class="form-control mt-3 personal-fields"
                ref="fileInput"
                @input="imgUpload"
                multiple
              />
            </div>

            <InputFileTooltip />
          </div>

          <div
            class="d-flex flex-column justify-content-start align-items-start mt-3"
            style="gap: 0.5rem"
            v-if="applicant?.payment_letter_copy?.length"
          >
            <template
              v-for="(letter, index) of applicant?.payment_letter_copy"
              :key="index"
            >
              <ReuseTemplate
                :letter="letter"
                :index="index"
                :enableDelete="!viewOnly"
              ></ReuseTemplate>
            </template>
          </div>
          <div
            class="d-flex flex-column justify-content-start align-items-stretch mt-3"
            style="gap: 0.5rem"
          >
            <div class="col-12">
              <label><span v-t="'Remarks'"></span></label>
            </div>

            <CustomEditor
              :disabled="viewOnly"
              v-model="v$.applicantForm.remarks.$model"
            ></CustomEditor>

            <div
              v-if="isMultipleApplicants && !viewOnly"
              class="mt-3 d-flex flex-row justify-content-center align-items-center"
            >
              <SaveButton
                class="btn btn-blue mt-3"
                :disabled="isApplicationClosed"
                @click="onSubmit"
              >
                <span v-t="'Update All'"></span>
              </SaveButton>
            </div>
          </div>
        </div>
      </div>
      <div class="loi-application-card last-loi-application-container mt-4">
        <div class="card-body">
          <span class="last-loi-heading" v-t="'Last LOI Application'"></span>
          <hr class="loi-spearator" />

          <template v-if="previous_loi_applicant">
            <div class="row">
              <div class="col-6">
                <ul class="label-value ps-0 m-0">
                  <li class="w-100">
                    <label><span v-t="'LOI No:'"></span></label>
                    <strong>{{ previous_loi_applicant?.loi_no }}</strong>
                  </li>
                </ul>
              </div>
              <div class="col-6">
                <ul class="label-value ps-0 m-0">
                  <li class="w-100">
                    <label><span v-t="'Batch No:'"></span></label>
                    <strong>{{ previous_loi_applicant?.batch_no }}</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <ul class="label-value ps-0 m-0">
                  <li class="w-100">
                    <label><span v-t="'LOI Payment Date:'"></span></label>
                    <strong>{{
                      previous_loi_applicant?.loi_payment_date
                    }}</strong>
                  </li>
                </ul>
              </div>
              <div class="col-6">
                <ul class="label-value ps-0 m-0">
                  <li class="w-100">
                    <label><span v-t="'LOI Payment Receipt No:'"></span></label>
                    <strong>{{
                      previous_loi_applicant?.loi_payment_receipt_no
                    }}</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <ul class="label-value ps-0 m-0">
                  <li class="w-100">
                    <label><span v-t="'Deposit Amount:'"></span></label>
                    <strong>{{
                      previous_loi_applicant?.deposit_amount
                    }}</strong>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="d-flex flex-column justify-content-start align-items-stretch"
            >
              <label><span v-t="'Payment Letter Copy:'"></span></label>
              <template
                v-for="(
                  letter, index
                ) of previous_loi_applicant?.payment_letter_copy"
                :key="index"
              >
                <ReuseTemplate :letter="letter" :index="index"></ReuseTemplate>
              </template>
            </div>

            <div class="row mt-3">
              <div class="col-12">
                <label><span v-t="'Remarks'"></span></label>
                <p v-html="previous_loi_applicant?.remarks"></p>
              </div>
            </div>
          </template>

          <span v-else class="no-history-content"
            ><span v-t="'No LOI Application History'"></span
          ></span>
        </div>
      </div>
    </div>
  </div>

  <DefineTemplate v-slot="{ letter, index, enableDelete }">
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="gap: 1rem"
    >
      <a
        :href="`${baseStorageUrl}/${letter}`"
        v-if="letter"
        style="min-width: 100px"
        class="d-flex flex-row justify-content-start align-items-center"
        target="_blank"
      >
        <svg
          width="13"
          height="16"
          viewBox="0 0 13 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.15807 8.00313C5.9888 7.50313 5.99219 6.5375 6.09036 6.5375C6.37474 6.5375 6.34766 7.69063 6.15807 8.00313ZM6.10052 9.47812C5.83984 10.1094 5.51484 10.8313 5.13906 11.4375C5.75859 11.2188 6.45938 10.9 7.26849 10.7531C6.83854 10.4531 6.42552 10.0219 6.10052 9.47812ZM2.91484 13.3781C2.91484 13.4031 3.36172 13.2094 4.09635 12.1219C3.86953 12.3187 3.1112 12.8875 2.91484 13.3781ZM8.39583 5H13V15.25C13 15.6656 12.6378 16 12.1875 16H0.8125C0.36224 16 0 15.6656 0 15.25V0.75C0 0.334375 0.36224 0 0.8125 0H7.58333V4.25C7.58333 4.6625 7.94896 5 8.39583 5ZM8.125 10.3687C7.44792 9.9875 6.99766 9.4625 6.67943 8.6875C6.83177 8.10938 7.07214 7.23125 6.88932 6.68125C6.73021 5.7625 5.45391 5.85312 5.27109 6.46875C5.10182 7.04062 5.25755 7.84687 5.54531 8.875C5.1526 9.7375 4.5737 10.8937 4.16406 11.5562C4.16068 11.5562 4.16068 11.5594 4.15729 11.5594C3.23984 11.9937 1.66563 12.95 2.31224 13.6844C2.50182 13.9 2.85391 13.9969 3.0401 13.9969C3.64609 13.9969 4.2487 13.4344 5.10859 12.0656C5.98203 11.8 6.9401 11.4687 7.78307 11.3406C8.51771 11.7094 9.3776 11.95 9.94974 11.95C10.9383 11.95 11.006 10.95 10.6167 10.5938C10.1461 10.1687 8.77839 10.2906 8.125 10.3687V10.3687ZM12.763 3.28125L9.44531 0.21875C9.29297 0.078125 9.08646 0 8.86979 0H8.66667V4H13V3.80938C13 3.6125 12.9154 3.42188 12.763 3.28125ZM10.2544 11.2594C10.3932 11.175 10.1698 10.8875 8.80547 10.9781C10.0615 11.4719 10.2544 11.2594 10.2544 11.2594Z"
            fill="#C93737"
          />
        </svg>
        <span class="ms-2 align-text-bottom pointer">
          <strong> {{ $t("Document") }} {{ index + 1 }}</strong></span
        >
      </a>
      <Fa
        v-if="enableDelete"
        :icon="closeIcon"
        class="cursor-pointer"
        style="color: rgb(255, 54, 54)"
        size="lg"
        fw
        @click="showDeleteModal(index)"
      />
    </div>
  </DefineTemplate>

  <VueModal v-model="deleteModal">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="deleteDocument"
      :title="$t('Delete document')"
      :message="$t('Are you sure you want to delete this document?')"
    />
  </VueModal>

  <VueModal v-model="removeApplicantModal">
    <ConfirmModal
      @close="hideRemoveApplicantModal"
      @confirm="removeFromList"
      :title="$t('Remove Applicant')"
      :message="$t('Are you sure you want to remove this applicant?')"
    />
  </VueModal>
</template>

<script>
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, numeric } from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useLOIStore, useConfigStore, useUserStore } from "@/stores";
import { mapStores, storeToRefs } from "pinia";
import {
  checkValidValue,
  sanitizeObject,
  readMultipleFiles,
  defaultDisabledDates,
  removeInvalidFields,
} from "@/helpers";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { EnvironmentEnum, PermissionsEnum } from "@/data";
import { createReusableTemplate } from "@vueuse/core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import CustomEditor from "@/components/common/CustomEditor.vue";
import InputFileTooltip from "@/components/common/InputFileTooltip.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

export default defineComponent({
  setup() {
    const v$ = useVuelidate();
    const { selectedApplication, loiApplicantStatus } = storeToRefs(
      useLOIStore()
    );

    return { v$, selectedApplication, loiApplicantStatus };
  },
  data() {
    return {
      last_loi_application: {},
      applicant: null,
      pax: null,
      baseStorageUrl: import.meta.env[EnvironmentEnum.StorageBaseURL],
      closeIcon: faXmark,
      deleteModal: false,
      removeApplicantModal: false,
      selectedIndex: null,
      applicantForm: {
        status: "",
        deposit_amount: "",
        loi_payment_date: "",
        loi_payment_receipt_no: "",
        remarks: "",
        payment_letter_copy: "",
      },
      defaultDisabledDates,
    };
  },
  components: {
    ErrorMessages,
    DatePicker,
    BaseDropDown,
    DefineTemplate,
    ReuseTemplate,
    Fa,
    ConfirmModal,
    CustomEditor,
    InputFileTooltip,
    SaveButton,
    DeleteButton,
    CustomDatepicker,
  },
  emits: ["delete", "submit"],
  validations() {
    // We don't use these as we're always updating
    const rules = {
      status: {},
      deposit_amount: {
        numeric,
      },
      loi_batch_number: {},
      loi_payment_date: {},
      loi_payment_receipt_no: {
        numeric,
      },
      remarks: {},
      payment_letter_copy: {},
    };
    return {
      applicantForm: rules,
    };
  },
  props: {
    applicantId: [String, Number],
    applicantIds: {
      type: Array,
      default() {
        return [];
      },
    },
    application: Object,
  },
  methods: {
    async removeFromList() {
      await this.loiStore.deleteApplicant(this.applicantId);
      this.$emit("delete");
    },
    downloadInvoice(letter) {
      this.configStore.downloadFileFromURL(letter);
    },
    downloadInvoicelast() {
      this.configStore.downloadFileFromURL(
        this.last_loi_application?.payment_letter_copy
      );
    },
    async imgUpload() {
      let input = this.$refs.fileInput;
      this.applicantForm.payment_letter_copy = input?.files;
    },
    async onSubmit() {
      try {
        this.v$.$touch();
        if (this.v$.applicantForm.$invalid) {
          return;
        }

        const form = this.v$.applicantForm.$model;
        const data = sanitizeObject({
          ...form,
        });

        const promise = this.isMultipleApplicants
          ? this.loiStore.updateMultipleApplicantDetails(
              this.batchNumber,
              this.applicantIds.join(","),
              data
            )
          : this.loiStore.updateApplicantDetails(
              this.applicantId,
              removeInvalidFields(data)
            );
        await promise;

        this.$emit("submit");
      } catch (error) {
        console.log("Error", error);
      }
    },
    showDeleteModal(index) {
      this.deleteModal = true;
      this.selectedIndex = index;
    },
    showRemoveApplicantModal() {
      this.removeApplicantModal = true;
    },
    hideDeleteModal() {
      this.deleteModal = false;
      this.selectedIndex = null;
    },
    hideRemoveApplicantModal() {
      this.removeApplicantModal = false;
    },
    async deleteDocument() {
      try {
        await this.loiStore.deleteApplicantDocument(
          this.applicantId,
          this.selectedIndex
        );
        this.getApplicantDetails(this.applicantId);
      } catch (error) {
        console.log("Error", error);
      } finally {
        this.hideDeleteModal();
      }
    },
    async getApplicantDetails(id, initializeForm = false) {
      try {
        const { current_loi_applicant, previous_loi_applicant, pax_profile } =
          await this.loiStore.getLoiApplicantFullDetails(id);
        this.applicant = current_loi_applicant;

        this.previous_loi_applicant = previous_loi_applicant;
        this.pax = pax_profile;

        if (initializeForm) {
          this.applicantForm = {
            ...this.applicantForm,
            status: current_loi_applicant?.status,
            deposit_amount: this.checkNonPrimitiveValue(
              current_loi_applicant?.deposit_amount
            ),
            loi_payment_date: this.checkNonPrimitiveValue(
              current_loi_applicant?.loi_payment_date
            ),
            loi_payment_receipt_no: this.checkNonPrimitiveValue(
              current_loi_applicant?.loi_payment_receipt_no
            ),
            remarks: current_loi_applicant?.remarks,
          };
        }
      } catch (error) {
        console.log("Error", error);
      }
    },
    checkNonPrimitiveValue(value) {
      return checkValidValue(value);
    },
  },
  computed: {
    ...mapStores(useLOIStore, useConfigStore, useUserStore),
    isApplicationClosed() {
      return !!this.application?.close_date;
    },
    requestDate() {
      return this.application?.submission_date;
    },
    isMultipleApplicants() {
      return this.applicantIds.length;
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_EDIT);
    },
    viewOnly() {
      return !this.hasEditPermission || this.isApplicationClosed;
    },
    batchNumber() {
      return +this.application?.batch_no;
    },
  },
  watch: {
    applicantId: {
      async handler(newValue) {
        if (newValue) {
          this.getApplicantDetails(newValue, true);
        }
      },
      immediate: true,
    },
  },
});
</script>
<style scoped lang="scss">
.multiple-applicants-container {
  .applicant-info-container,
  .last-loi-application-container {
    display: none;
  }

  .loi-application-card .card-body {
    padding: 3rem !important;
  }
}

.add-passport {
  padding: 0;
}
.main-header {
  height: 30px;
  background-color: #d9d9d9;
}
.loi-application-card {
  box-shadow: none;
  border-radius: 0px;
  background: #ffffff;
}
.background {
  background: #ffffff;
}
.background strong {
  font-weight: 600;
}
.card-body {
  padding: 30px 20px 30px 20px;
}
.loi-spearator {
  margin: 10px 0;
}
.current-loi-heading {
  font-weight: 400;
  color: #8493a5;
  font-size: 12px;
}
.last-loi-heading {
  font-weight: 400;
  color: black;
  font-weight: bold;
}
.card-main-heading {
  font-size: 14px;
  font-weight: 500;
}
.pax-profile-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-block-start: 125px;
}
.pax-profile-btn button {
  width: 130px;
  height: 24px;
  padding: 0px;
}
.card-background {
  background-color: #f2f2f2;
  box-shadow: none;
  min-width: 35rem;
  padding: 4rem 3rem;
}
.card-table {
  margin-block-start: 73px;
}
.card-table td {
  padding-block-start: 10px;
  font-size: 12px;
  font-family: Roboto;
  font-weight: 400;
  line-height: 14px;
}

.card-table td span {
  display: inline-block;
  min-width: 8rem;
}

.card-table td strong {
  font-weight: 700;
  min-width: 25rem;
  display: inline-block;
}
.main-heading {
  font-family: Roboto;
  font-weight: 600;
  font-size: 12px;
  line-height: 1%;
}

.tabel-head {
  display: flex;
  align-items: center;
  height: 16px;
}
.label-value {
  display: flex;
  flex-wrap: wrap;
}

.label-value li {
  width: 48%;
}

.label-value li label {
  width: 45%;
}

.payemnt-letter-copy-input {
  width: 75%;
  margin-inline-start: 10px;
}
.no-app-history {
  padding: 30px 20px 30px 20px;
  height: 200px;
  background: white;
}
.no-history-content {
  padding: 2rem 0px;
  font-weight: 400;
  color: #a7b1c2;
  font-size: 12px;
  display: flex;
  justify-content: center;
}
.loi-request-date-input input {
  border: none;
  padding-block-start: 5px;
  outline: none;
}
.last-loi {
  font-weight: 400;
  color: #8493a5;
  font-size: 12px;
}
.personal-fields {
  outline: none;
  border: none;
  border-bottom: 1px solid #dadada;
  border-radius: 0;
  box-shadow: none;
}
.payment-copy {
  padding-inline-start: 7px;
}
.pdf-icon {
  margin-inline-end: 5px;
}
input:disabled {
  background-color: transparent;
}
</style>
