/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

plms store
Stores plms configurations, and personal types counts for use in PAX filters

***********************************
*/
import { defineStore } from "pinia";
import { apiservices } from "@/services";
import { convertToFormData, removeInvalidFields } from "@/helpers";
import { PaxStatusEnum } from "@/data";

export const usePLMSStore = defineStore("plms", {
  state: () => ({
    personnelType: [
      "Local",
      "Expat",
      "Iraqi Rotator",
      "Iraqi Commute",
      "VIP",
      "Visitor",
      "Contractor",
    ],
    personal_types_counts: [],
    status_counts: [],
    status: [
      { id: PaxStatusEnum.Onboard, value: "Onboard", value_ar: "داخل الموقع" },
      {
        id: PaxStatusEnum.Offboard,
        value: "Offboard",
        value_ar: "خارج الموقع",
      },
    ],
  }),

  actions: {
    async addPax(data) {
      const formData = convertToFormData(data);

      await apiservices.post("paxes", formData);
    },
    async updatePax(id, data) {
      const formData = convertToFormData({ ...data });

      const response = await apiservices.put(`paxes/${id}`, formData);
      return response.data.data;
    },
    async patchPax(id, data) {
      const formData = convertToFormData({ ...data });

      const response = await apiservices.patch(`paxes/${id}`, formData);
      return response.data.data;
    },
    async getPaxes(paginationObject, extraFilters = {}) {
      let response = await apiservices.get("paxes", {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraFilters,
        }),
      });
      this.personal_types_counts = response?.data?.meta?.type_counts;
      this.status_counts = response?.data?.meta?.status_counts;
      return response.data;
    },
    async getPaxDetails(id) {
      let response = await apiservices.get(`paxes/${+id}`);
      return response.data.data;
    },
    async deletePax(id) {
      await apiservices.delete(`paxes/${+id}`);
    },
  },
});
