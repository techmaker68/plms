<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Renders header routes
Header routes adjust side menu
Controls language change, and user profile options

***********************************
-->
<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Routes, LanguagesEnum } from "@/data";
import { useUserStore, useRouterStore, useConfigStore } from "@/stores";
import { useRouter } from "vue-router";
import { useModal } from "@kouts/vue-modal";

import EnglishFlag from "@/assets/img/english.svg";
import ArabicFlag from "@/assets/img/arabic.svg";

import { generateUIDs, translateObject } from "@/helpers";
import Menu from "primevue/menu";
import GenericModal from "@/components/common/GenericModal.vue";
import RegisterForm from "@/components/common/RegisterForm.vue";

const { locale } = storeToRefs(useConfigStore());
const { getActiveModule, permissionFilteredRoutes } = storeToRefs(
  useRouterStore()
);
const { fullName, avatar, user } = storeToRefs(useUserStore());
const { logout, getCurrentUser } = useUserStore();
const { show, hide } = useModal();
const [profileModal] = generateUIDs(1);

const routesEnum = ref(Routes);
const langaugeMenu = ref();
const languageItems = ref([
  {
    label: "English",
    image: EnglishFlag,
    language: LanguagesEnum.English,
  },
  {
    separator: true,
    style: "margin: 0px",
  },
  {
    label: "العربية",
    image: ArabicFlag,
    language: LanguagesEnum.Arabic,
  },
]);
const currentLanguage = computed(() => {
  return languageItems.value.find(
    (element) => element.language == locale.value
  );
});
const router = useRouter();

function redirectModule({ name, children }) {
  /* We find first visible child and navigate to that
  Otherwise we fallback to the module itself */
  const firstVisibleChild = children.find((child) => child.visibility);
  router.push({
    name: firstVisibleChild ? firstVisibleChild.name : name,
  });
}

function switchLanguage(language) {
  if (locale.value != language) {
    locale.value = language;
  }
}

function toggleLanguage(event) {
  langaugeMenu.value.toggle(event);
}

function onUpdateProfile() {
  getCurrentUser();
  hideUpdateProfileModal();
}

function showUpdateProfileModal() {
  show(profileModal);
}

function hideUpdateProfileModal() {
  hide(profileModal);
}
</script>

<template>
  <nav class="navbar navbar-expand-sm">
    <div class="container-fluid">
      <router-link
        :to="{ name: routesEnum.DashboardModule }"
        custom
        v-slot="{ navigate }"
      >
        <div
          @click="navigate"
          role="link"
          class="navbar-brand d-flex align-items-center cursor-pointer mt-3"
        >
          <a class="">
            <img
              class="navbar-brand__logo"
              alt="PLMS:Home"
              src="@/assets/img/Majnoon.svg"
            />
          </a>
        </div>

        <div
          @click="navigate"
          role="link"
          class="navbar-brand d-flex align-items-center cursor-pointer mt-3"
        >
          <a class="">
            <img
              class="navbar-brand__logo"
              alt="PLMS:Home"
              src="@/assets/img/headerLogo.png"
            />
          </a>
          <h6 class="ms-3 mb-0" v-t="'People Logistics'"></h6>
        </div>
      </router-link>
      <ul class="list-unstyled navbar__emailList">
        <li class="navbar__emailList__listItems cursor-pointer">
          <button
            type="button"
            class="btn text-white d-flex justify-content-center align-items-center"
            @click="toggleLanguage"
          >
            <img
              :src="currentLanguage.image"
              class="img-fluid d-inline me-2"
              style="height: 10px"
            />
            <span class="text-white">{{ currentLanguage.label }}</span>
          </button>

          <Menu
            ref="langaugeMenu"
            id="language-menu"
            :model="languageItems"
            :popup="true"
          >
            <template #item="{ item }">
              <button
                type="button"
                class="btn d-flex justify-content-center align-items-center"
                @click="switchLanguage(item.language)"
              >
                <img
                  :src="item.image"
                  class="img-fluid d-inline me-2"
                  style="height: 10px"
                />
                <span>{{ item.label }}</span>
              </button>
            </template></Menu
          >
        </li>
        <li class="profile dropdown">
          <a
            class="nav-link"
            id="navbarDropdownUser"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span style="color: #ffffff; margin-inline-end: 10px">{{
              fullName
            }}</span>
            <div class="avatar">
              <img
                class="rounded-circle"
                src="@/assets/img/profile_logo.png"
                alt=""
              />
            </div>
            <span class="icon-arrowDownIcon text-white"></span>
          </a>
          <div
            class="dropdown-menu dropdown-caret dropdown-menu-end py-0"
            aria-labelledby="navbarDropdownUser"
          >
            <router-link
              :to="{ name: routesEnum.DashboardModule }"
              class="dropdown-item"
            >
              <span class="icon icon-admin"></span>
              <span v-t="'Dashboard'"></span>
            </router-link>
            <a
              class="dropdown-item"
              role="button"
              @click="showUpdateProfileModal"
            >
              <span class="icon icon-person"></span>
              <span v-t="'Personal Info'"></span>
            </a>
            <a class="dropdown-item" role="button" @click="logout">
              <span class="icon icon-logout"></span>
              <span v-t="'Logout'"></span>
            </a>
          </div>
        </li>
      </ul>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mynavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    <ul class="list-unstyled navbar__emailList">
      <template v-for="(item, index) in permissionFilteredRoutes" :key="index">
        <li v-if="item.visibility" class="navbar-list-item d-inline">
          <button
            type="button"
            class="btn btn-blue add-profile"
            :class="{ active: getActiveModule?.name == item?.name }"
            @click="redirectModule(item)"
          >
            <span :class="item.headerClass"> </span>
            {{ translateObject(item, "label") }}
          </button>
        </li>
      </template>
    </ul>
  </nav>

  <VueModal :name="profileModal" wrapperClass="vm-md">
    <GenericModal :title="$t('Personal Info')" @close="hideUpdateProfileModal">
      <RegisterForm personal-user :user="user" @submit="onUpdateProfile" />
    </GenericModal>
  </VueModal>
</template>

<style scoped lang="scss">
.progress {
  position: absolute;
  left: 0px;
  bottom: -4px;
}

.progress,
.progress-bar {
  height: 4px;
  width: 100%;
}

.navbar-list-item {
  margin-inline-end: 0.5rem;
}

.icon-person:before {
  color: gray;
}
</style>
