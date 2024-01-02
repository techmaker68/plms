<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Shows closed LOIs list
Displays application details component on LOI select

***********************************
-->
<template>
  <div class="wrapper loi-req">
    <div
      class="Addpassport sidebar sidebar--moreInfoSidebar sidebar--moreInfoSidebar__large d-flex flex-column flex-shrink-0 sidebar__menublock pt-3 pb-3 overflow-auto custom-scrollbar"
    >
      <BreadCrumbs :override-route-name="Routes.LOIManagement" />

      <LOIApplicationsTable
        ref="applicationsTable"
        :included-headers="LOIHeaders"
        :extra-server-filters="{
          search_by_applicant: applicantSearch,
        }"
        @on-search="clearSearch(false)"
        @last-clicked-item-change="navigateToLOIDetails"
        is-loi-management
        :enable-auto-trigger-extra-filters="false"
        class="loi-table"
      >
        <template #header-section>
          <div
            class="search-option d-flex justify-content-start align-items-center"
            style="gap: 1rem"
          >
            <label class="search-label"
              ><span v-t="'By Applicants:'"></span>
            </label>

            <SearchField
              v-model="applicantSearch"
              :showClearSearch="clearApplicantSearch"
              :placeholder="$t('Name / Pax ID / Passport No')"
              @submit="searchByApplicant"
              @cancel="clearSearch"
            />
          </div>
        </template>

        <template #header-description>
          <label class="search-label"
            ><span v-t="'Quick Search:'"></span
          ></label>
        </template>
      </LOIApplicationsTable>
    </div>

    <main
      class="page-container d-flex flex-column justify-content-start align-items-stretch"
    >
      <router-view />
    </main>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import BackButton from "@/components/common/BackButton.vue";
import { useLOIStore } from "@/stores";
import { mapStores } from "pinia";
import LOIApplicationsTable from "./components/LOIApplicationsTable.vue";
import { LOIApplicationsHeaders, Routes } from "@/data";
import SearchField from "@/components/common/SearchField.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

export default defineComponent({
  name: "LoiManagement",
  data() {
    return {
      applicantSearch: "",
      clearApplicantSearch: false,
      LOIHeaders: [
        LOIApplicationsHeaders.LOINo,
        LOIApplicationsHeaders.BatchNo,
        LOIApplicationsHeaders.NationCategory,
        LOIApplicationsHeaders.Type,
        LOIApplicationsHeaders.LOIIssueDate,
        LOIApplicationsHeaders.LOIExpiryDate,
      ],
      Routes,
    };
  },
  methods: {
    async navigateToLOIDetails(application) {
      if (application?.id) {
        this.$router.push({
          name: Routes.LOIApplicationDetails,
          params: {
            id: application?.id,
          },
        });
      } else {
        this.$router.push({
          name: Routes.LOIManagement,
        });
      }
    },
    async searchByApplicant() {
      this.$refs.applicationsTable?.clearSearch(false);
      this.$refs.applicationsTable?.triggerServerRefresh(true);
      this.clearApplicantSearch = true;
    },
    async clearSearch(refresh = true) {
      this.applicantSearch = "";
      this.$nextTick(() => {
        if (refresh) {
          this.$refs.applicationsTable?.triggerServerRefresh(true);
        }
        this.clearApplicantSearch = false;
      });
    },
  },
  components: {
    BackButton,
    LOIApplicationsTable,
    SearchField,
    BreadCrumbs,
  },
  computed: {
    ...mapStores(useLOIStore),
  },
});
</script>
<style scoped lang="scss">
.sidebar--moreInfoSidebar__large {
  width: 54rem;
}

.icon-searchIcon::before {
  color: #fff;
}

.search-label {
  min-width: 9rem;
}

:deep(.loi-table) {
  .selected-table-row {
    background-color: #f2f2f2 !important;
    color: #212121 !important;
  }
  .header-description-container {
    flex-grow: 0;
  }

  .table-headers-container {
    justify-content: flex-start !important;
  }

  .table-headers {
    flex-grow: 1;
  }

  .search-filter-container {
    flex-grow: 1;
  }

  .table-actions-container {
    display: none;
  }
}
</style>
