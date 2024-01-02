<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Layout containing all auth routes

***********************************
-->
<script setup>
import { storeToRefs } from "pinia";
import { useConfigStore, useSettingsStore, useUserStore } from "@/stores";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { onMounted } from "vue";

import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
import { Routes } from "@/data";
import { authGuard } from "@/router";

const { loading } = storeToRefs(useConfigStore());
const { hasToken } = storeToRefs(useUserStore());

onBeforeRouteUpdate(authGuard);
</script>

<template>
  <div
    class="d-flex flex-column justify-content-start align-items-stretch app-container"
  >
    <LoadingOverlay :loading="loading" />
    <div
      class="router-view-container d-flex flex-row justify-content-start align-items-stretch flex-grow-1 auth-bg"
    >
      <div
        class="d-flex flex-row justify-content-start align-items-stretch flex-grow-1"
      >
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
