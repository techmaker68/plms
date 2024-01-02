<!--
***********************************
@author Mohanned Hassan
@create_date 6th Dec 2023

***********************************
-->
<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
<template>
  <label
    class="chips-file-tooltip"
    style="
      display: block;
      text-align: start;
      font-weight: 600;
      font-size: 9px;
      margin-top: 2px;
      color: var(--label-color);
    "
    >{{ t("Type a valid Email and hit enter") }}</label
  >
</template>
