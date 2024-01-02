/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Visa store
Stores visa types counts to use in visas filters

***********************************
*/
import { defineStore } from "pinia";
import { apiservices, tableInstance } from "@/services";
import { convertToFormData, removeInvalidFields } from "@/helpers";
import { StatusEnum, CustomAxiosConfigEnum } from "@/data";

export const useVisaStore = defineStore("visa", {
  state: () => ({
    visaType: ["Visitor", "3 months", "6 months", "12 months"],
    visaLocation: ["MEEV in Country", "MEEV", "others"],
    visa_types_counts: [],
  }),
  getters: {
    getCountByStatusId(state) {
      return (id) => {
        const countType = state?.visa_types_counts?.find(
          (type) => type.status == id
        );
        return countType ? countType?.count : 0;
      };
    },
  },
  actions: {
    async addVisa(data) {
      let formData = convertToFormData(data);

      await apiservices.post(`visa`, formData);
    },
    async updateVisa(id, data) {
      const formData = convertToFormData({
        ...data,
      });

      const response = await apiservices.put(`visa/${id}`, formData);
      return response.data.data;
    },
    async cancelVisa(id, data) {
      await apiservices.post(`visa/cancel/${id}`, data);
    },
    async getVisaList(paginationObject, extraParams = {}) {
      let response = await tableInstance.get("visa", {
        [CustomAxiosConfigEnum.FileName]: "Visa List.xlsx",
        params: removeInvalidFields({
          ...paginationObject,
          ...extraParams,
        }),
      });
      this.visa_types_counts = response?.data?.meta?.visa_types_counts;
      return response.data;
    },
    async getVisaDetail(id) {
      let response = await apiservices.get(`visa/${id}`);
      return response.data;
    },
    async deleteVisa(id) {
      await apiservices.delete(`visa/${id}`);
    },
  },
});
