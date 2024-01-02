<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Create/Edit/View blood applicant

***********************************
-->
<script setup>
import { computed, reactive, onMounted, ref, watch } from "vue";
import BloodHistoryTable from "./BloodHistoryTable.vue";
import PenaltyTable from "./BloodPenaltyTable.vue";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { useBloodStore, useConfigStore, usePLMSStore } from "@/stores";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  numeric,
  maxLength,
  alphaNum,
} from "@vuelidate/validators";
import {
  TestStatusEnum,
  TestPurposesEnum,
  MEEVTypeEnum,
  BloodTestTypesEnum,
  BloodVisaTypesEnum,
  iraqCountryId,
} from "@/data";
import { storeToRefs } from "pinia";
import {
  appendDate,
  expiryDisabledDates,
  issueDisabledDates,
  countryToNationalityLabel,
  validName,
  validPhoneNumber,
  dobDisabledDates,
} from "@/helpers";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import FadeInTransition from "@/components/common/FadeInTransition.vue";
import { useI18n } from "vue-i18n";
import CustomEditor from "@/components/common/CustomEditor.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import PhoneInput from "@/components/common/PhoneInput.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false,
  },
  batch: {
    type: Object,
    required: true,
  },
  applicantId: {
    type: [String, Number],
    required: false,
  },
  applicantsIds: {
    type: Array,
    default: () => [],
  },
  paxId: {
    type: [String, Number],
    required: false,
  },
});

const emit = defineEmits({
  submitted: null,
});

const { countries, companies, departments, sortedNationalities } = storeToRefs(
  useConfigStore()
);
const {
  saveBloodApplicant,
  updateBloodApplicant,
  getBloodApplicant,
  updateMultipleBloodApplicants,
} = useBloodStore();
const { getPaxDetails } = usePLMSStore();
const { t } = useI18n();

const applicantDetails = ref(null);

const applicantInfo = computed(() => applicantDetails.value?.data);
const paxInfo = computed(() => applicantDetails.value?.data?.pax);
const bloodTestHistory = computed(
  () => applicantDetails.value?.blood_test_history
);
const bloodPenalties = computed(() => applicantDetails.value?.penalty);
const bloodSuggestions = computed(
  () => applicantDetails.value?.blood_test_suggestions
);

const viewOnly = computed(() => props.viewOnly);
const isApplicant = computed(() => !!props.applicantId || viewOnly.value);
const isMultipleApplicants = computed(() => !!props.applicantsIds.length);
const enablePaxForm = computed(() => !paxInfo.value?.pax_id && !props.viewOnly);

const defaultTests = !enablePaxForm.value && !props.applicantId;

const state = reactive({
  bloodForm: {
    arrival_date: "",
    departure_date: "",
    appoint_time: "",
    passport_submit_date: "",
    passport_return_date: "",
    attendance: "",

    purposeBloods: false,
    purposeMEEV: false,
    purposeVisa: false,

    meevRenewal: false,
    meevNew: false,
    meevModify: false,

    visaOffboard: false,
    visaExtension: false,

    malaria_tested: defaultTests,
    hiv_tested: defaultTests,
    hbs_tested: defaultTests,
    hiv_expire_date: "",
    hbs_expire_date: "",

    remarks: "",
  },
  paxForm: {
    passport_no: "",
    full_name: "",
    passport_country: "",
    birthday: "",
    passport_issue_date: "",
    passport_expiry_date: "",
    employer: "",
    badge_no: "",
    position: "",
    department: "",
    email: "",
    country_code_id: iraqCountryId,
    phone: "",
  },
});

