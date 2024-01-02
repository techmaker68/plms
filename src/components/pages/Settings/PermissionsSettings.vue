<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

***********************************
-->
<script setup>
import { useSettingsStore, useUserStore } from "@/stores";
import { onMounted, reactive, computed, ref } from "vue";
import GenericModal from "@/components/common/GenericModal.vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import PermissionForm from "./components/PermissionForm.vue";
import { PermissionsEnum, RolesHeaders } from "@/data";
import PermissionListTable from "./components/PermissionListTable.vue";
import AddButton from "@/components/common/AddButton.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

const { show, hide } = useModal();
const { hasPermission } = useUserStore();

const [permissionFormModal] = generateUIDs(1);

const permissionsTable = ref(null);

const hasGetPermissions = computed(() =>
  hasPermission(PermissionsEnum.PERMISSIONS_GET)
);

const hasAddPermission = computed(() =>
  hasPermission(PermissionsEnum.PERMISSION_ADD)
);

function onNewPermissions() {
  permissionsTable.value.triggerServerRefresh();
  hidePermissionsModal();
}

function showPermissionsModal() {
  show(permissionFormModal);
}

function hidePermissionsModal() {
  hide(permissionFormModal);
}
</script>

<template>
  <div class="wrapper">
    <main>
      <div
        class="page-header d-flex justify-content-between align-items-center"
      >
        <BreadCrumbs />
      </div>

      <div class="tab-content" v-if="hasGetPermissions">
        <div class="table-responsive">
          <PermissionListTable ref="permissionsTable">
            <template #header-actions>
              <AddButton
                v-if="hasAddPermission"
                class="btn btn-primary btn-icon text-nowrap"
                :title="$t('Add Permission')"
                @click="showPermissionsModal"
              >
                <span v-t="'Add Permission'"></span>
              </AddButton>
            </template>
            <template #column-actions> </template>
          </PermissionListTable>
        </div>
      </div>
    </main>
  </div>

  <VueModal :name="permissionFormModal" wrapperClass="vm-md">
    <GenericModal :title="$t('Add Permission')" @close="hidePermissionsModal">
      <PermissionForm @submitted="onNewPermissions" />
    </GenericModal>
  </VueModal>
</template>

<style scoped></style>
