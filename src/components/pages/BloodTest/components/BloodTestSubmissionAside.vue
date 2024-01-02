<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Render batches calendar and table

***********************************
-->
<script setup>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import BloodApplicationCreateBatch from "./BloodApplicationCreateBatch.vue";
import { useModal } from "@kouts/vue-modal";
import { ref, watch, computed } from "vue";
import { useBloodStore } from "@/stores";
import { storeToRefs } from "pinia";
import {
  appendDate,
  defaultDateFormat,
  formatDate,
  convertToDayjs,
  generateUIDs,
} from "@/helpers";
import { useTable } from "@/composables";
import { useRoute } from "vue-router";
import { watchOnce } from "@vueuse/core";
import SearchField from "@/components/common/SearchField.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import { Routes } from "@/data";

const emit = defineEmits(["batchChange"]);

const { enableCreateBatch, nextBatchDefaults } = storeToRefs(useBloodStore());
const { getBloodBatches } = useBloodStore();
const apiCall = (pagination, search) => {
  return getBloodBatches(pagination, {
    search,
  });
};

const { show, hide } = useModal();
const route = useRoute();

const calendarBatches = ref([]);
const calendarLoading = ref(false);
const createBatchModal = generateUIDs();
const componentKey = ref(0);
const showDate = ref(new Date());
const disableFuture = ref(true);
const showClearSearch = ref(false);
const selectedBatch = ref(null);
const batchesDataHeaders = ref([
  { text: "Batch No", value: "batch_no", width: "70" },
  { text: "Test Date", value: "test_date", width: "70" },
  { text: "Submitted", value: "submitted" },
  { text: "Tested", value: "tested" },
  { text: "Returned", value: "returned" },
]);
const {
  searchValue,
  headers,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  triggerServerRefresh,
  extraOptions,
} = useTable(batchesDataHeaders, null, apiCall, {
  sortBy: "batch_no",
  sortType: "desc",
});

const defaultClasses = ["batch-calendar-item-container"];

const calendarItems = computed(() => {
  let temp = [];
  calendarBatches.value.forEach((batch) => {
    if (batch?.test_date) {
      // We have two bars for each batch
      // We push collect bar, start date is the start of test date week, and ends with it
      temp.push({
        id: `${batch.batch_no}-collect`,
        title: generateBatchCalendarItem(batch, false),
        startDate: formatDate(batch.test_date, undefined, undefined, true)
          .startOf("week")
          .format(defaultDateFormat),
        endDate: formatDate(batch.test_date, undefined, undefined, true)
          .endOf("week")
          .format(defaultDateFormat),
        tooltip: batch.batch_no,
        classes: [...defaultClasses, "collect-batch-calendar"],
      });

      // We push test bar, start date is the start of test date next week, and ends with it
      temp.push({
        id: `${batch.batch_no}-test`,
        title: generateBatchCalendarItem(batch, true),
        startDate: appendDate(batch.test_date, 7, "days", undefined, true)
          .startOf("week")
          .format(defaultDateFormat),
        endDate: appendDate(batch.test_date, 7, "days", undefined, true)
          .startOf("week")
          .add(3, "days")
          .format(defaultDateFormat),
        tooltip: batch.batch_no,
        classes: [...defaultClasses, "test-batch-calendar"],
      });
    }
  });

  // We push create new batch if required
  if (enableCreateBatch.value) {
    temp.push({
      id: +nextBatchDefaults.value?.batch_no,
      title: generateCreateBatchCalendarContent(nextBatchDefaults.value),
      startDate: formatDate(
        nextBatchDefaults.value?.test_date,
        undefined,
        undefined,
        true
      )
        .startOf("week")
        .format(defaultDateFormat),
      endDate: formatDate(
        nextBatchDefaults.value?.test_date,
        undefined,
        undefined,
        true
      )
        .endOf("week")
        .format(defaultDateFormat),
      tooltip: nextBatchDefaults.value?.batch_no,
      classes: [...defaultClasses, "new-batch-calendar"],
    });
  }

  return temp;
});

watch(selectedBatch, (newBatch, oldBatch) => {
  if (oldBatch?.batch_no != newBatch?.batch_no) {
    emit("batchChange", newBatch);
  }
});

watch(
  serverOptions,
  () => forceTableRerender() // Library table seems bugged, doesn't update automatically.
);

watch(
  showDate,
  (newDate) => {
    getCalendarBatches(newDate);
  },
  {
    immediate: true,
  }
);

watchOnce(serverItems, (newItems) => {
  selectFirstBatch(false, newItems);
});

async function getBatches(resetPage = true) {
  await triggerServerRefresh(resetPage);
}

async function getCalendarBatches(date) {
  try {
    calendarLoading.value = true;
    const month = formatDate(convertToDayjs(date), undefined, "MM-YYYY");
    const response = await getBloodBatches(
      {},
      {
        month,
      }
    );
    calendarBatches.value = response?.data || [];
  } catch (error) {
    console.log("error getting calendar items");
  } finally {
    calendarLoading.value = false;
  }
}

function hideCreateBatchModal() {
  hide(createBatchModal);
}

function showCreateBatchModal() {
  show(createBatchModal);
}

