/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Company store
Contains companylist data until we migrate to pagination
Stores companies configurations like types, and status

***********************************
*/
import { defineStore } from "pinia";
import apiservices from "@/services/apiservices";
import { convertToFormData } from "@/helpers";

export const useCompanyStore = defineStore("company", {
  state: () => ({
    companyList: [],
    companyType: [
      "Owner",
      "Operator",
      "Partner",
      "Contractor",
      "Services Provider",
    ],
    industryType: ["IT", "Information Technology"],
    companyStatus: [
      { id: 1, status: "Approved" },
      { id: 2, status: "Pending" },
    ],
  }),
  getters: {
    companyCount(state) {
      return state.companyList.length;
    },
    approvedCompanies(state) {
      return state.companyList.filter((company) => {
        if (company.status == 1) {
          return company;
        }
      });
    },
    pendingCompanies(state) {
      return state.companyList.filter((company) => {
        if (company.status == 2) {
          return company;
        }
      });
    },
    approvedCompaniesCount() {
      return this.approvedCompanies.length;
    },
    pendingCompaniesCount() {
      return this.pendingCompanies.length;
    },
    getCompanyStatus(state) {
      return (statusID) =>
        state.companyStatus.find((company) => company.id == statusID);
    },
  },
  actions: {
    async getCompanyList(paginationObject = {}, extraFilters = {}) {
      const response = await apiservices.get("company", {
        params: {
          ...paginationObject,
          ...extraFilters,
        },
      });
      this.companyList = response.data.data;
      return response.data;
    },
    async getCompanyDetail(id) {
      const response = await apiservices.get(`company/${id}`);
      return response.data.data;
    },
    async addCompany(data) {
      const formData = convertToFormData(data);

      await apiservices.post("company", formData);
    },
    async editCompany(id, data) {
      const formData = convertToFormData({
        ...data,
      });

      await apiservices.put(`company/${id}`, formData);
    },
    async deleteCompany(id) {
      await apiservices.delete(`company/${id}`);
    },
  },
});
