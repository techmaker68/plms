/*
***********************************
@author Mohanned Hassan, Umair
@create_date 1st April 2023

Application's entry point, import 
plugins and libraries

***********************************
*/
import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import DatePicker from "vue-datepicker-next";

import "./services";
import "./assets/scss/style.scss";
import "bootstrap";
import "primeicons/primeicons.css";

import router from "./router";
import App from "./App.vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import { Modal, modalPlugin } from "@kouts/vue-modal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import Toast, { POSITION } from "vue-toastification";

// PrimeVue
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import i18n from "./i18n";
import { inputDirective, validateDirective } from "./directives";

dayjs.extend(customParseFormat);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(({ store }) => {
  store.$router = markRaw(router);
});
const app = createApp(App);
DatePicker.install(app);
DatePicker.locale("en");

app.use(i18n).use(pinia).use(router).use(modalPlugin).use(PrimeVue).use(Toast, {
  position: POSITION.BOTTOM_LEFT,
});

app.directive("tooltip", Tooltip);
app.directive("validate", validateDirective);
app.directive("input", inputDirective);
app.component("EasyDataTable", Vue3EasyDataTable).component("VueModal", Modal);
app.mount("#app");
