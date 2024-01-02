<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Display PAX profile details
Side page depends on selected tab

***********************************
-->
<script setup>
import { useConfigStore, usePLMSStore, useUserStore } from "@/stores";
import { toRefs } from "@vueuse/core";
import { ref, computed, onMounted } from "vue";
import { EnvironmentEnum, PaxProfileTabsEnum, PermissionsEnum } from "@/data";
import defaultProfilePic from "@/assets/img/profile.svg";
import PaxProfileForm from "./components/PaxProfileForm.vue";
import PaxVisasTable from "./components/PaxVisasTable.vue";
import PaxLOITable from "./components/PaxLOITable.vue";
import PaxPassportsTable from "./components/PaxPassportsTable.vue";
import PaxBloodTable from "./components/PaxBloodTable.vue";
import { checkValidValue, translateObject } from "@/helpers";
import PaxPhoto from "./components/PaxPhoto.vue";

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["close", "updateTable"]);

const { id } = toRefs(props);

const { getPaxDetails, deletePax, updatePax, patchPax } = usePLMSStore();
const { hasPermission } = useUserStore();

const baseStorageUrl = import.meta.env[EnvironmentEnum.StorageBaseURL];
const pax = ref(null);
const dynamicComponentRef = ref(null);
const paxProfileFormViewOnly = ref(null);

const blood_tests = computed(() => pax.value?.blood_tests);
const loi = computed(() => pax.value?.lois);
const passports = computed(() => pax.value?.passports);
const visa = computed(() => pax.value?.visas);
const paxProfile = computed(() => pax.value);

const hasGetVisaPermission = computed(() =>
  hasPermission(PermissionsEnum.VISAS_GET)
);
const hasGetPassportsPermission = computed(() =>
  hasPermission(PermissionsEnum.PASSPORTS_GET)
);
const hasGetLOIPermission = computed(() =>
  hasPermission(PermissionsEnum.LOI_BATCHES_GET)
);
const hasGetBloodTestsPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TESTS_GET)
);

const tabs = [
  {
    id: PaxProfileTabsEnum.Profile,
    iconClass: "icon-person",
    label: "Pax Profile",
    label_ar: "حساب الوافد",
    component: PaxProfileForm,
    enableHr: true,
    visible: true,
  },
  {
    id: PaxProfileTabsEnum.Passports,
    iconClass: "icon-contacts",
    label: "Passports",
    label_ar: "الجوازات",
    component: PaxPassportsTable,
    visible: hasGetPassportsPermission.value,
  },
  {
    id: PaxProfileTabsEnum.Visa,
    iconClass: "icon-certificate",
    label: "Visas",
    label_ar: "الفيزا",
    component: PaxVisasTable,
    visible: hasGetVisaPermission.value,
  },
  {
    id: PaxProfileTabsEnum.BloodTest,
    iconClass: "icon-testtube",
    label: "Blood Tests",
    label_ar: "فحوص الدم",
    component: PaxBloodTable,
    visible: hasGetBloodTestsPermission.value,
  },
  {
    id: PaxProfileTabsEnum.LOI,
    iconClass: "icon-envelope",
    label: "LOI",
    label_ar: "LOI",
    component: PaxLOITable,
    visible: hasGetLOIPermission.value,
  },
];
const activeTab = ref(tabs.find((e) => e.id === PaxProfileTabsEnum.Profile));

const profilePhoto = computed(() =>
  paxProfile.value?.file ? `${baseStorageUrl}/${paxProfile.value.file}` : null
);

function setActiveTab(tab) {
  activeTab.value = tab;
}

function emitUpdateTable() {
  emit("updateTable");
}

function emitClose() {
  emit("close");
}

async function onDeletePax() {
  try {
    await deletePax(paxProfile.value.id);
    emitUpdateTable();
    emitClose();
  } catch (error) {
    console.log("Error deleting pax", error);
  }
}

async function onProfileUpload({ file }) {
  try {
    const updatedPax = await patchPax(paxProfile.value.id, { file });
    pax.value = updatedPax;
  } catch (error) {
    console.log("Error pax profile image", error);
  }
}

async function onUpdatePax(data) {
  try {
    const updatedPax = await updatePax(paxProfile.value.id, data);
    emitUpdateTable();
    pax.value = updatedPax;
  } catch (error) {
    enablePaxEditing();
  }
}

async function getPaxProfile() {
  try {
    pax.value = await getPaxDetails(id.value);
  } catch (error) {
    console.log("Error getting pax profile", error);
  }
}

function paxViewOnlyChange(newValue) {
  paxProfileFormViewOnly.value = newValue;
}

function enablePaxEditing() {
  dynamicComponentRef.value?.enableEditing();
}

