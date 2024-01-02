<!--
***********************************
@author Mohanned Hassan
@create_date 1st June 2023

View PAXes

***********************************
-->
<script setup>
import { ref, watch, reactive, computed } from "vue";
import { useConfigStore, useVisaStore } from "@/stores";

import { VisaHeaders, StatusEnum, VisaStatusRiskEnum } from "@/data";
import { useTable, useTableProps } from "@/composables";
import { toRefs, watchDebounced } from "@vueuse/core";
import { filter, isEmpty } from "lodash-es";
import {
  resetObject,
  convertFilterObject,
  translateObject,
  expiryDisabledDates,
  formatDate,
} from "@/helpers";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { storeToRefs } from "pinia";
import ExportButton from "@/components/common/ExportButton.vue";
import SearchField from "@/components/common/SearchField.vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import SelectButton from "primevue/selectbutton";
import ToggleButton from "primevue/togglebutton";
import CancelButton from "@/components/common/CancelButton.vue";
import useVuelidate from "@vuelidate/core";
import FadeInTransition from "@/components/common/FadeInTransition.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const props = defineProps({
  ...useTableProps,
  enableExport: {
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
});
const emit = defineEmits(["rowClick"]);

const defaultHeaders = ref([
  { text: "Pax Id", value: VisaHeaders.PAX, sortable: true, width: 80 },
  { text: "Full Name", value: VisaHeaders.FullName },
  { text: "Type", value: VisaHeaders.Type },
  { text: "Passport No", value: VisaHeaders.PassportNo, sortable: true },
  { text: "Employer", value: VisaHeaders.Employer },
  { text: "Department", value: VisaHeaders.Department },
  { text: "Date of Issue", value: VisaHeaders.DateOfIssue },
  { text: "Date of Expiry", value: VisaHeaders.DateOfExpiry },
  { text: "Expire in Days", value: VisaHeaders.ExpireInDays },
  { text: "Status", value: VisaHeaders.Status, width: 110 },
  // {text: "Action", value: VisaHeaders.Actions},
]);
const showClearSearch = ref(false);

const { extraServerFilters, rowsPerPage, enableAccordion, enableLegend } =
  toRefs(props);

const state = reactive({
  filters: {
    passport_no: [],
    type: [],
    department_id: [],
    company_id: [],
    status: [],
    date_range: [],
    no_visa_image: false,
  },
});

const rules = computed(() => ({
  filters: {
    passport_no: {},
    type: {},
    department_id: {},
    company_id: {},
    status: {},
    no_visa_image: {},
    date_range: {},
  },
}));

const v$ = useVuelidate(rules, state);

const dateFilter = computed(() =>
  state.filters.date_range.length
    ? {
        date_of_expiry_start: formatDate(state.filters.date_range[0]),
        date_of_expiry_end: formatDate(state.filters.date_range[1]),
      }
    : {}
);

const { departments, companies, passportStatus } = storeToRefs(
  useConfigStore()
);
const { getVisaList, getCountByStatusId, visaType } = useVisaStore();

const apiCall = (pagination, search, excel_export = null) => {
  const { date_range, ...filters } = state.filters;

  return getVisaList(pagination, {
    search,
    all: excel_export,
    ...extraServerFilters.value,
    ...convertFilterObject(filters),
    ...dateFilter.value,
  });
};

const clearSearch = () => {
  searchValue.value = "";
  showClearSearch.value = false;
  triggerServerRefresh(true);
};

const searchData = () => {
  if (!isEmpty(searchValue.value)) {
    triggerServerRefresh(true);
    showClearSearch.value = true;
  }
};

const {
  selectedItems,
  getColumnItemName,
  getColumnHeaderName,
  extraOptions,
  vModelWorkaround,
  headers,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  triggerServerRefresh,
  searchValue,
} = useTable(defaultHeaders, props, apiCall, {
  sortBy: "",
  sortType: "",
  rowsPerPage: rowsPerPage.value,
});

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

async function exportExcel() {
  await apiCall({}, undefined, true);
}

function resetFilters() {
  state.filters = resetObject(state.filters);
  searchValue.value = "";
  showClearSearch.value = false;
  v$.value.filters.$reset();
}

defineExpose({
  selectedItems,
  triggerServerRefresh,
});
</script>

