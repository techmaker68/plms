<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

***********************************
-->
<script setup>
import { useUserStore } from "@/stores";
import { computed, ref } from "vue";
import GenericModal from "@/components/common/GenericModal.vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import { PermissionsEnum } from "@/data";
import RegisterForm from "@/components/common/RegisterForm.vue";
import UsersTable from "./components/UsersTable.vue";
import AddButton from "@/components/common/AddButton.vue";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";

const { show, hide } = useModal();
const [registerFormModal] = generateUIDs(1);

const { hasPermission } = useUserStore();

const hasAddUserPermission = computed(() =>
  hasPermission(PermissionsEnum.USER_ADD)
);

const usersTable = ref(null);

function onAddUser() {
  hideRegisterForm();
  usersTable.value.triggerServerRefresh();
}

function showRegisterForm() {
  show(registerFormModal);
}

function hideRegisterForm() {
  hide(registerFormModal);
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

      <UsersTable ref="usersTable">
        <template #table-title>
          <h3 class="popup-subtile my-0">
            <span v-t="'Employee Admin Users'"></span>
          </h3>
        </template>

        <template #table-actions>
          <AddButton
            class="btn btn-primary btn-icon"
            v-if="hasAddUserPermission"
            @click="showRegisterForm"
          >
            {{ $t("Add User") }}
          </AddButton>
        </template>
      </UsersTable>
    </main>
  </div>

  <VueModal :name="registerFormModal" wrapperClass="vm-md">
    <GenericModal :title="$t('Add User')" @close="hideRegisterForm">
      <RegisterForm @submit="onAddUser" />
    </GenericModal>
  </VueModal>
</template>

<style scoped></style>
