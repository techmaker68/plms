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

const emit = defineEmits(["submit", "close"]);

const state = reactive({
  form: {
    notes: "",
  },
});

const rules = computed(() => ({
  form: {
    notes: {
      required,
    },
  },
}));

const v$ = useVuelidate(rules, state);

function emitSubmit() {
  emit("submit", state.form);
}

function emitClose() {
  emit("close");
}
</script>
<template>
  <ConfirmModal
    :title="$t('Notes/Comments/Report')"
    :confirm-label="$t('Email applicants')"
    @close="emitClose"
    @confirm="emitSubmit"
    :disable-confirm="v$.form.$invalid"
  >
    <p
      class="text-primary"
      v-t="'*This email will be sent to all the selected applicants'"
    ></p>

    <div class="form-container-section required-form-control">
      <div>
        <label class="form-label" v-t="'Notes:'"> </label>
        <CustomEditor v-model="v$.form.notes.$model"></CustomEditor>
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
