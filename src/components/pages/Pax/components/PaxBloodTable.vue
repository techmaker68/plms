<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Display blood batches PAX belongs to

***********************************
-->
<script setup>
import { useRouterHelpers } from "@/composables";
import { PermissionsEnum, Routes, TestStatus } from "@/data";
import { resolveLabelFromId } from "@/helpers";
import { useUserStore } from "@/stores";
import { toRefs } from "@vueuse/core";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  bloods: {
    type: Array,
    default: () => [],
  },
});

const { bloods } = toRefs(props);

const router = useRouter();
const { navigateToRouteInNewTab } = useRouterHelpers();

const { hasPermission } = useUserStore();

const hasGetBloodBatchesPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TESTS_GET)
);

function navigate({ batch_no }) {
  if (hasGetBloodBatchesPermission.value) {
    router.push({
      name: Routes.BloodTestSubmission,
      params: {
        id: batch_no,
      },
    });
  }
}
</script>

<template>
  <div class="pax-profile-tab-container">
    <slot name="header"></slot>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th v-t="'Batch No'"></th>
          <th v-t="'Passport No'"></th>
          <th v-t="'Submit Date'"></th>
          <th v-t="'Test Date'"></th>
          <th v-t="'Return Date'"></th>
          <th v-t="'Appoint Time'"></th>
          <th v-t="'Test Place'"></th>
          <th v-t="'Attendance'"></th>
          <th v-t="'Status'"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in bloods" :key="item.id">
          <td>{{ bloods.length - index }}</td>
          <td class="cursor-pointer" @click="navigate(item)">
            {{ item.batch_no }}
          </td>
          <td>{{ item.passport_no }}</td>
          <td>{{ item.submit_date }}</td>
          <td>{{ item.test_date }}</td>
          <td>{{ item.return_date }}</td>
          <td>{{ item.appoint_time }}</td>
          <td>{{ item.venue_name }}</td>
          <td>{{ resolveLabelFromId(TestStatus, item.attendance) }}</td>
          <td>{{ item.scheduled_status }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!bloods.length" class="table-no-data-container">
      <p class="text-center" v-t="'No data available'"></p>

      <button
        @click="navigateToRouteInNewTab(Routes.BloodTest)"
        class="btn btn-outline-primary"
      >
        <span v-t="'Navigate to Blood Batches'"></span>
      </button>
    </div>
  </div>
</template>
