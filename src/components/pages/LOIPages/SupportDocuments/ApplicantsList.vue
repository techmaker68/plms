<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Display LOI applicants and details
Allows editing/deleting LOI
Add Paxes to LOI
Rearrange paxes in LOI

***********************************
-->
<template>
  <div
    :class="{
      'view-only-container': viewOnly,
    }"
  >
    <div class="applicantListHtml">
      <div class="applicantHeader">
        <div class="logo">
          <img src="@/assets/img/antonLogo.png" alt="Anton Logo" />

          <div
            class="d-flex justify-content-end"
            v-if="!isApplicationClosed"
            style="position: absolute; right: 0px; top: 0px; gap: 0.5rem"
          >
            <button
              class="btn btn-icon action-button"
              v-if="hasDeletePermission"
              @click="showDeleteModal"
            >
              <span class="icon-icon-delete larger-icon">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
                <span class="path7"></span>
                <span class="path8"></span
              ></span>
            </button>

            <button
              type="button"
              class="btn btn-link btn-icon ms-auto company-edit-icon edit-icon btn-edit"
              v-if="viewOnly && hasEditPermission"
              @click="enableEdit"
            >
              <span class="icon-edit"></span>
            </button>
          </div>
        </div>

        <div class="info border-form-custom">
          <div
            class="d-flex flex-column justify-content-start align-items-stretch"
            style="gap: 1rem"
          >
            <ul class="label-value main-ul">
              <li class="required-form-control">
                <label><span v-t="'LOI Batch NO'"></span>.</label>
                <input
                  type="text"
                  class="form-control personal-fields batch-number"
                  :disabled="viewOnly"
                  v-model="v$.loiForm.batch_no.$model"
                />
              </li>
              <li class="required-form-control">
                <label><span v-t="'LOI Type:'"></span></label>
                <div class="input-container">
                  <BaseDropDown
                    class="base-dropdown"
                    v-model="v$.loiForm.loi_type.$model"
                    :options="loiStore.loiTypes"
                    optionValue="id"
                    optionLabel="value"
                    :disabled="viewOnly"
                  />
                </div>
              </li>
              <li class="required-form-control">
                <label><span v-t="'Nation Category'"></span></label>
                <div class="input-container">
                  <BaseDropDown
                    class="base-dropdown"
                    v-model="v$.loiForm.nation_category.$model"
                    :options="loiStore.nationCategories"
                    optionValue="id"
                    optionLabel="value"
                    :disabled="viewOnly"
                  />
                </div>
              </li>
              <li>
                <label><span v-t="'Company Name:'"></span></label>
                <BaseDropDown
                  v-model="v$.loiForm.company_id.$model"
                  :options="configStore.companies"
                  optionValue="id"
                  optionLabel="name"
                  :disabled="viewOnly"
                />
              </li>
              <li>
                <label
                  ><span v-t="'The companys address inside Iraq:'"></span
                ></label>
                <input
                  type="text"
                  class="form-control personal-fields"
                  :disabled="viewOnly"
                  v-model="v$.loiForm.company_address_iraq_ar.$model"
                />
              </li>
              <li>
                <label
                  ><span v-t="'The companys address outside Iraq:'"></span
                ></label>
                <input
                  type="text"
                  class="form-control personal-fields"
                  :disabled="viewOnly"
                  v-model="v$.loiForm.company_address_ar.$model"
                />
              </li>

              <li>
                <label><span v-t="'Request Date'"></span></label>
                <div class="input-container">
                  <CustomDatepicker
                    class="request-date"
                    v-model:value="v$.loiForm.submission_date.$model"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    :disabled-date="defaultDisabledDates"
                    :disabled="viewOnly"
                  />
                </div>
              </li>
              <li>
                <label><span v-t="'Contract Expiry:'"></span></label>
                <div class="input-container">
                  <CustomDatepicker
                    v-model:value="v$.loiForm.contract_expiry.$model"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    :disabled-date="defaultDisabledDates"
                    :disabled="viewOnly"
                  />
                </div>
              </li>
              <li>
                <label><span v-t="'The purpose of entry:'"></span></label>
                <input
                  type="text"
                  class="form-control personal-fields"
                  :disabled="viewOnly"
                  v-model="v$.loiForm.entry_purpose.$model"
                />
              </li>
              <li>
                <label><span v-t="'Entry Attribute Type:'"></span></label>
                <input
                  type="text"
                  class="form-control personal-fields"
                  :disabled="viewOnly"
                  v-model="v$.loiForm.entry_type.$model"
                />
              </li>
              <li>
                <label v-t="'Priority'"></label>
                <BaseDropDown
                  v-model="v$.loiForm.priority.$model"
                  :options="loiStore.loiPriorities"
                  optionValue="id"
                  optionLabel="value"
                  :disabled="viewOnly"
                />
              </li>
              <li>
                <label v-t="'Expected issue date'"></label>
                <input
                  type="text"
                  class="form-control personal-fields"
                  :disabled="viewOnly"
                  v-model="v$.loiForm.expected_issue_date.$model"
                />
              </li>
            </ul>

            <div class="save-buttons-container" v-if="!viewOnly">
              <CancelButton
                type="button"
                class="btn btn-secondary"
                @click="disableEdit"
              ></CancelButton>

              <SaveButton
                type="button"
                class="btn btn-blue"
                @click="emitUpdate"
                :disabled="!v$.loiForm.$anyDirty || v$.loiForm.$invalid"
              >
                {{ $t("Update") }}
              </SaveButton>
            </div>
          </div>
          <img
            src="@/assets/img/profile.png"
            class="small-profile-image"
            alt=""
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div class="d-flex justify-content-start align-items-center">
          <button
            v-if="enableImport"
            class="btn btn-outline-primary btn-icon"
            @click="showImportModal"
          >
            <img src="@/assets/fonts/icons/user-icon.svg" alt="" />
            <span v-t="'Add Paxes'"></span>
          </button>
        </div>

        <div
          class="d-flex justify-content-end align-items-center"
          style="gap: 1rem"
        >
          <!-- <FadeInTransition>
            <button
              v-if="
                selectedItems.length &&
                hasEditPermission &&
                !isApplicationClosed
              "
              class="btn btn-outline-primary text-primary"
              @click="showMultipleDetailsModal()"
            >
              <span v-t="'Update Multiple'"></span>
            </button>
          </FadeInTransition> -->
          <FadeInTransition>
            <button
              class="btn btn-outline-primary text-primary btn-icon"
              v-if="
                hasEditPermission &&
                !isApplicationClosed &&
                selectedItems?.length
              "
              @click="showDeleteApplicantsModal"
            >
              <span class="icon-deleteIcon"></span>
              <span v-t="'Remove Selected from list'"></span>
            </button>
          </FadeInTransition>
          <div
            class="d-flex flex-row justify-content-end"
            v-tooltip.top="
              disableEmailFiles
                ? $t('Workflow not yet completed')
                : $t('Email files to LOI Admins')
            "
          >
            <button
              v-if="applicants?.length"
              :disabled="disableEmailFiles"
              class="btn btn-blue"
              @click="showEmailFilesModal"
            >
              <span v-t="'Email Files'"></span>
            </button>
          </div>
        </div>
      </div>
      <EasyDataTable
        v-model:[customvModelWorkaround]="selectedItems"
        v-bind="{
          ...(this.isApplicationClosed ? {} : defaultMultiSelectionOptions),
          ...extraOptions,
        }"
        class="easy-table"
        header-text-direction="center"
        :headers="includedHeaders"
        @click-row="($event) => showDetailsModal($event?.id)"
        :items="applicantsVModel"
        :rows-per-page="99999"
        hide-footer
      >
        <template #body="tableItems">
          <draggable
            @end="sortApplicants"
            tag="tbody"
            class="draggable-body"
            handle=".handle"
            v-model="applicantsVModel"
            item-key="id"
          >
            <template
              #item="{
                index,
                element: {
                  id,
                  pax,
                  status,
                  last_loi,
                  receipt_no,
                  sequence_no,
                  loi_payment_date,
                },
              }"
            >
              <tr @click="showDetailsModal(id)">
                <template v-if="!isApplicationClosed">
                  <td @click.stop>
                    <SingleSelectCheckBox
                      :checked="tableItems[index]['checkbox']"
                      @change="onSelectItem(tableItems[index])"
                    />
                  </td>
                  <td class="handle" @click.stop>
                    <Fa :icon="faGrip" />
                  </td>
                </template>
                <td class="fw-bold">{{ sequence_no }}</td>
                <td class="table-fullname">
                  {{ checkValidValue(pax?.eng_full_name) }}
                </td>
                <td>{{ checkValidValue(pax?.pax_id) }}</td>
                <td>
                  {{ checkValidValue(pax?.latest_passport?.passport_no) }}
                </td>
                <td>
                  {{ checkValidValue(pax?.nationality?.country_name_short_en) }}
                </td>
                <td>{{ checkValidValue(pax?.department?.name) }}</td>
                <td>{{ checkValidValue(pax?.company?.name) }}</td>
                <td>{{ checkValidValue(pax?.type) }}</td>
                <td>
                  {{
                    checkValidValue(
                      loiStore.getLOIApplicantStatusById(status)?.value
                    )
                  }}
                </td>
                <td>
                  <span
                    class="text-uppercase"
                    :class="{
                      'expired-visa-status-badge': !loi_payment_date,
                    }"
                  >
                    {{ loi_payment_date ? loi_payment_date : $t("UNPAID") }}
                  </span>
                </td>
                <td>
                  <div class="table-headings">
                    <img
                      v-if="last_loi"
                      src="@/assets/fonts/icons/pdf.svg"
                      alt="pdf"
                      class="pdf-icon"
                    />
                    <u class="bold-text">{{ last_loi }}</u>
                  </div>
                </td>
                <td>
                  <div class="loi-heading">
                    <img
                      v-if="receipt_no"
                      src="@/assets/fonts/icons/pdf.svg"
                      alt="pdf"
                      class="pdf-icon"
                    />
                    <u class="bold-text">{{ receipt_no }}</u>
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
        </template>
      </EasyDataTable>
    </div>
  </div>

  <VueModal v-model="paxTableModal" wrapperClass="vm-xlg vm-body-no-padding">
    <GenericModal
      :title="$t('Search and import PAXES')"
      @close="hideImportModal"
    >
      <ImportPax
        :batch-no="batchNumber"
        :initial-nation-category="nationCategory"
        @import="importFromPaxProfiles"
      />
    </GenericModal>
  </VueModal>

  <VueModal
    v-model="applicationDetailsModal"
    wrapperClass="vm-lg vm-body-no-padding"
    @closed="resetDetailsValues"
  >
    <GenericModal :title="modalTitle" @close="hideDetailsModal">
      <LOIUpdateApplicant
        :applicant-id="applicantID"
        :applicant-ids="applicantsIds"
        :application="application"
        @delete="hideModalAndRefresh"
        @submit="hideModalAndRefresh"
      />
    </GenericModal>
  </VueModal>

  <VueModal v-model="deleteModal">
    <ConfirmModal
      @close="hideDeleteModal"
      @confirm="emitDelete"
      :title="$t('Delete LOI')"
      :message="$t('Are you sure you want to delete this request?')"
    />
  </VueModal>

  <VueModal v-model="deleteApplicantsModal">
    <ConfirmModal
      @close="hideDeleteApplicantsModal"
      @confirm="emitDeleteApplicants"
      :title="$t('Delete Applicants')"
      :message="$t('Are you sure you want to delete these applicants?')"
    />
  </VueModal>

  <VueModal v-model="emailFilesModal">
    <ConfirmModal
      @close="hideEmailFilesModal"
      @confirm="emitDownloadAll"
      :title="$t('Email files')"
      :message="
        $t(
          'E-mail file packages to system administrators? It would take a few minutes for the files to be generated'
        )
      "
    />
  </VueModal>
