<!--
***********************************
@author Mohanned Hassan
@create_date 26th Dec 2023

***********************************
-->
<script setup>
import { useI18n } from "vue-i18n";
import { Mask } from "maska";
import { useVModel } from "@vueuse/core";
import { ref } from "vue";

const { t } = useI18n();

const props = defineProps({
  value: String,
  range: {
    type: Boolean,
    default: false,
  },
});

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(["update:value"]);

const modelValue = useVModel(props, "value", emit);

const datepickerRef = ref(null);

const mask = new Mask({ mask: "#-#" });
</script>

<template>
  <date-picker
    v-bind="$attrs"
    v-model:value="modelValue"
    :range="props.range"
    :editable="false"
  >
  </date-picker>
</template>
<style scoped lang="scss"></style>
