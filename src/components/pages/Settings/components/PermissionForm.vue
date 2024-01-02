<!--
***********************************
@author Mohanned Hassan, Umair
@create_date 15th Oct 2023

***********************************
-->
<script setup>
import { computed, reactive, watchEffect } from "vue";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { useSettingsStore } from "@/stores";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import CustomEditor from "@/components/common/CustomEditor.vue";
import { toRefs } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { update } from "lodash-es";
import SaveButton from "@/components/common/SaveButton.vue";
const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false,
  },
  permission: {
    type: Object,
    default: () => null,
  },
});
const { permission } = toRefs(props);

const emit = defineEmits({
  submitted: null,
});
const isUpdate = computed(() => !!permission.value);

const { savePermission, updatePermission } = useSettingsStore();
const { t } = useI18n();

const state = reactive({
  permissionForm: {
    name: "",
    description: "",
  },
  errors: {},
});

const rules = computed(() => ({
  permissionForm: {
    name: {
      required,
    },
    description: {},
  },
}));

const v$ = useVuelidate(rules, state);

async function submit() {
  try {
    const form = state.permissionForm;
    if (isUpdate.value) {
      await updatePermission(permission.value.id, form);
    } else {
      await savePermission(form);
    }
    emit("submitted");
  } catch (error) {
    console.log("Error is", error);
    state.errors = error?.response?.data?.message;
  }
}

watchEffect(() => {
  if (permission.value) {
    const { name, description } = permission.value;
    state.permissionForm = {
      ...state.permissionForm,
      name,
      description,
    };
  }
});
</script>

<template>
  <div
    class="border-form-custom d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 2rem"
  >
    <div></div>
    <div>
      <div class="horizontal-form-row required-form-control">
        <label class="form-label" v-t="'Permission Name:'"></label>
        <input
          type="text"
          class="form-control"
          v-model="v$.permissionForm.name.$model"
          :disabled="viewOnly"
        />
      </div>
      <ErrorMessages :errors="v$.permissionForm.name.$errors" />
      <span class="text text-danger" v-if="state.errors?.name">{{
        state.errors?.name[0]
      }}</span>
    </div>

    <div>
      <div class="horizontal-form-row">
        <label class="form-label" v-t="'Permission Description:'"></label>
        <CustomEditor
          v-model="v$.permissionForm.description.$model"
          :disabled="viewOnly"
          simple
        ></CustomEditor>
      </div>
      <ErrorMessages :errors="v$.permissionForm.description.$errors" />
    </div>

    <div class="d-flex flex-column justify-content-end align-items-center">
      <SaveButton
        class="btn btn-blue"
        :disabled="v$.permissionForm.$invalid"
        @click="submit"
      >
        <span>{{ isUpdate ? t("Update") : t("Add") }}</span>
      </SaveButton>
    </div>
  </div>
</template>

<style lang="scss">
.horizontal-form-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  .form-label {
    min-width: 200px;
  }

  .form-control,
  textarea {
    flex-grow: 1;
  }
}
</style>
