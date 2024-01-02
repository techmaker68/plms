<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Appoint blood applicants modal

***********************************
-->
<script setup>
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import useVuelidate from "@vuelidate/core";
import { computed, onMounted, reactive } from "vue";
import { required } from "@vuelidate/validators";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import CustomEditor from "@/components/common/CustomEditor.vue";
import { defaultDisabledDates } from "@/helpers";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const props = defineProps({
  applicant: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit", "close"]);

const state = reactive({
  form: {
    applicantID: props.applicant.id,
    new_appoint_date: "",
    new_remarks: `Your Next Appointment of HIV Blood Test, please submit your passport before 4 days of your appointment if you will be inside Iraq at this time.
if you are outside of Iraq, once you arrive to Majnoon please submit your passport on the first two days of your arrival, your arrival date is included of these two days.`,
  },
});

const rules = computed(() => ({
  form: {
    new_appoint_date: {
      required,
    },
    new_remarks: {},
  },
}));

const v$ = useVuelidate(rules, state);

onMounted(async () => {
  const { applicant } = props;
  const { new_appoint_date, new_remarks } = applicant;

  state.form = {
    ...state.form,
    new_appoint_date,
    new_remarks: new_remarks ? new_remarks : state.form.new_remarks,
  };
});

function emitSubmit() {
  emit("submit", state.form);
}

function emitClose() {
  emit("close");
}
</script>
<template>
  <ConfirmModal
    :title="$t('New appointment')"
    confirm-label="Save and Email applicant"
    @close="emitClose"
    @confirm="emitSubmit"
    :disable-confirm="v$.form.$invalid"
  >
    <div class="form-container-section">
      <div class="horizontal-form-field required-form-control">
        <label class="form-label" v-t="'Appointment Date:'"> </label>
        <div class="flex-grow-1">
          <CustomDatepicker
            v-model:value="v$.form.new_appoint_date.$model"
            value-type="YYYY-MM-DD"
            format="DD/MM/YYYY"
            :disabled-date="defaultDisabledDates"
          />
        </div>
        <ErrorMessages :errors="v$.form.new_appoint_date.$errors" />
      </div>

      <div>
        <label class="form-label" v-t="'Remarks:'"> </label>
        <CustomEditor v-model="v$.form.new_remarks.$model"></CustomEditor>
      </div>
    </div>
  </ConfirmModal>
</template>

<style lang="scss">
.form-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px 15%;
  gap: 2rem;
}

.form-container-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 2rem;
}

.horizontal-form-field {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.horizontal-form-field .form-check-input {
  margin-top: unset;
}

.horizontal-form-field .form-control {
  flex: 1;
  width: unset;
}

.horizontal-form-field .form-label {
  min-width: 100px;
}
</style>
