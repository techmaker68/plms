<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Add/Edit/View department form

***********************************
-->
<template>
  <div
    class="main-tab addCompanyForm modal-form p-4"
    :class="{ 'view-only-container': viewOnly }"
  >
    <div class="main-tab-card">
      <div class="companyFormDetails">
        <div class="row" v-if="viewOnly && hasEditPermission">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-link btn-icon company-edit-icon edit-icon btn-edit"
              @click="enabledEditing"
            >
              <span class="icon-edit"></span>
            </button>
          </div>
        </div>
        <div class="Addpassport visadetails">
          <div>
            <div class="row">
              <div class="col-6 required-form-control">
                <label for="Passport" class="form-label" v-t="'Name'"></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.department.name.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.department.name.$errors" />
              </div>
              <div class="col-6 required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Company'"
                ></label>
                <BaseDropDown
                  v-model="v$.department.company_id.$model"
                  :options="companyStore.companyList"
                  :disabled="viewOnly"
                  optionValue="id"
                  optionLabel="name"
                />
                <ErrorMessages :errors="v$.department.company_id.$errors" />
              </div>
            </div>
            <div class="row">
              <div class="col-6 required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Manager Name'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.department.manager_name.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.department.manager_name.$errors" />
              </div>
              <div class="col-6 required-form-control">
                <label
                  for="Passport"
                  class="form-label"
                  v-t="'Abbreviation'"
                ></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="v$.department.abbreviation.$model"
                  :disabled="viewOnly"
                />
                <ErrorMessages :errors="v$.department.abbreviation.$errors" />
              </div>
            </div>
            <div
              class="mt-5 mb-3 btn-grp d-flex justify-content-between"
              style="gap: 0.5rem"
              v-if="!viewOnly"
            >
              <DeleteButton
                v-if="isItemValid && hasDeletePermission"
                type="button"
                class="btn btn-danger"
                @click="showDelete"
              >
              </DeleteButton>

              <div
                class="d-flex flex-grow-1 flex-row justify-content-end"
                style="gap: 1rem"
              >
                <CancelButton
                  type="button"
                  class="btn btn-secondary"
                  aria-label="Close"
                  @click="disableEditing"
                >
                </CancelButton>
                <SaveButton
                  class="btn btn-blue"
                  :disabled="v$.department.$invalid"
                  @click="onSubmit"
                >
                  {{ isItemValid ? $t("Update") : $t("Add") }}
                </SaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <VueModal v-model="showConfirmation">
    <ConfirmModal
      @close="cancelDelete"
      @confirm="deleteCompanyRecord"
      :title="$t('DELETE COMPANY?')"
      :message="
        $t(
          'There are paxes registered under this company, please unregister paxes from this company before deletion'
        )
      "
    />
  </VueModal>
</template>

<script>
import { defineComponent } from "vue";
import { useCompanyStore, useDepartmentStore, useUserStore } from "@/stores";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import ErrorMessages from "@/components/common/ErrorMessages.vue";
import { mapStores } from "pinia";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { isValidObject, validName } from "@/helpers";
import BaseDropDown from "@/components/common/BaseDropDown.vue";
import { PermissionsEnum } from "@/data";
import CancelButton from "@/components/common/CancelButton.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";

export default defineComponent({
  name: "DepartmentsManagementForm",
  setup() {
    const v$ = useVuelidate();

    return { v$ };
  },
  emits: {
    close: null,
  },
  data: function () {
    return {
      department: {
        name: "",
        company_id: "",
        manager_name: "",
        abbreviation: "",
      },
      errors: {},
      showConfirmation: false,
      viewOnly: false,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => null,
      required: false,
    },
  },
  components: {
    ErrorMessages,
    ConfirmModal,
    BaseDropDown,
    CancelButton,
    SaveButton,
    DeleteButton,
  },
  validations() {
    return {
      department: {
        name: {
          required,
        },
        company_id: {
          required,
        },
        manager_name: {
          required,
        },
        abbreviation: {
          required,
        },
      },
    };
  },
  computed: {
    ...mapStores(useCompanyStore, useDepartmentStore, useUserStore),
    isItemValid() {
      return isValidObject(this.item);
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.DEPARTMENT_EDIT);
    },
    hasDeletePermission() {
      return this.userStore.hasPermission(PermissionsEnum.DEPARTMENT_DELETE);
    },
    departmentID() {
      return this.item?.id;
    },
  },
  methods: {
    async onSubmit() {
      if (this.v$.department.$invalid) {
        return;
      }
      const formData = this.v$.department.$model;
      const data = {
        ...formData,
      };
      if (this.isItemValid) {
        try {
          await this.departmentStore.editDepartment(this.departmentID, data);
          this.closeModal(true);
        } catch (error) {
          this.errors = error?.response?.data?.errors;
        }
      } else {
        try {
          await this.departmentStore.addDepartment(data);
          this.closeModal(true);
        } catch (error) {
          this.errors = error?.response?.data?.errors;
        }
      }
    },
    enabledEditing() {
      this.viewOnly = false;
    },
    disableEditing() {
      console.log("v$", this.v$.$errors);
      this.viewOnly = true;

      this.syncFormWithItem(this.item);
    },
    showDelete() {
      this.showConfirmation = true;
    },
    cancelDelete() {
      this.showConfirmation = false;
    },
    async deleteCompanyRecord() {
      this.showConfirmation = false;

      await this.departmentStore.deleteDepartment(this.departmentID);
      this.closeModal(true);
    },
    closeModal(updateOnClose = false) {
      this.$emit("close", updateOnClose);
    },
    syncFormWithItem(newValue) {
      this.department = {
        ...this.department,
        name: newValue?.name,
        company_id: newValue?.company?.id,
        manager_name: newValue?.manager_name,
        abbreviation: newValue?.abbreviation,
      };
    },
  },
  watch: {
    item: {
      handler(newValue) {
        if (this.isItemValid) {
          this.viewOnly = true;

          this.syncFormWithItem(newValue);
        }
      },
      immediate: true,
    },
  },
});
</script>
