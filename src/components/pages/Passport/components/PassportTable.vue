<!--
***********************************
@author Mohanned Hassan
@create_date 1st June 2023

View PAXes

***********************************
-->
<script setup>
import { ref, computed, reactive } from "vue";
import { useConfigStore, usePassportStore } from "@/stores";

import { PassportHeaders, StatusEnum } from "@/data";
import { useTable, useTableProps } from "@/composables";
import { toRefs, watchDebounced } from "@vueuse/core";
import { isEmpty } from "lodash-es";
import {
  resetObject,
  convertFilterObject,
  translateObject,
  expiryDisabledDates,
  generateExcelFile,
  checkValidValue,
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
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["rowClick"]);

const defaultHeaders = ref([
  { text: "Pax ID", value: PassportHeaders.PAX, sortable: true, width: 80 },
  {
    text: "Name as in passport",
    value: PassportHeaders.FullName,
    sortable: true,
  },
  { text: "Type", value: PassportHeaders.Type },
  { text: "Passport No", value: PassportHeaders.PassportNo, sortable: true },
  { text: "Country", value: PassportHeaders.PassportCountry, sortable: true },
  { text: "Birthday", value: PassportHeaders.Birthday, sortable: true },
  { text: "Employer", value: PassportHeaders.Employer },
  { text: "Department", value: PassportHeaders.Department },
  { text: "Date of Issue", value: PassportHeaders.DateOfIssue },
  { text: "Date of Expiry", value: PassportHeaders.DateOfExpiry },
  { text: "Expire in Days", value: PassportHeaders.ExpireInDays },
  { text: "Status", value: PassportHeaders.Status, width: 110 },
]);
const showClearSearch = ref(false);

const {
  extraServerFilters,
  rowsPerPage,
  enableAccordion,
  enableLegend,
  initialFilters,
} = toRefs(props);

const state = reactive({
  filters: {
    passport_no: [],
    type: [],
    department_id: [],
    company_id: [],
    status: [],
    passport_country: [],
    date_range: [],
    no_passport_image: false,
    ...initialFilters.value,
  },
});

const rules = computed(() => ({
  filters: {
    passport_no: {},
    type: {},
    department_id: {},
    company_id: {},
    status: {},
    passport_country: {},
    date_range: {},
    no_passport_image: {},
  },
}));

const dateFilter = computed(() =>
  state.filters.date_range.length
    ? {
        date_of_expiry_start: formatDate(state.filters.date_range[0]),
        date_of_expiry_end: formatDate(state.filters.date_range[1]),
      }
    : {}
);

const v$ = useVuelidate(rules, state);

const {
  countries,
  departments,
  companies,
  passportStatus,
  passportTypes,
  getPassportTypeById,
} = storeToRefs(useConfigStore());

const { getCountByStatusId } = storeToRefs(usePassportStore());
const { getPassportList } = usePassportStore();

const passportStatusWithoutCancelled = passportStatus.value.filter(
  (element) => element.id != StatusEnum.Cancelled
);

