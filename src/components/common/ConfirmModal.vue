<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

Used with VueModal to display confirmation dialog

***********************************
-->
<script setup>
import { useSlots } from "vue";
import ModalHeader from "./ModalHeader.vue";
import CancelButton from "./CancelButton.vue";
import ConfirmButton from "./ConfirmButton.vue";

const emit = defineEmits(["confirm", "close"]);

const slots = useSlots();
const props = defineProps({
  title: {
    type: String,
    default: "Confirm",
  },
  message: {
    type: String,
    default: "Are you sure?",
  },
  closeLabel: {
    type: String,
    default: "Close",
  },
  confirmLabel: {
    type: String,
    default: "Confirm",
  },
  deleteLabel: {
    type: String,
    default: "Delete",
  },
  hideClose: {
    type: Boolean,
    default: false,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  disableConfirm: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <ModalHeader :title="props.title" @close="emit('close')" />
        <div class="modal-body">
          <p
            :class="props.delete ? 'text-danger' : 'text-primary'"
            v-if="!slots.default"
          >
            {{ props.message }}
          </p>

          <slot></slot>
        </div>
        <div class="modal-footer" v-if="!hideFooter">
          <CancelButton
            v-if="!hideClose"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click="emit('close')"
            >{{ closeLabel }}</CancelButton
          >
          <ConfirmButton
            :disabled="disableConfirm"
            type="button"
            class="btn"
            :class="{
              'btn-primary': !props.delete,
              'btn-danger': props.delete,
            }"
            @click="emit('confirm')"
          >
            {{ props.delete ? deleteLabel : confirmLabel }}
          </ConfirmButton>
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

.modal-body p,
:slotted(p) {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
