<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Edit/Delete/View blood batch details

***********************************
-->
<script setup>
import { ref, watch, computed, watchEffect } from "vue";
import { useModal } from "@kouts/vue-modal";

import GenericModal from "@/components/common/GenericModal.vue";
import BloodApplicationCreateBatch from "./components/BloodApplicationCreateBatch.vue";
import BloodApplicationConfig from "./components/BloodApplicationConfig.vue";
import BloodApplicationsList from "./components/BloodApplicationsList.vue";
import BloodLetter from "./components/BloodLetter.vue";
import BloodCollectPassport from "./components/BloodCollectPassport.vue";
import BloodApplicationForm from "./components/BloodApplicationForm.vue";
import ManualPassportNotification from "./components/ManualPassportNotification.vue";
import { generateUIDs } from "@/helpers";
import {
  useBloodStore,
  useConfigStore,
  useLOIStore,
  useUserStore,
} from "@/stores";
import {
  BloodApplicantsHeaders,
  ExcelTypeEnum,
  PenaltyTypeEnum,
  PermissionsEnum,
  SortApplicantsTypeEnum,
} from "@/data";
import BloodTimeTable from "./components/BloodTimeTable.vue";
import { storeToRefs } from "pinia";
import NoteModal from "./components/NoteModal.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useI18n } from "vue-i18n";
import ImportConfirmModal from "@/components/common/ImportConfirmModal.vue";
import SearchField from "@/components/common/SearchField.vue";
import BloodKPIModal from "./components/BloodKPIModal.vue";

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
});
const emit = defineEmits(["batchUpdate", "batchDelete"]);

const { show, hide } = useModal();
const {
  getBloodApplicants,
  removeBloodApplicants,
  deleteBloodBatch,
  rescheduleApplicants,
  emailApplicants,
  renewApplicantAppointment,
  addApplicantPenalty,
  sendBloodApplicantsReport,
  generatePenaltyExcel,
} = useBloodStore();
const { sortApplicants } = useLOIStore();
const { t } = useI18n();
const { hasPermission } = useUserStore();
const { generateExcel } = useConfigStore();

const includedHeaders = ref([
  BloodApplicantsHeaders.FullName,
  BloodApplicantsHeaders.Company,
  BloodApplicantsHeaders.BadgeNo,
  BloodApplicantsHeaders.PAX,
  BloodApplicantsHeaders.PassportNo,
  BloodApplicantsHeaders.Nationality,
  BloodApplicantsHeaders.Arrival,
  BloodApplicantsHeaders.Departure,
  BloodApplicantsHeaders.PassportSubmitDate,
  BloodApplicantsHeaders.AppointTime,
  BloodApplicantsHeaders.Attendance,
  BloodApplicantsHeaders.PassportReturnDate,
]);
const applicantsList = ref([]);
const submission_information = ref(null);
const selectedApplicantDetails = ref(null);
const selectedApplicantID = ref(null);
const selectedApplicantsIds = ref([]);
const selectedPaxID = ref(null);
const importModal = ref(false);

const hasEditPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_EDIT)
);

const hasDeletePermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_DELETE)
);

const hasApplicantAddPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_APPLICANT_ADD)
);

const hasApplicantDeletePermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_APPLICANT_DELETE)
);

const hasApplicantEditPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_APPLICANT_EDIT)
);
const applicantsListRef = ref(null);
const searchValue = ref("");
const showClearSearch = ref(false);

const bloodFormTitle = computed(() => {
  return selectedApplicantID.value ||
    selectedApplicantsIds.value.length ||
    selectedPaxID.value
    ? t("BLOOD TEST INFORMATION")
    : t("ADD ONE-TIME BLOOD TEST");
});

const [
  collectPassportModal,
  applicationFormModal,
  manualPassportNotificationModal,
  editBatchModal,
  deleteBatchModal,
  optionsModal,
  notesModal,
  kpiModal,
] = generateUIDs(8);

watch(
  () => props.id,
  () => {
    clearSearch();
    refreshBloodBatch();
  },
  { immediate: true }
);

