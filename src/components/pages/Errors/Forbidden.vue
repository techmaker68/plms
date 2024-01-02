<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Forbidden page for unauthorized users
Users with no permission land on this page

***********************************
-->
<template>
  <div class="forbidden">
    <h1>403 Forbidden</h1>
    <p>You are not authorized to access this page.</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Forbidden",
});
</script>

<style scoped>
.forbidden {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

h1 {
  font-size: 3rem;
  margin-block-end: 1rem;
}

.forbidden p {
  font-size: 1.5rem;
  text-align: center;
}
</style>
