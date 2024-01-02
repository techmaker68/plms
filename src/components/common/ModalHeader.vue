<!--
***********************************
@author Mohanned Hassan
@create_date 1st July 2023

***********************************
-->
<script setup>
const emit = defineEmits(["close"]);

const props = defineProps({
  title: {
    type: String,
    default: "Insert title here",
  },
});
</script>

<template>
  <div class="modal-header">
    <h5 class="modal-title">{{ props.title }}</h5>
    <div class="d-flex flex-row justify-content-end align-items-center">
      <slot name="action-buttons"></slot>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        @click="emit('close')"
      ></button>
    </div>
  </div>
</template>

<style scoped></style>
