<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Edit blood batch details

***********************************
-->
<script setup>
import { computed, onMounted, reactive, watchEffect } from "vue";
import ModalHeader from "@/components/common/ModalHeader.vue";
import { required, email } from "@vuelidate/validators";
import { useSettingsStore } from "@/stores";
import { primitiveForEach } from "@/helpers";
import useVuelidate from "@vuelidate/core";
import Chips from "primevue/chips";
import { createReusableTemplate, watchArray } from "@vueuse/core";
import { storeToRefs } from "pinia";
import SaveButton from "@/components/common/SaveButton.vue";

const emit = defineEmits(["submit", "close"]);
const { settings } = storeToRefs(useSettingsStore());
const { testEmails, saveSettings } = useSettingsStore();
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const props = defineProps({
  batch: {
    type: Object,
  },
  asComponent: {
    type: Boolean,
    default: false,
  },
  showTest: {
    type: Boolean,
    default: true,
  },
});

const state = reactive({
  form: {
    blood_test_emails: "",
    blood_test_email_status: false,
    blood_test_email_admins: [],
  },
});

const rules = computed(() => ({
  form: {
    blood_test_emails: {
      required,
    },
    blood_test_email_status: {},
    blood_test_email_admins: {
      required,
      $each: primitiveForEach(
        {
          email,
        },
        true
      ),
    },
  },
}));

const v$ = useVuelidate(rules, state);

const joinedEmails = computed(() => {
  return state.form.blood_test_email_admins.join(",");
});

watchEffect(() => {
  const {
    blood_test_emails,
    blood_test_email_status,
    blood_test_email_admins,
  } = settings.value;
  state.form = {
    blood_test_emails: blood_test_emails,
    blood_test_email_status: !!+blood_test_email_status,
    blood_test_email_admins: blood_test_email_admins
      ? blood_test_email_admins.split(",")
      : [],
  };
});

async function submit() {
  try {
    const { blood_test_email_admins, ...formData } = state.form;

    await saveSettings({
      // ...formData,
      batch_no: props?.batch?.batch_no,
      blood_test_email_admins: joinedEmails.value,
    });
    emit("submit");
  } catch (error) {
    console.log("I'm in submit error", error);
  }
}

async function sendTestEmails() {
  try {
    await testEmails({
      emails: joinedEmails.value,
      batch_no: props?.batch?.batch_no,
    });
  } catch (error) {
    console.log("Error testing emails", error);
  }
}
</script>

<template>
  <DefineTemplate
    ><div class="vertical-form-field">
      <label
        for=""
        class="form-label"
        v-t="'Admin Emails (Can be multiple)'"
      ></label>
      <div class="horizontal-form-field">
        <Chips
          type="email"
          class="flex-grow-1"
          separator=","
          v-model="v$.form.blood_test_email_admins.$model"
          :class="{
            'p-invalid':
              v$.form.blood_test_email_admins.$invalid &&
              v$.form.blood_test_email_admins.$dirty,
          }"
          :allow-duplicate="false"
        />

        <button
          v-if="showTest"
          type="button"
          class="btn btn-blue"
          style="min-width: unset"
          :disabled="v$.form.blood_test_email_admins.$invalid"
          @click="sendTestEmails"
        >
          <span v-t="'Test'"></span>
        </button>
      </div>
    </div>
  </DefineTemplate>

  <template v-if="asComponent">
    <div
      class="modal-body d-flex flex-column justify-content-start align-items-stretch"
      style="gap: 2rem"
    >
      <div>
        <div class="inner-form">
          <ReuseTemplate></ReuseTemplate>
        </div>
      </div>

      <div class="d-flex flex-row justify-content-end align-items-center">
        <SaveButton
          :disabled="v$.form.$invalid"
          type="button"
          class="btn btn-primary"
          @click="submit"
        >
          <span v-t="'Update'"></span>
        </SaveButton>
      </div>
    </div>
  </template>

  <div v-else class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <ModalHeader
          :title="$t('Blood Test Notifications')"
          @close="emit('close')"
        >
        </ModalHeader>

        <div
          class="modal-body d-flex flex-column justify-content-start align-items-stretch"
          style="gap: 2rem"
        >
          <ReuseTemplate></ReuseTemplate>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: unset;
  display: unset;
}

.modal-dialog {
  margin: unset;
}

.modal-body p {
  font-size: 1.5rem;
  font-weight: 600;
}

.form-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px 15%;
  gap: 2rem;
}

.form-container-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 2rem;
}

.horizontal-form-field {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.horizontal-form-field .form-check-input {
  margin-block-start: unset;
}

.horizontal-form-field .form-control {
  width: unset;
  flex-grow: 1;
}

.horizontal-form-field .form-label {
  min-width: 130px;
  margin-block-end: 0px;
}

.vertical-form-field {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.mx-datepicker {
  width: unset !important;
}

.inner-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 1rem;
}
</style>