</template>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import LOIUpdateApplicant from "../components/LOIUpdateApplicant.vue";
import { useConfigStore, useLOIStore, useUserStore } from "@/stores";
import "vue-datepicker-next/index.css";
import "vue3-easy-data-table/dist/style.css";
import draggable from "vuedraggable";
import ImportPax from "../components/ImportPax.vue";
import SingleSelectCheckBox from "../components/SingleSelectCheckBox.vue";
import GenericModal from "@/components/common/GenericModal.vue";
import {
  checkValidValue,
  cleanArrayObjects,
  defaultDisabledDates,
} from "@/helpers";
import { PermissionsEnum, SortApplicantsTypeEnum } from "@/data";
import Fa from "vue-fa";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import useVuelidate from "@vuelidate/core";
import { helpers, numeric, required } from "@vuelidate/validators";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useTable } from "@/composables";
import FadeInTransition from "@/components/common/FadeInTransition.vue";
import CancelButton from "@/components/common/CancelButton.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

export default defineComponent({
  name: "ApplicantsList",
  props: ["applicants", "application", "disableEmailFiles", "enableImport"],
  setup() {
    const v$ = useVuelidate();
    const { defaultMultiSelectionOptions, selectedItems, extraOptions } =
      useTable();
    return {
      faGrip,
      v$,
      defaultMultiSelectionOptions,
      extraOptions,
      selectedItems,
    };
  },
  expose: ["selectedItems", "enableEdit", "showImportModal"],
  data() {
    return {
      viewOnly: true,
      paxTableModal: false,
      deleteModal: false,
      deleteApplicantsModal: false,
      applicationDetailsModal: false,
      emailFilesModal: false,
      applicantID: null,
      applicantsIds: [],
      applicantsVModel: [],
      headers: [
        { text: "", value: "sortable", width: 40 },
        { text: "#", value: "sequence", width: 20 },
        { text: "Full Name", value: "full_name" },
        { text: "Pax ID", value: "pax_id", width: 60 },
        { text: "Passport No.", value: "passport_no", width: 90 },
        { text: "Nationality", value: "nationality", width: 80 },
        { text: "Department", value: "department" },
        { text: "Employer", value: "employer", width: 100 },
        { text: "Type", value: "pax_type", width: 70 },
        { text: "Status", value: "status", width: 70 },
        { text: "LOI Payment Date", value: "loi_payment_date", width: 150 },
        { text: "Last LOI", value: "last_loi" },
        { text: "Receipt No.", value: "receipt_no" },
      ],
      loiForm: {
        batch_no: "",
        nation_category: "",
        loi_type: "",
        submission_date: "",
        company_id: "",
        company_address_iraq_ar: "",
        company_address_ar: "",
        entry_purpose: "",
        entry_type: "",
        contract_expiry: "",
        priority: "",
        expected_issue_date: "",
      },
      defaultDisabledDates,
      checkValidValue,
    };
  },
  validations() {
    return {
      loiForm: {
        batch_no: {
          numeric: helpers.withMessage("Invalid batch number", numeric),
        },
        nation_category: {
          required: helpers.withMessage("This field is required", required),
        },
        nation_category: {
          required: helpers.withMessage("This field is required", required),
        },
        loi_type: {
          required: helpers.withMessage("This field is required", required),
        },
        submission_date: {},
        company_id: {},
        company_address_iraq_ar: {},
        company_address_ar: {},
        entry_purpose: {},
        entry_type: {},
        contract_expiry: {},
        priority: {},
        expected_issue_date: {},
      },
    };
  },
  emits: ["refresh", "update", "delete", "deleteApplicants", "downloadAll"],
  components: {
    LOIUpdateApplicant,
    ImportPax,
    GenericModal,
    draggable,
    Fa,
    BaseDropDown,
    ConfirmModal,
    SingleSelectCheckBox,
    FadeInTransition,
    CancelButton,
    SaveButton,
    CustomDatepicker,
  },
  methods: {
    async sortApplicants() {
      try {
        await this.loiStore.sortApplicants(
          SortApplicantsTypeEnum.LOIApplicants,
          this.applicantsVModel.map(({ id }) => id)
        );
        this.emitRefresh();
      } catch (error) {
        console.log("Error sorting applicants", error);
      }
    },
    showImportModal() {
      if (this.enableImport) {
        this.paxTableModal = true;
      }
    },
    hideImportModal() {
      this.paxTableModal = false;
    },
    showDetailsModal(id) {
      this.applicantID = id;
      this.applicationDetailsModal = true;
    },
    showMultipleDetailsModal() {
      this.applicantsIds = this.selectedItems.map((element) => element.id);
      this.applicationDetailsModal = true;
    },
    hideDetailsModal() {
      this.applicationDetailsModal = false;
    },
    resetDetailsValues() {
      this.applicantID = null;
      this.applicantsIds = [];
    },
    hideModalAndRefresh() {
      this.hideDetailsModal();
      this.emitRefresh();
    },
    showDeleteModal() {
      this.deleteModal = true;
    },
    hideDeleteModal() {
      this.deleteModal = false;
    },
    showDeleteApplicantsModal() {
      if (this.selectedItems.length) {
        this.deleteApplicantsModal = true;
      }
    },
    hideDeleteApplicantsModal() {
      this.deleteApplicantsModal = false;
    },
    showEmailFilesModal() {
      this.emailFilesModal = true;
    },
    hideEmailFilesModal() {
      this.emailFilesModal = false;
    },
    emitRefresh() {
      this.$emit("refresh");
    },
    emitUpdate() {
      this.$emit("update", this.v$.loiForm.$model);
      this.viewOnly = true;
    },
    emitDelete() {
      this.$emit("delete", this.applicantID);
      this.hideDeleteModal();
    },
    emitDeleteApplicants() {
      this.$emit("deleteApplicants", this.selectedItems);
      this.hideDeleteApplicantsModal();
    },
    emitDownloadAll() {
      this.$emit("downloadAll");
      this.hideEmailFilesModal();
    },
    async importFromPaxProfiles(pax_ids) {
      if (pax_ids?.length) {
        const data = {
          batch_no: this.batchNumber,
          pax_ids: pax_ids.map((element) => element.pax_id).join(","),
        };

        await this.loiStore.importApplicantList(data);
        this.hideImportModal();
        this.$emit("refresh");
      }
    },
    enableEdit() {
      this.viewOnly = false;
    },
    disableEdit() {
      this.viewOnly = true;
      this.syncFormWithItem(this.application);
    },
    onSelectItem(item) {
      const isAlreadyChecked = item.checkbox;
      // eslint-disable-next-line no-param-reassign
      delete item.checkbox;
      // eslint-disable-next-line no-param-reassign
      delete item.index;
      if (!isAlreadyChecked) {
        const selectItemsArr = this.selectedItems;
        selectItemsArr.unshift(item);
        this.selectedItems = selectItemsArr;
      } else {
        this.selectedItems = this.selectedItems.filter(
          (element) => element.id !== item.id
        );
      }
    },
    syncFormWithItem(newApplication) {
      const {
        company_address_ar,
        company_address_iraq_ar,
        company,
        contract_expiry,
        entry_purpose,
        entry_type,
        priority,
        expected_issue_date,
      } = newApplication || {};
      this.loiForm = {
        ...this.loiForm,
        batch_no: this.batchNumber,
        nation_category: this.nationCategory,
        loi_type: this.loiType,
        submission_date: this.requestDate,
        company_address_ar,
        company_address_iraq_ar,
        company_id: company?.id,
        contract_expiry,
        entry_purpose,
        entry_type,
        priority,
        expected_issue_date,
      };
    },
  },
  async mounted() {
    this.selectedFilter = this.nationCategory;
  },
  watch: {
    applicants: {
      immediate: true, // Trigger the watch immediately on component creation
      handler(newApplicants) {
        this.applicantsVModel = newApplicants;
      },
    },
    application: {
      handler(newApplication) {
        this.syncFormWithItem(newApplication);
      },
    },
  },
  computed: {
    ...mapStores(useLOIStore, useConfigStore, useUserStore),
    applicantsFilteredList() {
      return cleanArrayObjects(this.applicants);
    },
    loiTypeText() {
      return this.loiStore.getLOITypeById(this.loiType)?.value;
    },
    nationCategoryText() {
      return this.loiStore.getNationCategoryById(this.nationCategory)?.value;
    },
    companyName() {
      return this.configStore.getCompanyById(this.application.company_id)?.name;
    },
    requestDate() {
      return this.application?.submission_date;
    },
    batchNumber() {
      return +this.application?.batch_no;
    },
    nationCategory() {
      return this.application?.nation_category;
    },
    loiType() {
      return this.application?.loi_type;
    },
    loiID() {
      return this.application?.id || this.id;
    },
    downloadedFileName() {
      if (this.batchNumber) {
        let fileName = this.batchNumber + "_applicants_list";
        return fileName;
      } else {
        return "applicants_list";
      }
    },
    modalTitle() {
      if (this.selectedItems.length) {
        return this.$t("UPDATE LOI APPLICANTS");
      } else {
        return this.$t("LOI APPLICANT DETAILS");
      }
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_EDIT);
    },
    hasDeletePermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_DELETE);
    },
    isApplicationClosed() {
      return !!this.application?.close_date;
    },
    includedHeaders() {
      return this.isApplicationClosed
        ? this.headers.slice(1, this.headers.length)
        : this.headers;
    },
    customvModelWorkaround() {
      return this.isApplicationClosed ? "workaround" : "items-selected";
    },
  },
});
</script>

