<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

View/Delete/Edit PAX details

***********************************
-->
<template>
  <div class="pax-profile-tab-container">
    <slot name="header"></slot>

    <div
      class="modal-form"
      :class="{
        'view-only-container': viewOnly,
        'disable-validation': isItemValid,
        'new-pax': !isItemValid,
      }"
    >
      <VueModal v-model="deleteModal">
        <ConfirmModal
          @close="hideDeleteModal"
          @confirm="deletePax"
          delete
          :title="$t('Do you want to delete this PAX?')"
          :message="
            $t(
              'All personal data, including historical data, LOIs, visas, passports will be deleted from the system, Are you sure?'
            )
          "
        />
      </VueModal>

      <div
        class="pax-modal-container d-flex flex-column justify-content-start align-items-stretch"
        style="gap: 2rem"
      >
        <div
          class="d-flex flex-row justify-content-between align-items-stretch"
          style="gap: 2rem"
        >
          <div style="flex: 0 0 20%" v-if="!onlyForm">
            <PaxPhoto @update-profile="onProfileUpload" :photo="photo" />
            <div class="text-center mt-2 mb-2 username">
              <h4>{{ v$.personal.eng_full_name.$model }}</h4>
            </div>
          </div>

          <div
            class="d-flex flex-column justify-content-start align-items-stretch flex-grow-1"
            style="gap: 1rem"
          >
            <div class="pax-form-container">
              <div class="card">
                <h5 class="card-title">{{ $t("PAX Identification") }}</h5>

                <div class="card-body">
                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.type"
                  >
                    <label for="" class="form-label">Pax Type</label>
                    <BaseDropDown
                      v-model="v$.personal.type.$model"
                      :options="plmsStore.personnelType"
                      :disabled="viewOnly"
                    />
                  </div>

                  <div class="pax-form-item" v-validate="v$.personal.badge_no">
                    <label for="" class="form-label" v-t="'Badge No'"></label>
                    <input
                      type="number"
                      class="form-control personal-fields hide-spinner"
                      v-model="v$.personal.badge_no.$model"
                      v-input="v$.personal.badge_no"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.badge_no.$errors" />
                  </div>
                </div>
              </div>

              <div class="card">
                <h5 class="card-title">{{ $t("Personal Details") }}</h5>

                <div class="card-body">
                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.first_name"
                  >
                    <label
                      for="fname"
                      class="form-label"
                      v-t="'First Name'"
                    ></label>
                    <input
                      type="text"
                      id="fname"
                      class="form-control personal-fields"
                      name="firstName"
                      v-model="v$.personal.first_name.$model"
                      v-input="v$.personal.first_name"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.first_name.$errors" />
                  </div>

                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.last_name"
                  >
                    <label
                      for="lname"
                      class="form-label"
                      v-t="'Family Name'"
                    ></label>
                    <input
                      type="text"
                      class="form-control personal-fields"
                      v-model="v$.personal.last_name.$model"
                      v-input="v$.personal.last_name"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.last_name.$errors" />
                  </div>

                  <div
                    class="pax-form-item required-form-control full-basis"
                    v-validate="v$.personal.eng_full_name"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'English Full Name'"
                    ></label>
                    <input
                      type="text"
                      class="form-control personal-fields"
                      v-model="v$.personal.eng_full_name.$model"
                      v-input="v$.personal.eng_full_name"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages
                      :errors="v$.personal.eng_full_name.$errors"
                    />
                  </div>

                  <div
                    class="pax-form-item full-basis"
                    v-validate="v$.personal.arab_full_name"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Full Name in Arabic (or Translation)'"
                    ></label>
                    <input
                      type="text"
                      class="form-control personal-fields"
                      v-model="v$.personal.arab_full_name.$model"
                      v-input="v$.personal.arab_full_name"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages
                      :errors="v$.personal.arab_full_name.$errors"
                    />
                  </div>

                  <div class="pax-form-item" v-validate="v$.personal.dob">
                    <label
                      for=""
                      class="form-label"
                      v-t="'Date of Birth'"
                    ></label>
                    <CustomDatepicker
                      class="field-required"
                      v-model:value="v$.personal.dob.$model"
                      value-type="YYYY-MM-DD"
                      format="DD/MM/YYYY"
                      :disabled-date="dobDisabledDates"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.dob.$errors" />
                  </div>

                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.gender"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Gender'"
                    ></label>
                    <BaseDropDown
                      v-model="v$.personal.gender.$model"
                      :options="configStore.sexTypes"
                      :disabled="viewOnly"
                    />
                  </div>
                </div>
              </div>

              <div class="card">
                <h5 class="card-title">{{ $t("Nationalities") }}</h5>

                <div class="card-body">
                  <div
                    class="pax-form-item"
                    v-validate="v$.personal.nationality"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Nationality'"
                    ></label>
                    <BaseDropDown
                      v-model="v$.personal.nationality.$model"
                      :options="configStore.sortedNationalities"
                      optionValue="ID"
                      :optionLabel="countryToNationalityLabel"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.nationality.$errors" />
                  </div>

                  <div
                    class="pax-form-item"
                    v-validate="v$.personal.country_residence"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Country of Residence'"
                    ></label>
                    <BaseDropDown
                      v-model="v$.personal.country_residence.$model"
                      :options="configStore.countries"
                      optionValue="ID"
                      optionLabel="EngName"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages
                      :errors="v$.personal.country_residence.$errors"
                    />
                  </div>
                </div>
              </div>

              <div class="card">
                <h5 class="card-title">{{ $t("Employment Info") }}</h5>

                <div class="card-body">
                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.company_id"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Employer'"
                    ></label>
                    <BaseDropDown
                      v-model="v$.personal.company_id.$model"
                      :options="configStore.companies"
                      optionValue="id"
                      optionLabel="name"
                      :disabled="viewOnly"
                    />
                  </div>

                  <div class="flex-break"></div>

                  <div
                    class="pax-form-item"
                    v-validate="v$.personal.department_id"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Department'"
                    ></label>
                    <BaseDropDown
                      v-model="v$.personal.department_id.$model"
                      :options="configStore.departments"
                      optionValue="id"
                      optionLabel="name"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages
                      :errors="v$.personal.department_id.$errors"
                    />
                  </div>

                  <div class="flex-break"></div>

                  <div class="pax-form-item" v-validate="v$.personal.position">
                    <label
                      for=""
                      class="form-label"
                      v-t="'Position In English'"
                    ></label>
                    <input
                      type="text"
                      class="form-control personal-fields"
                      v-model="v$.personal.position.$model"
                      v-input="v$.personal.position"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.position.$errors" />
                  </div>

                  <div
                    class="pax-form-item"
                    v-validate="v$.personal.arab_position"
                  >
                    <label
                      for=""
                      class="form-label"
                      v-t="'Position In Arabic'"
                    ></label>
                    <input
                      type="text"
                      class="form-control personal-fields"
                      v-model="v$.personal.arab_position.$model"
                      v-input="v$.personal.arab_position"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages
                      :errors="v$.personal.arab_position.$errors"
                    />
                  </div>
                </div>
              </div>

              <div class="card">
                <h5 class="card-title">{{ $t("Contact") }}</h5>

                <div class="card-body">
                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.email"
                  >
                    <label for="email" class="form-label" v-t="'Email'"></label>
                    <input
                      type="email"
                      class="form-control personal-fields"
                      v-model="v$.personal.email.$model"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.email.$errors" />
                  </div>

                  <div class="pax-form-item" v-validate="v$.personal.phone">
                    <label
                      for="phone"
                      class="form-label"
                      v-t="'Mobile'"
                    ></label>
                    <PhoneInput
                      v-model:phone="v$.personal.phone.$model"
                      v-model:country="v$.personal.country_code_id.$model"
                      :disabled="viewOnly"
                    />
                    <ErrorMessages :errors="v$.personal.phone.$errors" />
                  </div>
                </div>
              </div>

              <div class="card">
                <h5 class="card-title">{{ $t("PAX Status") }}</h5>

                <div class="card-body">
                  <div
                    class="pax-form-item required-form-control"
                    v-validate="v$.personal.status"
                  >
                    <label
                      for="Passport"
                      class="form-label"
                      v-t="'Status'"
                    ></label>
                    <div
                      class="d-flex flex-row justify-content-evenly align-items-center"
                    >
                      <div
                        class="form-check form-check-inline horizontal-form-field flex-grow-1"
                        style="height: 4rem"
                        v-for="option of plmsStore.status"
                        :key="option.id"
                      >
                        <label
                          class="form-check-label cursor-pointer no-asterisk"
                        >
                          <input
                            name="status-radio"
                            class="form-check-input"
                            type="radio"
                            :value="option.id"
                            v-model="v$.personal.status.$model"
                            :disabled="viewOnly"
                          />{{ option.value }}</label
                        >
                      </div>
                    </div>
                  </div>

                  <FadeInTransition>
                    <div
                      class="pax-form-item required-form-control"
                      v-validate="v$.personal.offboard_date"
                      v-if="isOffboard"
                    >
                      <label
                        for="Passport"
                        class="form-label"
                        v-t="'Offboard Date'"
                      ></label>
                      <CustomDatepicker
                        class="field-required"
                        v-model:value="v$.personal.offboard_date.$model"
                        dateFormat="DD/MM/YYYY"
                      /></div
                  ></FadeInTransition>
                </div>
              </div>
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
                :disabled="v$.personal.$invalid"
              >
                {{ isItemValid ? $t("Update") : $t("Save") }}
              </SaveButton>
            </div>
          </div>

          <div
            v-if="viewOnly && hasEditPermission && !onlyForm"
            class="d-flex flex-column justify-content-start align-items-center"
            style="gap: 1rem; flex-basis: 52px"
          >
            <button
              class="btn btn-icon company-edit-icon edit-details"
              @click="enableEditing"
            >
              <span class="icon-edit"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  helpers,
  email,
  alphaNum,
  numeric,
  requiredIf,
  maxLength,
} from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { useConfigStore, usePLMSStore, useUserStore } from "@/stores";
import { mapStores } from "pinia";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import {
  checkValidValue,
  convertToDayjs,
  formatDate,
  isValidObject,
  resetValidationObject,
  dobDisabledDates,
  sanitizeObject,
  validName,
  validPhoneNumber,
  validNameArabic,
  defaultDisabledDates,
  countryToNationalityLabel,
  uploadFile,
} from "@/helpers";
import {
  EnvironmentEnum,
  PaxStatusEnum,
  PermissionsEnum,
  iraqCountryId,
} from "@/data";

