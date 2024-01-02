<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Closed Test records page

***********************************
-->
<script setup>
import { computed, ref } from "vue";
import { useModal } from "@kouts/vue-modal";

import BloodApplicationsList from "./components/BloodApplicationsList.vue";
import { BloodApplicantsHeaders } from "@/data";
import BloodApplicationForm from "./components/BloodApplicationForm.vue";
import { generateUIDs } from "@/helpers";
import GenericModal from "@/components/common/GenericModal.vue";
import { useBloodStore } from "@/stores";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

const selectedApplicantId = ref(null);
const selectedBatch = ref(null);

const includedHeaders = ref([
  BloodApplicantsHeaders.PassportNo,
  BloodApplicantsHeaders.FullName,
  BloodApplicantsHeaders.Nationality,
  BloodApplicantsHeaders.Company,
  BloodApplicantsHeaders.BatchNo,
  BloodApplicantsHeaders.BatchSubmissionDate,
  BloodApplicantsHeaders.LastHivDate,
  BloodApplicantsHeaders.NextHivDate,
  BloodApplicantsHeaders.LastHbsDate,
  BloodApplicantsHeaders.NextHbsDate,
]);

const [applicationFormModal] = generateUIDs(5);

const { show, hide } = useModal();

function clearRefs() {
  selectedApplicantId.value = null;
  selectedBatch.value = null;
}

function hideBloodTestForm() {
  hide(applicationFormModal);
}

async function showBloodTestModal({ id, batch_no, test_date }) {
  selectedApplicantId.value = id;
  selectedBatch.value = {
    batch_no,
    test_date,
  };

  show(applicationFormModal);
}
</script>

<template>
  <VueModal
    :name="applicationFormModal"
    @after-leave="clearRefs"
    wrapperClass="vm-lg vm-body-no-padding"
  >
    <GenericModal
      :title="$t('BLOOD TEST INFORMATION')"
      @close="hideBloodTestForm"
    >
      <BloodApplicationForm
        view-only
        :batch="selectedBatch"
        :applicant-id="selectedApplicantId"
      />
    </GenericModal>
  </VueModal>

  <div class="wrapper">
    <main class="page-container">
      <div
        class="page-header d-flex justify-content-between align-items-center"
      >
        <BreadCrumbs />
      </div>

      <div class="tab-content" id="myTabContent">
        <BloodApplicationsList
          enable-search
          :included-headers="includedHeaders"
          @row-click="showBloodTestModal"
        />
      </div>
    </main>
  </div>
</template>
