/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Users store
Stores logged in user information

***********************************
*/
import {
  EnvironmentEnum,
  PermissionsEnum,
  QueryParamsEnum,
  Routes,
  storageEnum,
} from "@/data";
import { apiservices } from "@/services";
import { defineStore } from "pinia";
import { intersection } from "lodash-es";

export const useUserStore = defineStore("user", {
  persist: true,
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    hasToken(state) {
      return !!state.token;
    },
    fullName(state) {
      return state?.user?.name;
    },
    permissions(state) {
      return state?.user?.permissions?.length
        ? state?.user?.permissions?.map((element) => element.name)
        : [];
    },
    hasPermission(state) {
      return (permission) => {
        if (permission) {
          return this.permissions.length
            ? this.permissions.includes(permission)
            : false; // If permissions is empty, allow all|none
        } else {
          return false;
        }
      };
    },
    hasAnyPermission(state) {
      return (permissions) => {
        // Check if a value exists on both arrays, thus has permission
        if (permissions?.length) {
          return this.permissions.length
            ? !!intersection(permissions, this.permissions)?.length
            : false; // If permissions is empty, allow all|none
        } else {
          return false;
        }
      };
    },
  },
  actions: {
    setAuthenticationToken(token) {
      this.token = token;
    },
    removeAuthenticationToken() {
      this.token = null;
    },
    async logout() {
      try {
        await apiservices.post("auth/logout");
      } catch (error) {
        console.log("Error logging out", error);
      } finally {
        this.removeAuthenticationToken();
        this.$reset();
        this.redirectUnAuthorized();
      }
    },
    redirectUnAuthorized() {
      this.$router.push({
        name: Routes.AuthModule,
        replace: true,
      });
    },
    redirectAuthorized() {
      this.$router.push({
        name: Routes.DashboardModule,
        replace: true,
      });
    },
    async getCurrentUser() {
      if (this.hasToken) {
        const response = await apiservices.get("auth/current_user");
        this.user = response.data;
      }
    },
    async login(data) {
      const response = await apiservices.post("auth/login", data);
      const { token, ...user } = response.data;
      this.user = user;
      this.setAuthenticationToken(token);
      this.redirectAuthorized();
    },
  },
});
