<!--
***********************************
@author Mohanned Hassan
@create_date 6th Dec 2023

***********************************
-->
<script setup>
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";
</script>
<template>
  <button class="btn btn-icon">
    <Fa class="btn-fa-icon" :icon="faCheck" fw />
    <slot></slot>
  </button>
</template>
