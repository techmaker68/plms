<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Send Email to LOI applicants

***********************************
-->
<template>
  <div
    class="d-flex flex-row justify-content-start align-items-stretch"
    :class="{
      'view-only-container': viewOnly,
    }"
    style="gap: 2rem"
  >
    <div class="d-flex flex-column pb-3" style="flex: 1 1 50rem">
      <div class="loiDetailsBlock">
        <h6 v-t="'LOI DETAILS'"></h6>
        <hr style="margin: 1rem 0 2rem" />
        <div class="row">
          <div class="col-6">
            <label v-t="'Batch No'"></label>
            <strong>{{ application?.batch_no }}</strong>
          </div>
          <div class="col-6">
            <label v-t="'LOI NO'"></label>
            <strong>{{ checkNonPrimitiveValue(application?.loi_no) }}</strong>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label v-t="'LOI Type'"></label>
            <strong>{{ loiTypeText(application?.loi_type) }}</strong>
          </div>
          <div class="col-6">
            <label v-t="'Nation Category'"></label>
            <strong>{{
              nationCategoryText(application?.nation_category)
            }}</strong>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label v-t="'Issued Date'"></label>
            <strong>{{ application?.loi_issue_date }}</strong>
          </div>
        </div>
      </div>

      <div
        class="d-flex flex-column justify-content-start align-items-stretch"
        style="gap: 2rem"
      >
        <h6 v-t="'SEND LOI TO APPLICANTS'"></h6>
        <hr class="my-1" />
        <div class="row">
          <div class="col-2"></div>
          <div
            class="col-10 d-flex flex-column justify-content-start align-items-stretch"
            style="gap: 0.5rem"
          >
            <div
              class="d-flex flex-row justify-content-between align-items-center"
              v-if="!viewOnly"
            >
              <div class="form-check-inline horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="v$.loi.all_applicants.$model"
                />
                <label class="form-check-label" v-t="'All Applicants'"></label>
              </div>

              <div class="form-check-inline horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="departmentManagersCheck"
                />
                <label
                  class="form-check-label"
                  v-t="'Department Managers'"
                ></label>
              </div>

              <div class="form-check-inline horizontal-form-field">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="focalPointsCheck"
                />
                <label class="form-check-label" v-t="'Focal Points'"></label>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-2">
            <label for="Passport" class="form-label text-primary">
              {{ $t("Department Managers") }}:
            </label>
          </div>
          <div class="col-10 d-flex">
            <Chips
              type="email"
              class="flex-grow-1"
              separator=","
              v-model="v$.loi.department_managers.$model"
              :class="{
                'p-invalid':
                  v$.loi.department_managers.$invalid &&
                  v$.loi.department_managers.$dirty,
              }"
              :allow-duplicate="false"
              :disabled="viewOnly"
            />
            <ChipsTooltip />
            <ErrorMessages :errors="v$.loi.department_managers.$errors" />
          </div>
        </div>

        <div class="row">
          <div class="col-2">
            <label for="Passport" class="form-label text-primary">
              {{ $t("Focal Points") }}:
            </label>
          </div>
          <div class="col-10 d-flex">
            <Chips
              type="email"
              class="flex-grow-1"
              separator=","
              v-model="v$.loi.loi_focal_points.$model"
              :class="{
                'p-invalid':
                  v$.loi.loi_focal_points.$invalid &&
                  v$.loi.loi_focal_points.$dirty,
              }"
              :allow-duplicate="false"
              :disabled="viewOnly"
            />
            <ChipsTooltip />
            <ErrorMessages :errors="v$.loi.loi_focal_points.$errors" />
          </div>
        </div>

        <div class="row">
          <div class="col-2">
            <label for="Passport" class="form-label text-primary" v-t="'To:'">
            </label>
          </div>
          <div class="col-10 d-flex">
            <Chips
              type="email"
              class="flex-grow-1"
              separator=","
              v-model="v$.loi.to.$model"
              :class="{
                'p-invalid': v$.loi.to.$invalid && v$.loi.to.$dirty,
              }"
              :allow-duplicate="false"
              :disabled="viewOnly"
            />
            <ChipsTooltip />
            <ErrorMessages :errors="v$.loi.to.$errors" />
          </div>
        </div>

        <div class="row">
          <div class="col-2">
            <label for="Passport" class="form-label text-primary" v-t="'CC:'">
            </label>
          </div>
          <div class="col-10 d-flex">
            <Chips
              type="email"
              class="flex-grow-1"
              separator=","
              v-model="v$.loi.cc.$model"
              :class="{
                'p-invalid': v$.loi.cc.$invalid && v$.loi.cc.$dirty,
              }"
              :allow-duplicate="false"
              :disabled="viewOnly"
            />
            <ChipsTooltip />
            <ErrorMessages :errors="v$.loi.cc.$errors" />
          </div>
        </div>

        <div class="row">
          <div class="col-2">
            <label for="Passport" class="form-label text-primary" v-t="'BCC:'">
            </label>
          </div>
          <div class="col-10 d-flex">
            <Chips
              type="email"
              class="flex-grow-1"
              separator=","
              v-model="v$.loi.bcc.$model"
              :class="{
                'p-invalid': v$.loi.bcc.$invalid && v$.loi.bcc.$dirty,
              }"
              :allow-duplicate="false"
              :disabled="viewOnly"
            />
            <ChipsTooltip />
            <ErrorMessages :errors="v$.loi.bcc.$errors" />
          </div>
        </div>
        <div class="row required-form-control">
          <div class="col-2">
            <label
              for="Passport"
              class="form-label text-primary"
              v-t="'Subject:'"
            >
            </label>
          </div>
          <div class="col-10">
            <input
              type="text"
              class="form-control"
              id="Passport"
              v-model="v$.loi.subject.$model"
              :disabled="viewOnly"
            />
            <ErrorMessages :errors="v$.loi.subject.$errors" />
          </div>
        </div>
        <div class="row required-form-control">
          <div class="col-2">
            <label
              for="Passport"
              class="form-label text-primary"
              v-t="'Contents:'"
            >
            </label>
          </div>
          <div class="col-10">
            <CustomEditor v-model="v$.loi.content.$model" :disabled="viewOnly">
            </CustomEditor>
            <ErrorMessages :errors="v$.loi.content.$errors" />
          </div>
        </div>
        <div class="row">
          <div class="col-2">
            <label
              class="text-primary mb-2 d-block"
              v-t="'Attachments'"
            ></label>
          </div>
          <div class="col-10">
            <input
              type="file"
              class="form-control personal-fields"
              ref="attachment"
              @input="uploadAttachment"
              multiple
              :disabled="viewOnly"
            />
            <InputFileTooltip />
          </div>
        </div>
        <div class="btn-grp d-flex justify-content-end mt-5">
          <button
            :disabled="v$.loi.$invalid || viewOnly"
            type="submit"
            @click="onSubmit"
            class="btn btn-blue reminder-btn"
          >
            <svg
              class="svg-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0L16 8L0 16V0ZM0 6.4V9.6L8 8L0 6.4Z" fill="white" />
            </svg>
            {{ $t("Send LOl to Applicants") }}
          </button>
        </div>
      </div>
    </div>
    <div class="card p-4 pdfDocView" style="flex: 5 1 auto">
      <h6 v-t="'LOI Preview'"></h6>
      <iframe :src="photoCopyURL" width="100%" height="800px"></iframe>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { useLOIStore, useSettingsStore } from "@/stores";
