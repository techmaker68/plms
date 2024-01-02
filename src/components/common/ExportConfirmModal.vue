<!--
***********************************
@author Mohanned Hassan
@create_date 5th Dec 2023

Unified export confirmation button

***********************************
-->
<script setup>
import { ref } from "vue";
import ConfirmModal from "./ConfirmModal.vue";
import { useI18n } from "vue-i18n";
import { useVModel } from "@vueuse/core";

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["confirm", "update:modelValue"]);
const { t } = useI18n();

const modelValue = useVModel(props, "modelValue", emit);

function showModal() {
  modelValue.value = true;
}

function hideModal() {
  modelValue.value = false;
}

function onConfirm() {
  emit("confirm");
  hideModal();
}
</script>

<template>
  <VueModal v-model="modelValue">
    <ConfirmModal
      @close="hideModal"
      @confirm="onConfirm"
      :close-label="$t('No')"
      :confirm-label="$t('Yes')"
      :title="t('Data Export')"
      :message="
        t(
          'Are you sure you want to export ALL data as Excel? It will take a few minutes'
        )
      "
    >
    </ConfirmModal>
  </VueModal>
</template>
