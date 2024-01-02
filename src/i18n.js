/*
***********************************
@author Mohanned Hassan
@create_date 1st Oct 2023

* Load locales and expose i18n

***********************************
*/
import { createI18n } from "vue-i18n";
import { EnvironmentEnum } from "./data";
import messages from "@intlify/unplugin-vue-i18n/messages";

function loadLocaleMessages() {
  return messages;
}

const i18n = createI18n({
  legacy: false,
  locale: import.meta.env[EnvironmentEnum.I18nLocale] || "en",
  fallbackLocale: import.meta.env[EnvironmentEnum.I18nFallbackLocale] || "en",
  messages: loadLocaleMessages(),
});

export default i18n;
