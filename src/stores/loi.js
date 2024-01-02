/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

LOI store
Contains LOI configurations

***********************************
*/
import { defineStore } from "pinia";
import {
  apiservices,
  infiniteNotificationInstance,
  tableInstance,
} from "@/services";
import { convertToFormData, removeInvalidFields } from "@/helpers";
import {
  CustomAxiosConfigEnum,
  LOIApplicantStatusEnum,
  LOIApplicationIssuedEnum,
  LOIApplicationStatusEnum,
  LOINationCategories,
  LOIPriority,
  LOITypes,
} from "@/data";
import { useConfigStore } from "./config";

export const useLOIStore = defineStore("loi", {
  state: () => ({
    loiStatus: [
      { id: LOIApplicationStatusEnum.Open, value: "Open" },
      { id: LOIApplicationStatusEnum.Closed, value: "Closed" },
    ],
    loiIssued: [
      { id: LOIApplicationIssuedEnum.Issued, value: "Issued" },
      { id: LOIApplicationIssuedEnum.NotIssued, value: "Not Issued" },
    ],
    loiTypes: [
      { id: LOITypes.ThreeMonths, value: "3 Months", value_ar: "3 أشهر" },
      { id: LOITypes.SixMonths, value: "6 Months", value_ar: "6 أشهر" },
      { id: LOITypes.TwelveMonths, value: "12 Months", value_ar: "12 شهر" },
    ],
    loiPriorities: [
      { id: LOIPriority.Low, value: "Low", value_ar: "قليل" },
      { id: LOIPriority.Normal, value: "Normal", value_ar: "عادي" },
      { id: LOIPriority.High, value: "High", value_ar: "عالي" },
    ],
    loiApplicantStatus: [
      { id: LOIApplicantStatusEnum.Approved, value: "Approved" },
      { id: LOIApplicantStatusEnum.Rejected, value: "Rejected" },
      { id: LOIApplicantStatusEnum.Cancelled, value: "Cancelled" },
      { id: LOIApplicantStatusEnum.GiveUp, value: "Give Up" },
    ],
    nationCategories: [
      {
        id: LOINationCategories.Foreign,
        filterId: "foreign",
        value: "Foreigners",
        countries: ["Albania"],
      },
      {
        id: LOINationCategories.Arab,
        filterId: "arab",
        value: "Arabs",
        countries: [
          "Egypt",
          "Sudan",
          "Algeria",
          "Libya",
          "Lebanon",
          "Jordan",
          "Palestine",
        ],
      },
      {
        id: LOINationCategories.Syrian,
        filterId: "syrian",
        value: "Syrian",
        countries: ["Syrian Arab Republic"],
      },
    ],
  }),

  getters: {
    getNationCategoryById(state) {
      return (id) =>
        state.nationCategories.find((element) => +element.id == +id);
    },
    getLOITypeById(state) {
      return (id) => state.loiTypes.find((element) => +element.id == +id);
    },
    getLOIPriorityById(state) {
      return (id) => state.loiPriorities.find((element) => +element.id == +id);
    },
    getLOIApplicantStatusById(state) {
      return (id) =>
        state.loiApplicantStatus.find((element) => +element.id == +id);
    },
    getLOIStatusById(state) {
      return (id) => state.loiStatus.find((element) => +element.id == +id);
    },
  },
  actions: {
    async getLoiApplications(
      loi_management = false,
      paginationObject,
      extraFilters = {}
    ) {
      const response = await tableInstance.get("lois", {
        // We define custom parameter here
        [CustomAxiosConfigEnum.FileName]: "Applications.xlsx",
        params: removeInvalidFields({
          ...paginationObject,
          ...extraFilters,
          loi_management,
        }),
      });
      return response.data;
    },
    async renewLoi(batch_no) {
      const response = await apiservices.post(`lois/renew/${batch_no}`);
      return response.data.data;
    },
    async getLoiApplicationDetails(id) {
      const response = await apiservices.get(`lois/${id}`);
      return response.data.data;
    },
    async addLoiApplication(data) {
      const formData = convertToFormData(data);
      const response = await apiservices.post("lois", formData);
      return response.data.data;
    },
    async updateLoiApplication(id, data) {
      let formData = convertToFormData({
        ...data,
      });

      const response = await apiservices.patch(`lois/${id}`, formData);
      return response.data.data;
    },
    async getLoiApplicants(batch_no, extraFilters = {}) {
      const response = await apiservices.get(`loi-applicants`, {
        params: {
          ...extraFilters,
          batch_no,
        },
      });
      return response.data;
    },
    async deleteApplicant(id) {
      await apiservices.delete(`loi-applicants/${id}`);
    },
    async sendLoiToApplicants(data) {
      const formData = convertToFormData(data);
      const response = await apiservices.post(
        "loi-applicants/approved_email",
        formData
      );
      return response.data;
    },
    async importApplicantList(data) {
      await apiservices.post("loi-applicants/store/bulk", data);
    },
    async getLoiApplicantFullDetails(id) {
      const response = await apiservices.get(`loi-applicants/${id}`);
      return response.data;
    },
    async updateApplicantDetails(id, data) {
      const formData = convertToFormData(data);

      const response = await apiservices.patch(
        `loi-applicants/${id}`,
        formData
      );
      return response.data;
    },
    async updateMultipleApplicantDetails(batch_no, ids, data) {
      const formData = convertToFormData(data);

      await apiservices.put("loi-applicants/update/bulk", formData, {
        params: {
          batch_no,
          ids,
        },
      });
    },
    async deleteApplicantDocument(applicantID, index) {
      await apiservices.delete(
        `loi-applicants/delete/payment-letter-copy/${applicantID}`,
        {
          params: {
            index,
          },
        }
      );
    },
    async sortApplicants(applicants, ids) {
      const response = await apiservices.post(`sort_applicants_by_sequence`, {
        applicants,
        ids,
      });
      return response.data;
    },
    async deleteApplication(id) {
      const response = await apiservices.delete(`lois/${id}`);
      return response.data;
    },
    async deleteApplicants(ids = []) {
      const response = await apiservices.post(
        `loi-applicants/remove/applicant`,
        null,
        {
          params: {
            ids: ids.join(","),
          },
        }
      );
      return response.data;
    },
    async deleteLoiFile(id, data) {
      const response = await apiservices.delete(`lois/files/delete/${id}`, {
        data,
      });
      return response.data;
    },
    async emailLOIFiles(data) {
      const formData = convertToFormData(data);

      const response = await infiniteNotificationInstance.post(
        `lois/email_files`,
        formData
      );
      return response.data;
    },
    async getLOIPresentations() {
      const response = await apiservices.get(`get_presentations`);
      return response.data;
    },
    async saveLOIPresentations(data) {
      const formData = convertToFormData(data);

      const response = await apiservices.post(`save_presentations`, formData);
      return response.data;
    },
    async deletePresentation(id) {
      const response = await apiservices.delete(`delete_presentation/${id}`);
      return response.data;
    },
    async downloadPresentationFiles() {
      const { downloadBlob } = useConfigStore();
      const response = await apiservices.get(`download_presentation`, {
        responseType: "arraybuffer",
      });
      downloadBlob(
        new Blob([response.data], { type: "application/zip" }),
        "presentations.zip"
      );
    },
  },
});
