<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood tests container
Renders table and details page as a route
Handles changing batches

***********************************
-->
<script setup>
import { ref } from "vue";
import BloodTestSubmissionAside from "./components/BloodTestSubmissionAside.vue";
import { Routes } from "@/data";
import { useRouter } from "vue-router";

const router = useRouter();
const submissionAside = ref(null);

function onBatchChange({ batch_no: id } = {}) {
  if (id) {
    router.push({
      name: Routes.BloodTestSubmission,
      params: {
        id,
      },
    });
  } else {
    router.push({
      name: Routes.BloodTest,
    });
  }
}

async function refreshBatches(refresh = false, force = false) {
  await submissionAside.value?.triggerServerRefresh(refresh);
  submissionAside.value?.selectFirstBatch(force);
}
</script>

<template>
  <div class="wrapper justify-content-start align-items-stretch">
    <BloodTestSubmissionAside
      ref="submissionAside"
      @batch-change="onBatchChange"
    />

    <main
      class="page-container d-flex flex-column justify-content-start align-items-stretch"
    >
      <router-view
        @batch-update="refreshBatches"
        @batch-delete="refreshBatches(true, true)"
      />
    </main>
  </div>
</template>

<style scoped>
main {
  gap: 2rem;
}
</style>
