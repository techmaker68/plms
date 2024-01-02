<!--
***********************************
@author Mohanned Hassan
@create_date 7th Dec 2023

Unified search

***********************************
-->
<script setup>
import { ref, computed } from "vue";
import ConfirmModal from "./ConfirmModal.vue";
import { useI18n } from "vue-i18n";
import InputFileTooltip from "./InputFileTooltip.vue";
import { useVModel } from "@vueuse/core";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  modelValue: String,
  showClearSearch: Boolean,
  hideButtons: Boolean,
});

const emit = defineEmits(["cancel", "submit", "update:modelValue"]);

const { t } = useI18n();

const modelValue = useVModel(props, "modelValue", emit);

function emitSubmit() {
  emit("submit");
}

function emitCancel() {
  emit("cancel");
}
</script>

<template>
  <div class="search-box" v-bind="$attrs">
    <input
      type="text"
      class="form-control search-input"
      :class="{
        'no-input-group-append': hideButtons,
      }"
      :placeholder="$t('Quick Search')"
      @keyup.enter="emitSubmit"
      v-model="modelValue"
      v-bind="$attrs"
    />
    <div class="input-group-append btn-group btn-group-sm" v-if="!hideButtons">
      <button
        class="btn btn-blue btn-icon rounded-start"
        type="button"
        @click="emitSubmit"
      >
        <span class="icon-searchIcon"></span>
      </button>
      <button
        class="btn btn-secondary btn-icon rounded-end"
        type="button"
        v-if="showClearSearch"
        @click="emitCancel"
      >
        <span class="icon-cross"></span>
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search-box {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;

  input {
    flex-grow: 1;
  }
}

.form-control:not(.no-input-group-append) {
  &:focus {
    box-shadow: none;
  }
}

.input-group-append {
  position: absolute;
  inset-inline-end: 0px;
  inset-block-start: 0px;
  height: 100%;
  padding: 0.5px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: stretch;
  align-self: end;
  z-index: 5;

  .btn:first {
    border-end-end-radius: 0px;
    border-start-end-radius: 0px;
  }

  .btn {
    $size: 2.6rem;
    min-width: unset;
    width: $size;
    padding: 5px 5px;

    display: flex;
    justify-content: center;
  }
}
</style>
