<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood test applicant history table

***********************************
-->
<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <table class="table table-responsive">
    <thead>
      <tr>
        <th scope="col" v-t="'Appoint Time'"></th>
        <th scope="col" v-t="'Submit Date'"></th>
        <th scope="col" v-t="'Test Date'"></th>
        <th scope="col" v-t="'Return Date'"></th>
        <th scope="col" v-t="'Test Place'"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in props.data" :key="item?.id">
        <td>{{ item?.appoint_time }}</td>
        <td>{{ item?.submit_date }}</td>
        <td>{{ item?.test_date }}</td>
        <td>{{ item?.return_date }}</td>
        <td>{{ item?.venue }}</td>
      </tr>
    </tbody>
  </table>

  <p
    v-if="!props.data.length"
    class="text-center"
    v-t="'No data available'"
  ></p>
</template>
<style scoped>
.table {
  --bs-table-bg: transparent;
  text-align: center;
}

.table th {
  font-weight: 600;
}
</style>
