<!--
***********************************
@author Mohanned Hassan
@create_date 24th Nov 2023

***********************************
-->
<script setup>
import useVuelidate from "@vuelidate/core";
import { computed, onMounted, reactive, ref } from "vue";
import { helpers, minLength, required, maxLength } from "@vuelidate/validators";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import CustomEditor from "@/components/common/CustomEditor.vue";
import { useModal } from "@kouts/vue-modal";
import { generateUIDs } from "@/helpers";
import ErrorMessages from "./ErrorMessages.vue";

const emit = defineEmits(["submit", "close"]);

const { show, hide } = useModal();

const [confirmDeleteModal] = generateUIDs(1);

const state = reactive({
  form: {
    reason: "",
  },
});

// Text is saved in HTML, so we give it extra length
const reasonMinLength = ref(10);
const reasonMaxLength = ref(200);
const rules = computed(() => ({
  form: {
    reason: {
      required,
      minLength: helpers.withMessage(
        `Text must be longer than ${reasonMinLength.value} characters`,
        minLength(reasonMinLength)
      ),
      maxLength: helpers.withMessage(
        `Text must be shorter than ${reasonMaxLength.value} characters`,
        maxLength(reasonMaxLength)
      ),
    },
  },
}));

const v$ = useVuelidate(rules, state);

function hideConfirmModal() {
  hide(confirmDeleteModal);
}

function showConfirmModal() {
  show(confirmDeleteModal);
}

function emitSubmit() {
  hideConfirmModal();
  emit("submit", state.form);
}

function emitClose() {
  emit("close");
}
</script>
<template>
  <ConfirmModal
    :title="$t('Visa Revoke Reason')"
    :confirm-label="$t('Revoke Visa')"
    @close="emitClose"
    @confirm="showConfirmModal"
    :disable-confirm="v$.form.$invalid"
  >
    <div class="form-container-section required-form-control">
      <div>
        <label class="form-label" v-t="'Reason:'"> </label>
        <CustomEditor
          v-model="v$.form.reason.$model"
          :maxlength="reasonMaxLength"
          simple
        ></CustomEditor>
        <ErrorMessages :errors="v$.form.reason.$errors" />
      </div>
    </div>
  </ConfirmModal>

  <VueModal :name="confirmDeleteModal">
    <ConfirmModal
      @close="hideConfirmModal"
      @confirm="emitSubmit"
      :title="$t('Confirm Visa Cancellation?')"
      :message="
        $t('Are you REALLY sure? You will not be able to revert this action')
      "
    />
  </VueModal>
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