async function onSubmittedCreateBatch() {
  await getBatches();
  hide(createBatchModal);
  selectFirstBatch(true, serverItems.value);
}

function selectedBatchClass(batch) {
  return batch?.id == selectedBatch.value?.id ? "active-row" : "";
}

const selectFirstBatch = (force = false, items = serverItems.value) => {
  const batchID = route.params.id;
  if (batchID && !force) {
    selectedBatch.value = items.find((element) => element.batch_no == batchID);
  } else {
    selectedBatch.value = items[0];
  }
};

const searchData = () => {
  if (searchValue.value) {
    getBatches(true);
    showClearSearch.value = true;
  }
};

const clearSearch = () => {
  searchValue.value = "";
  getBatches(true);
  showClearSearch.value = false;
};

function forceTableRerender() {
  componentKey.value += 1;
}

function generateBatchCalendarItem(batch, test = false) {
  return `
  <div class="calendar-flex-batch">
    <span>${batch?.batch_no}</span>

    <span class="calendar-flex-title">
      ${test ? batch?.tested : ""}
    </span>

    <span>
      ${
        test
          ? `${batch?.returned}${batch?.submitted ? `/${batch.submitted}` : ""}`
          : batch?.submitted
      }
    </span>
  </div>
  `;
}

function generateCreateBatchCalendarContent(batchDefaults) {
  return `
  <div class="calendar-flex-batch">
    <span>${batchDefaults?.batch_no}</span>

    <span class="calendar-flex-title">
      Create new batch for this week
    </span>

    <span>
    </span>
  </div>
  `;
}

function setShowDate(event) {
  showDate.value = event;
}

defineExpose({
  triggerServerRefresh,
  selectFirstBatch,
});
</script>

<template>
  <VueModal :name="createBatchModal" wrapperClass="vm-md">
    <BloodApplicationCreateBatch
      @submit="onSubmittedCreateBatch"
      @close="hideCreateBatchModal"
    />
  </VueModal>

  <aside
    v-bind="$attrs"
    class="sidebar sidebar--moreInfoSidebar d-flex flex-column flex-shrink-0 sidebar__menublock pt-3 h-100 overflow-auto custom-scrollbar"
    style="gap: 1rem"
  >
    <BreadCrumbs :override-route-name="Routes.BloodTest" />

    <div class="custom-calendar-theme">
      <calendar-view
        :show-date="showDate"
        :items="calendarItems"
        :enable-date-selection="false"
        current-period-label="icons"
        class="theme-default"
      >
        <template #header="{ headerProps }">
          <calendar-view-header
            :header-props="headerProps"
            :disableFuture="disableFuture"
            @input="setShowDate"
          />
        </template>
      </calendar-view>
    </div>

    <div v-if="enableCreateBatch">
      <button class="btn btn-blue" @click="showCreateBatchModal">
        <span v-t="'New Test Batch'"></span>
      </button>
    </div>

    <div
      class="Bloodtest-search d-flex flex-row-reverse justify-content-between align-items-center"
    >
      <h4 class="sidebar-title">
        <span v-t="'last'"></span>
        {{ serverItemsLength }} <span v-t="'Batches'"></span>
      </h4>

      <SearchField
        style="max-width: 20rem"
        v-model="searchValue"
        :showClearSearch="showClearSearch"
        @submit="searchData"
        @cancel="clearSearch"
      />
    </div>

    <EasyDataTable
      :key="componentKey"
      v-model:server-options="serverOptions"
      class="easy-data-table"
      :headers="headers"
      :items="serverItems"
      :loadiing="loading"
      :server-items-length="serverItemsLength"
      :body-row-class-name="selectedBatchClass"
      body-text-direction="center"
      header-text-direction="center"
      @click-row="(item) => (selectedBatch = item)"
      :alternating="false"
      v-bind="extraOptions"
    >
      <template #item-batch_no="{ batch_no }">
        <span class="d-flex align-items-center px-3">
          <span class="icon-envelopico me-1"
            ><span class="path1"></span><span class="path2"></span
            ><span class="path3"></span><span class="path4"></span
            ><span class="path5"></span
          ></span>
          <span>{{ batch_no }}</span>
        </span>
      </template>
      <template #item-returned="{ returned, submitted }">
        {{ returned }}{{ submitted ? `/${submitted}` : "" }}
      </template>
    </EasyDataTable>
  </aside>
</template>

<style scoped lang="scss">
.sidebar--moreInfoSidebar {
  width: 36rem;
}

.easy-data-table {
  --easy-table-body-row-background-color: transparent;
  --easy-table-header-item-padding: 0px 5px;
  --easy-table-body-item-padding: 0px 0px;
  --easy-table-body-row-height: 24px;
  background-color: transparent !important;

  ::v-deep(.header-text) {
    font-weight: bolder;
  }

  ::v-deep(.vue3-easy-data-table__body tr) {
    font-weight: bolder;
    font-size: 11px;

    &:hover:not(.active-row) {
      cursor: pointer;
      background-color: #d4d4d4;
    }
  }

  ::v-deep(.active-row) {
    td {
      color: var(--light-success) !important;
    }
  }
}

.custom-calendar-theme {
  position: relative;
}

.table thead th {
  font-weight: 600;
}

.table tr {
  text-align: center;
}
</style>