import BaseDropDown from "@/components/common/BaseDropDown.vue";
import FadeInTransition from "@/components/common/FadeInTransition.vue";
import InputFileTooltip from "@/components/common/InputFileTooltip.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import CancelButton from "@/components/common/CancelButton.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import PhoneInput from "@/components/common/PhoneInput.vue";
import PaxPhoto from "./PaxPhoto.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

export default defineComponent({
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      personal: {
        pax_id: "",
        dob: "",
        type: "",
        company_id: "",
        arab_position: "",
        position: "",
        department_id: "",
        eng_full_name: "",
        arab_full_name: "",
        nationality: "",
        country_residence: "",
        gender: "",
        first_name: "",
        last_name: "",
        badge_no: "",
        phone: "",
        email: "",
        file: "",
        country_code_id: iraqCountryId,
        status: PaxStatusEnum.Onboard,
        offboard_date: formatDate(convertToDayjs(new Date())),
      },
      viewOnly: false,
      baseUrl: import.meta.env[EnvironmentEnum.StorageBaseURL],
      deleteModal: false,
      defaultDisabledDates,
      dobDisabledDates,
      countryToNationalityLabel,
    };
  },
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
    onlyForm: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["delete", "update", "create", "viewOnlyChange"],
  validations() {
    const rules = {
      type: {
        required: helpers.withMessage("This field is required", required),
      },
      company_id: {
        required: helpers.withMessage("This field is required", required),
      },
      gender: {
        required: helpers.withMessage("This field is required", required),
      },
      dob: {},
      pax_id: {
        alphaNum: helpers.withMessage("Invalid PAX ID", alphaNum),
      },
      position: {},
      arab_position: {},
      department_id: {},
      arab_full_name: {
        validNameArabic,
      },
      eng_full_name: {
        required: helpers.withMessage("This field is required", required),
        validName,
      },
      nationality: {},
      country_residence: {},
      status: {},
      offboard_date: {
        requiredIfStatus: requiredIf(this.isOffboard),
      },
      first_name: {
        required: helpers.withMessage("This field is required", required),
        validName,
      },
      last_name: {
        required: helpers.withMessage("This field is required", required),
        validName,
      },
      badge_no: {
        numeric: helpers.withMessage("Invalid Badge Number", numeric),
        maxLength: maxLength(6),
      },
      country_code_id: {},
      phone: {
        validPhoneNumber,
      },
      email: {
        required: helpers.withMessage("This field is required", required),
        email: helpers.withMessage("Invalid Email", email),
      },
      file: {},
    };
    return {
      personal: rules,
    };
  },
  components: {
    ErrorMessages,
    ConfirmModal,
    BaseDropDown,
    FadeInTransition,
    InputFileTooltip,
    DeleteButton,
    CancelButton,
    SaveButton,
    PhoneInput,
    PaxPhoto,
    CustomDatepicker,
  },
  methods: {
    showDeleteModal() {
      this.deleteModal = true;
    },
    hideDeleteModal() {
      this.deleteModal = false;
    },
    async deletePax() {
      this.hideDeleteModal();
      this.$emit("delete");
    },
    autoFillFromCompany(autofill) {
      this.personal = {
        ...this.personal,
        email: autofill.email,
      };

      this.v$.$touch();
    },
    async onSubmit() {
      if (this.v$.personal.$invalid) {
        return;
      }
      const formData = this.v$.personal.$model;

      const data = sanitizeObject({
        ...formData,
        company_id: formData.company_id,
        offboard_date: this.isOffboard ? formData.offboard_date : "",
      });

      if (this.isItemValid) {
        this.$emit("update", data);
      } else {
        this.$emit("create", data);
      }
    },
    enableEditing() {
      this.viewOnly = false;
    },
    disableEditing() {
      this.viewOnly = true;

      this.syncFormWithItem(this.profile);
    },
    onProfileUpload({ file }) {
      this.v$.personal.file.$model = file;
      this.v$.personal.file.$touch();
    },
    checkPrimitiveValue(value) {
      return checkValidValue(value);
    },
    syncFormWithItem(personalData) {
      this.personal = {
        ...this.personal,
        pax_id: this.checkPrimitiveValue(personalData.pax_id),
        type: this.checkPrimitiveValue(personalData.type),
        position: this.checkPrimitiveValue(personalData.position),
        arab_position: this.checkPrimitiveValue(personalData.arab_position),
        department_id: this.checkPrimitiveValue(personalData.department?.id),
        eng_full_name: this.checkPrimitiveValue(personalData.eng_full_name),
        arab_full_name: this.checkPrimitiveValue(personalData.arab_full_name),
        nationality: this.checkPrimitiveValue(personalData.nationality?.id),
        country_residence: this.checkPrimitiveValue(
          personalData.country_residence?.id
        ),
        gender: this.checkPrimitiveValue(personalData.gender),
        first_name: this.checkPrimitiveValue(personalData.first_name),
        last_name: this.checkPrimitiveValue(personalData.last_name),
        badge_no: this.checkPrimitiveValue(personalData.badge_no),
        dob: this.checkPrimitiveValue(personalData.dob),
        phone: this.checkPrimitiveValue(personalData.phone),
        country_code_id: this.checkPrimitiveValue(
          personalData.country_code?.id
        ),
        email: this.checkPrimitiveValue(personalData.email),
        company_id: this.checkPrimitiveValue(personalData.company?.id),
        status: this.checkPrimitiveValue(personalData.status),
        offboard_date:
          personalData.status == PaxStatusEnum.Offboard
            ? this.checkPrimitiveValue(personalData?.offboard_date)
            : this.personal.offboard_date,
      };
    },
  },
  computed: {
    ...mapStores(usePLMSStore, useConfigStore, useUserStore),
    isItemValid() {
      return isValidObject(this.profile);
    },
    isOffboard() {
      return this.personal.status == PaxStatusEnum.Offboard;
    },
    hasDeletePermission() {
      return this.userStore.hasPermission(PermissionsEnum.PAX_DELETE);
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.PAX_EDIT);
    },
    photo() {
      return this.profile?.file ? `${this.baseUrl}/${this.profile.file}` : null;
    },
  },
  watch: {
    profile: {
      handler(personalData) {
        if (this.isItemValid) {
          this.viewOnly = true;

          this.syncFormWithItem(personalData);
        }
      },
      immediate: true,
    },
    viewOnly: {
      handler(newValue) {
        this.$emit("viewOnlyChange", newValue);
      },
      immediate: true,
    },
  },
});
</script>

