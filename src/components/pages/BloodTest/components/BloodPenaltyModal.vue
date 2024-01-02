<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood test applicant penalty modal

***********************************
-->
<script setup>
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import useVuelidate from "@vuelidate/core";
import { computed, onMounted, reactive } from "vue";
import { required, numeric } from "@vuelidate/validators";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import CustomEditor from "@/components/common/CustomEditor.vue";

const props = defineProps({
  applicant: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["submit", "close"]);

const state = reactive({
  form: {
    applicantID: props.applicant.id,
    penalty_fee: "",
    penalty_remarks: "",
  },
});

const rules = computed(() => ({
  form: {
    penalty_fee: {
      required,
      numeric,
    },
    penalty_remarks: {},
  },
}));

const v$ = useVuelidate(rules, state);

onMounted(async () => {
  const { applicant } = props;
  const { penalty_fee, penalty_remarks } = applicant;

  state.form = {
    ...state.form,
    penalty_fee,
    penalty_remarks,
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
    :title="$t('Blood Penalty')"
    :confirm-label="$t('Save and Email applicant')"
    @close="emitClose"
    @confirm="emitSubmit"
    :disable-confirm="v$.form.$invalid"
  >
    <div class="form-container-section">
      <div class="horizontal-form-field required-form-control">
        <label class="form-label" v-t="'Penalty:'"> </label>
        <input
          type="number"
          class="form-control"
          v-model="v$.form.penalty_fee.$model"
        />
        <ErrorMessages :errors="v$.form.penalty_fee.$errors" />
      </div>

      <div>
        <label class="form-label" v-t="'Remarks:'"> </label>
        <CustomEditor v-model="v$.form.penalty_remarks.$model"></CustomEditor>
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
