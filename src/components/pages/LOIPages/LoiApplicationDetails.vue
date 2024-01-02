<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Closed LOI details

***********************************
-->
<script setup>
import { useTable } from "@/composables";
import {
  EnvironmentEnum,
  LOIApplicantsHeaders,
  PermissionsEnum,
  Routes,
} from "@/data";
import { appendDate } from "@/helpers";
import { useLOIStore, useUserStore } from "@/stores";
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
});

const {
  getLoiApplicationDetails,
  getLoiApplicants,
  getLOITypeById,
  getNationCategoryById,
  renewLoi,
} = useLOIStore();
const router = useRouter();
const { extraOptions, getColumnItemName } = useTable();
const { hasPermission } = useUserStore();

const baseURL = import.meta.env[EnvironmentEnum.StorageBaseURL];
const application = ref(null);
const applicantsList = ref([]);
const headersApplicant = ref([
  { text: "Full Name", value: LOIApplicantsHeaders.FullName },
  { text: "PAX ID", value: LOIApplicantsHeaders.PAX },
  { text: "Passport No.", value: LOIApplicantsHeaders.PassportNo },
  { text: "Nationality", value: LOIApplicantsHeaders.Nationality },
  { text: "Department", value: LOIApplicantsHeaders.Department },
  { text: "Employer", value: LOIApplicantsHeaders.Company },
  { text: "Type", value: LOIApplicantsHeaders.PaxType },
  { text: "Deposit Paid", value: LOIApplicantsHeaders.DepositAmount },
  // { text: "Visa Sticker", value: LOIApplicantsHeaders.VisaNo },
]);

const calculatedDate = computed(() => {
  return appendDate(application.value?.loi_issue_date, 3, "month");
});

const photoCopy = computed(() => {
  if (application.value?.loi_photo_copy != null) {
    return `${baseURL}/${application.value?.loi_photo_copy}`;
  } else {
    return "";
  }
});

const hasAddPermission = computed(() => {
  return hasPermission(PermissionsEnum.LOI_BATCH_ADD);
});

const invoiceCopy = computed(() => {
  if (application.value?.payment_copy != null) {
    return `${baseURL}/${application.value?.payment_copy}`;
  } else {
    return "";
  }
});

watchEffect(async () => {
  refreshApplicationDetails();
});

async function refreshApplicationDetails() {
  try {
    application.value = await getLoiApplicationDetails(props.id);
    const applicantsResponse = await getLoiApplicants(
      application.value?.batch_no,
      {
        all: true,
      }
    );
    applicantsList.value = applicantsResponse.data;
  } catch (error) {
    console.error(error);
  }
}

async function renew() {
  try {
    const { loi_application: { id } = {} } = await renewLoi(
      application.value?.batch_no
    );
    router.push({
      name: Routes.LOIRequest,
      params: {
        id,
      },
    });
  } catch (error) {
    console.log("Error", error);
  }
}
</script>

