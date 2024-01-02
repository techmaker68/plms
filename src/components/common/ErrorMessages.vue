<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

Display form fields errors

***********************************
-->
<template>
  <div class="input-errors">
    <div
      class="error-msg message"
      v-for="(error, index) of errors?.slice(0, 1)"
      :key="index"
    >
      {{ isArray(error.$message) ? error.$message?.[0] : error.$message }}
    </div>

    <slot name="extra"></slot>
  </div>
</template>

<script>
import { isArray } from "lodash-es";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorMessages",
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
  methods: {
    isArray(value) {
      return isArray(value);
    },
  },
});
</script>

<style scoped lang="scss">
.input-errors {
  width: 100%;
}

.message {
  //add error message CSS here
  margin-block-start: 1px;
}
</style>