const rules = computed(() => ({
  bloodForm: {
    arrival_date: {},
    departure_date: {},
    appoint_time: {},
    passport_submit_date: {},
    passport_return_date: {},
    attendance: {},

    purposeBloods: {},
    purposeMEEV: {},
    purposeVisa: {},

    meevRenewal: {},
    meevNew: {},
    meevModify: {},

    visaOffboard: {},
    visaExtension: {},

    malaria_tested: {},
    hiv_tested: {},
    hbs_tested: {},
    modify_tested: {},

    hiv_expire_date: {},
    hbs_expire_date: {},

    remarks: {},
  },
  paxForm: {
    passport_no: {
      required,
      alphaNum,
    },
    full_name: {
      required,
      validName,
    },
    passport_country: {},
    birthday: {},
    passport_issue_date: {},
    passport_expiry_date: {},
    employer: {},
    badge_no: {
      numeric,
      maxLength: maxLength(6),
    },
    position: {},
    department: {},
    email: {
      email,
      required,
    },
    country_code_id: {},
    phone: {
      validPhoneNumber,
    },
  },
  $validationGroups: {
    pax: Object.keys(state.paxForm).map((element) => `paxForm.${element}`),
    blood: Object.keys(state.bloodForm).map(
      (element) => `bloodForm.${element}`
    ),
  },
}));

const v$ = useVuelidate(rules, state);

const submitDateCheckbox = computed(
  () => !!state.bloodForm.passport_submit_date
);
const returnedDateCheckbox = computed(
  () => !!state.bloodForm.passport_return_date
);
const defaultTestExpiryDate = computed(() =>
  state.bloodForm.departure_date
    ? appendDate(state.bloodForm.departure_date, 86, "days")
    : ""
);
const isBloodPurposeEnabled = computed(() => state.bloodForm.purposeBloods);
const isVisaPurposeEnabled = computed(() => state.bloodForm.purposeVisa);
const isMEEVPurposeEnabled = computed(() => state.bloodForm.purposeMEEV);
const isFormValid = computed(() => {
  const isPaxValid = !v$.value.$validationGroups.pax.$invalid;
  const isBloodValid = !v$.value.$validationGroups.blood.$invalid;
  if (enablePaxForm.value) {
    return isPaxValid && isBloodValid;
  } else {
    return isBloodValid;
  }
});

watch(
  () => state.bloodForm.hiv_tested,
  (newValue) => {
    state.bloodForm.hiv_expire_date = newExpiryDate(
      newValue,
      state.bloodForm.hiv_expire_date
    );
    v$.value.bloodForm.hiv_expire_date.$touch();
  }
);

watch(
  () => state.bloodForm.hbs_tested,
  (newValue) => {
    state.bloodForm.hbs_expire_date = newExpiryDate(
      newValue,
      state.bloodForm.hbs_expire_date
    );
    v$.value.bloodForm.hbs_expire_date.$touch();
  }
);

function newExpiryDate(checkValue, originalValue) {
  let temp = originalValue;
  if (checkValue) {
    if (!temp && defaultTestExpiryDate.value) {
      temp = defaultTestExpiryDate.value;
    }
  } else {
    temp = "";
  }
  return temp;
}

async function submit() {
  try {
    const fullBloodForm = state.bloodForm;
    const fullPaxForm = state.paxForm;

    const {
      appoint_time, // In order to remove it from payload

      purposeBloods,
      purposeMEEV,
      purposeVisa,

      meevRenewal,
      meevNew,
      meevModify,

      visaOffboard,
      visaExtension,

      malaria_tested,
      hiv_tested,
      hbs_tested,
      modify_tested,

      ...tempBloodForm
    } = fullBloodForm;
    const {
      applicantId,
      batch: { batch_no } = {}, // We add this so it doesn't throw if empty
    } = props;
    const { pax_id } = paxInfo.value || {};

    const meev_types = convertPaxFormToMeevTypes(fullBloodForm);
    const blood_test_types = convertPaxFormToBloodTypes(fullBloodForm);
    const visa_types = convertPaxFormToVisaTypes(fullBloodForm);

    const task_purposes = {
      blood: {
        status: isBloodPurposeEnabled.value,
        values: isBloodPurposeEnabled.value ? blood_test_types : [],
      },
      visa: {
        status: isVisaPurposeEnabled.value,
        values: isVisaPurposeEnabled.value ? visa_types : [],
      },
      meev: {
        status: isMEEVPurposeEnabled.value,
        values: isMEEVPurposeEnabled.value ? meev_types : [],
      },
    };

    const body = {
      batch_no,
      pax_id: +pax_id,
    };

    const bloodFormBody = {
      ...tempBloodForm,
      task_purposes,
    };

    const finalData = {
      ...(isMultipleApplicants.value ? {} : body),
      ...bloodFormBody,
      ...(enablePaxForm.value ? fullPaxForm : {}),
    };
    const promise = () =>
      isMultipleApplicants.value
        ? updateMultipleBloodApplicants(props.applicantsIds, finalData)
        : isApplicant.value
        ? updateBloodApplicant(applicantId, finalData)
        : saveBloodApplicant(finalData);
    await promise();
    emit("submitted");
  } catch (error) {
    console.log("Error submitting", error);
  }
}

