/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Settings store
Used for roles/permissions/users

***********************************
*/
import { removeInvalidFields } from "@/helpers";
import { apiservices } from "@/services";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  persist: false,
  state: () => ({
    settings: {},
  }),
  getters: {},
  actions: {
    async getRolesList(paginationObject, extraParams) {
      let response = await apiservices.get("roles", {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraParams,
        }),
      });
      return response.data;
    },
    async getPermissionsList(paginationObject, extraParams) {
      let response = await apiservices.get("permissions", {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraParams,
        }),
      });
      return response.data;
    },
    async savePermission(data) {
      let response = await apiservices.post("permissions", data);
      return response.data;
    },
    async updatePermission(id, data) {
      let response = await apiservices.put(`permissions/${id}`, data);
      return response.data;
    },
    async getRoleWithPermission(id) {
      let response = await apiservices.get(`roles/${id}`);
      return response.data.data;
    },
    async saveRole(data) {
      let response = await apiservices.post("roles", data);
      return response.data.data;
    },
    async updateRole(id, data) {
      let response = await apiservices.put(`roles/${id}`, data);
      return response.data;
    },
    async assignRoleToUsers(data) {
      let response = await apiservices.post(`/roles/assign_role_to_user`, data);
      return response.data;
    },
    async deleteRole(id) {
      let response = await apiservices.delete(`roles/${id}`);
      return response.data;
    },
    async deletePermission(id) {
      let response = await apiservices.delete(`permissions/${id}`);
      return response.data;
    },
    async getUsers(paginationObject = {}, extraFilters = {}) {
      let response = await apiservices.get(`auth/users`, {
        params: removeInvalidFields({
          ...paginationObject,
          ...extraFilters,
        }),
      });
      return response.data;
    },
    async getSettings() {
      const response = await apiservices.get("get_settings");
      this.settings = response.data.data;
      return response.data;
    },

    async saveSettings(data) {
      const response = await apiservices.post("save_settings", data);
      this.settings = response.data.result;
      return response.data;
    },
    async testEmails(data) {
      const response = await apiservices.post("test_emails", data);
      return response.data;
    },
    async addUser(data) {
      const response = await apiservices.post("auth/users", data);
      return response.data;
    },
    async updateUser(id, data) {
      const response = await apiservices.put(`auth/users/${id}`, data);
      return response.data;
    },
    async deleteUser(id) {
      const response = await apiservices.delete(`auth/users/${id}`);
      return response.data;
    },
  },
});
