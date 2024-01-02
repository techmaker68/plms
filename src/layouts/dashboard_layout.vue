<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Layout containing all dashboard routes
Calls a bunch of APIs onmount, to preload required values
Controls rtl document adjustments

***********************************
-->
<script setup>
import { storeToRefs } from "pinia";
import MainHeader from "./components/MainHeader.vue";
import MainMenu from "./components/MainMenu.vue";
import {
  useConfigStore,
  useRouterStore,
  useSettingsStore,
  useUserStore,
} from "@/stores";
import { onBeforeRouteUpdate } from "vue-router";
import { onMounted, watch } from "vue";
import { LanguagesEnum, Routes } from "@/data";
import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
import { useI18n } from "vue-i18n";
import { useTextDirection } from "@vueuse/core";
import { dashboardGuard } from "@/router";

const { loading, locale } = storeToRefs(useConfigStore());
const { permissions, user } = storeToRefs(useUserStore());
const { locale: i18nLocale } = useI18n();

const { getCompanies, getCountryList, getDepartments, getVenues } =
  useConfigStore();
const { getSettings } = useSettingsStore();
const { logout, getCurrentUser } = useUserStore();
const { getActiveModule } = storeToRefs(useRouterStore());

const dir = useTextDirection();

const htmlElement = document.documentElement;
const bodyElement = document.body;
const rtlBodyClass = "rtl-app-container";

watch(
  locale,
  (newValue) => {
    i18nLocale.value = newValue;

    switch (newValue) {
      case LanguagesEnum.English: {
        dir.value = "ltr";
        bodyElement.classList.remove(rtlBodyClass);
        break;
      }
      case LanguagesEnum.Arabic: {
        dir.value = "rtl";
        bodyElement.classList.add(rtlBodyClass);
        break;
      }
      default: {
        break;
      }
    }

    htmlElement.setAttribute("lang", newValue);
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  try {
    if (permissions.value.length) {
      let initialPromises = [
        getCompanies(),
        getCountryList(),
        getDepartments(),
        getSettings(),
        getVenues(),
        getCurrentUser(),
      ];

      Promise.all(initialPromises).catch((error) => {
        console.log("Error fetching configs", error);
        logout();
      });
    } else {
      logout();
    }
  } catch (error) {
    console.log("Error initial", error);
  }
});

onBeforeRouteUpdate(dashboardGuard);
</script>

<template>
  <div
    class="d-flex flex-column justify-content-start align-items-stretch app-container"
  >
    <LoadingOverlay :loading="loading" />

    <MainHeader />

    <div
      class="router-view-container d-flex flex-row justify-content-start align-items-stretch flex-grow-1"
    >
      <div
        v-if="getActiveModule?.children.length > 1"
        class="d-flex flex-row justify-content-start align-items-stretch side-menu-container"
      >
        <MainMenu />
      </div>

      <div
        class="d-flex flex-row justify-content-start align-items-stretch flex-grow-1 content-container"
      >
        <router-view v-slot="{ Component }">
          <keep-alive :include="Routes.DashboardPage">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$side-menu-width: 90px;

.side-menu-container {
  flex: 0 0 $side-menu-width;
}

.content-container {
  flex-grow: 1;
  overflow-x: auto;
}
</style>
