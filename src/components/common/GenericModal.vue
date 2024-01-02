<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

Modal wrapper

***********************************
-->
<script setup>
import ModalHeader from "./ModalHeader.vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  title: {
    type: String,
  },
});
</script>

<template>
  <div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <ModalHeader :title="props.title" @close="emit('close')" />
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: unset;
  display: unset;
}

.modal-dialog {
  margin: unset;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
