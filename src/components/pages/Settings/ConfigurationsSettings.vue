<!--
***********************************
@author Mohanned Hassan
@create_date 29th Nov 2023

***********************************
-->
<script setup>
import BloodApplicationConfig from "@/components/pages/BloodTest/components/BloodApplicationConfig.vue";
import LOIDepartmentManagers from "./components/LOIDepartmentManagers.vue";
import LOIFocalPoints from "./components/LOIFocalPoints.vue";
import LOIPresentationsConfig from "./components/LOIPresentationsConfig.vue";
import LOISettings from "./components/LOISettings.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
</script>

<template>
  <div class="wrapper">
    <main>
      <div
        class="page-header d-flex justify-content-between align-items-center"
      >
        <BreadCrumbs />
      </div>

      <div
        class="d-flex flex-column justify-content-start align-items-stretch bg-white p-3"
        style="gap: 2rem"
      >
        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <h3 class="fs-3 text-primary">
            <span v-t="'Blood Notifications Settings'"></span>
          </h3>
          <BloodApplicationConfig
            as-component
            :show-test="false"
          ></BloodApplicationConfig>
        </div>

        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <h3 class="fs-3 text-primary"><span v-t="'LOI Settings'"></span></h3>
          <LOISettings></LOISettings>
        </div>
        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <LOIPresentationsConfig></LOIPresentationsConfig>
        </div>

        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <h3 class="fs-3 text-primary">
            <span v-t="'LOI Department Managers'"></span>
          </h3>
          <LOIDepartmentManagers />
        </div>

        <div
          class="d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 1rem"
        >
          <h3 class="fs-3 text-primary">
            <span v-t="'LOI Focal Points'"></span>
          </h3>
          <LOIFocalPoints />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
::v-deep(.inner-form) {
  flex-direction: row;
  > div {
    flex-grow: 1;
  }
}
</style>
