<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

***********************************
-->
<script setup>
import { useSettingsStore, useUserStore } from "@/stores";
import { reactive, computed, ref, onUnmounted } from "vue";
import RolesTable from "./components/RolesTable.vue";
import GenericModal from "@/components/common/GenericModal.vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import RoleForm from "./components/RoleForm.vue";
import { PermissionsEnum, RolesHeaders } from "@/data";
import AddButton from "@/components/common/AddButton.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

const { show, hide } = useModal();
const { hasPermission, getCurrentUser } = useUserStore();

const [roleFormModal] = generateUIDs(1);

const rolesTable = ref(null);

const hasGetRoles = computed(() => hasPermission(PermissionsEnum.ROLES_GET));

const hasAddRolePermission = computed(() =>
  hasPermission(PermissionsEnum.ROLE_ADD)
);

function onNewRole() {
  rolesTable.value.triggerServerRefresh();
  hideRoleModal();
}

function showRoleModal() {
  show(roleFormModal);
}

function hideRoleModal() {
  hide(roleFormModal);
}

onUnmounted(() => {
  getCurrentUser();
});
</script>

<template>
  <div class="wrapper">
    <main>
      <div
        class="page-header d-flex justify-content-between align-items-center"
      >
        <BreadCrumbs />
      </div>

      <div class="tab-content" v-if="hasGetRoles">
        <RolesTable ref="rolesTable" disable-search>
          <template #header-actions>
            <AddButton
              v-if="hasAddRolePermission"
              class="btn btn-primary btn-icon text-nowrap"
              @click="showRoleModal"
            >
              <span v-t="'Add Role'"></span>
            </AddButton>
          </template>
          <template #column-actions> </template>
        </RolesTable>
      </div>
    </main>
  </div>

  <VueModal :name="roleFormModal" wrapperClass="vm-lg">
    <GenericModal :title="$t('Role Information')" @close="hideRoleModal">
      <RoleForm @submitted="onNewRole" />
    </GenericModal>
  </VueModal>
</template>

<style scoped></style>
