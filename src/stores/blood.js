/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood store
Saves nextBatchDefaults

***********************************
*/
import { defineStore } from "pinia";
import { apiservices, infiniteNotificationInstance } from "@/services";
import { excelContentType } from "@/data";
import { useConfigStore } from "./config";
import { removeInvalidFields } from "@/helpers";

export const useBloodStore = defineStore("blood", {
  state: () => ({
    nextBatchDefaults: null,
  }),
  getters: {
    enableCreateBatch() {
      if (this.nextBatchDefaults) {
        return !this.nextBatchDefaults?.current_week_batch;
      } else {
        return false;
      }
    },
  },
  actions: {
    async getBloodBatches(paginationObject, extraFilters = {}) {
      const response = await apiservices.get("bloodtests", {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraFilters,
        }),
      });
      this.nextBatchDefaults = response.data.meta.current_week_batch;
      return response.data;
    },
    async getBloodApplicants(paginationObject, extraFilters = {}) {
      const response = await apiservices.get(`blood-applicants`, {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraFilters,
        }),
      });
      return response.data;
    },
    async getBloodApplicant(id) {
      const response = await apiservices.get(`blood-applicants/${id}`);
      return response.data;
    },
    async createBloodBatch(body) {
      const response = await apiservices.post("bloodtests", body);
      return response.data;
    },
    async updateBloodBatch(id, body) {
      const response = await apiservices.put(`bloodtests/${id}`, body);
      return response.data;
    },
    async saveBloodApplicant(body) {
      const response = await apiservices.post("blood-applicants", body);
      return response.data;
    },
    async updateBloodApplicant(id, body) {
      const response = await apiservices.put(`blood-applicants/${id}`, body);
      return response.data;
    },
    async updateMultipleBloodApplicants(ids = [], body) {
      const response = await apiservices.post(
        `blood-applicants/update_multiple_blood_applicants`,
        body,
        {
          params: {
            ids: ids.join(","),
          },
        }
      );
      return response.data;
    },
    async removeBloodApplicants(ids) {
      const response = await apiservices.delete(
        "blood-applicants/remove/multiple",
        {
          params: {
            ids,
          },
        }
      );
      return response.data;
    },
    async deleteBloodBatch(id) {
      const response = await apiservices.delete(`bloodtests/${id}`);
      return response.data;
    },
    async rescheduleApplicants(id) {
      const response = await apiservices.post("blood-applicants/reschedule", {
        id,
      });
      return response.data;
    },
    async emailApplicants(batch_no) {
      const response = await infiniteNotificationInstance.post(
        `send_email_to_applicants/${batch_no}`
      );
      return response.data;
    },
    async renewApplicantAppointment(applicantID, form) {
      const response = await apiservices.post(
        `blood-applicants/renew_appointment/${applicantID}`,
        form
      );
      return response.data;
    },
    async addApplicantPenalty(applicantID, form) {
      const response = await apiservices.post(
        `blood-applicants/add_penalty/${applicantID}`,
        form
      );
      return response.data;
    },
    async sendBloodApplicantsReport(form) {
      const response = await apiservices.post(`blood-applicants/report`, form);
      return response.data;
    },
  },
});
