<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

***********************************
-->
<script setup>
import Fa from "vue-fa";

import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  tooltip: {
    type: String,
  },
});
</script>

<template>
  <i v-tooltip.top="props.tooltip"
    ><Fa :icon="faCircleInfo" style="color: darkslategray" fw
  /></i>
</template>
