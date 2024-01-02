<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood applicants table

***********************************
-->
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useModal } from "@kouts/vue-modal";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useTable, useTableProps } from "@/composables";
import { generateUIDs, resolveLabelFromId } from "@/helpers";
import { TestStatus, BloodApplicantsHeaders } from "@/data";
import { useBloodStore } from "@/stores";
import { storeToRefs } from "pinia";
import FadeInTransition from "@/components/common/FadeInTransition.vue";
import SearchField from "@/components/common/SearchField.vue";

const props = defineProps({
  ...useTableProps,
  enableSearch: {
    type: Boolean,
    required: false,
    default: false,
  },
  enableRemove: {
    type: Boolean,
    required: false,
    default: false,
  },
  enableFilters: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const defaultHeaders = ref([
  {
    text: "Name in Passport",
    value: BloodApplicantsHeaders.FullName,
    width: 200,
  },
  { text: "Company", value: BloodApplicantsHeaders.Company },
  { text: "Badge No.", value: BloodApplicantsHeaders.BadgeNo },
  { text: "PAX ID", value: BloodApplicantsHeaders.PAX },
  { text: "Passport No.", value: BloodApplicantsHeaders.PassportNo },
  { text: "Nationality", value: BloodApplicantsHeaders.Nationality },
  { text: "Arrival", value: BloodApplicantsHeaders.Arrival },
  { text: "Departure", value: BloodApplicantsHeaders.Departure },
  {
    text: "Passport Submit",
    value: BloodApplicantsHeaders.PassportSubmitDate,
  },
  { text: "Appoint Time", value: BloodApplicantsHeaders.AppointTime },
  { text: "Attendance", value: BloodApplicantsHeaders.Attendance },
  { text: "Passport Return", value: BloodApplicantsHeaders.PassportReturnDate },
  { text: "Batch No.", value: BloodApplicantsHeaders.BatchNo },
  {
    text: "Submission Date",
    value: BloodApplicantsHeaders.BatchSubmissionDate,
  },
  { text: "Last HIV Test Date", value: BloodApplicantsHeaders.LastHivDate },
  { text: "Next HIV Appt Date", value: BloodApplicantsHeaders.NextHivDate },
  { text: "Last HBS Test Date", value: BloodApplicantsHeaders.LastHbsDate },
  { text: "Next HBS Appt Date", value: BloodApplicantsHeaders.NextHbsDate },
  { text: "", value: BloodApplicantsHeaders.Actions },
]);
const { show, hide } = useModal();
const { getBloodApplicants } = useBloodStore();

const apiCall = !props?.staticData
  ? (pagination, search) =>
      getBloodApplicants(pagination, {
        ...props.extraServerFilters,
        search,
      })
  : null;

const {
  selectedItems,
  defaultMultiSelectionOptions,
  extraOptions,
  searchValue,
  headers,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  getColumnItemName,
  vModelWorkaround,
  triggerServerRefresh,
} = useTable(defaultHeaders, props, apiCall);

const confirmModal = generateUIDs();

const easyDataTableRef = ref(null);
const showClearSearch = ref(false);

const emit = defineEmits({
  rowClick: null,
  rowCheck: null,
  deleteApplicants: null,
  updateMultipleApplicants: null,
});

const staticData = computed(() => props.staticData);

const tableData = computed(() => {
  if (staticData?.value) {
    return staticData.value;
  } else {
    return serverItems.value;
  }
});

const customServerItemsLength = computed(
  () => serverItemsLength.value || tableData.value.length
);

watch(staticData, () => {
  easyDataTableRef.value.currentPaginationNumber = 1;
});

function showRemoveModal() {
  if (selectedItems.value.length) {
    show(confirmModal);
  }
}

function confirmRemoveApplicants() {
  hide(confirmModal);
  emit("deleteApplicants", selectedItems.value);
  selectedItems.value = [];
}

function emitMultipleUpdate() {
  emit(
    "updateMultipleApplicants",
    selectedItems.value.map((element) => element.id)
  );
  selectedItems.value = [];
}

const clearSearch = () => {
  searchValue.value = "";
  triggerServerRefresh(true);
  showClearSearch.value = false;
};
const searchData = () => {
  if (searchValue.value) {
    triggerServerRefresh(true);
    showClearSearch.value = true;
  }
};

defineExpose({
  selectedItems,
});
</script>

<template>
  <VueModal :name="confirmModal">
    <ConfirmModal
      @close="hide(confirmModal)"
      @confirm="confirmRemoveApplicants"
      :title="$t('Remove selected items?')"
      :message="$t('Are you sure you want to proceed?')"
    />
  </VueModal>

  <div class="d-flex flex-column justify-content-start align-items-stretch">
    <div class="d-flex flex-row justify-content-start align-items-center">
      <div class="header-description-container">
        <slot name="header-description"></slot>
      </div>

      <div
        class="search-option flex-grow-1 d-flex flex-row justify-content-start align-items-center"
        style="gap: 1rem"
      >
        <div class="search-filter-container" v-if="props.enableSearch">
          <SearchField
            v-model="searchValue"
            :showClearSearch="showClearSearch"
            @submit="searchData"
            @cancel="clearSearch"
          />
        </div>

        <div class="table-actions-container flex-grow-1">
          <slot name="header-actions"></slot>

          <FadeInTransition>
            <div
              class="d-flex flex-row justify-content-start align-items-center align-self-stretch"
              style="gap: 1rem"
              v-if="selectedItems.length"
            >
              <!-- <button
            class="btn btn-outline-primary text-primary"
            @click="emitMultipleUpdate"
          >
            Update Multiple
          </button> -->

              <slot name="header-multiple-actions"></slot>
            </div>
          </FadeInTransition>
          <button
            class="btn btn-outline-primary text-primary btn-icon"
            v-if="props.enableRemove"
            @click="showRemoveModal"
          >
            <span class="icon-deleteIcon"></span>
            <span v-t="'Remove Selected from list'"></span>
          </button>
        </div>
      </div>
    </div>

    <EasyDataTable
      v-model:[vModelWorkaround]="selectedItems"
      v-model:server-options="serverOptions"
      :server-items-length="customServerItemsLength"
      :headers="headers"
      :items="tableData"
      :loading="loading"
      body-row-class-name="cursor-pointer"
      alternating
      @click-row="emit('rowClick', $event)"
      v-bind="{ ...defaultMultiSelectionOptions, ...extraOptions }"
      ref="easyDataTableRef"
    >
      <template #empty-message> <span v-t="'No data found'"></span></template>

      <template
        #[getColumnItemName(BloodApplicantsHeaders.BatchNo)]="{ batch_no }"
      >
        <template v-if="batch_no">
          <div
            class="d-flex flex-row justify-content-start align-items-center"
            style="gap: 1rem"
          >
            <span class="icon-envelopico me-1"
              ><span class="path1"></span><span class="path2"></span
              ><span class="path3"></span><span class="path4"></span
              ><span class="path5"></span
            ></span>
            <span>{{ batch_no }}</span>
          </div>
        </template>
      </template>

      <template
        #[getColumnItemName(BloodApplicantsHeaders.PassportSubmitDate)]="{
          passport_submit_date,
        }"
      >
        <template v-if="passport_submit_date">
          <div>
            <span class="passport-icon">
              <span class="icon-passportico big"
                ><span class="path1"></span><span class="path2"></span
                ><span class="path3"></span><span class="path4"></span
                ><span class="path5"></span><span class="path6"></span
              ></span>
            </span>
            <span>{{ passport_submit_date }}</span>
          </div>
        </template>
      </template>

      <template
        #[getColumnItemName(BloodApplicantsHeaders.Attendance)]="{ attendance }"
      >
        {{ resolveLabelFromId(TestStatus, attendance) }}
      </template>

      <template #[getColumnItemName(BloodApplicantsHeaders.FullName)]="{ pax }">
        {{ pax?.eng_full_name }}
      </template>

      <template #[getColumnItemName(BloodApplicantsHeaders.BadgeNo)]="{ pax }">
        {{ pax?.badge_no }}
      </template>

      <template #[getColumnItemName(BloodApplicantsHeaders.PAX)]="{ pax }">
        {{ pax?.pax_id }}
      </template>

      <template
        #[getColumnItemName(BloodApplicantsHeaders.PassportNo)]="{ pax }"
      >
        {{ pax?.latest_passport?.passport_no }}
      </template>

      <template #[getColumnItemName(BloodApplicantsHeaders.Company)]="{ pax }">
        {{ pax?.company?.name }}
      </template>
      <template
        #[getColumnItemName(BloodApplicantsHeaders.Nationality)]="{ pax }"
      >
        {{ pax?.nationality?.country_name_short_en }}
      </template>
    </EasyDataTable>
  </div>
</template>

<style scoped lang="scss">
.table td {
  font-weight: 500;
}

.btn.text-primary {
  font-size: 1.2rem;
}
</style>
