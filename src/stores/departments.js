/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
*/
import { defineStore } from "pinia";
import apiservices from "@/services/apiservices";
import { convertToFormData, removeInvalidFields } from "@/helpers";

export const useDepartmentStore = defineStore("department", {
  state: () => ({}),
  getters: {},
  actions: {
    async getDepartmentList(paginationObject = {}, extraFilters = {}) {
      const response = await apiservices.get(`department`, {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraFilters,
        }),
      });
      return response.data;
    },
    async getDepartmentDetail(id) {
      const response = await apiservices.get(`department/${id}`);
      return response.data.data;
    },
    async addDepartment(data) {
      const formData = convertToFormData(data);

      await apiservices.post(`department`, formData);
    },
    async editDepartment(id, data) {
      const formData = convertToFormData({
        ...data,
      });

      await apiservices.put(`department/${id}`, formData);
    },
    async deleteDepartment(id) {
      await apiservices.delete(`department/${id}`);
    },
  },
});
