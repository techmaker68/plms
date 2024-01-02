<!--
***********************************
@author Mohanned Hassan
@create_date 1st July 2023

View/Edit/Delete passports

***********************************
-->
<template>
  <div
    class="addPassportDataForm Addpassport modal-form"
    :class="{
      'view-only-container': viewOnly,
    }"
  >
    <div class="bg-transparent main-tab-card">
      <div
        class="plmsProfileDetails d-flex flex-row justify-content-start align-items-stretch"
      >
        <div
          class="personnel-info d-flex flex-column justify-content-start align-items-stretch flex-grow-1"
          style="gap: 1.5rem"
        >
          <div class="fields-row">
            <div class="required-form-control">
              <label for="Passport" class="form-label">PAX ID</label>
              <div
                class="form_control_search-container"
                :class="{
                  'no-cursor': !enablePaxIDField,
                }"
                @click="searchEmployee"
              >
                <input
                  :class="{
                    'no-borders-form-control': !enablePaxIDField,
                  }"
                  class="form-control form-control__search"
                  id="paxId"
                  placeholder="Search.."
                  disabled
                  v-model="v$.passport.pax_id.$model"
                />
                <span
                  v-if="enablePaxIDField"
                  class="icon-searchIcon text-dark cursor-pointer"
                ></span>
              </div>
            </div>
          </div>
          <div class="fields-row">
            <div class="required-form-control">
              <label for="" class="form-label">
                {{ $t("Full Name As in Passport") }}
                <TooltipIcon
                  tooltip="Full Name As in Passport for LOI use (English or Arabic)"
                />
              </label>
              <input
                type="text"
                v-model="v$.passport.full_name.$model"
                v-input="v$.passport.full_name"
                class="form-control"
                placeholder=""
                :disabled="viewOnly"
              />
              <ErrorMessages :errors="v$.passport.full_name.$errors" />
            </div>
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Passport No'"></label>
              <input
                type="text"
                class="form-control"
                v-model="v$.passport.passport_no.$model"
                v-input:upper="v$.passport.passport_no"
                placeholder=""
                :disabled="viewOnly"
              />
              <ErrorMessages :errors="v$.passport.passport_no.$errors" />
            </div>
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Passport Type'"></label>
              <BaseDropDown
                v-model="v$.passport.type.$model"
                :options="configStore.passportTypes"
                optionValue="id"
                optionLabel="name"
                :disabled="viewOnly"
              />
            </div>
          </div>
          <div class="fields-row">
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Date of Issue'"></label>
              <CustomDatepicker
                class="visa-date-fields field-required"
                v-model:value="v$.passport.date_of_issue.$model"
                dateFormat="DD/MM/YYYY"
                :disabled-date="issueDisabledDates"
                :disabled="viewOnly"
              />
              <ErrorMessages :errors="v$.passport.date_of_issue.$errors" />
            </div>
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Date of Expiry'"></label>
              <CustomDatepicker
                class="visa-date-fields field-required"
                v-model:value="v$.passport.date_of_expiry.$model"
                dateFormat="DD/MM/YYYY"
                :disabled-date="expiryDisabledDates"
                :disabled="viewOnly"
              />
              <ErrorMessages :errors="v$.passport.date_of_expiry.$errors" />
            </div>
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Date of Birth'"></label>
              <CustomDatepicker
                class="visa-date-fields field-required"
                v-model:value="v$.passport.birthday.$model"
                dateFormat="DD/MM/YYYY"
                :disabled-date="dobDisabledDates"
                :disabled="viewOnly"
              />
            </div>
          </div>
          <div class="fields-row">
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Place of Issue'"></label>
              <BaseDropDown
                v-model="v$.passport.place_of_issue.$model"
                :options="configStore.countries"
                optionValue="ID"
                optionLabel="EngName"
                :disabled="viewOnly"
              />
            </div>
            <div class="required-form-control">
              <label for="" class="form-label" v-t="'Passport Country'"></label>
              <BaseDropDown
                v-model="v$.passport.passport_country.$model"
                :options="configStore.countries"
                optionValue="ID"
                optionLabel="EngName"
                :disabled="viewOnly"
              />
              <ErrorMessages :errors="v$.passport.passport_country.$errors" />
            </div>
          </div>
          <div class="fields-row">
            <template v-if="!viewOnly">
              <div style="flex-basis: 66%">
                <label for="" class="form-label" v-t="'Photo Copy'">
                  <span class="noteClass" v-if="item?.file"
                    >(Note: Click on arrow icon for previously uploaded
                    photocopy)</span
                  >
                </label>
                <div>
                  <input
                    type="file"
                    class="form-control"
                    placeholder=""
                    ref="fileInput"
                    @input="imgUpload"
                    :disabled="viewOnly"
                  />
                  <InputFileTooltip />
                </div>
                <span class="text-danger text-capitalize">{{ fileErr }}</span>
              </div>
              <div
                class="d-flex flex-row justify-content-end align-items-center"
              >
                <div class="displayPhotoCopy" v-if="photo">
                  <div
                    class="d-flex align-items-end h-100"
                    @click="openTab(photo)"
                  >
                    <a
                      target="_blank"
                      class="btn btn-link btn-icon"
                      type="button"
                    >
                      <span class="icon-downloadIcon passportDownloadIcon">
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <button
                v-if="photo"
                class="btn btn-primary btn-icon btn-large"
                @click="openTab(photo)"
              >
                <span v-t="'Download Passport'"></span>
              </button>
            </template>
          </div>

          <div class="save-buttons-container" v-if="!viewOnly">
            <div
              class="delete-button-container"
              v-if="isItemValid && hasDeletePermission"
            >
              <DeleteButton
                type="button"
                class="btn btn-danger"
                @click="showDeleteModal"
              />
            </div>

            <CancelButton
              v-if="isItemValid"
              type="button"
              class="btn btn-secondary"
              @click="disableEditing"
            ></CancelButton>

            <SaveButton
              type="button"
              class="btn btn-blue"
              @click="onSubmit"
              :disabled="v$.passport.$invalid"
            >
              {{ isItemValid ? $t("Update") : $t("Save") }}
            </SaveButton>
          </div>
        </div>

        <div
          class="d-flex flex-column align-items-center justify-content-start"
          style="gap: 1rem; flex-basis: 2.5rem"
          v-if="viewOnly && hasEditPermission"
        >
          <button
            type="button"
            class="btn btn-link btn-icon company-edit-icon edit-icon btn-edit"
            @click="enableEditing"
          >
            <span class="icon-edit"></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <VueModal v-model="paxTableModal" wrapperClass="vm-lg">
    <GenericModal :title="$t('Select Pax')" @close="paxTableModal = false">
      <PaxTable
        :included-headers="paxTableHeaders"
        @row-click="autofillEmployeeForm"
      >
      </PaxTable>
    </GenericModal>
  </VueModal>

  <VueModal v-model="deleteModal">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="deletePassport"
      delete
      :title="$t('Delete Passport')"
      :message="$t('Are you sure you want to delete this passport?')"
    />
  </VueModal>
