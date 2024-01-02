<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood test batch collect passport modal

***********************************
-->
<script setup>
import { ref, computed } from "vue";
import PaxTable from "@/components/common/PaxTable.vue";
import { PAXHeaders, PaxTableRouteFilterEnum } from "@/data";
import AddButton from "@/components/common/AddButton.vue";

const props = defineProps({
  batch: {
    type: Object,
    required: false,
    default: null,
  },
});

const emit = defineEmits({
  rowClick: null,
  apply: null,
});

const paxTableHeaders = ref([
  PAXHeaders.PAX,
  PAXHeaders.PassportNo,
  PAXHeaders.FullName,
  PAXHeaders.Nationality,
  PAXHeaders.Position,
  PAXHeaders.Department,
  PAXHeaders.Employer,
  PAXHeaders.Actions,
]);

const extraTableOptions = ref({
  "rows-items": [10, 25, 50],
  "rows-per-page": 10,
});

const extraServerFilters = computed(() => ({
  batch_no: props.batch?.batch_no,
  route: PaxTableRouteFilterEnum.BloodTest,
}));
</script>

<template>
  <PaxTable
    :included-headers="paxTableHeaders"
    :extra-table-options="extraTableOptions"
    :extra-server-filters="extraServerFilters"
    latest-passport
  >
    <template #header-description>
      <span
        class="label"
        v-t="'Select applicants from PAX profiles list and add to the list'"
      ></span>
    </template>
    <template #column-actions="{ item }">
      <div class="text-end">
        <AddButton
          class="btn btn-blue btn-small"
          @click.stop="emit('apply', item)"
          >{{ $t("Add") }}</AddButton
        >
      </div>
    </template>
  </PaxTable>
</template>

<style scoped>
.label,
th {
  color: var(--label-color);
}
</style>
