<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Add/Edit/View company form

***********************************
-->
<template>
  <div
    class="main-tab addCompanyForm modal-form p-4"
    :class="{ 'view-only-container': viewOnly }"
  >
    <div class="main-tab-card">
      <div class="companyFormDetails">
        <div class="row" v-if="viewOnly && hasEditPermission">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-link btn-icon company-edit-icon edit-icon btn-edit"
              @click="enabledEditing"
            >
              <span class="icon-edit"></span>
            </button>
          </div>
        </div>
        <div class="Addpassport visadetails">
          <div>
            <div class="row">
              <div class="col-4 required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Company Name'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.name.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.name.$errors" />
              </div>
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Company Type'"
                ></label>
                <BaseDropDown
                  v-model="v$.company.type.$model"
                  :options="companyStore.companyType"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.type.$errors" />
              </div>
              <div class="col-4 required-form-control">
                <label for="Passport" class="form-label" v-t="'Status'"></label>
                <BaseDropDown
                  v-model="v$.company.status.$model"
                  :options="companyStore.companyStatus"
                  :disabled="viewOnly"
                  optionValue="id"
                  optionLabel="status"
                />
                <ErrorMessages :errors="v$.company.status.$errors" />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Short Name'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="company.short_name"
                  :disabled="viewOnly"
                />
              </div>
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Industry'"
                ></label>
                <BaseDropDown
                  v-model="v$.company.industry.$model"
                  :options="companyStore.industryType"
                  :disabled="viewOnly"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4 required-form-control">
                <label for="Passport" class="form-label" v-t="'Email'"></label>
                <input
                  type="email"
                  class="form-control"
                  v-model="v$.company.email.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.email.$errors" />
              </div>
              <div class="col-4 required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Telephone'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.phone.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.phone.$errors" />
              </div>
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Website'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="company.website"
                  :disabled="viewOnly"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Address 1'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.address_1.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.address_1.$errors" />
              </div>
              <div class="col-4">
                <label for="Passport" class="form-label" v-t="'City'"></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.city.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.city.$errors" />
              </div>
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Country'"
                ></label>
                <BaseDropDown
                  v-model="v$.company.country_id.$model"
                  :options="configStore.countries"
                  :disabled="viewOnly"
                  optionValue="ID"
                  optionLabel="EngName"
                />
                <ErrorMessages :errors="v$.company.country_id.$errors" />
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'POC Name'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.poc_name.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.poc_name.$errors" />
              </div>
              <div class="col-4">
                <label for="Passport" class="form-label">
                  <span v-t="'POC Email'"></span> /
                  <span v-t="'Username'"></span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.poc_email_or_username.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages
                  :errors="v$.company.poc_email_or_username.$errors"
                />
              </div>
              <div class="col-4">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'POC Mobile'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.company.poc_mobile.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.company.poc_mobile.$errors" />
              </div>
            </div>
            <div
              class="mt-5 mb-3 btn-grp d-flex justify-content-between"
              style="gap: 0.5rem"
              v-if="!viewOnly"
            >
              <DeleteButton
                v-if="isItemValid && hasDeletePermission"
                type="button"
                class="btn btn-danger"
                @click="showDelete"
              >
              </DeleteButton>

              <div
                class="d-flex flex-grow-1 flex-row justify-content-end"
                style="gap: 1rem"
              >
                <CancelButton
                  type="button"
                  class="btn btn-secondary"
                  aria-label="Close"
                  @click="disableEditing"
                >
                </CancelButton>
                <SaveButton
                  class="btn btn-blue"
                  :disabled="v$.company.$invalid"
                  @click="onSubmit"
                >
                  {{ isItemValid ? $t("Update") : $t("Approve") }}
                </SaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <VueModal v-model="showConfirmation">
    <ConfirmModal
      @close="cancelDelete"
      @confirm="deleteCompanyRecord"
      :title="$t('DELETE COMPANY?')"
      :message="
        $t(
          'There are paxes registered under this company, please unregister paxes from this company before deletion'
        )
      "
    />
  </VueModal>
