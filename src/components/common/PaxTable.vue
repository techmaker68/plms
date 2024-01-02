<!--
***********************************
@author Mohanned Hassan
@create_date 1st June 2023

View PAXes

***********************************
-->
<script setup>
import { ref, reactive, computed } from "vue";
import { useConfigStore, usePLMSStore } from "@/stores";

import { PAXHeaders, PaxStatusEnum, StatusEnum } from "@/data";
import { useTable, useTableProps } from "@/composables";
import { toRefs, watchDebounced } from "@vueuse/core";
import { filter, isEmpty } from "lodash-es";
import {
  generateExcelFile,
  resetObject,
  convertFilterObject,
  checkValidValue,
  countryToNationalityLabel,
  translateObject,
} from "@/helpers";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { storeToRefs } from "pinia";
import ExportButton from "./ExportButton.vue";
import SearchField from "./SearchField.vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import SelectButton from "primevue/selectbutton";
import ToggleButton from "primevue/togglebutton";
import CancelButton from "./CancelButton.vue";
import useVuelidate from "@vuelidate/core";
import FadeInTransition from "./FadeInTransition.vue";

const props = defineProps({
  ...useTableProps,
  enableExport: {
    type: Boolean,
    default: true,
  },
  latestLoi: {
    type: Boolean,
    default: false,
  },
  latestPassport: {
    type: Boolean,
    default: false,
  },
  latestVisa: {
    type: Boolean,
    default: false,
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
const emit = defineEmits(["rowClick", "clearSearch"]);

const defaultHeaders = ref([
  { text: "PAX ID", value: PAXHeaders.PAX, sortable: true, width: 90 },
  { text: "Full Name", value: PAXHeaders.FullName, sortable: true },
  { text: "PAX Type", value: PAXHeaders.PAXType },
  { text: "Badge No", value: PAXHeaders.BadgeNo },
  { text: "Nationality", value: PAXHeaders.Nationality },
  { text: "Position", value: PAXHeaders.Position },
  { text: "Department", value: PAXHeaders.Department },
  { text: "Employer", value: PAXHeaders.Employer },
  { text: "Passport", value: PAXHeaders.Passport },
  { text: "Passport", value: PAXHeaders.PassportNo },
  { text: "Visa", value: PAXHeaders.Visa },
  { text: "Email", value: PAXHeaders.Email },
  { text: "LOI Expiry", value: PAXHeaders.LOIExpiry },
  { text: "Visa Expiry", value: PAXHeaders.VisaExpiry, width: 90 },
  { text: "Documents", value: PAXHeaders.Docs },
  { text: "", value: PAXHeaders.Actions },
]);
const showClearSearch = ref(false);

const {
  extraServerFilters,
  rowsPerPage,
  latestLoi,
  latestPassport,
  latestVisa,
  enableAccordion,
  initialFilters,
  enableLegend,
} = toRefs(props);

const state = reactive({
  filters: {
    nationality: [],
    position: "",
    department_id: [],
    company_id: [],
    status: [],
    type: "",
    pax_without_passport: false,
    pax_without_visa: false,
    pax_without_badge: false,
    ...initialFilters.value,
  },
});

const rules = computed(() => ({
  filters: {
    nationality: {},
    position: {},
    department_id: {},
    company_id: {},
    status: {},
    type: {},
    pax_without_passport: {},
    pax_without_visa: {},
    pax_without_badge: {},
  },
}));

const v$ = useVuelidate(rules, state);

const { departments, sortedNationalities, companies } = storeToRefs(
  useConfigStore()
);
const {
  status: paxStatus,
  status_counts,
  personal_types_counts,
} = storeToRefs(usePLMSStore());
const { getPaxes } = usePLMSStore();

const apiCall = (pagination, search, excel_export = null) =>
  getPaxes(pagination, {
    search,
    latest_loi: latestLoi.value,
    latest_passport: latestPassport.value,
    latest_visa: latestVisa.value,
    all: excel_export,
    ...convertFilterObject(state.filters),
    ...extraServerFilters?.value,
  });

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
  try {
    const response = await apiCall({}, undefined, true);
    const filteredList = response.data.map((item) => {
      return {
        "Pax id": item.pax_id,
        "Full name": item.eng_full_name,
        "Pax type": item.type,
        "Badge no": item.badge_no,
        Position: item.position,
        Department: item.department?.name,
        Employer: item.company?.name,
        Phone: item.phone,
        Email: item.email,
        Gender: item.gender,
        Status: item.status === PaxStatusEnum.Onboard ? "onboard" : "offboard",
      };
    });
    generateExcelFile(filteredList, "Paxes list");
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
              v-model="v$.filters.nationality.$model"
              multiple
              :options="sortedNationalities"
              optionValue="ID"
              :optionLabel="countryToNationalityLabel"
              :placeholder="$t('Countries')"
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
              class="form-control form-control--xl filter-control"
              v-model="v$.filters.position.$model"
              :placeholder="$t('Position')"
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
                  :options="paxStatus"
                  optionValue="id"
                  dataKey="id"
                >
                  <template #option="{ option }">
                    <div class="select-button-template">
                      <span>{{ translateObject(option, "value") }}</span>
                      <span
                        >({{
                          status_counts?.[option.value.toLowerCase()]
                        }})</span
                      >
                    </div>
                  </template>
                </SelectButton>
              </div>

              <div
                class="filter-accordion-column"
                v-if="personal_types_counts?.length"
              >
                <label v-t="'PAX Type'"></label>
                <SelectButton
                  v-model="v$.filters.type.$model"
                  multiple
                  :options="personal_types_counts"
                  option-label="type"
                  optionValue="type"
                  dataKey="type"
                >
                  <template #option="{ option }">
                    <div class="select-button-template">
                      <span>{{ option.type }}</span>
                      <span>({{ option.count }})</span>
                    </div>
                  </template>
                </SelectButton>
              </div>

              <div class="filter-accordion-column">
                <label v-t="'Extra Options'"></label>
                <div class="legend-row">
                  <ToggleButton
                    class="toggle-button-normal"
                    v-model="v$.filters.pax_without_passport.$model"
                    :on-label="$t('No passports')"
                    :off-label="$t('No passports')"
                  />
                  <ToggleButton
                    class="toggle-button-normal"
                    v-model="v$.filters.pax_without_visa.$model"
                    :on-label="$t('No visas')"
                    :off-label="$t('No visas')"
                  />
                  <ToggleButton
                    class="toggle-button-normal"
                    v-model="v$.filters.pax_without_badge.$model"
                    :on-label="$t('No badges')"
                    :off-label="$t('No badges')"
                  />
                </div>
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
        <label v-t="'Docs'"></label>
        <div class="filter-accordion-row" style="gap: 2rem">
          <div class="legend-row">
            <span class="icon-userIcon"></span>
            <span class="has-photo" v-t="'Photo'"></span>
          </div>

          <div class="legend-row">
            <img src="@/assets/img/passport.png" />
            <span class="has-passport-valid" v-t="'Passport attached'"></span>
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
      :alternating="true"
      :loading="loading"
      body-item-class-name="pax-table-body-row"
      @click-row="emit('rowClick', $event)"
      v-bind="extraOptions"
    >
      <template #empty-message>
        <span v-t="'No data found'"></span>
      </template>
      <template #[getColumnItemName(PAXHeaders.PAX)]="item">
        <div>
          <span
            v-if="item?.image"
            class="icon-userIcon"
            style="margin-inline-end: 8px"
          ></span>
          {{ item?.pax_id }}
        </div>
      </template>

      <template #[getColumnItemName(PAXHeaders.Employer)]="{ company }">
        {{ company?.name }}
      </template>

      <template #[getColumnItemName(PAXHeaders.Email)]="{ email }">
        <div>
          {{ email }}
        </div>
      </template>

      <template #[getColumnItemName(PAXHeaders.VisaExpiry)]="{ latest_visa }">
        <div>
          {{ checkValidValue(latest_visa?.date_of_expiry) }}
        </div>
      </template>
      <template
        #[getColumnItemName(PAXHeaders.PassportNo)]="{ latest_passport }"
      >
        <div>
          {{ checkValidValue(latest_passport?.passport_no) }}
        </div>
      </template>

      <template #[getColumnItemName(PAXHeaders.Nationality)]="{ nationality }">
        <div>
          {{ checkValidValue(nationality?.country_name_short_en) }}
        </div>
      </template>

      <template #[getColumnItemName(PAXHeaders.Passport)]="{ passport_exist }">
        <div class="text-center">
          <!-- Can't use dynamic images with @/assets -->
          <img v-if="passport_exist" src="@/assets/img/passport.png" />
        </div>
      </template>

      <template #[getColumnItemName(PAXHeaders.Visa)]="{ visa_exist }">
        <!-- Can't use dynamic images with @/assets -->
        <!-- {{visa_data}} -->
        <div class="text-center">
          <img v-if="visa_exist" src="@/assets/img/visa.png" />
        </div>
      </template>

      <template
        #[getColumnItemName(PAXHeaders.Docs)]="{ visa_exist, passport_exist }"
      >
        <!-- Can't use dynamic images with @/assets -->
        <!-- {{visa_data}} -->
        <div
          class="d-flex flex-row justify-content-center align-items-center"
          style="gap: 1rem"
        >
          <img v-if="passport_exist" src="@/assets/img/passport.png" />
          <img v-if="visa_exist" src="@/assets/img/visa.png" />
        </div>
      </template>

      <template #[getColumnItemName(PAXHeaders.Department)]="{ department }">
        {{ department?.name }}
      </template>

      <template #[getColumnItemName(PAXHeaders.Actions)]="item">
        <slot name="column-actions" :item="item"></slot>
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
