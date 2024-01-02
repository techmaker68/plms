<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Display PAX passports
Can view/edit/delete passports

***********************************
-->
<script setup>
import GenericModal from "@/components/common/GenericModal.vue";
import PassportForm from "@/components/common/PassportForm.vue";
import { EnvironmentEnum, PermissionsEnum, StatusEnum } from "@/data";
import { generateUIDs } from "@/helpers";
import { useConfigStore, usePassportStore, useUserStore } from "@/stores";
import { toRefs } from "@vueuse/core";
import { ref, computed, onMounted } from "vue";
import { useModal } from "@kouts/vue-modal";
import { useI18n } from "vue-i18n";

const props = defineProps({
  passports: {
    type: Array,
    default: () => [],
  },
  profile: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["updateProfile"]);

const { hasPermission } = useUserStore();

const passportModal = generateUIDs();
const { t } = useI18n();
const { show, hide } = useModal();
const baseStorageUrl = import.meta.env[EnvironmentEnum.StorageBaseURL];
const selectedPassport = ref(null);
const { passports, profile } = toRefs(props);
const { getPassportStatusById, getCountryById } = useConfigStore();
const { getPassportDetails } = usePassportStore();

const initialPassportFormData = computed(() => {
  return {
    pax_id: profile.value?.pax_id,
    full_name: profile.value?.eng_full_name,
  };
});

const hasAddPassportPermission = computed(() =>
  hasPermission(PermissionsEnum.PASSPORT_ADD)
);

function hidePassportModal() {
  hide(passportModal);
}

async function onPassportClick({ id }) {
  try {
    const response = await getPassportDetails(id);
    selectedPassport.value = response;
    showPassportModal();
  } catch (error) {
    console.log("error", error);
  }
}

function showPassportModal() {
  show(passportModal);
}

function resetPassport() {
  selectedPassport.value = null;
}

function emitUpdateProfile() {
  emit("updateProfile");
}
</script>

<template>
  <VueModal
    :name="passportModal"
    wrapperClass="vm-lg vm-body-no-padding"
    @closed="resetPassport"
  >
    <GenericModal
      :title="selectedPassport ? t('Edit Passport') : t('Add Passport')"
      @close="hidePassportModal"
    >
      <PassportForm
        :item="selectedPassport"
        :initial-data="initialPassportFormData"
        @close="hidePassportModal"
        @submit="emitUpdateProfile"
      />
    </GenericModal>
  </VueModal>

  <div class="pax-profile-tab-container">
    <div class="d-flex flex-row justify-content-between align-items-center">
      <slot name="header"></slot>

      <button
        class="btn btn-outline-primary btn-icon text-nowrap button-table-action"
        :title="t('Add Passport')"
        v-if="hasAddPassportPermission"
        @click="showPassportModal"
      >
        <span class="icon-userIcon"></span>
        <span v-t="'Add Passport'"></span>
      </button>
    </div>
    <table class="table">
      <thead>
        <tr></tr>
        <tr>
          <th>#</th>
          <th v-t="'Passport No'"></th>
          <th v-t="'Date of Issue'"></th>
          <th v-t="'Date of expiry'"></th>
          <th v-t="'Place of Issue'"></th>
          <th v-t="'Status'"></th>
          <th v-t="'Passport Copy'"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in passports" :key="item.id">
          <td>{{ passports.length - index }}</td>
          <td class="cursor-pointer" @click="onPassportClick(item)">
            {{ item.passport_no }}
          </td>
          <td>{{ item.date_of_issue }}</td>
          <td>{{ item.date_of_expiry }}</td>
          <td>{{ item.place_of_issue?.country_name_short_en }}</td>
          <td
            :class="{
              'text-success': item.status_id == StatusEnum.Approved,
              'text-danger': item.status_id == StatusEnum.Expired,
            }"
          >
            {{ item.status }}
          </td>
          <td>
            <a
              :href="`${baseStorageUrl}/${item.file}`"
              class="d-flex flex-row justify-content-start align-items-center"
              target="_blank"
              style="gap: 1rem"
              :class="{
                'invalid-link': !item.file,
              }"
            >
              <img src="@/assets/img/pdf.svg" />
              <label class="cursor-pointer" v-t="'File'"></label>
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!passports.length" class="table-no-data-container">
      <p class="text-center" v-t="'No data available'"></p>
    </div>
  </div>
</template>
