<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Create new blood test batch

***********************************
-->
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import ModalHeader from "@/components/common/ModalHeader.vue";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { required, numeric } from "@vuelidate/validators";
import { useBloodStore, useConfigStore } from "@/stores";
import { storeToRefs } from "pinia";
import useVuelidate from "@vuelidate/core";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { expiryDisabledDates } from "@/helpers";
import SaveButton from "@/components/common/SaveButton.vue";
import { update } from "lodash-es";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const emit = defineEmits(["submit", "close"]);

const { venues } = storeToRefs(useConfigStore());
const { getVenueByLabel } = useConfigStore();

const { nextBatchDefaults } = storeToRefs(useBloodStore());
const { createBloodBatch, updateBloodBatch } = useBloodStore();

const props = defineProps({
  batch: {
    type: Object,
  },
});

const intervals = ref(
  Array.from(Array(12)) // generate until 60 minutes, 5 minutes intervals
    .map((v, index) => (index + 1) * 5)
    .map((v) => ({ value: v, label: `${v} Minutes` }))
);

const state = reactive({
  form: {
    batch_no: "",
    submit_date: "",
    return_date: "",
    start_time: "",
    end_time: "",
    interval: intervals.value[0].value,
    applicants_interval: 10,
    test_date: "",
    venue: "",
  },
});

const rules = computed(() => ({
  form: {
    batch_no: {
      required,
    },
    submit_date: {
      required,
    },
    return_date: {
      required,
    },
    test_date: {
      required,
    },
    start_time: {
      required,
    },
    end_time: {
      required,
    },
    interval: {
      required,
      numeric,
    },
    applicants_interval: {
      required,
      numeric,
    },
    venue: {
      required,
    },
  },
}));

const isUpdate = computed(() => !!props.batch);

const v$ = useVuelidate(rules, state);

onMounted(() => {
  const {
    batch_no,
    return_date,
    submit_date,
    test_date,
    venue,
    start_time,
    end_time,
    interval,
    applicants_interval,
  } = props.batch || nextBatchDefaults.value;

  const venueID = getVenueByLabel(venue)?.id;

  state.form = {
    ...state.form,
    batch_no,
    return_date,
    submit_date,
    test_date,
    venue: venueID,
    start_time,
    end_time,
    interval,
    applicants_interval,
  };
});

async function submit() {
  try {
    const promise = isUpdate.value
      ? () => updateBloodBatch(props.batch?.id, state.form)
      : () => createBloodBatch(state.form);
    await promise();
    emit("submit");
  } catch (error) {
    console.log("I'm in submit error", error);
  }
}
</script>

<template>
  <div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <ModalHeader
          :title="`${
            isUpdate ? $t('UPDATE') : $t('NEW')
          } BLOOD TEST SUBMISSION BATCH`"
          @close="emit('close')"
        >
        </ModalHeader>
        <div
          class="modal-body d-flex flex-column justify-content-center align-items-stretch"
          style="gap: 3rem"
        >
          <div class="form-container">
            <div class="form-container-section">
              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Batch No:'"></label>
                <span>{{ v$.form.batch_no.$model }}</span>
              </div>

              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Submit Date:'"> </label>
                <CustomDatepicker
                  v-model:value="v$.form.submit_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                />
                <ErrorMessages :errors="v$.form.submit_date.$errors" />
              </div>

              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Test Place:'"> </label>
                <div class="flex-grow-1">
                  <BaseDropDown
                    v-model="v$.form.venue.$model"
                    :options="venues"
                    optionValue="id"
                    optionLabel="label"
                  />
                </div>
                <ErrorMessages :errors="v$.form.venue.$errors" />
              </div>
            </div>

            <div class="form-container-section">
              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Test Date:'"> </label>
                <CustomDatepicker
                  v-model:value="v$.form.test_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                />

                <ErrorMessages :errors="v$.form.test_date.$errors" />
              </div>
              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Return Date:'"> </label>
                <CustomDatepicker
                  v-model:value="v$.form.return_date.$model"
                  value-type="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled-date="expiryDisabledDates"
                />

                <ErrorMessages :errors="v$.form.return_date.$errors" />
              </div>
            </div>
          </div>

          <hr />

          <div class="form-container">
            <div class="form-container-section">
              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Start Time:'"> </label>
                <CustomDatepicker
                  v-model:value="v$.form.start_time.$model"
                  value-type="format"
                  type="time"
                  :disabled-date="expiryDisabledDates"
                />
                <ErrorMessages :errors="v$.form.start_time.$errors" />
              </div>

              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Interval:'"> </label>
                <div class="flex-grow-1">
                  <BaseDropDown
                    v-model="v$.form.interval.$model"
                    :options="intervals"
                    optionValue="value"
                    optionLabel="label"
                  />
                </div>
                <ErrorMessages :errors="v$.form.interval.$errors" />
              </div>
            </div>

            <div class="form-container-section">
              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'End Time:'"> </label>
                <CustomDatepicker
                  v-model:value="v$.form.end_time.$model"
                  value-type="format"
                  type="time"
                  :disabled-date="expiryDisabledDates"
                />
                <ErrorMessages :errors="v$.form.end_time.$errors" />
              </div>

              <div class="horizontal-form-field required-form-control">
                <label class="form-label" v-t="'Applicants per interval:'">
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="v$.form.applicants_interval.$model"
                />

                <ErrorMessages :errors="v$.form.applicants_interval.$errors" />
              </div>
            </div>
          </div>

          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <SaveButton
              type="button"
              class="btn btn-blue"
              :disabled="v$.form.$invalid"
              @click="submit()"
              >{{ $t("Submit") }}</SaveButton
            >
          </div>
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
  padding: 0px 0px;
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
  flex-wrap: wrap;
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
}

.horizontal-form-field .form-label {
  width: 100px;
}

.mx-datepicker,
.multiselect,
.p-multiselect {
  width: unset !important;
  flex-grow: 1;
}

hr {
  margin: 0px;
}
</style>
