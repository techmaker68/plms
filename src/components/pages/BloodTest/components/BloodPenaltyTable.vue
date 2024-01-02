<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood applicant's penalties tables

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
        <th scope="col" v-t="'Appoint Date'"></th>
        <th scope="col" v-t="'Penalty Reason'"></th>
        <th scope="col" v-t="'Penalty'"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in props.data" :key="index">
        <td>{{ item?.appoint_date }}</td>
        <td v-html="item?.penalty_remarks"></td>
        <td class="text-danger">{{ item?.penalty_fee }}</td>
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
}

.table th {
  font-weight: 600;
}
</style>
