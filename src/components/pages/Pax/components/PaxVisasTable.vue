<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

view/edit/delete PAX visas

***********************************
-->
<script setup>
import { toRefs } from "@vueuse/core";
import { ref, computed, onMounted } from "vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import GenericModal from "@/components/common/GenericModal.vue";
import VisaForm from "@/components/common/VisaForm.vue";
import { useUserStore, useVisaStore } from "@/stores";
import { EnvironmentEnum, PermissionsEnum, VisaStatusRiskEnum } from "@/data";
import { useI18n } from "vue-i18n";

const props = defineProps({
  visas: {
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

const visaModal = generateUIDs();
const { t } = useI18n();
const { show, hide } = useModal();
const { getVisaDetail } = useVisaStore();
const { visas, profile } = toRefs(props);
const selectedVisa = ref(null);
const baseStorageUrl = import.meta.env[EnvironmentEnum.StorageBaseURL];

const initialVisaFormData = computed(() => {
  return {
    pax_id: profile.value?.pax_id,
    full_name: profile.value?.eng_full_name,
    passport_no: profile.value?.passport_no,
    loi_no: profile.value?.loi_no,
  };
});

const hasAddVisaPermission = computed(() =>
  hasPermission(PermissionsEnum.VISA_ADD)
);

function hideVisaModal() {
  hide(visaModal);
}

async function onVisaClick(visa) {
  const visaDetails = await getVisaDetail(visa?.id);
  selectedVisa.value = {
    ...visaDetails,
    historical_visas: response.historical_visas,
  };

  showVisaModal();
}

function showVisaModal() {
  show(visaModal);
}

function resetVisa() {
  selectedVisa.value = null;
}

function emitUpdateProfile() {
  emit("updateProfile");
}
</script>

<template>
  <VueModal
    :name="visaModal"
    wrapperClass="vm-lg vm-body-no-padding"
    @closed="resetVisa"
  >
    <GenericModal
      :title="selectedVisa ? t('Edit Visa') : t('Add Visa')"
      @close="hideVisaModal"
    >
      <VisaForm
        :item="selectedVisa"
        :initial-data="initialVisaFormData"
        disable-delete
        @close="hideVisaModal"
        @update-table-request="emitUpdateProfile"
      />
    </GenericModal>
  </VueModal>
  <div class="pax-profile-tab-container">
    <div class="d-flex flex-row justify-content-between align-items-center">
      <slot name="header"></slot>

      <button
        v-if="hasAddVisaPermission"
        class="btn btn-outline-primary btn-icon text-nowrap button-table-action"
        @click="showVisaModal"
      >
        <span class="icon-userIcon"></span>
        <span v-t="'Add Visa'"></span>
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="table-headings">#</th>
          <th scope="col" class="table-headings" v-t="'Visa No'"></th>
          <th scope="col" class="table-headings" v-t="'Issue Date'"></th>
          <th scope="col" class="table-headings" v-t="'Expiry Date'"></th>
          <th scope="col" class="table-headings" v-t="'Status'"></th>
          <th scope="col" class="table-headings" v-t="'Visa Photocopy'"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in visas" :key="item.id">
          <td>{{ visas.length - index }}</td>
          <td class="cursor-pointer" @click="onVisaClick(item)">
            {{ item.visa_no }}
          </td>
          <td>{{ item.date_of_issue }}</td>
          <td>{{ item.date_of_expiry }}</td>
          <td>
            <span
              :class="{
                'expired-visa-status-badge':
                  item.status_id == VisaStatusRiskEnum.Expired ||
                  item.status_id == VisaStatusRiskEnum.Cancelled,
                'text-danger':
                  item.status_id == VisaStatusRiskEnum.ToBeRenewedNew,
                'text-warning':
                  item.status_id == VisaStatusRiskEnum.ToBeRenewedOld,
              }"
              >{{ item.status }}</span
            >
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

    <p v-if="!visas.length" class="text-center">No data available</p>
  </div>
</template>
