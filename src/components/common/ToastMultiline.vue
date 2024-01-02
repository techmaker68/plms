<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

***********************************
-->
<script setup>
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <div class="t-container">
    <ul class="mb-0">
      <li
        class="Vue-Toastification__toast-body"
        v-for="(message, index) of messages"
        :key="index"
      >
        {{ message }}
      </li>
    </ul>
  </div>
</template>