async function refreshBloodBatch(refreshList = false) {
  if (refreshList) {
    emit("batchUpdate");
  }

  const applicantsResponse = await getBloodApplicants(null, {
    batch_no: props.id,
    search: searchValue.value,
    all: true,
  });
  applicantsList.value = applicantsResponse.data;
  submission_information.value =
    applicantsResponse?.meta?.submission_information;
}

function handleCollectPassportApply(plms_profile) {
  hide(collectPassportModal);
  showBloodTestForm(null, plms_profile);
}

async function showBloodTestForm(applicant, { id } = {}) {
  if (hasApplicantEditPermission.value) {
    selectedApplicantID.value = applicant?.id;
    selectedPaxID.value = id;

    show(applicationFormModal);
  }
}

function showMultipleBloodTestForm(applicantsIds) {
  if (hasApplicantEditPermission.value) {
    selectedApplicantsIds.value = applicantsIds;
    show(applicationFormModal);
  }
}

function hideBloodTestForm() {
  hide(applicationFormModal);
}

function onSubmitBloodTestForm() {
  hideBloodTestForm();
  refreshBloodBatch(true);
}

function hideEditBatchModal() {
  hide(editBatchModal);
}

function showEditBatchModal() {
  show(editBatchModal);
}

function hideDeleteBatchModal() {
  hide(deleteBatchModal);
}

function showDeleteBatchModal() {
  show(deleteBatchModal);
}

function hideOptionsModal() {
  hide(optionsModal);
}

function showOptionsModal() {
  show(optionsModal);
}

function hideNotesModal() {
  hide(notesModal);
}

function showNotesModal() {
  show(notesModal);
}

function hideKPIModal() {
  hide(kpiModal);
}

function showKPIModal() {
  show(kpiModal);
}

function showImportModal() {
  importModal.value = true;
}

async function onSubmittedEditBatch() {
  hide(editBatchModal);
  refreshBloodBatch(true);
}

function resetSelectedValues() {
  selectedApplicantDetails.value = null;
  selectedApplicantID.value = null;
  selectedPax.value = null;
  selectedApplicantsIds.value = [];
}

async function deleteApplicants(applicants) {
  try {
    await removeBloodApplicants(
      applicants.map((element) => element.id).join(",")
    );
    refreshBloodBatch(true);
  } catch (error) {
    console.log("Error", error);
  }
}

function updateTable() {
  refreshBloodBatch(true);
}

async function deleteBatch() {
  try {
    await deleteBloodBatch(submission_information.value.id);
    hideDeleteBatchModal();
    emit("batchDelete");
  } catch (error) {
    console.log("Error deleting batch", error);
  }
}

async function scheduleApplicants({ id }) {
  try {
    await rescheduleApplicants(id);
    refreshBloodBatch();
  } catch (error) {
    console.log("Error", error);
  }
}

async function sendApplicantsEmail() {
  try {
    await emailApplicants(props.id);
    hideNotesModal();
  } catch (error) {
    console.log("Error", error);
  }
}

async function sortBloodApplicants(applicantsIDs) {
  try {
    await sortApplicants(SortApplicantsTypeEnum.BloodApplicants, applicantsIDs);
    refreshBloodBatch();
  } catch (error) {
    console.log("Error sorting applicants", error);
  }
}

async function generateKPIReport($event) {
  try {
    await generateExcel(ExcelTypeEnum.KPI, $event);
    hideKPIModal();
  } catch (error) {
    console.log("Error", error);
  }
}

async function emailNoteToApplicants($event) {
  try {
    const ids = applicantsListRef.value.selectedItems.map(
      (element) => element.id
    );
    await sendBloodApplicantsReport({
      ...$event,
      ids,
    });

    hideNotesModal();
  } catch (error) {
    console.log("Error sorting applicants", error);
  }
}

async function renewAppointment($event) {
  try {
    const { applicantID, ...form } = $event;
    await renewApplicantAppointment(applicantID, {
      batch_no: props.id,
      ...form,
    });

    refreshBloodBatch();
  } catch (error) {
    console.log("Error", error);
  }
}

