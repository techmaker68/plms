<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

View/Edit/Delete users

***********************************
-->
<script setup>
import { useSettingsStore, useUserStore } from "@/stores";
import { ref, computed } from "vue";
import GenericModal from "@/components/common/GenericModal.vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import { PermissionsEnum, UsersHeaders } from "@/data";
import RegisterForm from "@/components/common/RegisterForm.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useTable, useTableProps } from "@/composables";
import DeleteButton from "@/components/common/DeleteButton.vue";
import SearchField from "@/components/common/SearchField.vue";

const props = defineProps({
  ...useTableProps,
  disableClick: {
    type: Boolean,
    default: false,
  },
  fromRoles: {
    type: Boolean,
    default: false,
  },
});

const { show, hide } = useModal();
const { getUsers, deleteUser } = useSettingsStore();
const { hasPermission } = useUserStore();

const [registerFormModal, deleteUserModal] = generateUIDs(2);

const showClearSearch = ref(false);

const selectedUser = ref(null);

const hasEditPermission = computed(() =>
  hasPermission(PermissionsEnum.USER_EDIT)
);

const hasDeletePermission = computed(() =>
  hasPermission(PermissionsEnum.USER_DELETE)
);

const apiCall = (pagination, search) => {
  return getUsers(pagination, {
    search,
    from_roles: props.fromRoles ? true : null,
  });
};

const defaultHeaders = ref([
  { text: "Name", value: UsersHeaders.Name },
  { text: "Email", value: UsersHeaders.Email },
  { text: "Roles", value: UsersHeaders.Roles },
  { text: "", value: UsersHeaders.Actions },
]);

const {
  searchValue,
  headers,
  vModelWorkaround,
  vModelServerOptionsWorkaround,
  selectedItems,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  triggerServerRefresh,
  getColumnItemName,
  extraOptions,
} = useTable(defaultHeaders, props, apiCall, {
  sortBy: "",
  sortType: "",
});

async function onDeleteUser() {
  try {
    await deleteUser(selectedUser.value.id);
    triggerServerRefresh();
    hideDeleteModal();
  } catch (error) {
    console.log("Error registering user", error);
  }
}

function onUpdateUser() {
  hideRegisterForm();
  triggerServerRefresh();
}

async function search() {
  triggerServerRefresh(true);
  showClearSearch.value = true;
}

function clearSearch() {
  searchValue.value = "";
  triggerServerRefresh(true);
  showClearSearch.value = false;
}

async function getRecord(item) {
  if (!props.disableClick) {
    selectedUser.value = item;
    showRegisterForm();
  }
}

function showRegisterForm() {
  if (hasEditPermission.value) {
    show(registerFormModal);
  }
}

function hideRegisterForm() {
  hide(registerFormModal);
}

function showDeleteModal(item) {
  if (item) {
    selectedUser.value = item;
  }
  show(deleteUserModal);
}

function hideDeleteModal() {
  hide(deleteUserModal);
}

function resetValues() {
  selectedUser.value = null;
}

defineExpose({
  selectedItems,
  triggerServerRefresh,
});
</script>
<template>
  <div
    class="d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 1rem"
  >
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="gap: 1rem"
    >
      <slot name="table-title"></slot>

      <div class="d-flex justify-content-between flex-grow-1">
        <div class="search-filter-container" style="gap: 0.5rem">
          <SearchField
            v-model="searchValue"
            :showClearSearch="showClearSearch"
            @submit="search"
            @cancel="clearSearch"
          />
        </div>

        <div class="table-actions-container">
          <slot name="table-actions"></slot>
        </div>
      </div>
    </div>

    <EasyDataTable
      v-model:[vModelWorkaround]="selectedItems"
      v-model:[vModelServerOptionsWorkaround]="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="serverItems"
      :alternating="true"
      :loading="loading"
      @click-row="getRecord"
      body-row-class-name="cursor-pointer"
      v-bind="extraOptions"
    >
      <template #[getColumnItemName(UsersHeaders.Roles)]="{ roles }">
        <div
          class="d-flex flex-row justify-content-start align-items-center"
          style="gap: 0.5rem"
        >
          <span
            v-for="role of roles"
            :key="role.id"
            class="badge bg-info fw-normal"
          >
            {{ role.name }}
          </span>
        </div>
      </template>

      <template #[getColumnItemName(UsersHeaders.Actions)]="item">
        <div
          class="d-flex flex-row justify-content-end align-items-center"
          v-if="!item.admin"
        >
          <DeleteButton
            v-if="hasDeletePermission"
            @click.stop="showDeleteModal(item)"
            type="button"
            class="btn btn-danger rounded-end flex-grow-0"
          >
            <span v-t="'Delete'"></span>
          </DeleteButton>
        </div>
      </template>
    </EasyDataTable>
  </div>

  <VueModal
    :name="registerFormModal"
    @closed="resetValues"
    wrapperClass="vm-md"
  >
    <GenericModal
      :title="selectedUser ? $t('Update User') : $t('Add User')"
      @close="hideRegisterForm"
    >
      <RegisterForm :user="selectedUser" @submit="onUpdateUser" />
    </GenericModal>
  </VueModal>

  <VueModal :name="deleteUserModal" @closed="resetValues">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="onDeleteUser"
      :title="$t('Delete User')"
      :message="$t('Are you sure you want to delete this user?')"
    />
  </VueModal>
</template>
