<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Display LOIs PAX belongs to

***********************************
-->
<script setup>
import { useRouterHelpers } from "@/composables";
import { PermissionsEnum, Routes } from "@/data";
import { useLOIStore, useUserStore } from "@/stores";
import { toRefs } from "@vueuse/core";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  lois: {
    type: Array,
    default: () => [],
  },
});

const { lois } = toRefs(props);

const router = useRouter();
const { navigateToRouteInNewTab } = useRouterHelpers();
const { getLOITypeById } = useLOIStore();
const { hasPermission } = useUserStore();

const hasGetLOIPermission = computed(() =>
  hasPermission(PermissionsEnum.LOI_BATCHES_GET)
);

function navigate({ id }) {
  if (hasGetLOIPermission.value) {
    router.push({
      name: Routes.LOIRequest,
      params: {
        id,
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
          <th v-t="'Type'"></th>
          <th v-t="'Loi No'"></th>
          <th v-t="'LOI Issue Date'"></th>
          <th v-t="'LOI Close Date'"></th>
          <th v-t="'LOI Status'"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in lois" :key="item.id">
          <td>{{ lois.length - index }}</td>
          <td class="cursor-pointer" @click="navigate(item)">
            {{ item.batch_no }}
          </td>
          <td>{{ getLOITypeById(item.loi_type)?.value }}</td>
          <td>{{ item.loi_no }}</td>
          <td>{{ item.loi_issue_date }}</td>
          <td>{{ item.close_date }}</td>
          <td>
            <span
              :class="{
                'text-success': !item.close_date,
                'text-danger': item.close_date,
              }"
            >
              {{ item.close_date ? "Closed" : "Open" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!lois.length" class="table-no-data-container">
      <p class="text-center" v-t="'No data available'"></p>

      <button
        @click="navigateToRouteInNewTab(Routes.LOIApplications)"
        class="btn btn-outline-primary"
      >
        <span v-t="'Navigate to LOI'"></span>
      </button>
    </div>
  </div>
</template>
