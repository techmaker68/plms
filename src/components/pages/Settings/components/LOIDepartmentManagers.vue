<!--
***********************************
@author Mohanned Hassan, Umair
@create_date 27th Nov 2023

Edit department managers

***********************************
-->
<script setup>
import { computed, watchEffect, reactive } from "vue";
import { required, email } from "@vuelidate/validators";
import { useSettingsStore } from "@/stores";
import { primitiveForEach } from "@/helpers";
import useVuelidate from "@vuelidate/core";
import Chips from "primevue/chips";
import { storeToRefs } from "pinia";
import ChipsTooltip from "@/components/common/ChipsTooltip.vue";
import SaveButton from "@/components/common/SaveButton.vue";

const emit = defineEmits(["submit", "close"]);

const { settings } = storeToRefs(useSettingsStore());
const { saveSettings } = useSettingsStore();

const state = reactive({
  form: {
    department_managers: [],
  },
});

const rules = computed(() => ({
  form: {
    department_managers: {
      required,
      $each: primitiveForEach(
        {
          email,
        },
        true
      ),
    },
  },
}));

const v$ = useVuelidate(rules, state);

const joinedEmails = computed(() => {
  return state.form.department_managers.join(",");
});

watchEffect(() => {
  const { department_managers } = settings.value;
  state.form = {
    department_managers: department_managers
      ? department_managers.split(",")
      : [],
  };
});

async function submit() {
  try {
    await saveSettings({
      department_managers: joinedEmails.value,
    });
    emit("submit");
  } catch (error) {
    console.log("I'm in submit error", error);
  }
}
</script>

<template>
  <div
    class="modal-body d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 2rem"
  >
    <div>
      <div class="vertical-form-field">
        <label
          for=""
          class="form-label"
          v-t="'Focal Points (Can be multiple)'"
        ></label>
        <Chips
          type="email"
          class="flex-grow-1"
          separator=","
          v-model="v$.form.department_managers.$model"
          :class="{
            'p-invalid':
              v$.form.department_managers.$invalid &&
              v$.form.department_managers.$dirty,
          }"
          :allow-duplicate="false"
        />
        <ChipsTooltip />
      </div>
    </div>

    <div class="d-flex flex-row justify-content-end align-items-center">
      <SaveButton
        :disabled="v$.form.$invalid"
        type="button"
        class="btn btn-primary"
        @click="submit"
      >
        <span v-t="'Update'"></span>
      </SaveButton>
    </div>
  </div>
</template>

<style scoped>
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
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.horizontal-form-field .form-check-input {
  margin-block-start: unset;
}

.horizontal-form-field .form-control {
  width: unset;
  flex-grow: 1;
}

.horizontal-form-field .form-label {
  min-width: 130px;
  margin-block-end: 0px;
}

.vertical-form-field {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.mx-datepicker {
  width: unset !important;
}

.border-form-custom,
.inner-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 1rem;
}
</style>