import { mapStores } from "pinia";
import {
  checkValidValue,
  extractFiles,
  excludeFromArray,
  includeUniqueToArray,
  removeInvalidFields,
  primitiveForEach,
} from "@/helpers";
import CustomEditor from "@/components/common/CustomEditor.vue";
import { EnvironmentEnum } from "@/data";
import Chips from "primevue/chips";
import InputFileTooltip from "@/components/common/InputFileTooltip.vue";
import ChipsTooltip from "@/components/common/ChipsTooltip.vue";

export default defineComponent({
  name: "ApprovedLoi",
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  data() {
    return {
      loi: {
        department_managers: [],
        loi_focal_points: [],
        to: [],
        to: [],
        cc: [],
        bcc: [],
        subject: "",
        content: "",
        attachment: "",
        all_applicants: false,
      },
      departmentManagersCheck: false,
      focalPointsCheck: false,
    };
  },
  validations() {
    return {
      loi: {
        content: {
          required: helpers.withMessage("This field is required", required),
        },
        subject: {
          required: helpers.withMessage("This field is required", required),
        },
        to: {
          $each: primitiveForEach(
            {
              email,
            },
            true
          ),
        },
        department_managers: {
          $each: primitiveForEach(
            {
              email,
            },
            true
          ),
        },
        loi_focal_points: {
          $each: primitiveForEach(
            {
              email,
            },
            true
          ),
        },
        cc: {
          $each: primitiveForEach(
            {
              email,
            },
            true
          ),
        },
        bcc: {
          $each: primitiveForEach(
            {
              email,
            },
            true
          ),
        },
        attachment: {},
        all_applicants: {},
      },
    };
  },
  props: {
    application: Object,
    viewOnly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ErrorMessages,
    CustomEditor,
    Chips,
    InputFileTooltip,
    ChipsTooltip,
  },
  methods: {
    uploadAttachment() {
      const { files } = extractFiles(this.$refs.attachment);
      this.loi.attachment = files;
      this.v$.loi.attachment.$touch();
    },
    async onSubmit() {
      try {
        this.v$.$touch();
        if (this.v$.loi.$invalid) {
          return;
        }

        const {
          all_applicants,
          cc,
          bcc,
          to,
          department_managers,
          loi_focal_points,
          ...form
        } = this.v$.loi.$model;

        const data = removeInvalidFields({
          ...form,
          department_managers: department_managers.join(","),
          loi_focal_points: loi_focal_points.join(","),
          to: to.join(","),
          cc: cc.join(","),
          bcc: bcc.join(","),
          all_applicants: all_applicants ? all_applicants : null,
          batch_no: this.application?.batch_no,
        });
        await this.loiStore.sendLoiToApplicants(data);
      } catch (error) {
        console.log("Error", error);
      }
    },
    loiTypeText(type) {
      return this.loiStore.getLOITypeById(type)?.value;
    },
    nationCategoryText(nationCategory) {
      return this.loiStore.getNationCategoryById(nationCategory)?.value;
    },
    checkNonPrimitiveValue(value) {
      return checkValidValue(value);
    },
  },
  computed: {
    ...mapStores(useLOIStore, useSettingsStore),
    photoCopyURL() {
      if (this.application?.loi_photo_copy) {
        return `${import.meta.env[EnvironmentEnum.StorageBaseURL]}/${
          this.application?.loi_photo_copy
        }`;
      } else {
        return "";
      }
    },
  },
  watch: {
    departmentManagersCheck: {
      handler(checked) {
        const { department_managers } = this.settingsStore.settings;
        if (!department_managers) {
          return;
        }

        const departmentManagersArray = department_managers.split(",");
        if (checked) {
          this.loi.department_managers = includeUniqueToArray(
            this.loi.department_managers,
            departmentManagersArray
          );
        } else {
          this.loi.department_managers = excludeFromArray(
            this.loi.department_managers,
            departmentManagersArray
          );
        }
      },
    },
    focalPointsCheck: {
      handler(checked) {
        const { loi_focal_points } = this.settingsStore.settings;
        if (!loi_focal_points) {
          return;
        }

        const focalPointsArray = loi_focal_points.split(",");
        if (checked) {
          this.loi.loi_focal_points = includeUniqueToArray(
            this.loi.loi_focal_points,
            focalPointsArray
          );
        } else {
          this.loi.loi_focal_points = excludeFromArray(
            this.loi.loi_focal_points,
            focalPointsArray
          );
        }
      },
    },
  },
});
</script>

<style scoped>
.sidebar--moreInfoSidebar__large {
  width: 35rem;
}
.form-check {
  padding-inline-start: 1.5em;
}
th .form-check {
  padding-block-end: 0;
}
.batch-list {
  position: relative;
  margin: 2rem -1.5rem;
  padding: 1rem 2rem;
}
.batch-list::after {
  content: "";
  position: absolute;
  border-bottom: 1px solid #dadada;
  width: 100%;
  left: 0;
  bottom: 0;
}
main {
  width: calc(100% - 53rem);
}
.label-value li label {
  width: 40%;
}
.label-value li.col-md-12 label {
  width: 19.5%;
}
.Addpassport .form-control {
  padding: 1rem;
  border-radius: 3px;
}
.Addpassport .form-label {
  color: #000;
}
.nav.nav-tabs .nav-link {
  padding: 0.5rem 1.5rem;
}
.loiDetailsBlock {
  margin-block-end: 12%;
}
.loiDetailsBlock label {
  width: 60%;
  padding-block-start: 5px;
  padding-block-end: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #a14f11;
}
.horizontal-form-field {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
}

.col-10 {
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
</style>
