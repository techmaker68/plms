<template>
  <div class="d-flex flex-column border-form-custom" style="gap: 1rem">
    <!-- <hr style="margin: 1rem 0 2rem" /> -->
    <h6 class="text-center mb-3">{{ $t("MOI PAYMENT INVOICE") }}</h6>
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="gap: 2rem"
    >
      <div class="vertical-form-field">
        <label>{{ $t("FM Payment Date") }}</label>
        <CustomDatepicker
          v-model:value="invoice.moi_payment_date"
          value-type="YYYY-MM-DD"
          format="DD/MM/YYYY"
          :disabled-date="defaultDisabledDates"
          :disabled="disableForm"
        />
        <ErrorMessages :errors="v$.invoice.moi_payment_date.$errors" />
      </div>
      <div class="vertical-form-field">
        <label>{{ $t("LOI invoice No:") }}</label>
        <input
          type="text"
          class="form-control"
          v-model="v$.invoice.moi_invoice.$model"
          :disabled="disableForm"
        />
        <ErrorMessages :errors="v$.invoice.moi_invoice.$errors" />
      </div>
      <div class="vertical-form-field">
        <label>{{ $t("Total Insurance Deposit") }}</label>
        <input
          type="text"
          class="form-control"
          v-model="v$.invoice.moi_deposit.$model"
          :disabled="disableForm"
        />
        <ErrorMessages :errors="v$.invoice.moi_deposit.$errors" />
      </div>
    </div>
    <div class="row align-items-end">
      <div class="col-4">
        <label> {{ $t("LOI invoice Scan Copy:") }}</label>
        <input
          style="border-radius: 5px, 0px, 0px, 5px"
          type="file"
          class="form-control"
          ref="invoiceCopyFile"
          @input="uploadInvoiceCopy"
          :disabled="disableForm"
        />
        <InputFileTooltip />
        <ErrorMessages :errors="v$.invoice.moi_invoice.$errors" />
        <div v-if="invoiceCopyName" class="d-flex align-items-center file-name">
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
          <span @click="downloadInvoice" class="ms-2 align-text-bottom pointer">
            <strong> {{ $t("Payment Invoice") }} </strong></span
          >
        </div>
      </div>
    </div>
    <div class="d-flex flex-row justify-content-end align-items-center">
      <SaveButton @click="onSubmit" :disabled="disableForm">
        {{ $t("SAVE") }}
      </SaveButton>
    </div>
  </div>
  <hr style="border: 1px solid #a7b1c2" />
  <div class="d-flex justify-document">
    <div class="pdfDocView">
      <iframe :src="invoiceUrl" width="500px" height="800px"></iframe>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers, alphaNum, required, numeric } from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useConfigStore, useLOIStore } from "@/stores";
import { mapStores } from "pinia";
import { Routes } from "@/data";
import { EnvironmentEnum } from "@/data";
import { checkValidValue, defaultDisabledDates, uploadFile } from "@/helpers";
import InputFileTooltip from "@/components/common/InputFileTooltip.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

export default defineComponent({
  name: "PaymentInvoice",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      invoice: {
        moi_payment_date: "",
        moi_deposit: "",
        moi_invoice: "",
        payment_copy: null,
      },
      invoiceCopyErr: "",
      invoiceCopyName: null,
      defaultDisabledDates,
    };
  },
  validations() {
    return {
      invoice: {
        moi_payment_date: {
          required: helpers.withMessage("This field is required", required),
        },
        moi_deposit: {
          required: helpers.withMessage("This field is required", required),
          numeric: helpers.withMessage("Invalid Value", numeric),
        },
        moi_invoice: {
          required: helpers.withMessage("This field is required", required),
          alphaNum: helpers.withMessage("Invalid Value", alphaNum),
        },
        payment_copy: {},
      },
    };
  },
  components: {
    ErrorMessages,
    DatePicker,
    InputFileTooltip,
    SaveButton,
    CustomDatepicker,
  },
  emits: ["submit"],
  props: {
    application: Object,
    viewOnly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async onSubmit() {
      try {
        this.v$.$touch();
        if (this.v$.invoice?.$invalid) {
          return;
        }
        const formData = this.v$.invoice.$model;
        this.$emit("submit", formData);
      } catch (error) {
        console.log("Error is", error);
      }
    },
    uploadInvoiceCopy() {
      const { file, error, name } = uploadFile(this.$refs.invoiceCopyFile);
      this.invoiceCopyErr = error;
      this.invoiceCopyName = name;
      this.invoice.payment_copy = file;
    },
    checkNonPrimitiveValue(value) {
      return checkValidValue(value);
    },
    downloadInvoice() {
      this.configStore.downloadFileFromURL(this.invoiceCopyName);
    },
  },
  computed: {
    ...mapStores(useLOIStore, useConfigStore),
    disableForm() {
      return (
        this.application?.boc_moo_date == null ||
        this.application?.boc_moo_ref == null ||
        !!this.application?.close_date ||
        this.viewOnly
      );
    },
    invoiceUrl() {
      if (this.application?.payment_copy) {
        return `${import.meta.env[EnvironmentEnum.StorageBaseURL]}/${
          this.application?.payment_copy
        }`;
      } else {
        return "";
      }
    },
  },
  watch: {
    application(newValue) {
      if (newValue) {
        const application = newValue;
        this.invoice = {
          moi_payment_date: application?.moi_payment_date,
          moi_deposit: application?.moi_deposit,
          moi_invoice: application?.moi_invoice,
        };
        this.invoiceCopyName = application.payment_copy;
      }
    },
  },
});
</script>

<style scoped>
.justify-document {
  justify-content: center !important;
}
.file-name span {
  font-weight: 500;
  font-size: 12px;
}

.vertical-form-field {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  flex-grow: 1;
}
</style>