</template>

<script>
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import PaxTable from "@/components/common/PaxTable.vue";
import { required, helpers, alphaNum } from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { useConfigStore, usePassportStore, useUserStore } from "@/stores";
import { EnvironmentEnum, PAXHeaders, PermissionsEnum } from "@/data";
import {
  checkValidValue,
  isValidObject,
  issueDisabledDates,
  expiryDisabledDates,
  defaultDisabledDates,
  resetValidationObject,
  sanitizeObject,
  validName,
  dobDisabledDates,
  uploadFile,
} from "@/helpers";
import { mapStores } from "pinia";
import GenericModal from "@/components/common/GenericModal.vue";
import BaseDropDown from "./BaseDropDown.vue";
import ConfirmModal from "./ConfirmModal.vue";
import TooltipIcon from "./TooltipIcon.vue";
import InputFileTooltip from "./InputFileTooltip.vue";
import DeleteButton from "./DeleteButton.vue";
import CancelButton from "./CancelButton.vue";
import SaveButton from "./SaveButton.vue";
import CustomDatepicker from "./CustomDatepicker.vue";

export default defineComponent({
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      passport: {
        pax_id: "",
        full_name: "",
        passport_no: "",
        type: "",
        date_of_issue: "",
        date_of_expiry: "",
        birthday: "",
        place_of_issue: "",
        passport_country: "",
        file: "",
      },
      paxTableHeaders: [
        PAXHeaders.PAX,
        PAXHeaders.FullName,
        PAXHeaders.PAXType,
        PAXHeaders.Position,
        PAXHeaders.Department,
        PAXHeaders.Employer,
        PAXHeaders.Email,
        PAXHeaders.Passport,
      ],
      fileErr: null,
      paxTableModal: false,
      deleteModal: false,
      viewOnly: false,
      issueDisabledDates,
      expiryDisabledDates,
      defaultDisabledDates,
      dobDisabledDates,
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
  },
  validations() {
    const rules = {
      full_name: {
        required: helpers.withMessage("This field is required", required),
        validName,
      },
      passport_no: {
        required: helpers.withMessage("This field is required", required),
        alphaNum,
      },
      pax_id: {
        required: helpers.withMessage("This field is required", required),
      },
      type: {
        required: helpers.withMessage("This field is required", required),
      },
      birthday: {
        required: helpers.withMessage("This field is required", required),
      },
      place_of_issue: {
        required: helpers.withMessage("This field is required", required),
      },
      date_of_issue: {
        required: helpers.withMessage("This field is required", required),
      },
      date_of_expiry: {
        required: helpers.withMessage("This field is required", required),
      },
      passport_country: {
        required: helpers.withMessage("This field is required", required),
      },
      file: {},
    };
    return {
      passport: rules,
    };
  },
  components: {
    ErrorMessages,
    PaxTable,
    GenericModal,
    BaseDropDown,
    ConfirmModal,
    TooltipIcon,
    InputFileTooltip,
    DeleteButton,
    CancelButton,
    SaveButton,
    CustomDatepicker,
  },
  emits: ["updateTableRequest", "close", "submit"],
  methods: {
    enableEditing() {
      this.viewOnly = false;
    },
    disableEditing() {
      this.viewOnly = true;

      this.syncFormWithItem(this.item);
    },
    autofillEmployeeForm(item) {
      this.passport = {
        ...this.passport,
        pax_id: item.pax_id,
        full_name: item.eng_full_name,
      };

      this.paxTableModal = false;
    },
    showDeleteModal() {
      this.deleteModal = true;
    },
    hideDeleteModal() {
      this.deleteModal = false;
    },
    imgUpload() {
      const { file, error } = uploadFile(this.$refs.fileInput);
      this.fileErr = error;
      this.v$.passport.file.$model = file;
      this.v$.passport.file.$touch();
    },
    async onSubmit() {
      try {
        if (this.v$.passport.$invalid) {
          return;
        }

        const formData = this.passport;
        const data = sanitizeObject({
          ...formData,
          pax_id: +formData?.pax_id,
        });
        if (!this.isItemValid) {
          await this.passportStore.addPassport(data);
        } else {
          await this.passportStore.updatePassport(this.item?.id, data);
        }
        this.$emit("updateTableRequest");
        this.$emit("close");
        this.$emit("submit");
      } catch (error) {}
    },
    async searchEmployee() {
      if (this.enablePaxIDField) {
        this.paxTableModal = true;
      }
    },
    checkPrimitiveValue(value) {
      return checkValidValue(value);
    },
    async deletePassport() {
      try {
        await this.passportStore.deletePassport(this.item?.id);
        this.hideDeleteModal();
        this.$emit("updateTableRequest");
        this.$emit("close");
        this.$emit("submit");
      } catch (error) {
        console.log("Error deleting passport", error);
      }
    },
    openTab(url) {
      window.open(url, "_blank");
    },
    syncFormWithItem(newValue) {
      this.passport = {
        pax_id: this.checkPrimitiveValue(newValue?.pax?.pax_id),
        full_name: newValue.full_name,
        passport_no: newValue.passport_no,
        type: newValue.type,
        date_of_issue: newValue.date_of_issue,
        date_of_expiry: newValue.date_of_expiry,
        birthday: newValue.birthday ? newValue.birthday : "",
        place_of_issue: newValue.place_of_issue?.id,
        passport_country: newValue.passport_country?.id,
      };
    },
  },
  computed: {
    ...mapStores(usePassportStore, useConfigStore, useUserStore),
    isItemValid() {
      return isValidObject(this.item);
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.PASSPORT_EDIT);
    },
    hasDeletePermission() {
      return this.userStore.hasPermission(PermissionsEnum.PASSPORT_DELETE);
    },
    enablePaxIDField() {
      return !(this.viewOnly || this.isItemValid || this.initialData);
    },
    photo() {
      return this.item?.file
        ? `${import.meta.env[EnvironmentEnum.StorageBaseURL]}/${
            this.item?.file
          }`
        : "";
    },
  },
  watch: {
    item: {
      handler(newValue) {
        if (this.isItemValid) {
          this.viewOnly = true;

          this.syncFormWithItem(newValue);
        } else {
          this.passport = {
            ...this.passport,
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
}

.modal-form {
  padding: 2rem 4rem;
}
.form-label {
  display: block;
}

.fields-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;

  > div {
    flex-basis: 33%;
  }
}
</style>