async function addPenalty($event) {
  try {
    const { applicantID, ...form } = $event;
    await addApplicantPenalty(applicantID, {
      batch_no: props.id,
      ...form,
    });

    refreshBloodBatch();
  } catch (error) {
    console.log("Error", error);
  }
}

async function generatePenalty() {
  try {
    await generateExcel(ExcelTypeEnum.BloodPenalty, {
      batch_no: props.id,
    });
  } catch (error) {
    console.log("Error", error);
  }
}

function searchData() {
  if (searchValue.value) {
    refreshBloodBatch();
    showClearSearch.value = true;
  }
}

function clearSearch(refresh = false) {
  searchValue.value = "";
  if (refresh) {
    refreshBloodBatch();
  }
  showClearSearch.value = false;
}
</script>

<template>
  <VueModal :name="editBatchModal" wrapperClass="vm-md">
    <BloodApplicationCreateBatch
      @submit="onSubmittedEditBatch"
      @close="hideEditBatchModal"
      :batch="submission_information"
    />
  </VueModal>

  <VueModal :name="collectPassportModal" wrapperClass="vm-lg">
    <GenericModal title="Search PAX" @close="hide(collectPassportModal)">
      <BloodCollectPassport
        :batch="submission_information"
        @apply="(event) => handleCollectPassportApply(event)"
      />
    </GenericModal>
  </VueModal>

  <VueModal
    :name="applicationFormModal"
    @closed="resetSelectedValues"
    :wrapperClass="[
      selectedApplicantsIds.length ? 'vm-md' : 'vm-xlg',
      'vm-body-no-padding',
    ]"
  >
    <GenericModal :title="bloodFormTitle" @close="hideBloodTestForm()">
      <BloodApplicationForm
        :batch="submission_information"
        :applicant-id="selectedApplicantID"
        :applicants-ids="selectedApplicantsIds"
        :pax-id="selectedPaxID"
        @submitted="onSubmitBloodTestForm()"
      />
    </GenericModal>
  </VueModal>

  <VueModal :name="manualPassportNotificationModal">
    <GenericModal
      :title="$t('Manually Send Passport Notification')"
      @close="hide(manualPassportNotificationModal)"
    >
      <ManualPassportNotification />
    </GenericModal>
  </VueModal>

  <VueModal :name="deleteBatchModal">
    <ConfirmModal
      @close="hideDeleteBatchModal"
      @confirm="deleteBatch"
      :title="$t('Delete Batch')"
      :message="$t('Are you sure you want to delete this batch?')"
    />
  </VueModal>

  <VueModal :name="optionsModal">
    <BloodApplicationConfig
      @close="hideOptionsModal"
      @submit="hideOptionsModal"
      :batch="submission_information"
    ></BloodApplicationConfig>
  </VueModal>

  <VueModal :name="notesModal" wrapperClass="vm-md">
    <NoteModal
      @submit="emailNoteToApplicants"
      @close="hideNotesModal"
    ></NoteModal>
  </VueModal>

  <VueModal :name="kpiModal" wrapperClass="vm-md">
    <BloodKPIModal @submit="generateKPIReport" @close="hideKPIModal" />
  </VueModal>

  <ImportConfirmModal
    v-model="importModal"
    :type="ExcelTypeEnum.BloodTestOneTime"
    :text="t('Import multiple one time passports')"
    :batch="submission_information?.batch_no"
    @upload-success="updateTable"
  ></ImportConfirmModal>

  <div class="page-header">
    <strong class="page-title"
      ><span v-t="'BLOOD TEST SUBMISSION DETAILS'"></span
    ></strong>
  </div>

  <div
    class="submission-info d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 2rem"
  >
    <div
      class="d-flex flex-row justify-content-between align-items-center sub-title"
    >
      <div
        class="font-weight-bold d-flex flex-row justify-content-between align-items-center"
      >
        <span class="icon-envelopico me-1"
          ><span class="path1"></span><span class="path2"></span
          ><span class="path3"></span><span class="path4"></span
          ><span class="path5"></span
        ></span>
        <span v-t="'Submission Information'"></span>
      </div>

      <div class="d-flex flex-row justify-content-end align-items-center">
        <button
          style="font-size: 18px"
          class="btn btn-link btn-icon p-0"
          type="button"
          @click="showOptionsModal"
          v-if="hasEditPermission"
        >
          <span class="icon-settings"></span>
        </button>

        <button
          class="btn btn-icon"
          v-if="hasDeletePermission"
          @click="showDeleteBatchModal"
        >
          <span class="icon-icon-delete larger-icon">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
            <span class="path6"></span>
            <span class="path7"></span>
            <span class="path8"></span
          ></span>
        </button>

        <button
          class="btn btn-link btn-icon fs-1 p-0"
          type="button"
          @click="showEditBatchModal"
          v-if="hasEditPermission"
        >
          <span class="icon-edit"></span>
        </button>
      </div>
    </div>

    <div class="d-flex flex-row justify-content-start align-items-stretch">
      <div
        class="d-flex flex-row justify-content-center align-items-start submission-info-details"
      >
        <div class="container">
          <div class="batch-info-row">
            <div class="batch-info-col">
              <label v-t="'Batch No:'"></label>
              <span>{{ submission_information?.batch_no }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'Test place:'"></label>
              <span>{{ submission_information?.venue }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'End Time:'"></label>
              <span>{{ submission_information?.end_time }}</span>
            </div>
          </div>

          <div class="batch-info-row">
            <div class="batch-info-col">
              <label v-t="'Submit Date:'"></label>
              <span>{{ submission_information?.submit_date }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'Test Date:'"></label>
              <span>{{ submission_information?.test_date }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'Return Date:'"></label>
              <span>{{ submission_information?.return_date }}</span>
            </div>
          </div>

          <div class="batch-info-row">
            <div class="batch-info-col">
              <label v-t="'Submitted:'"></label>
              <span class="colored-value">{{
                submission_information?.submitted
              }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'Tested:'"></label>
              <span class="colored-value">{{
                submission_information?.tested
              }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'Passport Returned:'"></label>
              <span class="colored-value">{{
                submission_information?.returned
              }}</span>
            </div>
          </div>

          <div class="batch-info-row">
            <div class="batch-info-col">
              <label v-t="'Start Time:'"></label>
              <span>{{ submission_information?.start_time }}</span>
            </div>

            <div class="batch-info-col">
              <label v-t="'Interval:'"></label>
              <span
                >{{ submission_information?.interval }} {{ t("Minutes") }}</span
              >
            </div>

            <div class="batch-info-col">
              <label v-t="'Applicants Interval:'"></label>
              <span class="colored-value">{{
                submission_information?.applicants_interval
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="new-applicants-container d-flex flex-row justify-content-center align-items-start mb-2"
        v-if="submission_information?.enabled && hasApplicantAddPermission"
      >
        <button
          class="btn btn-primary btn-icon btn-large"
          @click="show(collectPassportModal)"
        >
          <span v-t="'Input Passport'"></span>
        </button>
        <button
          class="btn btn-primary btn-icon btn-large"
          :title="$t('Manually Add Passport')"
          @click="showBloodTestForm"
        >
          <span v-t="'Add One-Time Passport'"></span>
        </button>
      </div>
    </div>

    <div class="table-actions-container">
      <button
        class="btn btn-blue"
        @click="showKPIModal"
        v-t="'Generate KPI Report'"
      ></button>

      <button
        class="btn btn-blue"
        @click="generatePenalty"
        v-t="'Penalties Report'"
      ></button>

      <div v-if="submission_information?.enabled && hasApplicantAddPermission">
        <button class="btn btn-blue btn-icon w-100" @click="showImportModal">
          {{ t("Import multiple one time passports") }}
        </button>
      </div>
    </div>
  </div>

  <div
    class="flex-grow-1 d-flex flex-column justify-content-start align-items-stretch"
  >
    <ul
      class="nav nav-tabs d-flex flex-row justify-content-start align-items-center flex-nowrap"
      id="myTab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="applicantList-tab"
          data-bs-toggle="tab"
          data-bs-target="#applicantList-tab-pane"
          type="button"
          role="tab"
          aria-controls="applicantList-tab-pane"
          aria-selected="false"
        >
          <span v-t="'Applicants List'"></span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="basraHealth-tab"
          data-bs-toggle="tab"
          data-bs-target="#basraHealth-tab-pane"
          type="button"
          role="tab"
          aria-controls="basraHealth-tab-pane"
          aria-selected="true"
        >
          <span v-t="'Letter to Basra Health'"></span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="stt-tab"
          data-bs-toggle="tab"
          data-bs-target="#stt-tab-pane"
          type="button"
          role="tab"
          aria-controls="stt-tab-pane"
          aria-selected="true"
        >
          <span v-t="'Schedule Time Table'"></span>
        </button>
      </li>

      <div
        class="d-flex justify-content-end align-items-stretch flex-grow-1 mb-2"
        style="gap: 0.5rem"
      >
        <div class="search-filter-container">
          <SearchField
            v-model="searchValue"
            :showClearSearch="showClearSearch"
            @submit="searchData"
            @cancel="clearSearch(true)"
          />
        </div>
      </div>
    </ul>

    <div class="tab-content flex-grow-1" id="myTabContent">
      <div
        class="tab-pane fade show active pt-0"
        id="applicantList-tab-pane"
        role="tabpanel"
        aria-labelledby="applicantList-tab"
        tabindex="0"
      >
        <div class="w-full" style="position: relative">
          <div
            style="
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            "
          >
            <BloodApplicationsList
              ref="applicantsListRef"
              :included-headers="includedHeaders"
              :static-data="applicantsList"
              :enable-remove="hasApplicantDeletePermission"
              :enable-multi-selection="hasApplicantDeletePermission"
              @row-click="(event) => showBloodTestForm(event)"
              @delete-applicants="(event) => deleteApplicants(event)"
              @update-multiple-applicants="showMultipleBloodTestForm"
            >
              <template #header-multiple-actions>
                <button
                  class="btn btn-outline-primary text-primary"
                  @click="showNotesModal"
                  v-t="'Notes/Comments/Report'"
                ></button>
              </template>
            </BloodApplicationsList>
          </div>
        </div>
      </div>

      <div
        class="tab-pane fade pt-0"
        id="basraHealth-tab-pane"
        role="tabpanel"
        aria-labelledby="basraHealth-tab"
        tabindex="1"
      >
        <BloodLetter
          @schedule="scheduleApplicants"
          @new-appointment="renewAppointment"
          @new-penalty="addPenalty"
          @row-click="(event) => showBloodTestForm(event)"
          :applicantsList="applicantsList"
          :batch="submission_information"
        />
      </div>

      <div
        class="tab-pane fade pt-0"
        id="stt-tab-pane"
        role="tabpanel"
        aria-labelledby="stt-tab"
        tabindex="2"
      >
        <BloodTimeTable
          @schedule="scheduleApplicants"
          @email-to-applicants="sendApplicantsEmail"
          @sequence-change="sortBloodApplicants"
          @row-click="(event) => showBloodTestForm(event)"
          :applicantsList="applicantsList"
          :batch="submission_information"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sub-title {
  font-weight: bold;
}

table thead .pl {
  padding-inline-start: 0;
}

.submission-info {
  position: relative;
}

.submission-info-details {
  flex: 1;
  justify-content: center;
  align-items: center;

  .container {
    width: fit-content;

    .batch-info-row {
      padding: 1rem 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex: 0 0 auto;
      flex-wrap: wrap;

      .batch-info-col {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 2rem;
        max-width: 25rem;

        label {
          min-width: 12rem;

          text-align: start;
          font-weight: 600;
        }

        span {
          min-width: 10rem;
          text-align: start;
          font-weight: bold;
          font-size: 105%;
          text-wrap: nowrap;
        }
      }
    }
  }
}
.colored-value {
  color: var(--light-success);
  font-weight: 600;
}

.new-applicants-container {
  flex-shrink: 1;
  gap: 1rem;

  .btn-large {
    height: 100px;
  }
}

.nav-link {
  font-weight: 600;
}

.nav-item,
.nav-link {
  height: 100%;
}
</style>