onMounted(() => {
  getPaxProfile();
});
</script>
<template>
  <div
    class="wrapper bg-white d-flex flex-row justify-content-start align-items-stretch"
  >
    <div
      class="bg-gray py-4 d-flex flex-column justify-content-start align-items-stretch"
      style="gap: 2rem; flex: 0 0 30rem"
    >
      <div
        class="px-3 d-flex flex-column justify-content-start align-items-stretch align-self-center"
        style="gap: 1rem; width: 75%"
      >
        <PaxPhoto
          @update-profile="onProfileUpload"
          :photo="profilePhoto"
          class="border rounded-2 shadow align-self-center"
        />

        <div
          class="d-flex flex-column justify-content-start align-items-stretch ps-2"
          style="gap: 1rem"
        >
          <p class="fw-bold">{{ paxProfile?.eng_full_name }}</p>

          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <label>{{ paxProfile?.position }}</label>
            <label>{{ paxProfile?.department_label }}</label>
            <p class="fw-bold">{{ paxProfile?.employer }}</p>
          </div>

          <div
            class="d-flex flex-column justify-content-start align-items-stretch"
            style="gap: 0.5rem"
          >
            <div v-if="paxProfile?.pax_id" class="info-row">
              <label v-t="'Pax ID:'"></label>
              <span>{{ paxProfile?.pax_id }}</span>
            </div>

            <div v-if="paxProfile?.badge_no" class="info-row">
              <label v-t="'Badge No:'"></label>
              <span>{{ paxProfile?.badge_no }}</span>
            </div>

            <div v-if="paxProfile?.nationality_label" class="info-row">
              <label v-t="'Nationality:'"></label>
              <span>{{ paxProfile?.nationality_label }}</span>
            </div>

            <div v-if="paxProfile?.created_at" class="info-row">
              <label v-t="'Created On:'"></label>
              <span>{{ paxProfile?.created_at }}</span>
            </div>
          </div>
        </div>
      </div>

      <ul class="list-group">
        <template v-for="tab in tabs" :key="tab.id">
          <li
            v-if="tab.visible"
            class="list-group-item"
            :class="{ 'active-tab': tab.id === activeTab.id }"
            @click="setActiveTab(tab)"
          >
            <span :class="tab.iconClass"></span>
            <span> {{ translateObject(tab, "label") }}</span>
          </li>
        </template>
      </ul>
    </div>

    <div
      class="flex-grow-1 d-flex flex-column justify-content-start align-items-stretch p-4"
      style="gap: 1rem"
    >
      <div class="flex-grow-1 pax-profile-section">
        <!-- Add props for all possible components here -->
        <component
          :is="activeTab.component"
          :profile="paxProfile"
          :visas="visa"
          :lois="loi"
          :passports="passports"
          :bloods="blood_tests"
          :active-company="paxProfile?.company_id"
          @delete="onDeletePax"
          @update="onUpdatePax"
          @update-profile="getPaxProfile"
          @view-only-change="paxViewOnlyChange"
          only-form
          ref="dynamicComponentRef"
        >
          <template #header>
            <div
              class="d-flex flex-row justify-content-between align-items-stretch"
            >
              <h6
                class="text-primary fw-bold m-0 d-flex flex-row justify-content-start align-items-center"
                style="gap: 1rem"
              >
                <span :class="activeTab.iconClass"></span>
                <span>{{ activeTab.label }}</span>
              </h6>

              <template v-if="activeTab.id == PaxProfileTabsEnum.Profile">
                <button
                  v-if="paxProfileFormViewOnly"
                  class="btn btn-icon company-edit-icon edit-details"
                  @click="enablePaxEditing"
                >
                  <span class="icon-edit"></span>
                </button>
              </template>
            </div>

            <hr
              v-if="activeTab.enableHr"
              style="border-top: dashed 1px"
            /> </template
        ></component>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.info-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: start;

  span {
    color: var(--primary-color);
    font-weight: 500;
  }
}

.list-group {
  .list-group-item {
    $font-size: 12px;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 2rem;

    background-color: transparent;
    border-inline: 0px;
    padding: 8px 4rem;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;
    font-size: $font-size;

    [class^="icon-"],
    [class*=" icon-"] {
      height: $font-size;
      width: $font-size;
      text-align: center;
      &:before {
        color: var(--label-color);
        font-size: inherit;
      }
    }

    &.active-tab {
      color: var(--primary-color);
    }
  }
}

[class^="icon-"],
[class*=" icon-"] {
  &:before {
    color: inherit;
    font-size: inherit;
  }
}

hr {
  border-top: dashed 2px var(--label-color);
  margin: 0;
  margin-block-end: 1rem;
}
</style>