</template>

<script>
import { defineComponent } from "vue";
import { useCompanyStore, useConfigStore, useUserStore } from "@/stores";
import useVuelidate from "@vuelidate/core";
import {
  required,
  helpers,
  alphaNum,
  email,
  numeric,
} from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { mapStores } from "pinia";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { isValidObject, sanitizeObject, validPhoneNumber } from "@/helpers";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { PermissionsEnum } from "@/data";
import CancelButton from "@/components/common/CancelButton.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";

export default defineComponent({
  name: "CompanyManagementForm",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  emits: {
    close: null,
  },
  data: function () {
    return {
      company: {
        name: "",
        type: "",
        status: "",
        short_name: "",
        industry: "",
        email: "",
        phone: "",
        website: "",
        address_1: "",
        city: "",
        country_id: "",
        poc_name: "",
        poc_email_or_username: "",
        poc_mobile: "",
      },
      showConfirmation: false,
      viewOnly: false,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => null,
      required: false,
    },
  },
  components: {
    ErrorMessages,
    ConfirmModal,
    BaseDropDown,
    CancelButton,
    SaveButton,
    DeleteButton,
  },
  validations() {
    return {
      company: {
        name: {
          required,
          alphaNum,
        },
        type: {},
        status: {
          required,
        },
        email: {
          required,
          email,
        },
        phone: {
          required,
          validPhoneNumber,
          // numeric: helpers.withMessage("Invalid Telephone Number", numeric),
        },
        address_1: {},
        city: {},
        country_id: {},
        industry: {},
        poc_name: {},
        poc_email_or_username: {},
        poc_mobile: {
          validPhoneNumber,
        },
      },
    };
  },
  computed: {
    ...mapStores(useCompanyStore, useConfigStore, useUserStore),
    isItemValid() {
      return isValidObject(this.item);
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.COMPANY_EDIT);
    },
    hasDeletePermission() {
      return this.userStore.hasPermission(PermissionsEnum.COMPANY_DELETE);
    },
  },
  methods: {
    async onSubmit() {
      try {
        if (this.v$.company.$invalid) {
          return;
        }
        const formData = this.v$.company.$model;
        const data = sanitizeObject(formData);
        this.isItemValid
          ? await this.companyStore.editCompany(this.item?.id, data)
          : await this.companyStore.addCompany(data);
        this.closeModal(true);
      } catch (error) {
        console.log("Error company", error);
      }
    },
    enabledEditing() {
      this.viewOnly = false;
    },
    disableEditing() {
      this.viewOnly = true;

      this.syncFormWithItem(this.item);
    },
    showDelete() {
      this.showConfirmation = true;
    },
    cancelDelete() {
      this.showConfirmation = false;
    },
    async deleteCompanyRecord() {
      this.showConfirmation = false;

      await this.companyStore.deleteCompany(this.item?.id);
      this.closeModal(true);
    },
    closeModal(updateOnClose = false) {
      this.$emit("close", updateOnClose);
    },
    syncFormWithItem(newValue) {
      this.company = {
        ...this.company,
        name: newValue?.name,
        type: newValue?.type,
        status: newValue?.status,
        short_name: newValue?.short_name,
        industry: newValue?.industry,
        email: newValue?.email,
        phone: newValue?.phone,
        website: newValue?.website,
        address_1: newValue?.address_1,
        city: newValue?.city,
        country_id: newValue?.country?.id,
        poc_name: newValue?.poc_name,
        poc_email_or_username: newValue?.poc_email_or_username,
        poc_mobile: newValue?.poc_mobile,
      };
    },
  },
  watch: {
    item: {
      handler(newValue) {
        if (this.isItemValid) {
          this.viewOnly = true;

          this.syncFormWithItem(newValue);
        }
      },
      immediate: true,
    },
  },
});
</script>
