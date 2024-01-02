<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

LOI request details
Displays all related docs, namelist, and timeline

***********************************
-->
<template>
  <DefineDocSaveContainer v-slot="{ $slots }">
    <div v-if="application && !viewOnly" class="loi-doc-save-container">
      <component :is="$slots.default" />

      <button class="btn btn-blue" type="submit" @click="onDocsSubmit">
        <span v-t="'Save'"></span>
      </button>
    </div>
  </DefineDocSaveContainer>

  <div
    class="wrapper loi-req"
    :class="{
      'view-only-container': viewOnly,
    }"
  >
    <div class="page-container LOIApplicationMain">
      <div class="loi__application__head">
        <BreadCrumbs :parent-name="Routes.LOIApplications" />
      </div>
      <ul
        class="nav nav-tabs loi-tabs-app custom-scrollbar flex-nowrap whitespace-nowrap overflow-auto v-overflow-hidden"
        id="myTab"
        role="tablist"
      >
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="appplicatnList-tab"
            data-bs-toggle="tab"
            data-bs-target="#appplicatnList-tab-pane"
            type="button"
            role="tab"
            aria-controls="appplicatnList-tab-pane"
            aria-selected="false"
          >
            <img
              class="nav-tab-icons"
              src="@/assets/fonts/icons/apli_icon.svg"
              alt=""
            />
            {{ $t("APPLICANTS") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="nameList-tab"
            data-bs-toggle="tab"
            data-bs-target="#nameList-tab-pane"
            type="button"
            role="tab"
            aria-controls="nameList-tab-pane"
            aria-selected="false"
          >
            <img
              class="nav-tab-icons"
              src="@/assets/fonts/icons/docword.svg"
              alt=""
            />
            {{ $t("NAME LIST") }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="supportletter-tab"
            data-bs-toggle="tab"
            data-bs-target="#supportletter-tab-pane"
            type="button"
            role="tab"
            aria-controls="supportletter-tab-pane"
            aria-selected="true"
          >
            <img
              class="nav-tab-icons"
              src="@/assets/fonts/icons/pdf.svg"
              alt=""
            />
            {{
              `${
                application?.majnoon_ref ? application?.majnoon_ref + "-" : ""
              }${$t("MAJNOON")}`
            }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="fms-tab"
            data-bs-toggle="tab"
            data-bs-target="#fms-tab-pane"
            type="button"
            role="tab"
            aria-controls="fms-tab-pane"
            aria-selected="false"
          >
            <img
              class="nav-tab-icons"
              src="@/assets/fonts/icons/pdf.svg"
              alt=""
            />
            {{
              `${application?.moo_ref ? application?.moo_ref + "-" : ""}${$t(
                "MOO"
              )}`
            }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="moo-tab"
            data-bs-toggle="tab"
            data-bs-target="#moo-tab-pane"
            type="button"
            role="tab"
            aria-controls="moo-tab-pane"
            aria-selected="false"
          >
            <img
              class="nav-tab-icons"
              src="@/assets/fonts/icons/pdf.svg"
              alt=""
            />
            {{
              `${application?.moi_ref ? application?.moi_ref + "-" : ""}${$t(
                "MOI"
              )}`
            }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="moi-tab"
            data-bs-toggle="tab"
            data-bs-target="#moi-tab-pane"
            type="button"
            role="tab"
            aria-controls="moi-tab-pane"
            aria-selected="true"
          >
            <img
              class="nav-tab-icons"
              src="@/assets/fonts/icons/pdf.svg"
              alt=""
            />
            {{
              `${
                application?.moi_2_ref ? application?.moi_2_ref + "-" : ""
              }${$t("MOI")}`
            }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="paymentInvoice-tab"
            data-bs-toggle="tab"
            data-bs-target="#paymentInvoice-tab-pane"
            type="button"
            role="tab"
            aria-controls="paymentInvoice-tab-pane"
            aria-selected="false"
            v-t="'PAYMENT LETTER'"
          ></button>
        </li>
        <li v-if="isSendLOIValid" class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="approveloi-tab"
            data-bs-toggle="tab"
            data-bs-target="#approveloi-tab-pane"
            type="button"
            role="tab"
            aria-controls="approveloi-tab-pane"
            aria-selected="false"
            v-t="'APPROVED LOI'"
          ></button>
        </li>
      </ul>

      <div class="tab-content loi-tabpane" id="myTabContent">
        <div
          class="tab-pane fade show active pt-0"
          id="appplicatnList-tab-pane"
          role="tabpanel"
          aria-labelledby="appplicatnList-tab"
          tabindex="0"
        >
          <ApplicantsList
            ref="applicantsList"
            :application="application"
            :applicants="applicants"
            :disable-email-files="!isSendLOIValid"
            :enable-import="enableImport"
            @download-all="emailAllFiles"
            @refresh="getApplicantsList"
            @update="onUpdate"
            @delete="onDelete"
            @delete-applicants="onDeleteApplicants"
          />
        </div>
        <div
          class="tab-pane fade"
          id="nameList-tab-pane"
          role="tabpanel"
          aria-labelledby="nameList-tab"
          tabindex="0"
        >
          <NameListLoi
            ref="nameList"
            :application="application"
            :applicants="applicants"
          />
        </div>

        <div
          class="tab-pane fade"
          id="supportletter-tab-pane"
          role="tabpanel"
          aria-labelledby="supportletter-tab"
          tabindex="0"
        >
          <MajnoonDoc
            :ref="loiDocsEnum.Majnoon"
            :enable-download="enablePDFDownload"
            :application="application"
            :applicants="applicants"
          >
            <ReuseDocSaveContainer>
              <div class="loi-form-container border-form-custom">
                <div class="loi-form-col">
                  <label v-t="'Date'"></label>
                  <CustomDatepicker
                    class="field-required"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    v-model:value="application.majnoon_date"
                    :disabled-date="defaultDisabledDates"
                    @change="
                      docFormChange(docsFormsIndexEnum[loiDocsEnum.Majnoon])
                    "
                  />
                </div>

                <div class="loi-form-col">
                  <label v-t="'Ref'"></label>
                  <input
                    class="form-control"
                    v-model="application.majnoon_ref"
                    @change="
                      docFormChange(
                        docsFormsIndexEnum[loiDocsEnum.Majnoon],
                        true
                      )
                    "
                  />
                </div>
              </div>
            </ReuseDocSaveContainer>
          </MajnoonDoc>
        </div>
        <div
          class="tab-pane fade"
          id="fms-tab-pane"
          role="tabpanel"
          aria-labelledby="fms-tab"
          tabindex="0"
        >
          <MooDoc
            :ref="loiDocsEnum.Moo"
            :enable-download="enablePDFDownload"
            :application="application"
            :applicants="applicants"
          >
            <ReuseDocSaveContainer>
              <div class="loi-form-container border-form-custom">
                <div class="loi-form-col">
                  <label v-t="'Date'"></label>
                  <CustomDatepicker
                    class="field-required"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    v-model:value="application.moo_date"
                    @change="docFormChange(docsFormsIndexEnum[loiDocsEnum.Moo])"
                    :disabled-date="defaultDisabledDates"
                  />
                </div>

                <div class="loi-form-col">
                  <label v-t="'Ref'"></label>
                  <input
                    class="form-control"
                    v-model="application.moo_ref"
                    @change="
                      docFormChange(docsFormsIndexEnum[loiDocsEnum.Moo], true)
                    "
                  />
                </div>
              </div>
            </ReuseDocSaveContainer>
          </MooDoc>
        </div>
        <div
          class="tab-pane fade"
          id="moo-tab-pane"
          role="tabpanel"
          aria-labelledby="moo-tab"
          tabindex="0"
        >
          <Moi049Doc
            :ref="loiDocsEnum.Moi49"
            :enable-download="enablePDFDownload"
            :application="application"
            :applicants="applicants"
          >
            <ReuseDocSaveContainer>
              <div class="loi-form-container border-form-custom">
                <div class="loi-form-col">
                  <label v-t="'Date'"></label>
                  <CustomDatepicker
                    class="field-required"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    v-model:value="application.moi_date"
                    @change="
                      docFormChange(docsFormsIndexEnum[loiDocsEnum.Moi49])
                    "
                    :disabled-date="defaultDisabledDates"
                  />
                </div>

                <div class="loi-form-col">
                  <label v-t="'Ref'"></label>
                  <input
                    class="form-control"
                    v-model="application.moi_ref"
                    @change="
                      docFormChange(docsFormsIndexEnum[loiDocsEnum.Moi49], true)
                    "
                  />
                </div>
              </div>
            </ReuseDocSaveContainer>
          </Moi049Doc>
        </div>
        <div
          class="tab-pane fade"
          id="moi-tab-pane"
          role="tabpanel"
          aria-labelledby="moi-tab"
          tabindex="0"
        >
          <Moi051Doc
            :ref="loiDocsEnum.Moi51"
            :enable-download="enablePDFDownload"
            :application="application"
            :applicants="applicants"
          >
            <ReuseDocSaveContainer>
              <div class="loi-form-container border-form-custom">
                <div class="loi-form-col">
                  <label v-t="'Date'"></label>
                  <CustomDatepicker
                    class="field-required"
                    value-type="YYYY-MM-DD"
                    format="DD/MM/YYYY"
                    v-model:value="application.moi_2_date"
                    @change="
                      docFormChange(docsFormsIndexEnum[loiDocsEnum.Moi51])
                    "
                    :disabled-date="defaultDisabledDates"
                  />
                </div>

                <div class="loi-form-col">
                  <label v-t="'Ref'"></label>
                  <input
                    class="form-control"
                    v-model="application.moi_2_ref"
                    @change="
                      docFormChange(docsFormsIndexEnum[loiDocsEnum.Moi51], true)
                    "
                  />
                </div>
              </div>
            </ReuseDocSaveContainer>
          </Moi051Doc>
        </div>
        <div
          class="tab-pane fade"
          id="paymentInvoice-tab-pane"
          role="tabpanel"
          aria-labelledby="paymentInvoice-tab"
          tabindex="0"
        >
          <PaymentInvoice
            :view-only="viewOnly"
            :application="application"
            @submit="onSubmit"
          />
        </div>
        <div
          class="tab-pane fade"
          id="approveloi-tab-pane"
          role="tabpanel"
          aria-labelledby="approveloi-tab"
          tabindex="0"
        >
          <ApprovedLoi :view-only="viewOnly" :application="application" />
        </div>
      </div>
    </div>

    <div
      class="Addpassport sidebar sidebar--moreInfoSidebar d-flex flex-column flex-shrink-0 sidebar__menublock pt-3 pb-3 h-100 overflow-auto custom-scrollbar loi-timeline"
    >
      <LOITimelineForm
        :application="application"
        :applicants="finishedInitialLoad ? applicants : null"
        :allow-edit-previous-steps="hasEditTimelinePermission"
        :is-payment-letter-required="hasNonPaidApplicant"
        :enable-import="enableImport"
        @submit="onSubmit"
        @close="goBack"
        @send-loi-click="redirectToTab"
        @delete-document="deleteTimelineDocument"
        @add-pax="onAddPaxTitleClick"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick } from "vue";
import ApplicantsList from "./SupportDocuments/ApplicantsList.vue";
import MajnoonDoc from "./SupportDocuments/MajnoonDoc.vue";
import NameListLoi from "./SupportDocuments/NameListLoi.vue";
import MooDoc from "./SupportDocuments/MooDoc.vue";
import Moi049Doc from "./SupportDocuments/Moi049Doc.vue";
import Moi051Doc from "./SupportDocuments/Moi051Doc.vue";
import PaymentInvoice from "./SupportDocuments/PaymentInvoice.vue";
import ApprovedLoi from "./SupportDocuments/ApprovedLoi.vue";
import LOITimelineForm from "./components/LOITimelineForm.vue";
import "vue-datepicker-next/index.css";
import { sortBy } from "lodash-es";

import { useConfigStore, useLOIStore, useUserStore } from "@/stores";
import { mapStores } from "pinia";
import { LOIDocsEnum, PermissionsEnum, Routes } from "@/data";
import { defaultDisabledDates, sanitizeObject } from "@/helpers";
import { createReusableTemplate } from "@vueuse/core";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import CustomDatepicker from "@/components/common/CustomDatepicker.vue";

const [DefineDocSaveContainer, ReuseDocSaveContainer] =
  createReusableTemplate();

export default defineComponent({
  name: "LoiRequest",
  data() {
    return {
      application: null,
      enablePDFDownload: true,
      applicants: [],
      loiDocsEnum: LOIDocsEnum,
      docsFormsIndexEnum: {
        // This must follow docsFormsValues order, that's why we start with 0
        [LOIDocsEnum.Majnoon]: 0,
        [LOIDocsEnum.Moo]: 1,
        [LOIDocsEnum.Moi49]: 2,
        [LOIDocsEnum.Moi51]: 3,
      },
      finishedInitialLoad: false,
      defaultDisabledDates,
      Routes,
    };
  },
  components: {
    ApplicantsList,
    MajnoonDoc,
    MooDoc,
    Moi049Doc,
    PaymentInvoice,
    ApprovedLoi,
    Moi051Doc,
    NameListLoi,
    LOITimelineForm,
    DefineDocSaveContainer,
    ReuseDocSaveContainer,
    BreadCrumbs,
    CustomDatepicker,
  },
  methods: {
    async onSubmit(form) {
      try {
        const data = sanitizeObject({
          ...form,
        });

        const promise = this.isUpdate
          ? () => this.loiStore.updateLoiApplication(this.loiID, data)
          : () => this.loiStore.addLoiApplication(data);
        const newApplication = await promise();
        this.application = {
          ...this.application,
          ...newApplication,
        };

        this.getApplicantsList();
      } catch (error) {
        console.log("Error submitting LOI", error);
        throw new Error(error);
      }
    },
    async onDocsSubmit() {
      try {
        const data = sanitizeObject({
          ...(this.isUpdate && this.docsFormsValue
            ? { ...this.docsFormsValue.dates, ...this.docsFormsValue.refs }
            : {}),
        });

        const newApplication = await this.loiStore.updateLoiApplication(
          this.loiID,
          data
        );
        this.application = {
          ...this.application,
          ...newApplication,
        };

        this.getApplicantsList();
      } catch (error) {
        console.log("Error submitting LOI", error);
        throw new Error(error);
      }
    },
    async onUpdate(event) {
      try {
        await this.onSubmit(event, false);
      } catch (error) {
        this.$refs.applicantsList.enableEdit();
      }
    },
    async onDelete() {
      try {
        await this.loiStore.deleteApplication(this.loiID);
        this.goToApplicationsRoute();
      } catch (error) {
        console.log("Error deleting LOI", error);
      }
    },
    async onDeleteApplicants(items = []) {
      try {
        await this.loiStore.deleteApplicants(
          items.map((element) => element.id)
        );
        this.$refs.applicantsList.selectedItems = [];
        await this.getApplicantsList();
      } catch (error) {
        console.log("Error deleting LOI", error);
      }
    },
    docFormChange(offset, isRef = false) {
      let temp = {};
      if (isRef) {
        const { refs } = this.docsFormsValue;
        const baseValue = Object.values(refs)[offset];
        Object.keys(refs).forEach((key, index) => {
          let forecastedValue = +baseValue + (index - offset);
          if (+forecastedValue <= 0) {
            forecastedValue = "";
          }

          temp = {
            ...temp,
            [key]: refs[key] || forecastedValue,
          };
        });
      } else {
        const { dates } = this.docsFormsValue;
        const baseValue = Object.values(dates)[offset];
        Object.keys(dates).forEach((key, index) => {
          temp = {
            ...temp,
            [key]: dates[key] || baseValue,
          };
        });
      }

      this.application = {
        ...this.application,
        ...temp,
      };
    },
    redirectToTab() {
      let allNavLink = document.querySelectorAll(".loi-tabs-app .nav-link");
      let allTabsPane = document.querySelectorAll(".loi-tabpane .tab-pane");
      allNavLink.forEach((ele) => {
        ele.classList.remove("active");
        document.querySelector("#approveloi-tab").classList.add("active");
      });
      allTabsPane.forEach((element) => {
        element.classList.remove("show", "active");
        document
          .querySelector("#approveloi-tab-pane")
          .classList.add("show", "active");
      });
    },
    goBack() {
      this.goToApplicationsRoute();
    },
    goToApplicationsRoute() {
      this.$router.push({ name: Routes.LOIApplications });
    },
    async getApplicationDetails(id = this.loiID) {
      if (id) {
        this.application = await this.loiStore.getLoiApplicationDetails(id);
      }
    },
    async getApplicantsList(batchNumber = this.batchNumber) {
      if (batchNumber) {
        const applicantsResponse = await this.loiStore.getLoiApplicants(
          batchNumber,
          {
            all: true,
          }
        );
        this.applicants = applicantsResponse.data;
      }
    },
    async deleteTimelineDocument(event) {
      try {
        await this.loiStore.deleteLoiFile(this.loiID, event);
        await this.getApplicationDetails();
      } catch (error) {
        console.log("Error deleting document", error);
      }
    },
    async emailAllFiles() {
      try {
        const { file, name } = await this.$refs.nameList.downloadWordAr(false);
        const data = {
          file: new File([file], name),
          batch_no: this.batchNumber,
        };
        await this.loiStore.emailLOIFiles(data);
      } catch (error) {
        console.log("Error generating email", error);
      }
    },
    onAddPaxTitleClick() {
      this.$refs.applicantsList.showImportModal();
    },
  },
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
  },
  async mounted() {
    try {
      await this.getApplicationDetails();
      await this.getApplicantsList();
    } catch (error) {
    } finally {
      this.finishedInitialLoad = true;
    }
  },
  computed: {
    ...mapStores(useLOIStore, useUserStore, useConfigStore),
    loiID() {
      return this.application?.id || this.id;
    },
    batchNumber() {
      return this.application?.batch_no;
    },
    nationCategory() {
      return this.application?.nation_category;
    },
    submissionDate() {
      return this.application?.submission_date;
    },
    loiType() {
      return this.application?.loi_type;
    },
    isUpdate() {
      return !!this.application;
    },
    hasNonPaidApplicant() {
      const nonPaidApplicant = this.applicants.find(
        (element) => !element.loi_payment_date
      );
      return !!nonPaidApplicant;
    },
    docsFormsValue() {
      if (this.application) {
        const {
          majnoon_date,
          majnoon_ref,
          moi_date,
          moi_ref,
          moi_2_date,
          moi_2_ref,
          moo_date,
          moo_ref,
        } = this.application;

        /*
          The order here is IMPORTANT for the functionality to work correctly
          that's why we sort
        */
        const sortedArray = sortBy(
          [
            {
              pre: "majnoon",
              majnoon_date,
              majnoon_ref,
              index: this.docsFormsIndexEnum[LOIDocsEnum.Majnoon],
            },
            {
              pre: "moo",
              moo_date,
              moo_ref,
              index: this.docsFormsIndexEnum[LOIDocsEnum.Moo],
            },
            {
              pre: "moi",
              moi_date,
              moi_ref,
              index: this.docsFormsIndexEnum[LOIDocsEnum.Moi49],
            },
            {
              pre: "moi_2",
              moi_2_date,
              moi_2_ref,
              index: this.docsFormsIndexEnum[LOIDocsEnum.Moi51],
            },
          ],
          (element) => element.index
        );

        /* After sorting we extract refs and dates */
        let dates = {};
        let refs = {};

        sortedArray.forEach((element) => {
          dates = {
            ...dates,
            [`${element.pre}_date`]: element[`${element.pre}_date`],
          };

          refs = {
            ...refs,
            [`${element.pre}_ref`]: element[`${element.pre}_ref`],
          };
        });

        return {
          dates,
          refs,
        };
      } else {
        return null;
      }
    },
    hasAddPaxesPermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_ADD_PAXES);
    },
    hasReAddPaxesPermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_READD_PAX);
    },
    hasEditPermission() {
      return this.userStore.hasPermission(PermissionsEnum.LOI_BATCH_EDIT);
    },
    hasEditTimelinePermission() {
      return this.userStore.hasPermission(
        PermissionsEnum.LOI_BATCH_TIMELINE_EDIT
      );
    },
    isApplicationClosed() {
      return !!this.application?.close_date;
    },
    viewOnly() {
      return !this.hasEditPermission || this.isApplicationClosed;
    },
    isSendLOIValid() {
      return this.application?.sent_loi_date;
    },
    enableImport() {
      if (
        this.hasAddPaxesPermission &&
        this.application &&
        !this.application?.close_date
      ) {
        return (
          !(this.application?.mfd_date && this.application?.mfd_ref) ||
          this.hasReAddPaxesPermission
        );
      } else {
        return false;
      }
    },
  },
});
</script>
<style scoped lang="scss">
$timeline-width: 30rem;

main {
  margin-inline-end: auto;
}

.nav.nav-tabs .nav-link {
  /* padding: 0.5rem 1.5rem; */
  padding: 13px 25px 14px 10px;
  font-weight: 500;
  @media (max-width: 1400px) {
    font-size: 1rem;
    font-weight: 400;
  }
}

.loi__application__head img {
  width: 10px;
  height: 16px;
  opacity: 0.5;
}
.Loi-heading {
  font-size: 10px;
  font-weight: 700;
  color: #000000;
  line-height: 12.1px;
}
.nav-tab-icons {
  padding-inline-end: 9.11px;
}

.wrapper {
  .page-container {
    flex-grow: 1;
    max-width: calc(100% - #{$timeline-width});
  }

  .loi-timeline {
    flex-basis: $timeline-width;
  }
}
</style>
