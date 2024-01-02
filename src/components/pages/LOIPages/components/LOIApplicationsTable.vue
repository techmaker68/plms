<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
-->
<script setup>
import { ref, computed, watch, reactive } from "vue";
import { checkValidValue, convertFilterObject, resetObject } from "@/helpers";
import { LOIApplicationsHeaders, LOIPriority } from "@/data";
import { useTable, useTableProps } from "@/composables";
import { useLOIStore } from "@/stores";
import { toReactive, toRefs, watchDebounced } from "@vueuse/core";
import Fa from "vue-fa";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import ExportButton from "@/components/common/ExportButton.vue";
import SearchField from "@/components/common/SearchField.vue";

import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

import SelectButton from "primevue/selectbutton";
import CancelButton from "@/components/common/CancelButton.vue";
import { storeToRefs } from "pinia";
import useVuelidate from "@vuelidate/core";
import FadeInTransition from "@/components/common/FadeInTransition.vue";

const props = defineProps({
  ...useTableProps,
  disableSearch: {
    type: Boolean,
    default: false,
  },
  isLoiManagement: {
    type: Boolean,
    default: false,
  },
  enableAutoTriggerExtraFilters: {
    type: Boolean,
    default: true,
  },
  enableAccordion: {
    type: Boolean,
    default: false,
  },
  enableLegend: {
    type: Boolean,
    default: false,
  },
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["rowClick", "onSearch", "lastClickedItemChange"]);

const state = reactive({
  filters: {
    status: "",
    priority: [],
    issued: "",
    ...props.initialFilters.value,
  },
});

const rules = computed(() => ({
  filters: {
    status: {},
    priority: {},
    issued: {},
  },
}));

const v$ = useVuelidate(rules, state);

const lastClickedItem = ref(null);
const showClearSearch = ref(false);
const defaultHeaders = ref([
  { text: "LOI No.", value: LOIApplicationsHeaders.LOINo, width: 90 },
  { text: "Batch No", value: LOIApplicationsHeaders.BatchNo, sortable: true },
  {
    text: "Category",
    value: LOIApplicationsHeaders.NationCategory,
    sortable: true,
  },
  { text: "Type", value: LOIApplicationsHeaders.Type },
  { text: "Issued Date", value: LOIApplicationsHeaders.LOIIssueDate },
  { text: "Expire Date", value: LOIApplicationsHeaders.LOIExpiryDate },
  {
    text: "Applicants",
    value: LOIApplicationsHeaders.ApplicantsCount,
    sortable: false,
  },
  {
    text: "Request Time",
    value: LOIApplicationsHeaders.SubmissionDate,
    sortable: true,
  },
  { text: "BOC MFD ", value: LOIApplicationsHeaders.BOCMFD },
  { text: "BOC HQ", value: LOIApplicationsHeaders.BOCHQDate },
  { text: "MOO", value: LOIApplicationsHeaders.MOODate },
  { text: "MOI PAID", value: LOIApplicationsHeaders.MOIPaymentDate },
  { text: "Issued", value: LOIApplicationsHeaders.LOIIssued },
  { text: "Priority", value: LOIApplicationsHeaders.Priority },
  { text: "Status", value: LOIApplicationsHeaders.Status },
]);

const { extraServerFilters } = toRefs(props);

const { loiStatus, loiPriorities, loiIssued } = storeToRefs(useLOIStore());
const {
  getNationCategoryById,
  getLOITypeById,
  getLoiApplications,
  getLOIPriorityById,
} = useLOIStore();

const apiCall = (pagination, search, excel_export = null, batch_nos = null) =>
  getLoiApplications(props.isLoiManagement, pagination, {
    search,
    all: excel_export,
    batch_nos,
    ...convertFilterObject(state.filters),
    ...extraServerFilters?.value,
  });

const {
  searchValue,
  headers,
  getColumnItemName,
  getColumnHeaderName,
  selectedItems,
  extraOptions,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  vModelWorkaround,
  triggerServerRefresh,
} = useTable(defaultHeaders, props, apiCall);

const staticData = computed(() => props.staticData);

const tableData = computed(() => {
  if (staticData?.value) {
    return staticData.value;
  } else {
    return serverItems.value;
  }
});

watch(serverItems, (newValue) => {
  lastClickedItem.value = newValue?.[0];
});

watch(lastClickedItem, (newValue) => {
  emit("lastClickedItemChange", newValue);
});

watch([extraServerFilters], () => {
  if (props.enableAutoTriggerExtraFilters) {
    triggerServerRefresh(true);
  }
});

const clearSearch = (refresh = true) => {
  searchValue.value = "";
  if (refresh) {
    triggerServerRefresh(true);
  }
  showClearSearch.value = false;
};
const searchData = () => {
  if (searchValue.value) {
    emit("onSearch");
    triggerServerRefresh(true);
    showClearSearch.value = true;
  }
};

function checkNonPrimitiveValue(value) {
  return checkValidValue(value);
}

function onRowClick(item) {
  emit("rowClick", item);
  lastClickedItem.value = item;
}

function getRowClassName(item) {
  return lastClickedItem.value?.id == item.id ? "selected-table-row" : "";
}

async function exportExcel() {
  try {
    await apiCall(
      {},
      searchValue.value,
      true,
      selectedItems.value.map((element) => element.batch_no)
    );
  } catch (error) {
    console.log("Error exporting", error);
  }
}

function resetFilters() {
  emit("clearSearch");

  state.filters = resetObject(state.filters);
  searchValue.value = "";
  showClearSearch.value = false;
  v$.value.filters.$reset();
}

const watched = computed(() => ({
  ...extraServerFilters.value,
  ...state.filters,
}));

watchDebounced(
  watched,
  () => {
    triggerServerRefresh(true);
  },
  {
    debounce: 500,
  }
);

defineExpose({
  clearSearch,
  triggerServerRefresh,
});
</script>
<template>
  <div
    class="d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 1rem"
  >
    <slot name="header-section"></slot>

    <div
      class="table-headers-container d-flex flex-row justify-content-between align-items-center"
      style="gap: 1rem"
    >
      <div
        class="search-option table-headers d-flex flex-row justify-content-between align-items-center flex-grow-1"
        style="gap: 1rem"
        v-if="!disableSearch"
      >
        <slot name="header-description"></slot>
        <div class="search-filter-container search-filter-md">
          <SearchField
            v-model="searchValue"
            :showClearSearch="showClearSearch"
            @submit="searchData"
            @cancel="clearSearch"
          />
        </div>

        <div class="table-actions-container">
          <ExportButton
            v-if="enableExport"
            @confirm="exportExcel"
            style="min-width: unset"
            class="btn btn-outline-primary text-nowrap"
          ></ExportButton>
          <slot name="header-actions"></slot>
        </div>
      </div>
    </div>
    <Accordion v-if="props.enableAccordion">
      <AccordionTab :header="$t('Filters')">
        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <div
            class="filter-accordion-row justify-content-between"
            style="gap: 2rem"
          >
            <div
              class="filter-accordion-row justify-content-start"
              style="gap: 2rem"
            >
              <div class="filter-accordion-column">
                <label v-t="'Status'"></label>
                <SelectButton
                  class="toggle-button-normal"
                  v-model="v$.filters.status.$model"
                  :options="loiStatus"
                  optionValue="id"
                  optionLabel="value"
                  dataKey="id"
                >
                </SelectButton>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Priority'"></label>
                <SelectButton
                  class="toggle-button-normal"
                  v-model="v$.filters.priority.$model"
                  multiple
                  :options="loiPriorities"
                  option-label="value"
                  optionValue="id"
                  dataKey="id"
                >
                </SelectButton>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Issued'"></label>
                <SelectButton
                  class="toggle-button-normal"
                  v-model="v$.filters.issued.$model"
                  :options="loiIssued"
                  optionValue="id"
                  optionLabel="value"
                  dataKey="id"
                >
                </SelectButton>
              </div>

              <div class="filter-accordion-column justify-content-end">
                <FadeInTransition>
                  <CancelButton
                    v-if="v$.filters.$anyDirty"
                    style="height: 2.5rem"
                    @click="resetFilters"
                  >
                    {{ $t("Clear All") }}
                  </CancelButton>
                </FadeInTransition>
              </div>
            </div>
          </div>
        </div>
      </AccordionTab>
    </Accordion>
    <EasyDataTable
      v-model:[vModelWorkaround]="selectedItems"
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="tableData"
      @click-row="onRowClick"
      :loading="loading"
      :body-row-class-name="getRowClassName"
      body-text-direction="center"
      header-text-direction="center"
      v-bind="extraOptions"
      alternating
    >
      <template
        #[getColumnItemName(LOIApplicationsHeaders.BatchNo)]="{ batch_no }"
      >
        <div class="batch_number-wrapper">
          <span class="icon-envelopico me-1"
            ><span class="path1"></span><span class="path2"></span
            ><span class="path3"></span><span class="path4"></span
            ><span class="path5"></span
          ></span>
          {{ checkNonPrimitiveValue(batch_no) }}
        </div>
      </template>
      <template #[getColumnItemName(LOIApplicationsHeaders.LOINo)]="{ loi_no }">
        <div class="loi_number-wrapper">
          <span v-if="loi_no" class="icon-certificateIico me-1"
            ><span class="path1"></span><span class="path2"></span
            ><span class="path3"></span><span class="path4"></span
            ><span class="path5"></span><span class="path6"></span
            ><span class="path7"></span><span class="path8"></span
            ><span class="path9"></span
          ></span>
          {{ checkNonPrimitiveValue(loi_no) }}
        </div>
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.SubmissionDate)]="{
          submission_date,
        }"
      >
        {{ checkNonPrimitiveValue(submission_date) }}
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.BOCMFD)]="{ mfd_date }"
      >
        {{ checkNonPrimitiveValue(mfd_date) }}
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.BOCHQDate)]="{ hq_date }"
      >
        {{ checkNonPrimitiveValue(hq_date) }}
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.MOODate)]="{ boc_moo_date }"
      >
        {{ checkNonPrimitiveValue(boc_moo_date) }}
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.MOIPaymentDate)]="{
          moi_payment_letter_date,
        }"
      >
        {{ checkNonPrimitiveValue(moi_payment_letter_date) }}
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.LOIIssueDate)]="{
          loi_issue_date,
        }"
      >
        {{ checkNonPrimitiveValue(loi_issue_date) }}
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.NationCategory)]="{
          nation_category,
        }"
      >
        <div class="nation_category-wrapper">
          {{
            getNationCategoryById(checkNonPrimitiveValue(nation_category))
              ?.value
          }}
        </div>
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.Type)]="{ loi_type }"
      >
        <div class="loi_type-wrapper">
          {{ getLOITypeById(loi_type)?.value }}
        </div>
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.LOIIssued)]="{
          loi_issue_date,
        }"
      >
        <div class="d-flex justify-content-center align-items-center">
          <span
            class="fw-normal"
            v-tooltip.top="loi_issue_date ? $t('Issued') : $t('Not Issued')"
            :class="{
              'text-success': loi_issue_date,
              'text-danger': !loi_issue_date,
            }"
          >
            <Fa v-if="loi_issue_date" :icon="faCheck" />
            <Fa v-else :icon="faXmark" />
          </span>
        </div>
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.Priority)]="{
          priority,
          close_date,
        }"
      >
        <div class="d-flex justify-content-center align-items-center">
          <span
            v-if="!close_date"
            class="fw-normal"
            :class="{
              'text-danger': priority === LOIPriority.High,
              'normal-priority': priority === LOIPriority.Normal,
              'text-success': priority === LOIPriority.Low,
            }"
          >
            {{ getLOIPriorityById(priority)?.value }}
          </span>

          <span v-else class="fw-normal normal-priority">
            {{ getLOIPriorityById(priority)?.value }}
          </span>
        </div>
      </template>
      <template
        #[getColumnItemName(LOIApplicationsHeaders.Status)]="{ close_date }"
      >
        <div class="d-flex justify-content-center align-items-center">
          <span
            class="fw-normal"
            :class="{
              'badge bg-success': !close_date,
              'closed-status': close_date,
            }"
          >
            {{ close_date ? "Closed" : "Open" }}
          </span>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
<style scoped>
.badge {
  font-size: 1.25rem;
}

.normal-priority {
  color: #444;
}

.high-priority {
  background-color: #ff0000;
}

.closed-status {
  color: #444;
}
</style>