<style scoped lang="scss">
.icon-icon-delete {
  font-size: 2rem;
}
.passportDownloadIcon {
  font-size: 1.6rem;
}

.new-data {
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
}

.pax-form-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  gap: 2rem;

  .card {
    .card-title {
      text-align: start;
      font-size: 1.5rem;
      color: #666;
      font-weight: 600;
      background: #eee;
      padding: 0.6rem 1.5rem;
    }
  }

  .card-body,
  .no-card-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    row-gap: 1rem;

    .pax-form-item {
      flex: 0 0 49%;
      &.full-basis {
        flex-basis: 100%;
      }
    }

    .flex-break {
      width: 0;
      flex-basis: 100%;
    }
  }

  .pax-form-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
    width: 40rem;
    min-height: 26px;

    .form-label {
      margin-bottom: 0px;
      display: flex;
      align-items: center;
    }

    > label {
      white-space: nowrap;
      flex: 0 0 12.5rem;
    }

    label + * {
      flex-grow: 1;
      width: unset !important;
    }

    .horizontal-form-field {
      min-height: 27px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

.view-only-container {
  .form-label::after {
    content: ":";
    color: inherit;
  }
}

.pax-modal-container {
  .pax-form-item label + * {
    flex-grow: 1;
    width: 100% !important;
  }
}
.new-pax {
  .pax-modal-container {
    padding: 2rem;
  }
}
</style>
