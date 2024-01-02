<!--
***********************************
@author Mohanned Hassan
@create_date 1st July 2023

LOI request form
Each section enables based on previous section's validity
When closed, a confirmation pop up is displayed, only then will the LOI be closed

***********************************
-->
<script setup>
import useVuelidate from "@vuelidate/core";
import { useModal } from "@kouts/vue-modal";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { helpers, numeric, required, maxLength } from "@vuelidate/validators";
import { computed, reactive, ref, watchEffect } from "vue";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import {
  checkValidValue,
  uploadFile,
  acceptedFileInputs,
  generateUIDs,
  extractFiles,
  defaultDisabledDates,
} from "@/helpers";
import { createReusableTemplate } from "@vueuse/core";
import Fa from "vue-fa";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  EnvironmentEnum,
  LOITimelineDocumentDeleteEnum,
  LOITimelineDocumentSections,
} from "@/data";
import InputFileTooltip from "@/components/common/InputFileTooltip.vue";
import TimelineCheckLine from "./TimelineCheckLine.vue";
import { flow, intersection, isEmpty, orderBy } from "lodash-es";
import { useI18n } from "vue-i18n";
import SaveButton from "@/components/common/SaveButton.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const props = defineProps({
  application: {
    type: Object,
    required: false,
  },
  applicants: {
    type: Array,
    default: () => null,
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
  allowEditPreviousSteps: {
    type: Boolean,
    default: true,
  },
  isPaymentLetterRequired: {
    type: Boolean,
    default: false,
  },
  enableImport: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  submit: null,
  close: null,
  sendLoiClick: null,
  deleteDocument: null,
  addPax: null,
});

const { show, hide } = useModal();
const { t } = useI18n();

const [DefineSection, ReuseSection] = createReusableTemplate();

const [DefineAttachments, ReuseAttachments] = createReusableTemplate();

const acceptedInputs = ref(acceptedFileInputs());
const [confirmCloseModal, deleteFileModal] = generateUIDs(2);

const photoCopyRef = ref(null);
const invoiceCopyRef = ref(null);
const mfdCopyRef = ref(null);
const hqCopyRef = ref(null);
const bocCopyRef = ref(null);

const closedLoiErr = ref("");
const baseStorageUrl = ref(import.meta.env[EnvironmentEnum.StorageBaseURL]);
const deleteDocumentEvent = ref(null);
const forceCurrentStep = ref(null);

const state = reactive({
  application: {
    mfd_date: "",
    mfd_ref: "",
    mfd_copy: "",
    mfd_submit_date: "",
    mfd_received_date: "",
    hq_date: "",
    hq_ref: "",
    hq_copy: "",
    hq_submit_date: "",
    hq_received_date: "",
    boc_moo_date: "",
    boc_moo_ref: "",
    boc_moo_copy: "",
    boc_moo_submit_date: "",
    nation_category: "",
    moi_payment_letter_date: "",
    moi_payment_letter_ref: "",
    moi_payment_date: "",
    moi_invoice: "",
    moi_deposit: "",
    payment_copy: "",
    loi_issue_date: "",
    loi_photo_copy: "",
    loi_no: "",
    sent_loi_date: "",
    close_date: "",
  },
});

const numericErrorMessage = "Invalid Value";
const maxNumericLength = ref(7);
const maxRefInputLength = ref(+`${"9".repeat(maxNumericLength.value)}`);

