<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Show tiles summarizing PLMS

***********************************
-->
<template>
  <div class="wrapper useraccount">
    <main>
      <div class="container-dashboard dashboard-main">
        <h1 class="page-title" style="padding-inline-start: 7.5px">
          <span v-t="'Dashboard'"></span>
        </h1>
        <div class="row mb-4 g-4">
          <div class="col-lg-6 col-sm-12">
            <div class="container-fluid dashboard">
              <div
                class="page-header d-flex justify-content-between align-items-center my-4"
              >
                <h1 class="page-title">
                  <span class="iconclass icon-person me-2 text-white"></span>
                  {{ t("PAX") }}
                </h1>
              </div>
              <div class="row mb-4 g-4">
                <div class="col-lg-8 col-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Onboard')"
                      :value="paxStats?.onboard"
                      class="col-lg-6"
                      :icon-classes="['icon-landplane']"
                      @click="navigateToPax(null, [paxStatusEnum.Onboard])"
                    ></DashboardTile>

                    <DashboardTile
                      :title="$t('Offboard')"
                      :value="paxStats?.offboard"
                      class="col-lg-6"
                      :icon-classes="['icon-takeoffplane']"
                      @click="navigateToPax(null, [paxStatusEnum.Offboard])"
                    ></DashboardTile>

                    <DashboardTile
                      :title="$t('Expats')"
                      :value="paxStats?.expat"
                      @click="navigateToPax([paxTypesEnum.Expat])"
                    ></DashboardTile>
                  </div>
                </div>
                <div class="col-lg-4 col-12">
                  <div class="row mb-4 g-4 h-100">
                    <DashboardTile
                      :title="$t('Total Paxes')"
                      :value="paxStats?.total"
                      @click="navigateToPax()"
                    ></DashboardTile>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-sm-12">
            <div class="container-fluid dashboard">
              <div
                class="page-header d-flex justify-content-between align-items-center my-4"
              >
                <h1 class="page-title">
                  <span class="iconclass icon-contacts me-2 text-white"></span>
                  {{ t("Passports & Visas") }}
                </h1>
              </div>
              <div class="row mb-4 g-4">
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Expired Passports')"
                      :value="passportStats?.expired"
                      @click="navigateToPassport([statusEnum.Expired])"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('To be renewed passports')"
                      :value="passportStats?.to_be_renewed"
                      @click="navigateToPassport([statusEnum.ToBeRenewedNew])"
                    ></DashboardTile>
                  </div>
                </div>
                <!-- <div class="col-lg-4 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4 h-100">
                    <div class="col-12 dashboard-tiles">
                      <div class="dashboard-items dashboard-items--darkblue">
                        <h3>{{ accomodationStatistics.request.label }}</h3>
                        <div
                          class="d-flex justify-content-between align-items-end h-100"
                        >
                          <h1>
                            <span
                              class="iconclass icon-userIcon text-white"
                            ></span>
                          </h1>
                          <div class="text-end">
                            <h1>{{ accomodationStatistics.request.count }}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="row g-4">
                    <DashboardTile
                      :title="$t('Paxes without passport')"
                      :value="paxStats?.paxes_without_passports"
                      @click="navigateToPax(null, null, null, true)"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('Paxes without visas')"
                      :value="paxStats?.paxes_without_visas"
                      @click="navigateToPax(null, null, true, null)"
                    ></DashboardTile>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4 g-4">
          <div class="col-lg-6 col-sm-12">
            <div class="container-fluid dashboard">
              <div
                class="page-header d-flex justify-content-between align-items-center my-4"
              >
                <h1 class="page-title">
                  <span class="iconclass icon-testTube me-2 text-white"></span>
                  {{ t("Last Blood Test Batch") }} ({{
                    bloodTestStats?.lastTestBatchNo
                  }})
                </h1>
              </div>
              <div class="row mb-4 g-4">
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Submitted')"
                      :value="bloodTestStats?.submitted"
                      @click="navigateToLastBloodTest"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('Tested')"
                      :value="bloodTestStats?.tested"
                      @click="navigateToLastBloodTest"
                    ></DashboardTile>
                  </div>
                </div>
                <!-- <div class="col-lg-4 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4 h-100">
                    <div class="col-12 dashboard-tiles">
                      <div class="dashboard-items dashboard-items--purple">
                        <h3>{{ bloodTestStatistics.appointments.label }}</h3>
                        <div
                          class="d-flex justify-content-between align-items-end h-100"
                        >
                          <h1>
                            <span
                              class="iconclass icon-testTube text-white"
                            ></span>
                          </h1>
                          <div class="text-end">
                            <h1>
                              {{ bloodTestStatistics.appointments.count }}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Scheduled')"
                      :value="bloodTestStats?.scheduled"
                      :icon-classes="['icon-contacts']"
                      @click="navigateToLastBloodTest"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('Returned')"
                      :value="bloodTestStats?.returned"
                      :icon-classes="['icon-contacts']"
                      @click="navigateToLastBloodTest"
                    ></DashboardTile>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-sm-12">
            <div class="container-fluid">
              <div
                class="page-header d-flex justify-content-between align-items-center my-4"
              >
                <h1 class="page-title">
                  <span class="iconclass icon-certificateGreen d-inline me-2">
                    <span class="path1"></span>
                    <span class="path2 text-white"></span>
                    <span class="path3 text-white"></span>
                    <span class="path4 text-white"></span>
                    <span class="path5 text-white"></span>
                    <span class="path6 text-white"></span>
                    <span class="path7 text-white"></span>
                  </span>
                  {{ t("LOI") }}
                </h1>
              </div>

              <div class="row mb-4 g-4">
                <div class="col-lg-12 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Open LOIs')"
                      :value="loiStats?.open_loi"
                      @click="navigateToLOIs(loiApplicationStatusEnum.Open)"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('Closed LOIs')"
                      :value="loiStats?.closed_loi"
                      @click="navigateToLOIs(loiApplicationStatusEnum.Closed)"
                    ></DashboardTile>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-sm-12">
            <div class="container-fluid dashboard">
              <div
                class="page-header d-flex justify-content-between align-items-center my-4"
              >
                <h1 class="page-title">
                  <span class="iconclass icon-testTube me-2 text-white"></span>
                  {{ t("Last LOI batch") }} ({{ loiStats?.latest_batch }})
                </h1>
              </div>
              <div class="row mb-4 g-4">
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Approved')"
                      :value="loiStats?.approved"
                      @click="navigateToLastLOI"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('Cancelled')"
                      :value="loiStats?.cancelled"
                      @click="navigateToLastLOI"
                    ></DashboardTile>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                  <div class="row mb-4 g-4">
                    <DashboardTile
                      :title="$t('Rejected')"
                      :value="loiStats?.rejected"
                      @click="navigateToLastLOI"
                    ></DashboardTile>
                    <DashboardTile
                      :title="$t('Give up')"
                      :value="loiStats?.give_up"
                      @click="navigateToLastLOI"
                    ></DashboardTile>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useConfigStore } from "@/stores";
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import DashboardTile from "./components/DashboardTile.vue";
import {
  PaxStatusEnum,
  Routes,
  PaxTypesEnum,
  StatusEnum,
  LOIApplicationStatusEnum,
} from "@/data";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: Routes.DashboardPage,
  setup() {
    const { t } = useI18n();

    return { t };
  },
  async activated() {
    try {
      await this.configStore.getDashboard();
    } catch (error) {
      console.log("Error getting dashboard", error);
    }
  },
  data() {
    return {
      paxTypesEnum: PaxTypesEnum,
      paxStatusEnum: PaxStatusEnum,
      statusEnum: StatusEnum,
      loiApplicationStatusEnum: LOIApplicationStatusEnum,
    };
  },
  computed: {
    ...mapStores(useConfigStore),
    bloodTestStats() {
      return this.configStore.dashboard?.blood_test_stats;
    },
    loiStats() {
      return this.configStore.dashboard?.lois_stats;
    },
    passportStats() {
      return this.configStore.dashboard?.passports_stats;
    },
    paxStats() {
      return this.configStore.dashboard?.paxes_stats;
    },
    visaStats() {
      return this.configStore.dashboard?.visas_stats;
    },
  },
  components: {
    DashboardTile,
  },
  methods: {
    navigateToPax(type, status, noVisas, noPassports) {
      this.$router.push({
        name: Routes.PaxProfiles,
        query: { type, status, noVisas, noPassports },
      });
    },
    navigateToLOIs(status) {
      this.$router.push({ name: Routes.LOIApplications, query: { status } });
    },
    navigateToLastBloodTest() {
      this.$router.push({
        name: Routes.BloodTestSubmission,
        params: { id: this.bloodTestStats?.lastTestBatchNo },
      });
    },
    navigateToLastLOI() {
      this.$router.push({
        name: Routes.LOIRequest,
        params: { id: this.loiStats?.latest_batch_id },
      });
    },
    navigateToPassport(status) {
      this.$router.push({ name: Routes.Passport, query: { status } });
    },
  },
});
</script>

<style scoped>
h1 {
  font-size: 2rem;
}
</style>
