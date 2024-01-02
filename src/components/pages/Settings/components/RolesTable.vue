<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

View all roles

***********************************
-->
<script setup>
import { ref, watch, reactive, computed } from "vue";
import { useSettingsStore, useUserStore } from "@/stores";
import { PermissionsEnum, RolesHeaders } from "@/data";
import { useTable, useTableProps } from "@/composables";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useModal } from "@kouts/vue-modal";

import { generateUIDs, removeInvalidFields } from "@/helpers";
import RoleForm from "./RoleForm.vue";
import GenericModal from "@/components/common/GenericModal.vue";
import MembersTable from "./MembersTable.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import SearchField from "@/components/common/SearchField.vue";

const props = defineProps({
  ...useTableProps,
  disableSearch: {
    type: Boolean,
    default: false,
    required: false,
  },
});
const emit = defineEmits(["rowClick"]);

const defaultHeaders = ref([
  { text: "Role", value: RolesHeaders.Role },
  { text: "Display Name", value: RolesHeaders.DisplayName },
  { text: "Action", value: RolesHeaders.Actions, width: 300 },
]);
const [confirmRoleDeleteModal, roleFormModal, MembersTableForm] =
  generateUIDs(3);

const showClearSearch = ref(false);
const selectedRole = ref(null);
const { show, hide } = useModal();

const { getRolesList, deleteRole, getRoleWithPermission, assignRoleToUsers } =
  useSettingsStore();
const { hasPermission } = useUserStore();

const apiCall = (pagination, search) =>
  getRolesList(pagination, {
    ...props.extraServerFilters,
    search,
  });

const hasEditPermission = computed(() =>
  hasPermission(PermissionsEnum.ROLE_EDIT)
);

const hasDeletePermission = computed(() =>
  hasPermission(PermissionsEnum.ROLE_DELETE)
);

const clearSearch = () => {
  searchValue.value = "";
  triggerServerRefresh(true);
  showClearSearch.value = false;
};

const searchData = () => {
  if (searchValue.value) {
    triggerServerRefresh(true);
    showClearSearch.value = true;
  }
};

async function getRoleWithPermissions(item) {
  try {
    selectedRole.value = await getRoleWithPermission(item?.id);
    return selectedRole.value;
  } catch (error) {}
}

function onRowClick(item) {
  emit("rowClick", item);
}

async function showPermissionModal(item) {
  try {
    await getRoleWithPermissions(item);
    show(roleFormModal);
  } catch (error) {
    console.log("Error gettiong role", error);
  }
}

async function showMembersForm(item) {
  try {
    await getRoleWithPermissions(item);

    show(MembersTableForm);
  } catch (error) {
    console.log("Error gettiong role", error);
  }
}

function hideRoleModal() {
  hide(roleFormModal);
}

function hideMembersModal() {
  hide(MembersTableForm);
}

const {
  searchValue,
  selectedItems,
  getColumnItemName,
  extraOptions,
  vModelWorkaround,
  vModelServerOptionsWorkaround,
  headers,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  triggerServerRefresh,
} = useTable(defaultHeaders, props, apiCall);

defineExpose({
  selectedItems,
  triggerServerRefresh,
});

async function revokeRole() {
  try {
    await deleteRole(selectedRole.value?.id);
    hide(confirmRoleDeleteModal);
    triggerServerRefresh(true);
  } catch (error) {}
}

function onRoleUpdate() {
  triggerServerRefresh();
  hideRoleModal();
}

async function onMembersSubmit(selectedItems) {
  await assignRoleToUsers(
    removeInvalidFields({
      id: selectedRole.value.id,
      user_id: selectedItems.map((element) => element.id).join(","),
    })
  );

  triggerServerRefresh();
  hideMembersModal();
}

async function hideDeleteModal() {
  hide(confirmRoleDeleteModal);
}

function showDeleteModal(item) {
  selectedRole.value = item;
  show(confirmRoleDeleteModal);
}

function resetValues() {
  selectedRole.value = null;
}
</script>

<template>
  <div
    class="d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 1rem"
  >
    <div
      class="d-flex flex-row justify-content-start align-items-center"
      style="gap: 1rem"
    >
      <slot name="header-description"></slot>
      <div
        class="search-option d-flex flex-row justify-content-between align-items-center flex-grow-1"
        style="gap: 1rem"
      >
        <div class="search-filter-container">
          <SearchField
            v-model="searchValue"
            :showClearSearch="showClearSearch"
            @submit="searchData"
            @cancel="clearSearch"
          />
        </div>

        <div class="table-actions-container">
          <slot name="header-actions"></slot>
        </div>
      </div>
    </div>
    <div class="table table-responsive">
      <EasyDataTable
        v-model:[vModelWorkaround]="selectedItems"
        v-model:[vModelServerOptionsWorkaround]="serverOptions"
        :server-items-length="serverItemsLength"
        :headers="headers"
        :items="serverItems"
        :alternating="true"
        :loading="loading"
        @click-row="onRowClick"
        v-bind="extraOptions"
      >
        <template #empty-message> No data found </template>
        <template #[getColumnItemName(RolesHeaders.Role)]="{ name }">
          <div>
            <span class="icon-users me-2"></span>
            {{ name }}
          </div>
        </template>
        <template #[getColumnItemName(RolesHeaders.Actions)]="item">
          <slot name="column-actions" :item="item">
            <div
              class="btn-group btn-group-sm d-flex flex-row justify-content-start align-items-center"
              role="group"
            >
              <template v-if="hasEditPermission">
                <button
                  @click="showPermissionModal(item)"
                  type="button"
                  class="btn btn-outline-secondary rounded-start flex-grow-0"
                >
                  <span v-t="'Permission'"></span>
                </button>
              </template>
              <DeleteButton
                v-if="hasDeletePermission"
                @click="showDeleteModal(item)"
                type="button"
                class="btn btn-danger rounded-end flex-grow-0"
              >
                <span v-t="'Delete'"></span>
              </DeleteButton>
            </div>
          </slot>
        </template>
      </EasyDataTable>
    </div>
  </div>
  <VueModal :name="confirmRoleDeleteModal" @closed="resetValues">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="revokeRole"
      :title="$t('Do you want to delete this Role?')"
      :message="$t('**If you select YES, the Role wil be removed')"
    />
  </VueModal>

  <VueModal :name="roleFormModal" wrapperClass="vm-lg" @closed="resetValues">
    <GenericModal :title="$t('Role Information')" @close="hideRoleModal">
      <RoleForm :initialData="selectedRole" @submitted="onRoleUpdate" />
    </GenericModal>
  </VueModal>

  <VueModal :name="MembersTableForm" wrapperClass="vm-lg" @closed="resetValues">
    <GenericModal :title="$t('Role Members')" @close="hideMembersModal">
      <MembersTable :initialData="selectedRole" @submit="onMembersSubmit" />
    </GenericModal>
  </VueModal>
</template>
