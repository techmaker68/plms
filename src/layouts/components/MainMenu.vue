<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Renders side menu, containing main modules child routes
Uses router store to get module details

***********************************
-->
<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouterStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import { translateObject } from "@/helpers";

const { getActiveModule } = storeToRefs(useRouterStore());
const route = useRoute();
const router = useRouter();

function redirectPage({ name }) {
  router.push({
    name,
  });
}

function isExtraRoute(extraRoutes = []) {
  return extraRoutes.length ? extraRoutes.includes(route.name) : false;
}
</script>

<template>
  <div id="sidebarMenu" class="d-md-block sidebar" v-if="getActiveModule">
    <div
      class="h-100 d-flex flex-column flex-shrink-0 justify-content-between align-items-stretch sidebar__menublock overflow-auto custom-scrollbar"
    >
      <ul class="list-unstyled ps-0 mb-auto">
        <template
          v-for="(item, index) in getActiveModule.children"
          :key="index"
        >
          <li class="sidemenu-listitem" v-if="item.visibility">
            <RouterLink
              :to="{ name: item.name }"
              :class="{
                active: isExtraRoute(item?.extraRoutes),
              }"
            >
              <span :class="item.menuClass"></span>
              <span>{{ translateObject(item, "label") }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>

      <div class="p-4 d-flex justify-content-center align-items-center">
        <img
          src="@/assets/img/itForce.svg"
          class="sidebarFooterLogo"
          alt="It Force Logo"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  width: 100%;
}

.sidebarFooterLogo {
  width: 5rem;
}

.sidebar__menublock {
  width: 10rem;

  ul ul {
    padding-inline-start: 0 !important;
  }
}

.active {
  pointer-events: none;
}
</style>
