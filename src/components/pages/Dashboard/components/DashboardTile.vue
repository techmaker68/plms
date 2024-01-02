<!--
***********************************
@author Mohanned Hassan
@create_date 1st September 2023

Dashboard tile used in dashboard page
Randomizes background color on load

***********************************
-->
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  iconClasses: {
    type: Array,
    default: () => ["icon-userIcon"],
  },
});

const emit = defineEmits(["click"]);

const backgroundColors = [
  "#4586b9",
  "#9c5b0e",
  "#757e9a",
  "#f39a31",
  "#df7902",
  "#ff5c00",
  "#3bd4f5",
  "#5d4066",
  "#a972b2",
  "#55465a",
  "#42928d",
  "#37c774",
  "#afab41",
  "#c9a869",
  "#0fccc1",
  "#11ccc1",
];

const backgroundColor =
  backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
</script>
<template>
  <div class="col-12 dashboard-tiles cursor-pointer" @click="emit('click')">
    <div class="dashboard-items" :style="{ backgroundColor }">
      <h3>{{ props.title }}</h3>
      <div class="d-flex justify-content-between align-items-end h-100">
        <div
          class="d-flex flex-row justify-content-center align-items-center"
          style="min-height: 3.5rem"
        >
          <h2 class="iconclass text-white me-2" :class="props.iconClasses"></h2>
        </div>
        <h2 class="mb-0">
          {{ props.value }}
        </h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
}
.dashboard-tiles .dashboard-items {
  min-height: 12rem;
}
</style>
