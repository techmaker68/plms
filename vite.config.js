/*
***********************************
@author Mohanned Hassan
@create_date 23rd Nov 2023

***********************************
*/

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.BASE_URL,
    plugins: [
      vue(),
      VueI18nPlugin({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        compositionOnly: false,
        // you need to set i18n resource including paths !
        include: [path.resolve(__dirname, "./src/locales/**")],
      }),
    ],
    optimizeDeps: {
      include: ["jspdf"],
    },
    assetsInlineLimit: 10 * 1000,
    server: {
      port: 8080, // <-- Set your own server port here
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