function convertPaxFormToBloodTypes(tempBloodForm) {
  let temp = [];
  if (!!tempBloodForm?.malaria_tested) temp.push(BloodTestTypesEnum.Malaria);
  if (!!tempBloodForm?.hiv_tested) temp.push(BloodTestTypesEnum.HIV);
  if (!!tempBloodForm?.hbs_tested) temp.push(BloodTestTypesEnum.HBS);
  if (!!tempBloodForm?.modify_tested) temp.push(BloodTestTypesEnum.Modify);

  return temp;
}

function convertPaxFormToMeevTypes({ meevRenewal, meevNew, meevModify }) {
  let temp = [];
  if (!!meevRenewal) temp.push(MEEVTypeEnum.Renewal);
  if (!!meevNew) temp.push(MEEVTypeEnum.New);
  if (!!meevModify) temp.push(MEEVTypeEnum.Modify);

  return temp;
}

function convertPaxFormToVisaTypes({ visaOffboard, visaExtension }) {
  let temp = [];
  if (!!visaOffboard) temp.push(BloodVisaTypesEnum.Offboard);
  if (!!visaExtension) temp.push(BloodVisaTypesEnum.Extension);

  return temp;
}

function setUpInitialForm() {
  const {
    task_purposes,
    arrival_date,
    departure_date,
    appoint_time,
    passport_submit_date,
    passport_return_date,
    remarks,
    attendance,
    hbs_expire_date,
    hiv_expire_date,
  } = {
    ...state.bloodForm,
    ...applicantInfo.value,
  };
  const bloodsTests = task_purposes?.blood?.status
    ? task_purposes?.blood?.values
    : [];
  const meevTests = task_purposes?.meev?.status
    ? task_purposes?.meev?.values
    : [];
  const visaTests = task_purposes?.visa?.status
    ? task_purposes?.visa?.values
    : [];

  const tempBloodSuggestions = bloodSuggestions.value;
  const hasSuggestion = (bloodTestType) => {
    if (tempBloodSuggestions.length) {
      const tempDefault = tempBloodSuggestions.find(
        (element) => element?.label == bloodTestType
      )?.default;
      return tempDefault ? tempDefault : false;
    } else {
      return false;
    }
  };

  if (paxInfo.value) {
    const {
      badge_no,
      department,
      company,
      eng_full_name,
      latest_passport,
      position,
      dob,
      email,
      country_code,
      phone,
    } = paxInfo.value;

    state.paxForm = {
      ...state.paxForm,
      passport_no: latest_passport?.passport_no,
      full_name: eng_full_name,
      passport_country: latest_passport?.passport_country?.id,
      birthday: dob,
      passport_issue_date: latest_passport?.date_of_issue,
      passport_expiry_date: latest_passport?.date_of_expiry,
      position,
      badge_no,
      department: department?.id,
      employer: company?.id,
      email,
      country_code_id: country_code?.id,
      phone,
    };
  }

  if (isApplicant.value) {
    state.bloodForm = {
      arrival_date,
      departure_date,
      appoint_time,
      passport_submit_date,
      passport_return_date,
      remarks,
      attendance,
      hbs_expire_date,
      hiv_expire_date,

      purposeBloods: !!task_purposes?.blood?.status,
      purposeMEEV: !!task_purposes?.meev?.status,
      purposeVisa: !!task_purposes?.visa?.status,

      meevRenewal: meevTests?.includes(MEEVTypeEnum.Renewal),
      meevNew: meevTests?.includes(MEEVTypeEnum.New),
      meevModify: meevTests?.includes(MEEVTypeEnum.Modify),

      visaOffboard: visaTests?.includes(BloodVisaTypesEnum.Offboard),
      visaExtension: visaTests?.includes(BloodVisaTypesEnum.Extension),

      malaria_tested: bloodsTests?.includes(BloodTestTypesEnum.Malaria),
      hiv_tested: bloodsTests?.includes(BloodTestTypesEnum.HIV),
      hbs_tested: bloodsTests?.includes(BloodTestTypesEnum.HBS),
      modify_tested: bloodsTests?.includes(BloodTestTypesEnum.Modify),
    };
  } else if (tempBloodSuggestions?.length) {
    state.bloodForm = {
      ...state.bloodForm,
      malaria_tested: hasSuggestion(BloodTestTypesEnum.Malaria),
      hiv_tested: hasSuggestion(BloodTestTypesEnum.HIV),
      hbs_tested: hasSuggestion(BloodTestTypesEnum.HBS),
      modify_tested: hasSuggestion(BloodTestTypesEnum.Modify),
    };
  }
}

