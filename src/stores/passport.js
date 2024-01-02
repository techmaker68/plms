/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Passport store
Stores passport status counts to display in passport filters

***********************************
*/
import { defineStore } from "pinia";
import { apiservices } from "@/services";
import { convertToFormData, removeInvalidFields } from "@/helpers";

export const usePassportStore = defineStore("passport", {
  state: () => ({
    passport_status_counts: [],
  }),
  getters: {
    getCountByStatusId(state) {
      return (id) => {
        const countType = state?.passport_status_counts?.find(
          (type) => type.status == id
        );
        return countType ? countType?.count : 0;
      };
    },
  },
  actions: {
    async addPassport(data) {
      const formData = convertToFormData(data);

      await apiservices.post("passport", formData);
    },
    async updatePassport(id, data) {
      const formData = convertToFormData({
        ...data,
      });
      const response = await apiservices.put(`passport/${id}`, formData);
      return response.data.data;
    },
    async getPassportList(paginationObject, extraParams) {
      let response = await apiservices.get("passport", {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraParams,
        }),
      });
      this.passport_status_counts = response.data?.meta?.passport_status_counts;
      return response.data;
    },
    async getPassportDetails(passport_id) {
      let response = await apiservices.get(`passport/${passport_id}`);
      return response.data.data;
    },
    async deletePassport(id) {
      await apiservices.delete(`passport/${id}`);
    },
  },
});
