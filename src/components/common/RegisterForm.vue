<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

Edit/View user
Assign roles to user

***********************************
-->
<script setup>
import { reactive, computed, watchEffect, ref, onMounted } from "vue";
import ErrorMessages from "./ErrorMessages.vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  email,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import { useSettingsStore } from "@/stores";
import { useI18n } from "vue-i18n";
import {
  resetValidationObject,
  removeInvalidFields,
  sanitizeObject,
} from "@/helpers";
import { toRefs } from "@vueuse/core";
import RolesTable from "../pages/Settings/components/RolesTable.vue";
import { RolesHeaders, UsersHeaders } from "@/data";
import SaveButton from "./SaveButton.vue";

const props = defineProps({
  user: {
    type: Object,
    default: () => null,
  },
  personalUser: {
    type: Boolean,
    default: false,
  },
});

const passwordComplexityValidator = (password) => {
  if (password) {
    // Minimum of 1 Uppercase Letter
    if (false === /[A-Z]/.test(password)) return false;

    // Minimum of 1 Uppercase Letter
    if (false === /[a-z]/.test(password)) return false;

    // Minimum of 1 Number
    if (false === /\d/.test(password)) return false;
  }

  return true;
};

const emit = defineEmits(["submit", "close"]);
const { addUser, updateUser } = useSettingsStore();
const { t } = useI18n();

const state = reactive({
  form: {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  },
});

const rolesTable = ref(null);
const includedHeaders = ref([RolesHeaders.Role, RolesHeaders.DisplayName]);
const { user } = toRefs(props);
const isUpdate = computed(() => !!user.value);
const isUserAdmin = computed(() => user.value?.admin);
const buttonTitle = computed(() => (isUpdate.value ? t("Update") : t("Add")));

const rules = computed(() => {
  const passwordValidators = {
    minLength: minLength(8),
    passwordComplexityValidator: helpers.withMessage(
      "Must contain 1 Uppercase, 1 lowercase, and 1 number",
      passwordComplexityValidator
    ),
  };

  const confirmPasswordValidators = {
    sameAsPassword: helpers.withMessage(
      "Must contain 1 Uppercase, 1 lowercase, and 1 number",
      sameAs(state.form.password)
    ),
  };

  const rules = {
    name: {
      required,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      ...passwordValidators,
    },
    password_confirmation: {
      required,
      ...confirmPasswordValidators,
    },
  };

  return isUpdate.value && !props.personalUser
    ? {
        form: {
          ...rules,
          password: {
            ...passwordValidators,
          },
          password_confirmation: {
            ...confirmPasswordValidators,
          },
        },
      }
    : {
        form: rules,
      };
});

const v$ = useVuelidate(rules, state);

async function submit() {
  try {
    const form = {
      ...v$.value.form.$model,
      role_ids: props.personalUser
        ? user.value?.roles?.map((element) => element.id).join(",")
        : rolesTable.value.selectedItems.map((element) => element.id).join(","),
    };
    if (isUpdate.value) {
      await updateUser(user.value.id, removeInvalidFields(form));
    } else {
      await addUser(removeInvalidFields(form));
    }

    emit("submit");
  } catch (error) {
    console.log("Error registering user", error);
  }
}

watchEffect(() => {
  if (user.value) {
    const { name, email } = user.value;
    state.form = {
      ...state.form,
      name,
      email,
    };
  }
});

onMounted(() => {
  if (user.value?.roles && rolesTable.value) {
    rolesTable.value.selectedItems = user.value?.roles;
  }
});
</script>

<template>
  <div
    class="modal-form"
    :class="{
      'disable-validation': isUpdate,
    }"
  >
    <div
      class="d-flex flex-column justify-content-start align-items-stretch"
      style="gap: 2rem"
    >
      <div class="row required-form-control">
        <div class="col-md-4 d-flex align-items-center">
          <label v-t="'Name'"></label>
        </div>
        <div class="col-md-8">
          <input
            type="text"
            v-model="v$.form.name.$model"
            class="form-control"
            placeholder=""
            :disabled="isUserAdmin"
          />
          <ErrorMessages :errors="v$.form.name.$errors" />
        </div>
      </div>
      <div class="row required-form-control">
        <div class="col-md-4 d-flex align-items-center">
          <label v-t="'Email'"></label>
        </div>
        <div class="col-md-8">
          <input
            type="text"
            v-model="v$.form.email.$model"
            class="form-control"
            placeholder=""
          />
          <ErrorMessages :errors="v$.form.email.$errors" />
        </div>
      </div>
      <div class="row required-form-control">
        <div class="col-md-4 d-flex align-items-center">
          <label v-t="'Password'"></label>
        </div>
        <div class="col-md-8">
          <input
            type="password"
            v-model="v$.form.password.$model"
            class="form-control"
            placeholder=""
            autocomplete="new-password"
          />
          <ErrorMessages :errors="v$.form.password.$errors" />
        </div>
      </div>
      <div class="row required-form-control">
        <div class="col-md-4 d-flex align-items-center">
          <label v-t="'Confirm Password'"></label>
        </div>
        <div class="col-md-8">
          <input
            type="password"
            v-model="v$.form.password_confirmation.$model"
            class="form-control"
            placeholder=""
            autocomplete="new-password"
          />
        </div>
      </div>

      <RolesTable
        v-if="!personalUser"
        :included-headers="includedHeaders"
        enable-multi-selection
        all
        :extra-table-options="{
          'rows-items': [5, 10],
          'rows-per-page': 5,
        }"
        ref="rolesTable"
      >
      </RolesTable>

      <SaveButton
        :disabled="v$.form.$invalid"
        class="btn btn-blue align-self-center"
        aria-label="Close"
        @click="submit"
      >
        <span>{{ buttonTitle }}</span>
      </SaveButton>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
