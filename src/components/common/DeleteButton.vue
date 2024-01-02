<!--
***********************************
@author Mohanned Hassan
@create_date 4th Dec 2023

***********************************
-->
<script setup>
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";

const props = defineProps({
  icon: {
    default: faTrash,
  },
});

const emit = defineEmits(["on", "close"]);
</script>

<template>
  <button type="button" class="btn btn-danger">
    <Fa class="btn-fa-icon" :icon="props.icon" fw />
    <slot>
      {{ $t("Delete") }}
    </slot>
  </button>
</template>
