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
import ExportConfirmModal from "./ExportConfirmModal.vue";

const props = defineProps({
  text: {
    type: String,
  },
  class: {
    type: String,
    default: "btn btn-blue",
  },
});

const emit = defineEmits(["confirm"]);
const { t } = useI18n();

const modalView = ref(false);

function showModal() {
  modalView.value = true;
}

function hideModal() {
  modalView.value = false;
}

function onConfirm() {
  emit("confirm");
  hideModal();
}
</script>

<template>
  <button :class="class" v-bind="$attrs" @click="showModal">
    <slot></slot>
    <span>{{ props.text || t("Export as Excel") }}</span>
  </button>

  <ExportConfirmModal v-model="modalView" @confirm="onConfirm" />
</template>
