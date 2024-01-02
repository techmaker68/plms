<!--
***********************************
@author Mohanned Hassan
@create_date 6th Dec 2023

***********************************
-->
<script setup>
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";
</script>
<template>
  <button class="btn btn-icon btn-secondary">
    <Fa class="btn-fa-icon" :icon="faXmark" fw />
    <slot>
      {{ $t("Cancel") }}
    </slot>
  </button>
</template>