<template>
  <div class="page-header d-flex justify-content-start align-items-center">
    <h1 class="page-title"><span v-t="'LOI DETAILS'"></span></h1>
  </div>
  <div class="card mt-4">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center w-100 mb-3">
        <h3 class="popup-subtile"><span v-t="'LOI Batch Info'"></span></h3>
        <button
          class="btn btn-blue"
          @click="renew"
          v-if="!!application?.close_date && hasAddPermission"
        >
          <span v-t="'Renew this LOI'"></span>
        </button>
      </div>
      <ul v-if="application" class="label-value ps-0 mb-0 d-flex">
        <li>
          <label v-t="'LOI No'"></label>
          <strong>{{ application?.loi_no }}</strong>
        </li>
        <li>
          <label v-t="'Request Date'"></label>
          <strong>{{ application?.submission_date }}</strong>
        </li>
        <li>
          <label v-t="'Batch No'"></label>
          <strong>{{ application?.batch_no }}</strong>
        </li>
        <li>
          <label v-t="'Issue Date'"></label>
          <strong>{{ application?.loi_issue_date }}</strong>
        </li>
        <li>
          <label v-t="'LOI Type'"></label>
          <strong>{{ getLOITypeById(application?.loi_type)?.value }}</strong>
        </li>
        <li>
          <label v-t="'Close Date'"></label>
          <strong>{{ application?.close_date }}</strong>
        </li>
        <li>
          <label v-t="'Nation Category'"></label>
          <strong>{{
            getNationCategoryById(application?.nation_category)?.value
          }}</strong>
        </li>
        <li>
          <label v-t="'Visa Sticker Before'"></label>
          <strong>{{ calculatedDate }}</strong>
        </li>
      </ul>
    </div>
  </div>
  <div class="card mt-4">
    <div class="card-body">
      <div class="mb-3">
        <h3 class="popup-subtile"><span v-t="'NAME LIST'"></span></h3>
      </div>
      <div class="table-responsive">
        <EasyDataTable
          :headers="headersApplicant"
          :items="applicantsList"
          v-bind="extraOptions"
        >
          <template #[getColumnItemName(LOIApplicantsHeaders.PAX)]="{ pax }">
            {{ pax?.pax_id }}
          </template>

          <template
            #[getColumnItemName(LOIApplicantsHeaders.FullName)]="{ pax }"
          >
            {{ pax?.eng_full_name }}
          </template>

          <template
            #[getColumnItemName(LOIApplicantsHeaders.Company)]="{ pax }"
          >
            {{ pax?.company?.name }}
          </template>

          <template
            #[getColumnItemName(LOIApplicantsHeaders.PassportNo)]="{ pax }"
          >
            {{ pax?.latest_passport?.passport_no }}
          </template>

          <template
            #[getColumnItemName(LOIApplicantsHeaders.Nationality)]="{ pax }"
          >
            {{ pax?.nationality?.country_name_short_en }}
          </template>

          <template
            #[getColumnItemName(LOIApplicantsHeaders.Department)]="{ pax }"
          >
            {{ pax?.department?.name }}
          </template>
          <template
            #[getColumnItemName(LOIApplicantsHeaders.PaxType)]="{ pax }"
          >
            {{ pax?.type }}
          </template>
          <template #[getColumnItemName(LOIApplicantsHeaders.VisaNo)]="{ pax }">
            {{ pax?.department?.name }}
          </template>
        </EasyDataTable>
      </div>
    </div>
  </div>
  <div class="card mt-4">
    <div class="card-body">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="loiphotocopy-tab"
            data-bs-toggle="tab"
            data-bs-target="#loiphotocopy-tab-pane"
            type="button"
            role="tab"
            aria-controls="loiphotocopy-tab-pane"
            aria-selected="false"
          >
            <span v-t="'LOI Photo Copy'"></span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="paymentInvoice-tab"
            data-bs-toggle="tab"
            data-bs-target="#paymentInvoice-tab-pane"
            type="button"
            role="tab"
            aria-controls="paymentInvoice-tab-pane"
            aria-selected="true"
          >
            <span v-t="'Payment Invoice'"></span>
          </button>
        </li>
      </ul>
      <div class="tab-content">
        <div
          class="tab-pane fade show active pt-0"
          id="loiphotocopy-tab-pane"
          role="tabpanel"
          aria-labelledby="loiphotocopy-tab"
          tabindex="0"
        >
          <div class="mt-4 d-flex justify-document">
            <div class="pdfDocView">
              <iframe :src="photoCopy" width="500px" height="800px"></iframe>
            </div>
          </div>
        </div>
        <div
          class="tab-pane fade pt-0"
          id="paymentInvoice-tab-pane"
          role="tabpanel"
          aria-labelledby="paymentInvoice-tab"
          tabindex="0"
        >
          <div class="mt-4 d-flex justify-document">
            <div class="pdfDocView">
              <iframe :src="invoiceCopy" width="500px" height="800px"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.label-value {
  display: flex;
  flex-wrap: wrap;
}

.label-value li {
  width: 47%;
}

.label-value li label {
  width: 40%;
}
.icon-searchIcon::before {
  color: #fff;
}
</style>
