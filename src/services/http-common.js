/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Expose multiple axios instances, each with different interceptors,
all instances have error and loading interceptors
1. instance: main instance used for majority of APIs
2. tableInstance: Has an interceptor to handle excel_export params, and download excel file on response
3. infiniteNotificationInstance: displays an infinite info toast on response, has to be dismissed by user
4. fileInstance: Uses a different base url.

***********************************
*/
import axios from "axios";
import { useConfigStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import {
  CustomAxiosConfigEnum,
  EnvironmentEnum,
  excelContentType,
  storageEnum,
} from "@/data";
import { isArray, isObject, isString } from "lodash-es";

const basicOptions = {
  baseURL: import.meta.env[EnvironmentEnum.BaseURL],
  headers: {
    Accept: "application/json",
  },
};

const instance = axios.create({
  ...basicOptions,
});
export const tableInstance = axios.create({
  ...basicOptions,
});
export const infiniteNotificationInstance = axios.create({
  ...basicOptions,
});

export const fileInstance = axios.create({
  ...basicOptions,
  baseURL: import.meta.env[EnvironmentEnum.StorageBaseURL],
  responseType: "blob",
});

// Request interceptor
const requestInterceptor = (config, adjustTableResponseType = false) => {
  const { setLoading } = useConfigStore();
  const { token } = storeToRefs(useUserStore());
  const { hasToken } = useUserStore();

  setLoading(true);

  // Set the authorization header if the token exists
  if (hasToken) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }

  switch (config?.method) {
    case "get": {
      if (config?.params?.excel_export == true && adjustTableResponseType) {
        config.responseType = "blob";
      }
      break;
    }
    default: {
      break;
    }
  }

  // Return the config object
  return config;
};

const requestErrorInterceptor = (error) => {
  const { setLoading } = useConfigStore();

  setLoading(false);

  return Promise.reject(error);
};

instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
infiniteNotificationInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);
tableInstance.interceptors.request.use(
  (config) => requestInterceptor(config, true),
  requestErrorInterceptor
);

// Response interceptor
const responseInterceptor = (
  response,
  infiniteToast = false,
  autoFileResponseDownload = false
) => {
  const { displaySuccessToast, displayInfoToast, setLoading, downloadBlob } =
    useConfigStore();
  setLoading(false);

  if (response.config.method == "get" && response.status == 200) {
    // Download Excel files automatically
    if (
      response.headers["content-type"].includes(excelContentType) &&
      autoFileResponseDownload
    ) {
      downloadBlob(
        new Blob([response.data], {
          type: excelContentType,
        }),
        response.config?.[CustomAxiosConfigEnum.FileName] || "file.xlsx"
      );
    }
  } else if (
    (response.config.method == "post" || response.config.method == "delete") &&
    response.status == 200
  ) {
    const message = response.data.message;

    if (message) {
      const toastConfig = infiniteToast
        ? {
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            timeout: false,
          }
        : {};
      infiniteToast
        ? displayInfoToast(message, toastConfig)
        : displaySuccessToast(message, toastConfig);
    }
  }
  return response;
};

const responseErrorInterceptor = (error) => {
  const { displayErrorToast, setLoading } = useConfigStore();

  if (
    error?.response?.status ==
    import.meta.env[EnvironmentEnum.AuthenticationErrorCode]
  ) {
    const { logout } = useUserStore();
    logout();
  } else {
    const message = error.response.data.message;
    if (isObject(message)) {
      const errorMessages = [];
      Object.values(message).forEach((m) => {
        if (isArray(m)) {
          m.forEach((innerM) => {
            errorMessages.push(innerM);
          });
        } else if (isString(m)) {
          errorMessages.push(m);
        }
      });

      if (errorMessages.length == 1) {
        displayErrorToast(errorMessages[0]);
      } else if (errorMessages.length > 1) {
        displayErrorToast(errorMessages);
      }
    } else if (isString(message)) {
      message && displayErrorToast(message);
    }
  }
  setLoading(false);
  return Promise.reject(error);
};

instance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);
infiniteNotificationInstance.interceptors.response.use(
  (response) => responseInterceptor(response, true),
  responseErrorInterceptor
);
tableInstance.interceptors.response.use(
  (response) => responseInterceptor(response, undefined, true),
  responseErrorInterceptor
);

export default instance;