<style scoped lang="scss">
$input-padding: 0.875rem;

.view-only-container {
  background-color: transparent;

  :deep(.p-dropdown-label) {
    padding: 8px 0px;
  }
}

.form-control,
::v-deep(.multiselect-single-label) {
  padding-inline-start: 0.875rem !important;
  font-size: 12px;
}

.main-ul li {
  min-height: 28px;
}

.nav.nav-tabs .nav-link {
  padding: 0.5rem 1.5rem;
}

.label-value {
  display: flex;
  flex-wrap: wrap;
}

.label-value li {
  width: 45%;

  .input-container {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
  }

  strong {
    padding-inline-start: $input-padding;
  }

  label,
  strong,
  .base-dropdown {
    line-height: 1.5;
  }

  .request-date {
    max-height: 28px;
    font-size: 12px;
    font-weight: 400;
    color: #ff6600;
  }

  ::v-deep(.mx-input) {
    padding-inline-start: 0.875rem;
  }
}

.batch-number {
  font-size: 12px;
  font-weight: 600;
  color: #ff6600;
}

.table-headings p {
  padding-inline-start: 2px;
  padding-block-start: 9px;
}

.pdf-icon {
  margin-inline-end: 5px;
}

.table-fullname {
  font-weight: bold;
}

:deep(.easy-table) {
  .draggable-body {
    tr {
      height: var(--easy-table-body-row-height);
      color: var(--easy-table-body-row-font-color);
      font-size: var(--easy-table-body-row-font-size);
    }

    td {
      border-bottom: 1px solid #bdbdbd !important;
      padding: 0px 5px;
    }
  }

  th {
    padding: 0px;
  }

  th,
  td {
    text-align: center;
  }

  .vue3-easy-data-table__header tr th,
  .vue3-easy-data-table__body tr td,
  .draggable-body tr td {
    &:nth-last-of-type(2) {
      border-left: 1px solid #bdbdbd !important;
    }
  }

  .vue3-easy-data-table__header tr th:nth-last-of-type(-n + 2),
  .bold-text {
    font-weight: bold;
    width: 88px;
  }

  .vue3-easy-data-table__header tr th:nth-child(-n + 9) {
    color: #8493a5;
  }
}

.action-button {
  background-color: unset;
  border: unset;
}

.btn.text-primary {
  font-size: 1.2rem;
}

.btn-outline-primary:hover {
  color: white !important;
}

:deep(.custom-select) {
  flex-grow: 1;
}
</style>
