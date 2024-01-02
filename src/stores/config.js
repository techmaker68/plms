/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Config store
Contains central helper data
Contains shared API calls like file downloads
Used throughout the application to control language, loading, and global values

***********************************
*/
import { defineStore } from "pinia";
import { apiservices, fileInstance } from "@/services";
import {
  StatusEnum,
  PassportTypesEnum,
  LanguagesEnum,
  excelContentType,
} from "@/data";
import { useDepartmentStore } from "./departments";
import { convertToFormData } from "@/helpers";
import { useToast } from "vue-toastification";
import { isArray, isString, sortBy } from "lodash-es";
import ToastMultiline from "@/components/common/ToastMultiline.vue";
import i18n from "@/i18n";
import { useCompanyStore } from "./company";

const defaultExtraToastConfig = {
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  pauseOnFocusLoss: false,
  timeout: 2500,
};

export const useConfigStore = defineStore("config", {
  persist: {
    afterRestore: (ctx) => {
      ctx.store.loading = false;
    },
  },
  state: () => ({
    loading: false,
    locale: i18n.global.locale.value,
    countries: [],
    companies: [],
    departments: [],
    venues: [],
    passportStatus: [
      { id: StatusEnum.Approved, name: "Active" },
      { id: StatusEnum.Expired, name: "Expired" },
      { id: StatusEnum.ToBeRenewedNew, name: "To Be Renewed" },
      { id: StatusEnum.ToBeRenewedOld, name: "To Be Renewed" },
      { id: StatusEnum.Cancelled, name: "Cancelled" },
    ],
    passportTypes: [
      { id: PassportTypesEnum.Personal, name: "Personal" },
      { id: PassportTypesEnum.Official, name: "Official" },
      { id: PassportTypesEnum.Diplomatic, name: "Diplomatic" },
    ],
    sexTypes: ["Male", "Female"],
    dashboard: null,
  }),
  getters: {
    getCountryById(state) {
      return (id) => state.countries.find((country) => +country.ID == +id);
    },
    getCompanyById: (state) => {
      return (id) => state.companies.find((company) => +company.id == +id);
    },
    getPassportStatusById: (state) => {
      return (id) => state.passportStatus.find((status) => +status.id == +id);
    },
    getPassportTypeById: (state) => {
      return (id) => state.passportTypes.find((element) => element.id == id);
    },
    getVenueById: (state) => {
      return (id) => state.venues.find((venue) => +venue.id == +id);
    },
    getVenueByLabel: (state) => {
      return (label) => state.venues.find((venue) => venue.label == label);
    },
    sortedNationalities: (state) => {
      return sortBy(state.countries, (o) => o.nationality).map((element) => ({
        ...element,
        nationality_custom_label: `${element.nationality} (${element.EngName})`,
      }));
    },
  },
  actions: {
    async getCountryList() {
      const response = await apiservices.get("getCountrys");
      this.countries = response.data.result;
    },
    async getVenues() {
      const response = await apiservices.get("get_venues");
      this.venues = response.data.data;
    },
    async getCompanies(all = true) {
      const { getCompanyList } = useCompanyStore();
      const companiesResponse = await getCompanyList({
        all: true,
      });
      this.companies = companiesResponse.data;
    },
    async getDepartments() {
      const { getDepartmentList } = useDepartmentStore();
      const response = await getDepartmentList(undefined, {
        all: true,
      });
      this.departments = response.data;
    },
    async getDashboard() {
      const response = await apiservices.get("dashboard_stats");
      this.dashboard = response.data.data;
      return response.data.data;
    },
    async downloadExcelExample(type) {
      const response = await apiservices.get("download_excel", {
        params: {
          type,
        },
      });

      return response.data;
    },
    async importExcel(data, type, batch_no = null) {
      const formData = convertToFormData({ ...data, type, batch_no });
      await apiservices.post("excel_import", formData);
    },
    async downloadFileFromURL(fileUrl, fileName = "download", download = true) {
      if (!fileUrl) {
        throw new Error("No file URl");
      }
      const response = await fileInstance.get(`/${fileUrl}`);
      if (download) {
        this.downloadBlob(new Blob([response.data]), fileName);
      }

      return response;
    },
    async downloadBlob(blob, fileName = "blob") {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    },
    async generateExcel(export_type, data) {
      const response = await apiservices.post(
        `export`,
        {
          ...data,
          export_type,
        },
        {
          responseType: "arraybuffer",
        }
      );

      const { downloadBlob } = useConfigStore();
      downloadBlob(
        new Blob([response.data], { type: excelContentType }),
        `${export_type}.xlsx`
      );
    },
    setLoading(newValue) {
      this.loading = newValue;
    },
    toastContent(detail) {
      if (isArray(detail)) {
        const content = {
          component: ToastMultiline,
          // Any prop can be passed, but don't expect them to be reactive
          props: {
            messages: detail,
          },
        };

        return content;
      } else if (isString(detail)) {
        return detail;
      }
    },
    displaySuccessToast(detail, extraConfig = {}) {
      const toast = useToast();
      toast.success(this.toastContent(detail), {
        ...defaultExtraToastConfig,
        ...extraConfig,
      });
    },
    displayWarningToast(detail, extraConfig = {}) {
      const toast = useToast();
      toast.warning(this.toastContent(detail), {
        ...defaultExtraToastConfig,
        ...extraConfig,
      });
    },
    displayInfoToast(detail, extraConfig = {}) {
      const toast = useToast();
      toast.info(this.toastContent(detail), {
        ...defaultExtraToastConfig,
        ...extraConfig,
      });
    },
    displayErrorToast(detail, extraConfig = {}) {
      const toast = useToast();
      toast.error(this.toastContent(detail), {
        ...defaultExtraToastConfig,
        ...extraConfig,
      });
    },
  },
});
