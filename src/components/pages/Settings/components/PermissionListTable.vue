<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

View/Edit/Delete all permissions

***********************************
-->
<script setup>
import { computed, ref, watch, reactive } from "vue";
import { useSettingsStore, useUserStore } from "@/stores";
import { useTable, useTableProps } from "@/composables";
import { PermissionsEnum, PermissionsHeaders } from "@/data";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import PermissionForm from "./PermissionForm.vue";
import GenericModal from "@/components/common/GenericModal.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import SearchField from "@/components/common/SearchField.vue";

const props = defineProps({
  ...useTableProps,
});

const { getPermissionsList, deletePermission } = useSettingsStore();
const { hasPermission } = useUserStore();
const [confirmDeleteModal, permissionFormModal] = generateUIDs(2);
const emit = defineEmits(["rowClick"]);

const hasDeletePermission = computed(() =>
  hasPermission(PermissionsEnum.PERMISSION_DELETE)
);

const hasEditPermission = computed(() =>
  hasPermission(PermissionsEnum.PERMISSION_EDIT)
);

const defaultHeaders = ref([
  { text: "Name", value: PermissionsHeaders.Name },
  { text: "Description", value: PermissionsHeaders.Description },
  { text: "Action", value: PermissionsHeaders.Actions, width: 300 },
]);
const { show, hide } = useModal();

const selectedPermission = ref(null);
const showClearSearch = ref(false);

function onRowClick(item) {
  selectedPermission.value = item;
  emit("rowClick", item);
  showPermissionsModal();
}

const apiCall = (pagination, search) => {
  return getPermissionsList(pagination, {
    search,
  });
};

const {
  searchValue,
  selectedItems,
  headers,
  serverItems,
  serverItemsLength,
  serverOptions,
  loading,
  vModelWorkaround,
  vModelServerOptionsWorkaround,
  triggerServerRefresh,
  extraOptions,
  getColumnItemName,
} = useTable(defaultHeaders, props, apiCall);

async function revokePermission() {
  try {
    await deletePermission(selectedPermission.value.id);
    triggerServerRefresh(true);
    hide(confirmDeleteModal);
  } catch (error) {}
}

async function hideDeleteModal() {
  hide(confirmDeleteModal);
}

function showDeleteModal(item) {
  selectedPermission.value = item;
  show(confirmDeleteModal);
}

async function search() {
  triggerServerRefresh(true);
  showClearSearch.value = true;
}

function showPermissionsModal() {
  if (hasEditPermission.value) {
    show(permissionFormModal);
  }
}

function hidePermissionsModal() {
  hide(permissionFormModal);
}

function clearSearch() {
  searchValue.value = "";
  triggerServerRefresh(true);
  showClearSearch.value = false;
}

function onUpdatePermission() {
  triggerServerRefresh();
  hidePermissionsModal();
}

function resetValues() {
  selectedPermission.value = null;
}

defineExpose({
  selectedItems,
  triggerServerRefresh,
});
</script>
<template>
  <div class="table-responsive">
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="gap: 1rem"
    >
      <div class="search-filter-container">
        <SearchField
          v-model="searchValue"
          :showClearSearch="showClearSearch"
          @submit="search"
          @cancel="clearSearch"
        />
      </div>

      <div class="table-actions-container">
        <slot name="header-actions"></slot>
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
      @click-row="onRowClick"
      body-row-class-name="cursor-pointer"
      v-bind="extraOptions"
    >
      <template
        #[getColumnItemName(PermissionsHeaders.Description)]="{ description }"
      >
        <span v-html="description"></span>
      </template>

      <template #[getColumnItemName(PermissionsHeaders.Actions)]="item">
        <slot name="column-actions" :item="item">
          <DeleteButton
            v-if="hasDeletePermission"
            @click.stop="showDeleteModal(item)"
            type="button"
            class="btn btn-danger rounded-end flex-grow-0"
          >
            <span v-t="'Delete'"></span>
          </DeleteButton>
        </slot>
      </template>
    </EasyDataTable>
  </div>
  <VueModal :name="confirmDeleteModal" @closed="resetValues">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="revokePermission"
      :title="$t('Do you want to delete this Permission?')"
      :message="$t('**If you select YES, the permission wil be removed')"
    />
  </VueModal>

  <VueModal :name="permissionFormModal" wrapperClass="vm-md">
    <GenericModal
      :title="$t('Update Permission')"
      @close="hidePermissionsModal"
    >
      <PermissionForm
        :permission="selectedPermission"
        @submitted="onUpdatePermission"
      />
    </GenericModal>
  </VueModal>
</template>
