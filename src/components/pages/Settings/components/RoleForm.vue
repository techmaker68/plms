<!--
***********************************
@author Mohanned Hassan
@create_date 1st Nov 2023

Edit role
Add permissions to role

***********************************
-->
<script setup>
import { computed, reactive, watch, ref, watchEffect, onMounted } from "vue";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { useSettingsStore } from "@/stores";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import PermissionListTable from "./PermissionListTable.vue";
import { toRefs } from "@vueuse/core";
import { PermissionsHeaders } from "@/data";
import SaveButton from "@/components/common/SaveButton.vue";

const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => null,
  },
});

const { saveRole, updateRole } = useSettingsStore();
const emit = defineEmits({
  submitted: null,
});
const { initialData } = toRefs(props);
const { t } = useI18n();

const permissionsTable = ref(null);
const isUpdate = computed(() => !!initialData.value);
const includedHeaders = ref([
  PermissionsHeaders.Name,
  PermissionsHeaders.Description,
]);

const state = reactive({
  roleForm: {
    name: "",
    display_name: "",
  },
});

watchEffect(() => {
  if (initialData.value) {
    const { name, display_name } = initialData.value;
    state.roleForm = {
      ...state.roleForm,
      name,
      display_name,
    };
  }
});

const rules = computed(() => ({
  roleForm: {
    name: {
      required,
    },
    display_name: {},
  },
}));

const v$ = useVuelidate(rules, state);

async function submit() {
  const form = {
    ...state.roleForm,
    selectedPermissions: permissionsTable.value.selectedItems.map(
      (element) => element.id
    ),
  };
  try {
    if (isUpdate.value) {
      await updateRole(initialData.value?.id, form);
    } else {
      await saveRole(form);
    }
    emit("submitted");
  } catch (error) {
    console.log("Error submitting role", error);
  }
}

onMounted(() => {
  if (initialData.value?.role_permissions) {
    permissionsTable.value.selectedItems = initialData.value?.role_permissions;
  }
});
</script>
<template>
  <div class="roles-form">
    <div
      class="border-form-custom d-flex flex-column justify-content-start align-items-stretch px-5"
      style="gap: 3rem"
    >
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="verical-form-row w-50 required-form-control">
            <label class="form-label text-primary" v-t="'Role Name:'"></label>
            <input
              v-model="state.roleForm.name"
              type="text"
              class="form-control"
            />
          </div>
          <ErrorMessages :errors="v$.roleForm.name.$errors" />
        </div>
        <div class="col-md-6">
          <div class="vertical-form-row">
            <label
              class="form-label text-primary"
              v-t="'Role Display Name:'"
            ></label>
            <input
              v-model="state.roleForm.display_name"
              type="text"
              class="form-control"
            />
          </div>
          <ErrorMessages :errors="v$.roleForm.display_name.$errors" />
        </div>
      </div>

      <PermissionListTable
        enable-multi-selection
        :included-headers="includedHeaders"
        all
        :extra-table-options="{
          'rows-items': [10, 20, 50],
          'rows-per-page': 10,
        }"
        ref="permissionsTable"
      ></PermissionListTable>

      <div class="d-flex flex-column justify-content-end align-items-center">
        <SaveButton
          class="btn btn-blue"
          :disabled="v$.roleForm.$invalid"
          @click="submit"
        >
          {{ isUpdate ? t("Update") : t("Add") }}
        </SaveButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.horizontal-form-row {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  text-align: start;
}

.table tr:hover {
  background-color: unset;

  input[type="checkbox"] {
    cursor: pointer;
  }
}

.roles-form {
  width: 1000px;
  margin: 0 auto;
}
</style>
