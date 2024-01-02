<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Import PAXes to LOI request

***********************************
-->
<script setup>
import PaxTable from "@/components/common/PaxTable.vue";
import { PAXHeaders, PaxTableRouteFilterEnum } from "@/data";
import { useLOIStore, usePLMSStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ref, reactive, computed, onMounted, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { expiryDisabledDates, formatDate } from "@/helpers";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const props = defineProps({
  initialNationCategory: {
    type: [Number, String],
    default: 0,
  },
  batchNo: {
    type: [Number, String],
    default: () => null,
  },
});

const emit = defineEmits(["import"]);

const { nationCategories } = storeToRefs(useLOIStore());
const { status } = storeToRefs(usePLMSStore());

const initialNation = nationCategories.value.find(
  (element) => +element.id == +props.initialNationCategory
);

const state = reactive({
  filters: {
    nation_category: [
      initialNation
        ? initialNation.filterId
        : nationCategories.value[0].filterId,
    ],
    visa_expiry: [],
    status: [],
    batch_no: props.batchNo,
    route: PaxTableRouteFilterEnum.LoiRequest,
  },
});

const rules = computed(() => ({
  filters: {
    nation_category: {},
    status: {},
    visa_expiry: {},
  },
}));

const v$ = useVuelidate(rules, state);

const paxTableRef = ref(null);
const paxTableHeaders = ref([
  PAXHeaders.PAX,
  PAXHeaders.PassportNo,
  PAXHeaders.FullName,
  PAXHeaders.Nationality,
  PAXHeaders.Department,
  PAXHeaders.Employer,
  PAXHeaders.PAXType,
  PAXHeaders.VisaExpiry,
]);
const computedFilters = computed(() => {
  const { visa_expiry, ...filters } = v$.value.filters.$model;
  return {
    ...filters,
    nation_category: state.filters.nation_category.join(","),
    status: state.filters.status.join(","),
    ...(visa_expiry?.length
      ? {
          visa_expiry_start: formatDate(visa_expiry[0]),
          visa_expiry_end: formatDate(visa_expiry[1]),
        }
      : {}),
  };
});

function nationCategoryFilter(evt, status) {
  if (evt.target.checked) v$.value.filters.nation_category.$model.push(status);
  else {
    v$.value.filters.nation_category.$model =
      state.filters.nation_category.filter((x) => x !== status);
  }

  v$.value.filters.nation_category.$touch();
}

function statusFilter(evt, status) {
  if (evt.target.checked) v$.value.filters.status.$model.push(status);
  else {
    v$.value.filters.status.$model = state.filters.status.filter(
      (x) => x !== status
    );
  }

  v$.value.filters.status.$touch();
}

watch(computedFilters.value, (newValue) => {
  paxTableRef.value.triggerServerRefresh();
});

function onImport() {
  emit("import", paxTableRef.value.selectedItems);
}
</script>
<template>
  <div class="paxFilter">
    <div class="filters-page-container">
      <div class="filters-side-container Sidebar" style="gap: 2rem">
        <h5>
          <img src="@/assets/img/filter.svg" />
          Filters
        </h5>
        <div class="filterList">
          <label>Nation Category:</label>
          <div class="list">
            <div
              class="d-flex flex-column justify-content-center align-items-stretch"
              style="gap: 1rem"
            >
              <div
                class="d-flex flex-row justify-content-start align-items-center"
                v-for="category of nationCategories"
                :key="category.id"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  :checked="
                    v$.filters.nation_category.$model.includes(
                      category.filterId
                    )
                  "
                  :value="category.filterId"
                  @click="nationCategoryFilter($event, category.filterId)"
                />
                <label class="form-check-label" for="foreigners1">
                  {{ category.value }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="filterList">
          <label>Expiry:</label>
          <div class="list">
            <div class="date">
              <label class="form-check-label" for="visa">
                Visa Expired before
              </label>
              <CustomDatepicker
                v-model:value="v$.filters.visa_expiry.$model"
                type="date"
                range
                placeholder="Select date range"
                :disabled-date="expiryDisabledDates"
              />
            </div>
          </div>
        </div>

        <div class="filterList">
          <label>Status</label>
          <div class="list">
            <div
              class="d-flex flex-column justify-content-center align-items-stretch"
              style="gap: 1rem"
            >
              <div
                class="d-flex flex-row justify-content-start align-items-center"
                v-for="option in status"
                :key="option.id"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="v$.filters.status.$model.includes(option.id)"
                  :value="option.id"
                  @click="statusFilter($event, option.id)"
                />
                <label class="form-check-label" for="foreigners1">
                  {{ option.value }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filters-page-content ApplicantList">
        <div class="loimaincontent">
          <PaxTable
            ref="paxTableRef"
            :included-headers="paxTableHeaders"
            :extra-server-filters="computedFilters"
            enable-multi-selection
            :enable-export="false"
            latest-visa
            latest-passport
          >
            <template #header-actions>
              <button
                type="button"
                class="btn btn-blue import"
                :disabled="!paxTableRef?.selectedItems?.length"
                @click="onImport"
              >
                <span class="icon-downloadIcon"></span>
                Import
              </button>
            </template>
          </PaxTable>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.paxFilter {
  .Sidebar {
    flex-basis: 20%;
    background: var(--bg-color);
    padding: 1.5rem 2.5rem;
    h5 {
      font-size: 1.4rem;
      img {
        margin-inline-end: 0.5rem;
      }
    }
    .list {
      margin-block-start: 0.5rem;
    }
    .date {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      gap: 0.5rem;

      margin-block-end: 1.5rem;
      .form-check {
        margin-block-end: 0.5rem;
      }
    }
  }
  .ApplicantList {
    padding: 1.5rem 2.5rem;
  }
}

th .form-check {
  padding-block-end: 0;
}

.import span::before {
  color: #fff;
}
.import span {
  display: inline-block;
  margin-inline-end: 5px;
}
</style>