onMounted(async () => {
  const { applicantId, paxId } = props;
  let applicantPromise;
  if (applicantId) {
    applicantPromise = () => getBloodApplicant(applicantId);
  } else if (paxId) {
    applicantPromise = () =>
      getPaxDetails(paxId).then((pax) => ({
        data: {
          pax,
        },
      }));
  }

  if (applicantPromise) {
    applicantDetails.value = await applicantPromise();
  }

  setUpInitialForm();
});
</script>

<template>
  <div
    class="d-flex flex-row justify-content-start align-items-stretch modal-form"
    :class="{
      'view-only-container': viewOnly,
      'multiple-applicants-container': isMultipleApplicants,
    }"
  >
    <div
      class="form-sidebar d-flex flex-column justify-content-start align-items-stretch p-4"
    >
      <template v-if="enablePaxForm">
        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
        >
          <p
            class="section-title fs-4 text-primary"
            v-t="'PAX INFORMATION'"
          ></p>
          <div
            class="section-body Addpassport d-flex flex-column justify-content-start align-items-stretch"
            style="gap: 1rem"
          >
            <div class="row">
              <div class="col required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Passport Number'"
                >
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.paxForm.passport_no.$model"
                  v-input:upper="v$.paxForm.passport_no"
                  :placeholder="t('eg EH123456')"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.paxForm.passport_no.$errors" />
              </div>
            </div>
            <div class="row">
              <div class="col required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Full Name as in Passport'"
                >
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.paxForm.full_name.$model"
                  v-input="v$.paxForm.full_name"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.paxForm.full_name.$errors" />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label
                  for="country"
                  class="form-label"
                  v-t="'Passport Country'"
                >
                </label>
                <BaseDropDown
                  v-model="v$.paxForm.passport_country.$model"
                  :options="sortedNationalities"
                  :disabled="viewOnly"
                  optionValue="ID"
                  :optionLabel="countryToNationalityLabel"
                />
              </div>
              <div class="col-6 vertical-form-field">
                <label for="industry" class="form-label" v-t="'Birthday'">
                </label>
                <CustomDatepicker
                  v-model:value="v$.paxForm.birthday.$model"
                  placeholder="01-01-1990"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="dobDisabledDates"
                  :disabled="viewOnly"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6 vertical-form-field">
                <label for="industry" class="form-label" v-t="'Date of Issue'">
                </label>
                <CustomDatepicker
                  v-model:value="v$.paxForm.passport_issue_date.$model"
                  placeholder="01-01-1990"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="issueDisabledDates"
                  :disabled="viewOnly"
                />
              </div>
              <div class="col-6 vertical-form-field">
                <label for="industry" class="form-label" v-t="'Date of Expiry'">
                </label>
                <CustomDatepicker
                  v-model:value="v$.paxForm.passport_expiry_date.$model"
                  placeholder="01-01-1990"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                  :disabled="viewOnly"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="Telephone" class="form-label" v-t="'Employer'">
                </label>
                <BaseDropDown
                  v-model="v$.paxForm.employer.$model"
                  :options="companies"
                  :disabled="viewOnly"
                  optionValue="id"
                  optionLabel="name"
                />
              </div>
              <div class="col-6">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Badge Number'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.paxForm.badge_no.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.paxForm.badge_no.$errors" />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="country" class="form-label" v-t="'Position'">
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.paxForm.position.$model"
                  :disabled="viewOnly"
                />
              </div>
              <div class="col-6">
                <label for="city" class="form-label" v-t="'Department'">
                </label>
                <BaseDropDown
                  v-model="v$.paxForm.department.$model"
                  :options="departments"
                  optionValue="id"
                  optionLabel="name"
                  :disabled="viewOnly"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6 required-form-control">
                <label for="email" class="form-label" v-t="'Email'"> </label>
                <input
                  type="email"
                  class="form-control"
                  v-model="v$.paxForm.email.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.paxForm.email.$errors" />
              </div>

              <div class="col-6">
                <label for="Telephone" class="form-label" v-t="'Telephone'">
                </label>
                <PhoneInput
                  v-model:phone="v$.paxForm.phone.$model"
                  v-model:country="v$.paxForm.country_code_id.$model"
                  :disabled="viewOnly"
                  :placeholder="$t('Phone')"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
        >
          <p
            class="section-title fs-4 text-primary"
            v-t="'PAX INFORMATION'"
          ></p>
          <div class="section-body">
            <div class="container info-container applicant-info mx-5 gy-0">
              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Full Name:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.eng_full_name }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'PAX ID:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.pax_id }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Passport No:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.latest_passport?.passport_no }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Badge No:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.badge_no }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Email:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.email }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Telephone:'"></label>
                </div>
                <div class="col value-col">
                  <span v-if="paxInfo?.phone">{{
                    `+${paxInfo?.country_code?.calling_code} ${paxInfo?.phone}`
                  }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Position:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.position }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Department:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.department?.name }}</span>
                </div>
              </div>

              <div class="row">
                <div class="col-auto label-col">
                  <label v-t="'Employer:'"></label>
                </div>
                <div class="col value-col">
                  <span>{{ paxInfo?.company?.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
        >
          <p
            class="section-title fs-4 text-primary"
            v-t="'Blood Test History'"
          ></p>
          <div class="section-body">
            <BloodHistoryTable :data="bloodTestHistory" />
          </div>
        </div>

        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
        >
          <p class="section-title fs-4 text-primary" v-t="'Penalty List'"></p>
          <div class="section-body">
            <PenaltyTable :data="bloodPenalties" />
          </div>
        </div>
      </template>
    </div>

    <div
      class="form-body-container d-flex flex-column justify-content-between align-items-stretch p-4"
    >
      <div class="info-container">
        <div
          class="applicant-info d-flex flex-column flex-grow-1 justify-content-evenly align-items-stretch"
        >
          <div class="row">
            <div class="col-6 d-flex">
              <div class="col-auto label-col">
                <label v-t="'Batch No:'"></label>
              </div>
              <div class="col value-col">
                <span>{{ batch?.batch_no }}</span>
              </div>
            </div>
            <div class="col-6 d-flex">
              <div class="col-auto label-col">
                <label v-t="'Test Date:'"></label>
              </div>
              <div class="col value-col">
                <span>{{ batch?.test_date }}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6 d-flex">
              <div class="col-auto label-col">
                <label v-t="'Arrival Date:'"></label>
              </div>
              <div class="col value-col">
                <CustomDatepicker
                  v-model:value="v$.bloodForm.arrival_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                  :disabled="viewOnly"
                />
              </div>
            </div>
            <div class="col-6 d-flex">
              <div class="col-auto label-col">
                <label v-t="'Departure Date:'"></label>
              </div>
              <div class="col value-col">
                <CustomDatepicker
                  v-model:value="v$.bloodForm.departure_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                  :disabled="viewOnly"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="form-body d-flex flex-column flex-grow-1 justify-content-evenly align-items-stretch"
        >
          <div class="row row-form-field">
            <div class="col-auto label-col pt-1">
              <label v-t="'Passport:'"></label>
            </div>
            <div
              class="col-auto value-col d-flex flex-column"
              style="gap: 1rem"
            >
              <div class="horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="submitDateCheckbox"
                  disabled
                />
                <label
                  class="form-check-label min-width-label"
                  v-t="'Submit Date:'"
                >
                </label>

                <CustomDatepicker
                  v-model:value="v$.bloodForm.passport_submit_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                  :disabled="viewOnly"
                />
              </div>

              <div class="horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  disabled
                  v-model="returnedDateCheckbox"
                />
                <label
                  class="form-check-label min-width-label"
                  v-t="'Returned:'"
                >
                </label>
                <CustomDatepicker
                  v-model:value="v$.bloodForm.passport_return_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                  :disabled="viewOnly"
                />
              </div>
            </div>
          </div>

          <div class="row row-form-field">
            <div class="col-auto label-col center pt-1">
              <label v-t="'Attendance:'"></label>
            </div>
            <div
              class="col-auto value-col horizontal-form-field"
              style="gap: 2rem"
            >
              <div class="form-check-inline horizontal-form-field">
                <input
                  name="attendance-radio"
                  class="form-check-input"
                  type="radio"
                  :value="TestStatusEnum.Tested"
                  v-model="v$.bloodForm.attendance.$model"
                  :disabled="viewOnly"
                />
                <label class="form-check-label" v-t="'Tested'"></label>
              </div>

              <div class="form-check-inline horizontal-form-field">
                <input
                  name="attendance-radio"
                  class="form-check-input"
                  type="radio"
                  :value="TestStatusEnum.NoShow"
                  v-model="v$.bloodForm.attendance.$model"
                  :disabled="viewOnly"
                />
                <label class="form-check-label" v-t="'No show'"></label>
              </div>

              <div class="form-check-inline horizontal-form-field">
                <input
                  name="attendance-radio"
                  class="form-check-input"
                  type="radio"
                  :value="TestStatusEnum.NoNeedToTest"
                  v-model="v$.bloodForm.attendance.$model"
                  :disabled="viewOnly"
                />
                <label class="form-check-label" v-t="'No need to test'"></label>
              </div>
            </div>
          </div>

          <div class="row row-form-field">
            <div class="col-auto label-col center pt-1">
              <label v-t="'Task Purposes:'"></label>
            </div>
            <div
              class="col-auto value-col horizontal-form-field"
              style="gap: 2rem"
            >
              <div class="form-check-inline horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="TestPurposesEnum.Bloods"
                  v-model="v$.bloodForm.purposeBloods.$model"
                  :disabled="viewOnly"
                />
                <label class="form-check-label" v-t="'Blood'"></label>
              </div>

              <div class="form-check-inline horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="TestPurposesEnum.MEEV"
                  v-model="v$.bloodForm.purposeMEEV.$model"
                  :disabled="viewOnly"
                />
                <label class="form-check-label" v-t="'MEEV'"></label>
              </div>

              <div class="form-check-inline horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="TestPurposesEnum.VisaCancellation"
                  v-model="v$.bloodForm.purposeVisa.$model"
                  :disabled="viewOnly"
                />
                <label
                  class="form-check-label"
                  v-t="'Visa Cancellation'"
                ></label>
              </div>
            </div>
          </div>

          <hr />

          <FadeInTransition>
            <div v-if="isBloodPurposeEnabled">
              <div class="row" v-if="bloodSuggestions?.length">
                <span
                  class="text-primary fw-bold"
                  v-t="'Suggested test items from test history'"
                ></span>
              </div>

              <div class="row row-form-field">
                <div class="col-auto label-col pt-1">
                  <label v-t="'Blood Tests Type:'"></label>
                </div>
                <div
                  class="col-auto value-col d-flex flex-column"
                  style="gap: 1rem"
                >
                  <div class="form-check-inline horizontal-form-field">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="v$.bloodForm.malaria_tested.$model"
                      :disabled="viewOnly"
                    />
                    <label class="form-check-label" v-t="'Malaria (M)'"></label>
                  </div>

                  <div class="horizontal-form-field">
                    <div class="horizontal-form-field">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="v$.bloodForm.hiv_tested.$model"
                        :disabled="viewOnly"
                      />
                      <label
                        class="form-check-label min-width-label"
                        v-t="'HIV'"
                      ></label>
                    </div>

                    <FadeInTransition>
                      <div
                        v-if="state.bloodForm.hiv_tested"
                        class="d-flex flex-column"
                        style="gap: 1rem"
                      >
                        <div class="horizontal-form-field">
                          <label
                            class="form-check-label min-width-long-label"
                            v-t="'HIV expiry Date:'"
                          >
                          </label>
                          <CustomDatepicker
                            v-model:value="v$.bloodForm.hiv_expire_date.$model"
                            value-type="YYYY-MM-DD"
                            format="DD/MM/YYYY"
                            :disabled-date="expiryDisabledDates"
                            :disabled="viewOnly"
                          />
                        </div>
                      </div>
                    </FadeInTransition>
                  </div>

                  <div class="horizontal-form-field">
                    <div class="horizontal-form-field">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="v$.bloodForm.hbs_tested.$model"
                        :disabled="viewOnly"
                      />
                      <label
                        class="form-check-label min-width-label"
                        v-t="'HBS'"
                      ></label>
                    </div>

                    <FadeInTransition>
                      <div
                        v-if="state.bloodForm.hbs_tested"
                        class="d-flex flex-column"
                        style="gap: 1rem"
                      >
                        <div class="horizontal-form-field">
                          <label
                            class="form-check-label min-width-long-label"
                            v-t="'HBS expiry Date:'"
                          >
                          </label>
                          <CustomDatepicker
                            v-model:value="v$.bloodForm.hbs_expire_date.$model"
                            value-type="YYYY-MM-DD"
                            format="DD/MM/YYYY"
                            :disabled-date="expiryDisabledDates"
                            :disabled="viewOnly"
                          />
                        </div>
                      </div>
                    </FadeInTransition>
                  </div>

                  <div class="form-check-inline horizontal-form-field">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="v$.bloodForm.modify_tested.$model"
                      :disabled="viewOnly"
                    />
                    <label
                      class="form-check-label"
                      v-t="'Correct/Modify blood test'"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </FadeInTransition>

          <FadeInTransition>
            <div class="row row-form-field" v-if="isMEEVPurposeEnabled">
              <div class="col-auto label-col center pt-1">
                <label v-t="'MEEV type:'"></label>
              </div>
              <div
                class="col-auto value-col horizontal-form-field"
                style="gap: 2rem"
              >
                <div class="form-check-inline horizontal-form-field">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="MEEVTypeEnum.Renewal"
                    v-model="v$.bloodForm.meevRenewal.$model"
                    :disabled="viewOnly"
                  />
                  <label class="form-check-label" v-t="'Renewal Visa'"></label>
                </div>

                <div class="form-check-inline horizontal-form-field">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="MEEVTypeEnum.New"
                    v-model="v$.bloodForm.meevNew.$model"
                    :disabled="viewOnly"
                  />
                  <label class="form-check-label" v-t="'New Visa'"></label>
                </div>

                <div class="form-check-inline horizontal-form-field">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="MEEVTypeEnum.Modify"
                    v-model="v$.bloodForm.meevModify.$model"
                    :disabled="viewOnly"
                  />
                  <label
                    class="form-check-label"
                    v-t="'Correct/Modify Visa'"
                  ></label>
                </div>
              </div>
            </div>
          </FadeInTransition>

          <FadeInTransition>
            <div class="row row-form-field" v-if="isVisaPurposeEnabled">
              <div class="col-auto label-col center pt-1">
                <label v-t="'Visa Cancellation type:'"></label>
              </div>
              <div
                class="col-auto value-col horizontal-form-field"
                style="gap: 2rem"
              >
                <div class="form-check-inline horizontal-form-field">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="BloodVisaTypesEnum.Offboard"
                    v-model="v$.bloodForm.visaOffboard.$model"
                    :disabled="viewOnly"
                  />
                  <label class="form-check-label" v-t="'Offboard'"></label>
                </div>

                <div class="form-check-inline horizontal-form-field">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="BloodVisaTypesEnum.Extension"
                    v-model="v$.bloodForm.visaExtension.$model"
                    :disabled="viewOnly"
                  />
                  <label
                    class="form-check-label"
                    v-t="'Extension 10 days'"
                  ></label>
                </div>
              </div>
            </div>
          </FadeInTransition>

          <div class="row">
            <div class="col-auto label-col">
              <label v-t="'Remarks:'"></label>
            </div>
            <div class="col col-12 value-col">
              <CustomEditor
                v-model="v$.bloodForm.remarks.$model"
                :disabled="viewOnly"
              ></CustomEditor>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!viewOnly"
        class="btn-grp d-flex flex-column justify-content-center align-items-center"
      >
        <SaveButton
          class="btn btn-blue"
          :disabled="!isFormValid"
          @click="submit"
        >
          {{ isApplicant || isMultipleApplicants ? t("Update") : t("Save") }}
        </SaveButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.multiple-applicants-container {
  .form-sidebar {
    display: none !important;
  }

  .form-body-container {
    padding: 3rem !important;
  }
}

.form-sidebar {
  background-color: var(--semi-grey);
  gap: 2rem;
  flex-grow: 1;
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  flex-grow: 1;
}

.info-container .row {
  padding: 0.5rem 0px;
}

.info-container .label-col,
.min-width-label {
  min-width: 100px;
  display: flex;
}

.min-width-long-label {
  min-width: 150px;
}

.applicant-info .label-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.info-container .label-col {
  text-align: start;
  font-weight: 500;
}

.info-container .value-col {
  line-height: 2;
  text-align: start;
  font-weight: 600;
  font-size: 105%;
}

.section-title {
  font-weight: 500;
  margin-block-end: 0px;
}

.section-body {
  padding: 1rem 2rem;
}

.form-body-container {
  flex-grow: 3;
  gap: 2rem;
}

.form-body-container .info-container .label-col {
  min-width: 150px;
  font-weight: bolder;
}

.form-body-container .info-container .label-col label {
  font-weight: bolder;
}

.form-body-container .info-container .value-col {
  font-weight: 500;
}

.label-col.center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.form-body {
  gap: 1rem;
}

.form-check-input:disabled {
  opacity: 1;
}
.horizontal-form-field {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  min-height: 40px;
}

.horizontal-form-field .form-check-input {
  margin-block-start: unset;
}

.horizontal-form-field .form-control {
  width: unset;
}

.mx-datepicker {
  width: unset !important;
}

.horizontal-form-field * {
  flex-grow: 0;
  flex-shrink: 0;
}

hr {
  margin: 0px;
}

.vertical-form-field {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}
</style>
