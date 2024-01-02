<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

Full option quill editor

***********************************
-->
<script setup>
import Editor from "primevue/editor";
import { useVModel } from "@vueuse/core";

const props = defineProps({
  modelValue: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  simple: {
    type: Boolean,
    default: false,
  },
});
defineOptions({
  inheritAttrs: false,
});
const emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel(props, "modelValue", emit);

function onTextChange({ htmlValue }) {
  modelValue.value = htmlValue;
}
</script>
<template>
  <Editor
    v-if="!props.simple"
    class="custom-editor"
    :class="{
      'simple-custom-editor': props.simple,
    }"
    v-model="modelValue"
    @text-change="onTextChange"
    :readonly="props.disabled"
    v-bind="$attrs"
  >
  </Editor>
  <textarea
    v-else
    class="form-control"
    v-model="modelValue"
    rows="5"
    v-bind="$attrs"
  ></textarea>
</template>
<style scoped lang="scss">
.custom-editor::v-deep {
  &.simple-custom-editor {
    border-radius: 6px;
    border: 1px solid #dee2e6;
    .ql-toolbar {
      display: none;
    }

    .p-editor-container .p-editor-content.ql-snow {
      border: none;
    }
  }

  .ql-editor {
    min-height: 12rem;
  }

  .ql-formats {
    .ql-color,
    .ql-background,
    .ql-code-block,
    .ql-clean {
      display: none;
    }

    .ql-picker-label {
      svg {
        vertical-align: baseline;
      }
    }
  }
}
</style>
