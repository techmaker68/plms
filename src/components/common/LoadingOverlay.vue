<!--
***********************************
@author Mohanned Hassan
@create_date 1st July 2023

***********************************
-->
<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
  },
});
</script>
<template>
  <div class="loader-container" v-if="props.loading">
    <div
      class="sr-only spinner spinner-border text-primary"
      role="status"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.loader-container {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  place-content: center;
  align-items: center;
  z-index: 9999;
  background: radial-gradient(rgba(20, 20, 20, 0.8), rgba(0, 0, 0, 0.8));

  .spinner {
    $size: 8rem;
    width: $size;
    height: $size;
  }
}
</style>