const apiCall = (pagination, search, excel_export = null) => {
  const { date_range, ...filters } = state.filters;

  return getPassportList(pagination, {
    search,
    all: excel_export,
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
  const response = await apiCall({}, undefined, true);
  const filteredList = response.data.map((item) => {
    return {
      "Pax id": item.pax?.pax_id,
      "Full name as in passport": item.full_name,
      Type: getPassportTypeById.value(item.type)?.name,
      "Passport no": item.passport_no,
      Country: item.passport_country?.country_name_short_en,
      Birthday: item.birthday,
      Department: item?.pax?.department?.name,
      Employer: item?.pax?.company?.name,
      "Date of issue": item.date_of_issue,
      "Date of expiry":
        item.status_id == StatusEnum.Expired
          ? `Expired ${Math.abs(item.expire_in_days)} Days ago`
          : item.expire_in_days,
      "Expire in days": item.expire_in_days,
      Status: item.status,
    };
  });
  generateExcelFile(filteredList, "Passport list");
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
              v-model="v$.filters.passport_country.$model"
              multiple
              placeholder="Country"
              optionLabel="EngName"
              optionValue="ID"
              :options="countries"
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
                  :options="passportStatusWithoutCancelled"
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
                <label v-t="'Passport Type'"></label>
                <SelectButton
                  v-model="v$.filters.type.$model"
                  multiple
                  :options="passportTypes"
                  class="toggle-button-normal"
                  optionValue="id"
                  optionLabel="name"
                  dataKey="id"
                >
                </SelectButton>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Extra Options'"></label>
                <div class="legend-row">
                  <ToggleButton
                    class="toggle-button-normal"
                    v-model="v$.filters.no_passport_image.$model"
                    :on-label="$t('Show passports with no images')"
                    :off-label="$t('Show passports with no images')"
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
            <img src="@/assets/img/passport.png" />
            <span
              class="has-passport-valid"
              v-t="'Passport file attached'"
            ></span>
          </div>

          <div class="legend-row">
            <img src="@/assets/img/no-passport.png" />
            <span
              class="has-passport-expired"
              v-t="'Passport file not attached'"
            ></span>
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
      <template
        #[getColumnItemName(PassportHeaders.PAX)]="{ pax, passport_image }"
      >
        <div>
          <img v-if="passport_image" src="@/assets/img/passport.png" />
          <img v-else src="@/assets/img/no-passport.png" />
          {{ checkValidValue(pax?.pax_id) }}
        </div>
      </template>
      <template
        #[getColumnItemName(PassportHeaders.PassportCountry)]="{
          passport_country,
        }"
      >
        {{ passport_country?.country_name_short_en }}
      </template>
      <template #[getColumnItemName(PassportHeaders.Employer)]="{ pax }">
        {{ pax?.company?.name }}
      </template>
      <template #[getColumnItemName(PassportHeaders.Department)]="{ pax }">
        {{ pax?.department?.name }}
      </template>
      <template
        #[getColumnItemName(PassportHeaders.DateOfExpiry)]="{
          date_of_expiry,
          status_id,
        }"
      >
        <span
          :class="{
            'expired-visa-date': status_id == StatusEnum.Expired,
            'text-danger': status_id == StatusEnum.ToBeRenewedNew,
            'text-warning': status_id == StatusEnum.ToBeRenewedOld,
          }"
        >
          {{ date_of_expiry }}
        </span>
      </template>

      <template
        #[getColumnItemName(PassportHeaders.ExpireInDays)]="{
          expire_in_days,
          status_id,
          status,
        }"
      >
        <span
          :class="{
            'expired-visa-date': status_id == StatusEnum.Expired,
            'text-danger': status_id == StatusEnum.ToBeRenewedNew,
            'text-warning': status_id == StatusEnum.ToBeRenewedOld,
            'expired-visa-status-badge': status_id == StatusEnum.Cancelled,
          }"
        >
          {{
            status_id == StatusEnum.Cancelled
              ? status
              : status_id == StatusEnum.Expired
              ? `Expired ${Math.abs(expire_in_days)} Days ago`
              : expire_in_days
          }}
        </span>
      </template>

      <template #[getColumnHeaderName(PassportHeaders.Status)]>
        <div
          class="d-flex justify-content-center align-items-center flex-grow-1"
        >
          Status
        </div>
      </template>

      <template
        #[getColumnItemName(PassportHeaders.Status)]="{ status, status_id }"
      >
        <div class="d-flex justify-content-center align-items-center">
          <span
            :class="{
              'expired-visa-status-badge':
                status_id == StatusEnum.Expired ||
                status_id == StatusEnum.Cancelled,
              'text-danger': status_id == StatusEnum.ToBeRenewedNew,
              'text-warning': status_id == StatusEnum.ToBeRenewedOld,
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
