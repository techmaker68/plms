<!--
***********************************
@author Mohanned Hassan
@create_date 6th Dec 2023

***********************************
-->
<script setup>
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";
</script>
<template>
  <button class="btn btn-icon">
    <Fa class="btn-fa-icon" :icon="faPlus" fw />
    <slot>
      {{ $t("Add") }}
    </slot>
  </button>
</template>
