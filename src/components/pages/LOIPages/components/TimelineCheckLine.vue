<!--
***********************************
@author Mohanned Hassan
@create_date 29th Nov 2023

***********************************
-->
<script setup>
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";

const props = defineProps({
  checked: { type: Boolean, required: true },
  end: { type: Boolean, default: false },
  stepNumber: { type: Number },
  unavailable: { type: Boolean, default: false },
});
</script>

<template>
  <div
    class="timeline-side-line d-flex flex-column justify-content-start align-items-center"
    :class="{
      'success-line': props.checked,
    }"
  >
    <div class="timeline-step-number">
      <span>{{ props.stepNumber }}</span>
    </div>

    <!-- <Fa :icon="faCircleCheck" class="timeline-check-icon" fw /> -->
    <div v-if="!props.end" class="thin-line"></div>
  </div>
</template>
<style scoped lang="scss">
$unchecked-color: #8493a5;
.thin-line {
  background: $unchecked-color;
  width: 2px;
  flex-grow: 1;
}

.timeline-step-number {
  $size: 1.75rem;
  height: $size;
  width: $size;
  border-radius: calc(#{$size}/ 2);
  text-align: center;
  background: $unchecked-color;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  font-size: 1rem;
}

.success-line {
  .timeline-step-number {
    background: var(--light-success);
  }

  .thin-line {
    background: var(--light-success);
  }
}
</style>
