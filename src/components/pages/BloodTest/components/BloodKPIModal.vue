<!--
***********************************
@author Mohanned Hassan
@create_date 1st Oct 2023

Send note to blood batch applicants

***********************************
-->
<script setup>
import useVuelidate from "@vuelidate/core";
import { computed, onMounted, reactive } from "vue";
import { required } from "@vuelidate/validators";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import CustomEditor from "@/components/common/CustomEditor.vue";
import { defaultDisabledDates, formatDate } from "@/helpers";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const emit = defineEmits(["submit", "close"]);

const state = reactive({
  form: {
    date_range: [],
  },
});

const rules = computed(() => ({
  form: {
    date_range: {
      required,
    },
  },
}));

const v$ = useVuelidate(rules, state);

function emitSubmit() {
  const date_range = state.form.date_range;

  emit("submit", {
    start_date: formatDate(date_range[0]),
    end_date: formatDate(date_range[1]),
  });
}

function emitClose() {
  emit("close");
}
</script>
<template>
  <ConfirmModal
    :title="$t('KPI Report')"
    @close="emitClose"
    @confirm="emitSubmit"
    :disable-confirm="v$.form.$invalid"
  >
    <div class="form-container-section modal-form required-form-control">
      <div>
        <label class="form-label" v-t="'Date Range:'"> </label>
        <CustomDatepicker
          v-model:value="state.form.date_range"
          :disabled-date="defaultDisabledDates"
          type="date"
          range
          :placeholder="$t('Date range')"
        />
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
