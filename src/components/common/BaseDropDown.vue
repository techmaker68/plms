<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

***********************************
-->
<script setup>
import { useI18n } from "vue-i18n";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";

const { t } = useI18n();

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <MultiSelect
    class="custom-select"
    v-if="multiple"
    :showToggleAll="false"
    :maxSelectedLabels="1"
    v-bind="$attrs"
  >
  </MultiSelect>
  <Dropdown class="custom-select" v-else v-bind="$attrs"> </Dropdown>
</template>
<style scoped lang="scss">
.custom-select {
  width: 100%;
  flex-grow: 1;
}
</style>
