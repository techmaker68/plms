<!--
***********************************
@author Mohanned Hassan
@create_date 6th Dec 2023

***********************************
-->
<script setup>
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";
</script>
<template>
  <button class="btn btn-blue btn-icon">
    <Fa class="btn-fa-icon" :icon="faFloppyDisk" />
    <slot>
      {{ $t("Save") }}
    </slot>
  </button>
</template>