const rules = computed(() => {
  const requiredObject = props.isPaymentLetterRequired ? { required } : {};

  return {
    application: {
      mfd_date: {
        required,
      },
      mfd_ref: {
        required,
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      mfd_submit_date: {},
      mfd_received_date: {},
      mfd_copy: {},
      hq_date: {
        required,
      },
      hq_ref: {
        required,
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      hq_copy: {},
      hq_submit_date: {},
      hq_received_date: {},
      boc_moo_date: {
        required,
      },
      boc_moo_ref: {
        required,
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      boc_moo_copy: {},
      boc_moo_submit_date: {},
      moi_payment_letter_date: {},
      moi_payment_letter_ref: {
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      moi_payment_date: {
        required,
      },
      moi_invoice: {
        ...requiredObject,
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      moi_deposit: {
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      payment_copy: {},
      loi_issue_date: {
        required,
      },
      loi_photo_copy: {},
      loi_no: {
        required,
        numeric: helpers.withMessage(numericErrorMessage, numeric),
        maxLength: helpers.withMessage(
          numericErrorMessage,
          maxLength(maxNumericLength)
        ),
      },
      sent_loi_date: {
        required,
      },
      close_date: {
        required,
      },
    },
    $validationGroups: {
      [LOITimelineDocumentSections.MFD]: [
        "application.mfd_date",
        "application.mfd_ref",
        "application.mfd_submit_date",
        "application.mfd_received_date",
        "application.mfd_copy",
      ],
      [LOITimelineDocumentSections.HQ]: [
        "application.hq_date",
        "application.hq_ref",
        "application.hq_submit_date",
        "application.hq_received_date",
        "application.hq_copy",
      ],
      [LOITimelineDocumentSections.MOO]: [
        "application.boc_moo_date",
        "application.boc_moo_ref",
        "application.boc_moo_submit_date",
        "application.boc_moo_copy",
      ],
      [LOITimelineDocumentSections.MOI]: [
        "application.moi_payment_letter_date",
        "application.moi_payment_letter_ref",
        "application.moi_payment_date",
        "application.moi_invoice",
        "application.moi_deposit",
        "application.payment_copy",
      ],
      [LOITimelineDocumentSections.LOI]: [
        "application.loi_issue_date",
        "application.loi_no",
        "application.loi_photo_copy",
      ],
      [LOITimelineDocumentSections.Sent]: ["application.sent_loi_date"],
      [LOITimelineDocumentSections.Closed]: ["application.close_date"],
    },
  };
});

const requiredRules = computed(() => {
  const temp = flow([
    Object.entries,
    (arr) =>
      arr.filter(([key, value]) => {
        return !!value?.required;
      }),
    Object.fromEntries,
  ])(rules.value.application);

  return temp;
});

const v$ = useVuelidate(rules, state);

const isOriginalApplicationClosed = computed(() => {
  if (props?.application) {
    return !!props.application?.close_date;
  } else {
    return false;
  }
});

const isApplicationClosed = computed(
  () => !!state.application?.close_date || props.viewOnly
);

const isFormInvalidForSubmission = computed(() => {
  const numericValidationError = v$.value.application.$errors.find(
    (error) => error.$validator == "numeric"
  );

  const maxValueValidationError = v$.value.application.$errors.find(
    (error) => error.$validator == "maxLength"
  );

  return numericValidationError || maxValueValidationError;
});

const bocMfdValid = computed(
  () => !v$.value.$validationGroups[LOITimelineDocumentSections.MFD].$invalid
);

const bocHqValid = computed(
  () => !v$.value.$validationGroups[LOITimelineDocumentSections.HQ].$invalid
);

const mooValid = computed(
  () => !v$.value.$validationGroups[LOITimelineDocumentSections.MOO].$invalid
);

const moiValid = computed(
  () =>
    !v$.value.$validationGroups[LOITimelineDocumentSections.MOI].$invalid &&
    mooValid.value
);

const loiValid = computed(
  () => !v$.value.$validationGroups[LOITimelineDocumentSections.LOI].$invalid
);

const sentValid = computed(
  () => !v$.value.$validationGroups[LOITimelineDocumentSections.Sent].$invalid
);

const closedValid = computed(
  () => !v$.value.$validationGroups[LOITimelineDocumentSections.Closed].$invalid
);

const displayBocHq = computed(() =>
  validateObjectFromArrayOfFields(
    rules.value.$validationGroups[LOITimelineDocumentSections.MFD]
  )
);

const displayMoo = computed(
  () =>
    validateObjectFromArrayOfFields(
      rules.value.$validationGroups[LOITimelineDocumentSections.HQ]
    ) && displayBocHq.value
);

const displayMoi = computed(
  () =>
    validateObjectFromArrayOfFields(
      rules.value.$validationGroups[LOITimelineDocumentSections.MOO]
    ) && displayMoo.value
);

const displayLoi = computed(() => {
  return (
    validateObjectFromArrayOfFields(
      rules.value.$validationGroups[LOITimelineDocumentSections.MOI]
    ) && displayMoi.value
  );
});

const displaySent = computed(
  () =>
    validateObjectFromArrayOfFields(
      rules.value.$validationGroups[LOITimelineDocumentSections.LOI]
    ) && displayLoi.value
);

const displayClosed = computed(
  () =>
    validateObjectFromArrayOfFields(
      rules.value.$validationGroups[LOITimelineDocumentSections.Sent]
    ) && displaySent.value
);

// We keep checking if previous step values are there
const isBocMfdDisabled = computed(
  () =>
    isApplicationClosed.value || !isCurrentStep(LOITimelineDocumentSections.MFD)
);

const isBocHqDisabled = computed(
  () =>
    !bocMfdValid.value ||
    isApplicationClosed.value ||
    !isCurrentStep(LOITimelineDocumentSections.HQ)
);

const isMooDisabled = computed(
  () =>
    !bocHqValid.value ||
    isApplicationClosed.value ||
    !isCurrentStep(LOITimelineDocumentSections.MOO)
);

const isMoiDisabled = computed(
  () =>
    !mooValid.value ||
    isApplicationClosed.value ||
    !isCurrentStep(LOITimelineDocumentSections.MOI)
);

const isLoiDisabled = computed(
  () =>
    !moiValid.value ||
    isApplicationClosed.value ||
    !isCurrentStep(LOITimelineDocumentSections.LOI)
);

const isSendLoiDisabled = computed(
  () =>
    !loiValid.value ||
    isApplicationClosed.value ||
    !isCurrentStep(LOITimelineDocumentSections.Sent)
);

const isCloseLoiDisabled = computed(
  () =>
    !(
      bocMfdValid.value &&
      bocHqValid.value &&
      mooValid.value &&
      moiValid.value &&
      loiValid.value &&
      sentValid.value
    ) ||
    isOriginalApplicationClosed.value ||
    !isCurrentStep(LOITimelineDocumentSections.Closed)
);

const stepsConfigs = computed(() => {
  return {
    [LOITimelineDocumentSections.AddPaxes]: {
      checked: props.applicants ? !!props.applicants?.length : true,
      title: t("Add PAXES"),
      step: 1,
      displayForm: true,
      hidePencil: true,
      hideSave: true,
      forceDisplayForm: true,
      enableClick: props.enableImport,
      onClick: () => {
        if (props.enableImport) {
          emit("addPax");
        }
      },
    },
    [LOITimelineDocumentSections.MFD]: {
      checked: bocMfdValid.value,
      title: t("BOC MFD"),
      step: 2,
      displayForm: props.applicants ? props.applicants?.length : true,
    },
    [LOITimelineDocumentSections.HQ]: {
      checked: bocHqValid.value,
      title: t("BOC HQ"),
      step: 3,
      displayForm: displayBocHq.value,
    },
    [LOITimelineDocumentSections.MOO]: {
      checked: mooValid.value,
      title: t("MOO"),
      step: 4,
      displayForm: displayMoo.value,
    },
    [LOITimelineDocumentSections.MOI]: {
      checked: moiValid.value,
      title: t("MOI PAYMENT LETTER"),
      step: 5,
      displayForm: displayMoi.value,
    },
    [LOITimelineDocumentSections.LOI]: {
      checked: loiValid.value,
      title: t("LOI Issued by MOI"),
      step: 6,
      displayForm: displayLoi.value,
    },
    [LOITimelineDocumentSections.Sent]: {
      checked: sentValid.value,
      title: t("LOI Submission"),
      step: 7,
      displayForm: displaySent.value,
    },
    [LOITimelineDocumentSections.Closed]: {
      checked: closedValid.value,
      title: t("Case Closed"),
      step: 8,
      displayForm: displayClosed.value,
      end: true,
    },
  };
});

const currentStep = computed({
  get() {
    if (forceCurrentStep.value) {
      return forceCurrentStep.value;
    } else {
      const valueStepsConfigs = Object.values(stepsConfigs.value);

      const lastDisplayedSectionIndex = valueStepsConfigs.findLastIndex(
        (element) => element.displayForm
      );

      return Object.keys(stepsConfigs.value)[lastDisplayedSectionIndex];
    }
  },
  set(newValue) {
    forceCurrentStep.value = newValue;
  },
});

watchEffect(() => {
  if (props.application) {
    const application = props.application;
    state.application = {
      mfd_date: checkValidValue(application.mfd_date),
      mfd_ref: checkValidValue(application.mfd_ref),
      mfd_submit_date: checkValidValue(application.mfd_submit_date),
      mfd_received_date: checkValidValue(application.mfd_received_date),
      hq_date: checkValidValue(application.hq_date),
      hq_ref: checkValidValue(application.hq_ref),
      hq_submit_date: checkValidValue(application.hq_submit_date),
      hq_received_date: checkValidValue(application.hq_received_date),
      boc_moo_date: checkValidValue(application.boc_moo_date),
      boc_moo_ref: checkValidValue(application.boc_moo_ref),
      boc_moo_submit_date: checkValidValue(application.boc_moo_submit_date),
      moi_payment_letter_date: checkValidValue(
        application.moi_payment_letter_date
      ),
      moi_payment_letter_ref: checkValidValue(
        application.moi_payment_letter_ref
      ),
      moi_payment_date: checkValidValue(application.moi_payment_date),
      moi_deposit: checkValidValue(application.moi_deposit),
      moi_invoice: checkValidValue(application.moi_invoice),
      // payment_copy: checkValidValue(application.payment_copy),
      loi_issue_date: checkValidValue(application.loi_issue_date),
      // loi_photo_copy: checkValidValue(application.loi_photo_copy),
      loi_no: checkValidValue(application.loi_no),
      sent_loi_date: checkValidValue(application.sent_loi_date),
      close_date: checkValidValue(application.close_date),
    };
  }
});

function uploadInvoiceCopy() {
  const { file } = uploadFile(invoiceCopyRef.value);
  state.application.payment_copy = file;
  v$.value.application.payment_copy.$touch();
}

function uploadDigitalCopy() {
  const { file } = uploadFile(photoCopyRef.value);
  state.application.loi_photo_copy = file;
  v$.value.application.loi_photo_copy.$touch();
}

function uploadMfdCopy() {
  const { files } = extractFiles(mfdCopyRef.value);
  state.application.mfd_copy = files;
  v$.value.application.mfd_copy.$touch();
}

function uploadHqCopy() {
  const { files } = extractFiles(hqCopyRef.value);
  state.application.hq_copy = files;
  v$.value.application.hq_copy.$touch();
}

function uploadBocCopy() {
  const { files } = extractFiles(bocCopyRef.value);
  state.application.boc_moo_copy = files;
  v$.value.application.boc_moo_copy.$touch();
}

function setActiveStatus(status) {
  if (!status) {
    v$.value.application.close_date.$model = "";
  }
  hide(confirmCloseModal);
}

function checkClosedDate(value) {
  value && show(confirmCloseModal);
}

function showDeleteFileModal(type, index) {
  deleteDocumentEvent.value = {
    [type]: index.toString(),
  };
  show(deleteFileModal);
}

function hideDeleteFileModal() {
  deleteDocumentEvent.value = null;
  hide(deleteFileModal);
}

async function deleteDocument() {
  if (deleteDocumentEvent.value) {
    emit("deleteDocument", deleteDocumentEvent.value);
  }
  hideDeleteFileModal();
}

function isFieldRequired(field) {
  return !!field?.required;
}

function validateObjectFromArrayOfFields(
  fields = [],
  object = props.application
) {
  let temp = true;

  const requiredFields = intersection(
    fields.map((element) => element.split(".")[1]),
    Object.keys(requiredRules.value)
  );

  requiredFields.every((field) => {
    temp = !!object?.[field];
    return temp;
  });

  return temp;
}

function currentStepForm() {
  const currentValidationGroup =
    rules.value.$validationGroups[currentStep.value];

  const form = Object.fromEntries(
    currentValidationGroup.map((element) => {
      const key = element.split(".")[1];
      return [key, v$.value.application.$model[key]];
    })
  );

  return form;
}

function onClose() {
  emit("close");
}

function onSendLOI() {
  emit("sendLoiClick");
}

function onSubmit() {
  if (isFormInvalidForSubmission.value) {
    return;
  }

  if (isApplicationClosed.value && v$.value.application.close_date.$invalid) {
    closedLoiErr.value = "This Field is required";
    return;
  }
  emit("submit", v$.value.application.$model);
  forceCurrentStep.value = null;
}

function setForceStep(section) {
  currentStep.value = section;
}

function isCurrentStep(section) {
  return currentStep.value == section;
}

function getStepConfig(section) {
  return stepsConfigs.value[section];
}
</script>
<template>
  <VueModal :name="confirmCloseModal">
    <ConfirmModal
      @close="setActiveStatus(false)"
      @confirm="setActiveStatus(true)"
      :title="$t('Close Application?')"
      :message="
        $t(
          'You are closing this LOI application batch, After batch closes, data CANNOT be changed again, Are you ready to close this batch?'
        )
      "
    />
  </VueModal>

  <VueModal :name="deleteFileModal">
    <ConfirmModal
      @close="hideDeleteFileModal"
      @confirm="deleteDocument"
      :title="$t('Delete document')"
      :message="$t('Are you sure you want to delete this document?')"
    />
  </VueModal>

  <DefineAttachments v-slot="{ letter, type, index, enableDelete }">
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="gap: 8px"
      v-if="letter"
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
          <strong> <span v-t="'Document'"></span> {{ index + 1 }}</strong></span
        >
      </a>
      <Fa
        v-if="enableDelete"
        :icon="faXmark"
        class="cursor-pointer"
        style="color: rgb(255, 54, 54)"
        size="lg"
        fw
        @click="showDeleteFileModal(type, index)"
      />
    </div>
  </DefineAttachments>

  <DefineSection v-slot="{ $slots, section }">
    <li
      :class="{
        'hidden-section': !getStepConfig(section)?.displayForm,
        'valid-section ':
          getStepConfig(section)?.displayForm &&
          getStepConfig(section)?.checked,
        'view-only-container':
          getStepConfig(section)?.displayForm &&
          getStepConfig(section)?.checked &&
          currentStep != section,
      }"
    >
      <TimelineCheckLine
        :checked="getStepConfig(section)?.checked"
        :end="getStepConfig(section)?.end"
        :step-number="getStepConfig(section)?.step"
      />

      <div class="timeline-section">
        <div class="timeline__title">
          <span
            :class="{
              'clickable-title': getStepConfig(section)?.enableClick,
            }"
            @click="getStepConfig(section)?.onClick"
            >{{ getStepConfig(section)?.title }}</span
          >

          <Fa
            v-if="
              getStepConfig(section)?.displayForm &&
              getStepConfig(section)?.checked &&
              !getStepConfig(section)?.hidePencil &&
              !isApplicationClosed &&
              currentStep != section &&
              props.allowEditPreviousSteps
            "
            class="edit-section-icon"
            @click="setForceStep(section)"
            :icon="faPencil"
          />
        </div>

        <template
          v-if="
            getStepConfig(section)?.displayForm ||
            getStepConfig(section)?.forceDisplayForm
          "
        >
          <component :is="$slots.form" />

          <div
            class="d-flex justify-content-center"
            v-if="
              !isOriginalApplicationClosed &&
              !props.viewOnly &&
              !(currentStep != section) &&
              !isOriginalApplicationClosed &&
              !getStepConfig(section)?.hideSave
            "
          >
            <SaveButton
              class="btn btn-blue"
              type="submit"
              @click="onSubmit"
              :disabled="
                isFormInvalidForSubmission || !getStepConfig(section)?.checked
              "
            >
              <span v-t="'Save'"></span>
            </SaveButton>
          </div>
        </template>
      </div>
    </li>
  </DefineSection>

  <div
    class="d-flex flex-column flex-shrink-0 loi-timeline flex-grow-1"
    :class="{ 'view-only-container': props.viewOnly }"
  >
    <h6 class="timeline-title"><span v-t="'Application Progress'"></span></h6>
    <div
      class="loiDetails flex-grow-1 d-flex flex-column justify-content-start align-items-stretch"
    >
      <ul
        class="timeline timeline--vertical no-borders-form d-flex flex-column justify-content-start align-items-stretch px-0 flex-grow-1"
      >
        <ReuseSection :section="LOITimelineDocumentSections.AddPaxes">
          <template #form>
            <span>{{
              $t(
                "Use the Add Paxes button on the left to add PAXES, before proceeding"
              )
            }}</span>
          </template>
        </ReuseSection>

        <!-- Special rules for first item -->
        <!-- we hide save if next item is displayed -->
        <ReuseSection :section="LOITimelineDocumentSections.MFD">
          <template #form>
            <div class="timeline-form-row">
              <div v-validate="v$.application.mfd_submit_date">
                <label v-t="'Submission date'"></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.mfd_submit_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isBocMfdDisabled"
                />
                <ErrorMessages
                  :errors="v$.application.mfd_submit_date.$errors"
                />
              </div>
            </div>

            <div class="timeline-form-row required-form-control">
              <div v-validate="v$.application.mfd_date">
                <label><span v-t="'Date'"></span></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.mfd_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isBocMfdDisabled"
                />
              </div>
              <div v-validate="v$.application.mfd_ref">
                <label><span v-t="'Ref'"></span>.</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  :placeholder="$t('Reference Number')"
                  v-model="v$.application.mfd_ref.$model"
                  :disabled="isBocMfdDisabled"
                />
                <ErrorMessages :errors="v$.application.mfd_ref.$errors" />
              </div>
            </div>

            <div class="timeline-form-row">
              <div
                v-validate:empty="application?.mfd_copy?.length"
                class="file-attachments-container exception"
              >
                <input
                  type="file"
                  class="form-control"
                  ref="mfdCopyRef"
                  :accept="acceptedInputs"
                  @input="uploadMfdCopy"
                  :disabled="isBocMfdDisabled"
                  multiple
                />
                <InputFileTooltip />

                <template
                  v-for="(letter, index) of application?.mfd_copy"
                  :key="index"
                >
                  <ReuseAttachments
                    :letter="letter"
                    :index="index"
                    :type="LOITimelineDocumentDeleteEnum.MFD"
                    :enableDelete="!isBocMfdDisabled"
                  ></ReuseAttachments>
                </template>
              </div>
            </div>

            <div class="timeline-form-row">
              <div v-validate="v$.application.mfd_received_date">
                <label v-t="'Received Date'"></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.mfd_received_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isBocMfdDisabled"
                />
                <ErrorMessages
                  :errors="v$.application.mfd_received_date.$errors"
                />
              </div>
            </div>
          </template>
        </ReuseSection>

        <ReuseSection :section="LOITimelineDocumentSections.HQ">
          <template #form>
            <div class="timeline-form-row">
              <div v-validate="v$.application.hq_submit_date">
                <label v-t="'Submission date'"></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.hq_submit_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isBocHqDisabled"
                />
                <ErrorMessages
                  :errors="v$.application.hq_submit_date.$errors"
                />
              </div>
            </div>
            <div class="timeline-form-row required-form-control">
              <div v-validate="v$.application.hq_date">
                <label><span v-t="'Date'"></span></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.hq_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isBocHqDisabled"
                />
              </div>
              <div v-validate="v$.application.hq_ref">
                <label><span v-t="'Ref'"></span>.</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  :placeholder="$t('Reference Number')"
                  v-model="v$.application.hq_ref.$model"
                  :disabled="isBocHqDisabled"
                />
                <ErrorMessages :errors="v$.application.hq_ref.$errors" />
              </div>
            </div>
            <div class="timeline-form-row">
              <div
                v-validate:empty="application?.hq_copy?.length"
                class="file-attachments-container exception"
              >
                <input
                  type="file"
                  class="form-control"
                  ref="hqCopyRef"
                  :accept="acceptedInputs"
                  @input="uploadHqCopy"
                  :disabled="isBocHqDisabled"
                  multiple
                />
                <InputFileTooltip />

                <template
                  v-for="(letter, index) of application?.hq_copy"
                  :key="index"
                >
                  <ReuseAttachments
                    :letter="letter"
                    :index="index"
                    :type="LOITimelineDocumentDeleteEnum.HQ"
                    :enableDelete="!isBocHqDisabled"
                  ></ReuseAttachments>
                </template>
              </div>
            </div>
            <div class="timeline-form-row">
              <div v-validate="v$.application.hq_received_date">
                <label v-t="'Received Date'"></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.hq_received_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isBocHqDisabled"
                />
                <ErrorMessages
                  :errors="v$.application.hq_received_date.$errors"
                />
              </div>
            </div>
          </template>
        </ReuseSection>

        <ReuseSection :section="LOITimelineDocumentSections.MOO">
          <template #form>
            <div class="timeline-form-row">
              <div v-validate="v$.application.boc_moo_submit_date">
                <label v-t="'Submission date'"></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.boc_moo_submit_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isMooDisabled"
                />
                <ErrorMessages
                  :errors="v$.application.boc_moo_submit_date.$errors"
                />
              </div>
            </div>
            <div class="timeline-form-row required-form-control">
              <div v-validate="v$.application.boc_moo_date">
                <label><span v-t="'Date'"></span></label>
                <CustomDatepicker
                  v-model:value="v$.application.boc_moo_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isMooDisabled"
                />
              </div>
              <div v-validate="v$.application.boc_moo_ref">
                <label><span v-t="'Ref'"></span>.</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  :placeholder="$t('Reference Number')"
                  v-model="v$.application.boc_moo_ref.$model"
                  :disabled="isMooDisabled"
                />
                <ErrorMessages :errors="v$.application.boc_moo_ref.$errors" />
              </div>
            </div>
            <div class="timeline-form-row">
              <div
                v-validate:empty="application?.boc_moo_copy?.length"
                class="file-attachments-container exception"
              >
                <input
                  type="file"
                  class="form-control"
                  ref="bocCopyRef"
                  :accept="acceptedInputs"
                  @input="uploadBocCopy"
                  :disabled="isMooDisabled"
                  multiple
                />
                <InputFileTooltip />

                <template
                  v-for="(letter, index) of application?.boc_moo_copy"
                  :key="index"
                >
                  <ReuseAttachments
                    :letter="letter"
                    :index="index"
                    :type="LOITimelineDocumentDeleteEnum.BocMoo"
                    :enableDelete="!isMooDisabled"
                  ></ReuseAttachments>
                </template>
              </div>
            </div>
          </template>
        </ReuseSection>

        <ReuseSection :section="LOITimelineDocumentSections.MOI">
          <template #form>
            <div class="timeline-form-row">
              <div v-validate="v$.application.moi_payment_letter_date">
                <label v-t="'Date'"></label>
                <CustomDatepicker
                  type="date"
                  v-model:value="v$.application.moi_payment_letter_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isMoiDisabled"
                />
              </div>
              <div v-validate="v$.application.moi_payment_letter_ref">
                <label v-t="'Ref'"></label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  :placeholder="$t('Reference Number')"
                  v-model="v$.application.moi_payment_letter_ref.$model"
                  :disabled="isMoiDisabled"
                />
                <ErrorMessages
                  :errors="v$.application.moi_payment_letter_ref.$errors"
                />
              </div>
            </div>
            <div class="timeline-form-row">
              <div
                v-validate="v$.application.moi_payment_date"
                :class="{
                  'required-form-control': isFieldRequired(
                    v$.application.moi_payment_date
                  ),
                }"
              >
                <label v-t="'Payment Date'"></label>
                <CustomDatepicker
                  v-model:value="v$.application.moi_payment_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isMoiDisabled"
                />
              </div>
              <div
                v-validate="v$.application.moi_invoice"
                :class="{
                  'required-form-control': isFieldRequired(
                    v$.application.moi_invoice
                  ),
                }"
              >
                <label v-t="'Invoice No'"></label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  :placeholder="$t('Invoice Number')"
                  v-model="v$.application.moi_invoice.$model"
                  :disabled="isMoiDisabled"
                />
                <ErrorMessages :errors="v$.application.moi_invoice.$errors" />
              </div>
            </div>
            <div class="timeline-form-row">
              <div v-validate="v$.application.moi_deposit">
                <label v-t="'Deposit (IQD)'"></label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model="v$.application.moi_deposit.$model"
                  :disabled="isMoiDisabled"
                />
                <ErrorMessages :errors="v$.application.moi_deposit.$errors" />
              </div>
            </div>
            <div class="timeline-form-row">
              <div
                v-validate:empty="application?.payment_copy"
                class="file-attachments-container exception"
              >
                <label v-t="'Payment letter copy'"></label>
                <input
                  type="file"
                  class="form-control"
                  ref="invoiceCopyRef"
                  :accept="acceptedInputs"
                  @input="uploadInvoiceCopy"
                  :disabled="isMoiDisabled"
                />
                <InputFileTooltip />

                <template
                  v-for="(letter, index) of application?.payment_copy
                    ? [application?.payment_copy]
                    : []"
                  :key="index"
                >
                  <ReuseAttachments
                    :letter="letter"
                    :index="index"
                    :type="LOITimelineDocumentDeleteEnum.Payment"
                    :enableDelete="!isMoiDisabled"
                  ></ReuseAttachments>
                </template>
              </div>
            </div>
          </template>
        </ReuseSection>

        <ReuseSection :section="LOITimelineDocumentSections.LOI">
          <template #form>
            <div class="timeline-form-row required-form-control">
              <div v-validate="v$.application.loi_issue_date">
                <label v-t="'Issue Date'"></label>
                <CustomDatepicker
                  v-model:value="v$.application.loi_issue_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isLoiDisabled"
                />
              </div>
              <div v-validate="v$.application.loi_no">
                <label v-t="'LOI No'"></label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model="v$.application.loi_no.$model"
                  :disabled="isLoiDisabled"
                />
                <ErrorMessages :errors="v$.application.loi_no.$errors" />
              </div>
            </div>
            <div class="timeline-form-row">
              <div
                v-validate:empty="application?.loi_photo_copy"
                class="file-attachments-container exception"
              >
                <label v-t="'LOI Digital Copy'"></label>
                <div class="loidigial-input">
                  <input
                    type="file"
                    class="form-control"
                    ref="photoCopyRef"
                    :accept="acceptedInputs"
                    @input="uploadDigitalCopy"
                    :disabled="isLoiDisabled"
                  />
                  <InputFileTooltip />
                </div>

                <template
                  v-for="(letter, index) of application?.loi_photo_copy
                    ? [application?.loi_photo_copy]
                    : []"
                  :key="index"
                >
                  <ReuseAttachments
                    :letter="letter"
                    :index="index"
                    :type="LOITimelineDocumentDeleteEnum.Photo"
                    :enableDelete="!isLoiDisabled"
                  ></ReuseAttachments>
                </template>
              </div>
            </div>
          </template>
        </ReuseSection>

        <ReuseSection :section="LOITimelineDocumentSections.Sent">
          <template #form>
            <div class="timeline-form-row">
              <div v-validate="v$.application.sent_loi_date">
                <CustomDatepicker
                  v-model:value="v$.application.sent_loi_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isSendLoiDisabled"
                />
              </div>
            </div>
          </template>
        </ReuseSection>

        <ReuseSection :section="LOITimelineDocumentSections.Closed">
          <template #form>
            <div class="timeline-form-row">
              <div v-validate="v$.application.close_date">
                <CustomDatepicker
                  id="closedDate"
                  v-model:value="v$.application.close_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  @change="checkClosedDate"
                  :disabled-date="defaultDisabledDates"
                  :disabled="isCloseLoiDisabled"
                />

                <span v-if="closedLoiErr" class="text-danger">{{
                  closedLoiErr
                }}</span>
              </div>
            </div>
          </template>
        </ReuseSection>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
.loi-form-header {
  font-size: 1.4rem;
  text-align: center;
  margin-inline-start: 1.5rem;
}
.form-control {
  height: 28px;
  border-radius: 3px;
}

.col-1 {
  display: flex;
}

.icon-arrowDownIcon.arrow-right {
  transform: rotate(-90deg);
  display: inline-block;
  cursor: pointer;
  font-size: 7px;
}

.closed-checkbox,
.checkbox-readonly {
  pointer-events: none;
}

a {
  color: black;
}

li {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: stretch;
  gap: 1rem;

  &.hidden-section {
    flex-grow: 1;
  }

  .timeline-section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
    gap: 1rem;
    margin-block-end: 3rem;

    .timeline-form-row {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
      gap: 1rem;

      > div {
        flex-grow: 1;
      }
    }
  }
}

$hidden-color: #ccc;
.hidden-section {
  .timeline__title {
    color: $hidden-color;
  }

  ::v-deep(.timeline-side-line) {
    .timeline-step-number,
    .thin-line {
      background: $hidden-color;
    }
  }
}

.valid-section {
  .timeline__title {
    color: var(--light-success);
  }
}

.clickable-title {
  cursor: pointer;
  text-decoration: underline;
}

.timeline__title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-inline-end: 1rem;
  gap: 1rem;
}
.edit-section-icon {
  cursor: pointer;
  color: #888;
}
</style>