<template>
  <div
    class="d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 1rem"
  >
    <div
      class="d-flex flex-row justify-content-end align-items-center"
      style="gap: 0.5rem"
    >
      <!-- <div class="flex-grow-1">
        <slot name="header-description"></slot>
      </div> -->

      <div
        class="search-option flex-grow-1 d-flex flex-row justify-content-between align-items-stretch"
        style="gap: 0.5rem"
      >
        <div class="search-filter-md">
          <SearchField
            v-model="searchValue"
            :showClearSearch="showClearSearch"
            @submit="searchData"
            @cancel="clearSearch"
          />
        </div>

        <ExportButton
          v-if="enableExport"
          @confirm="exportExcel"
          class="btn btn-outline-primary btn-icon text-nowrap button-table-action"
        >
        </ExportButton>
      </div>
      <slot name="header-actions"></slot>
    </div>
    <Accordion v-if="enableAccordion">
      <AccordionTab :header="$t('Filters')">
        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <div class="filter-accordion-row">
            <BaseDropDown
              v-model="v$.filters.company_id.$model"
              multiple
              placeholder="Company"
              optionLabel="name"
              optionValue="id"
              :options="companies"
            />

            <BaseDropDown
              v-model="v$.filters.department_id.$model"
              multiple
              :options="departments"
              optionValue="id"
              optionLabel="name"
              :placeholder="$t('Department')"
            />

            <input
              type="text"
              class="form-control filter-control"
              v-model="v$.filters.passport_no.$model"
              :placeholder="$t('Passport Number')"
            />
          </div>

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
                  v-model="v$.filters.status.$model"
                  :options="passportStatus"
                  optionValue="id"
                  dataKey="id"
                >
                  <template #option="{ option }">
                    <div class="select-button-template">
                      <span
                        >{{ translateObject(option, "name") }}
                        <span v-if="option.id == StatusEnum.ToBeRenewedNew">
                          (&#8804; 30)
                        </span>
                        <span v-if="option.id == StatusEnum.ToBeRenewedOld">
                          (&#8804; 90)
                        </span>
                      </span>
                      <span>({{ getCountByStatusId(option.id) }})</span>
                    </div>
                  </template>
                </SelectButton>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Visa Type'"></label>
                <SelectButton
                  v-model="v$.filters.type.$model"
                  multiple
                  :options="visaType"
                  class="toggle-button-normal"
                >
                </SelectButton>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Extra Options'"></label>
                <div class="legend-row">
                  <ToggleButton
                    class="toggle-button-normal"
                    v-model="v$.filters.no_visa_image.$model"
                    :on-label="$t('Show visas with no images')"
                    :off-label="$t('Show visas with no images')"
                  />
                </div>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Expiry Range'"></label>
                <CustomDatepicker
                  v-model:value="v$.filters.date_range.$model"
                  type="date"
                  range
                  :disabled-date="expiryDisabledDates"
                  :placeholder="$t('Expiry Range')"
                />
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
    <div
      v-if="enableLegend"
      class="d-flex flex-row justify-content-end align-items-center"
    >
      <div class="filter-accordion-column">
        <label v-t="'Legend'"></label>
        <div class="filter-accordion-row" style="gap: 2rem">
          <div class="legend-row">
            <img src="@/assets/img/visa.png" />
            <span class="has-visa-valid" v-t="'Visa file attached'"></span>
          </div>

          <div class="legend-row">
            <img src="@/assets/img/no-visa.png" />
            <span
              class="has-visa-expired"
              v-t="'Visa file not attached'"
            ></span>
          </div>

          <div class="legend-row">
            <img src="@/assets/img/visa.png" />
            <span class="has-visa-valid" v-t="'Visa attached'"></span>
          </div>
        </div>
      </div>
    </div>
    <EasyDataTable
      v-model:[vModelWorkaround]="selectedItems"
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="serverItems"
      :loading="loading"
      body-row-class-name="cursor-pointer"
      @click-row="emit('rowClick', $event)"
      v-bind="extraOptions"
    >
      <template #[getColumnItemName(VisaHeaders.PAX)]="{ pax, visa_image }">
        <div>
          <img v-if="visa_image" src="@/assets/img/visa.png" />
          <img v-else src="@/assets/img/no-visa.png" />
          {{ pax?.pax_id }}
        </div>
      </template>
      <template #[getColumnItemName(VisaHeaders.FullName)]="{ pax }">
        {{ pax?.eng_full_name }}
      </template>
      <template #[getColumnItemName(VisaHeaders.Employer)]="{ pax }">
        {{ pax?.company?.name }}
      </template>
      <template #[getColumnItemName(VisaHeaders.Department)]="{ pax }">
        {{ pax?.department?.name }}
      </template>
      <template #[getColumnItemName(VisaHeaders.PassportNo)]="{ passport }">
        {{ passport?.passport_no }}
      </template>
      <template
        #[getColumnItemName(VisaHeaders.DateOfExpiry)]="{
          date_of_expiry,
          status_id,
        }"
      >
        <span
          :class="{
            'expired-visa-date':
              status_id == VisaStatusRiskEnum.Expired ||
              status_id == VisaStatusRiskEnum.Cancelled,
            'text-danger': status_id == VisaStatusRiskEnum.ToBeRenewedNew,
            'text-warning': status_id == VisaStatusRiskEnum.ToBeRenewedOld,
          }"
        >
          {{ date_of_expiry }}
        </span>
      </template>

      <template
        #[getColumnItemName(VisaHeaders.ExpireInDays)]="{
          expire_in_days,
          status_id,
          status,
        }"
      >
        <span
          :class="{
            'expired-visa-date': status_id == VisaStatusRiskEnum.Expired,
            'text-danger': status_id == VisaStatusRiskEnum.ToBeRenewedNew,
            'text-warning': status_id == VisaStatusRiskEnum.ToBeRenewedOld,
            'expired-visa-status-badge':
              status_id == VisaStatusRiskEnum.Cancelled,
          }"
        >
          {{
            status_id == VisaStatusRiskEnum.Cancelled
              ? status
              : status_id == VisaStatusRiskEnum.Expired
              ? `Expired ${Math.abs(expire_in_days)} Days ago`
              : expire_in_days
          }}
        </span>
      </template>

      <template #[getColumnHeaderName(VisaHeaders.Status)]>
        <div
          class="d-flex justify-content-center align-items-center flex-grow-1"
        >
          Status
        </div>
      </template>

      <template
        #[getColumnItemName(VisaHeaders.Status)]="{ status, status_id }"
      >
        <div class="d-flex justify-content-center align-items-center">
          <span
            :class="{
              'expired-visa-status-badge':
                status_id == VisaStatusRiskEnum.Expired ||
                status_id == VisaStatusRiskEnum.Cancelled,
              'text-danger': status_id == VisaStatusRiskEnum.ToBeRenewedNew,
              'text-warning': status_id == VisaStatusRiskEnum.ToBeRenewedOld,
            }"
          >
            {{ status }}
          </span>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<style scoped>
.icon-grey.icon-userIcon:before {
  color: #ccc !important;
}

:deep(.pax-table-body-row) {
  cursor: pointer;
}

.legend-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
}

.select-button-template {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
</style>
