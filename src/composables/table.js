/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Composable to manage all shared tables functions

***********************************
*/
import { ref, toValue, computed, watchEffect, watch } from "vue";
import {
  toRefs,
  watchIgnorable,
  watchTriggerable,
  watchWithFilter,
} from "@vueuse/core";
import { useI18n } from "vue-i18n";

export const useTableProps = {
  rowsPerPage: {
    type: Number,
    default: 25,
  },
  enableMultiSelection: {
    type: Boolean,
    default: false,
  },
  extraTableOptions: {
    type: Object,
    default: () => ({}),
  },
  staticData: {
    type: Array,
    default: null,
  },
  includedHeaders: {
    type: Array,
    required: false,
    default: () => [],
  },
  extraServerFilters: {
    type: Object,
    required: false,
    default: null,
  },
  enableExport: {
    type: Boolean,
    default: false,
  },
  all: {
    type: Boolean,
    default: false,
  },
};

export function useTable(
  initialHeaders,
  props,
  apiCall,
  defaultPagination = {}
) {
  const { t } = useI18n();

  const selectedItems = ref([]);
  const defaultHeaders = ref(toValue(initialHeaders));
  const defaultMultiSelectionOptions = ref({
    "fixed-index": true,
    "checkbox-column-width": 40,
    "index-column-width": 40,
  });
  // Server options
  const serverOptions = ref({
    page: 1,
    rowsPerPage: 25,
    sortBy: "",
    sortType: "",
    ...defaultPagination,
  });
  const serverItemsLength = ref(0);
  const serverItems = ref([]);
  const offset = computed(
    () => (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage
  );
  const loading = ref(false);

  const { sortBy, sortType } = toRefs(serverOptions);
  const searchValue = ref("");

  function getColumnItemName(headerName) {
    return `item-${headerName}`;
  }

  function getColumnHeaderName(headerName) {
    return `header-${headerName}`;
  }

  /* We don't want to assign to vModel if parent doesn't have to
  so we assign to a random v-model to avoid displaying the checkboxes */
  const vModelWorkaround = computed(() => {
    return toValue(props?.enableMultiSelection)
      ? "items-selected"
      : "workaround";
  });

  /* We don't want to assign to vModel if parent doesn't have to
  so we assign to a random v-model to avoid displaying the checkboxes */
  const vModelServerOptionsWorkaround = computed(() => {
    return toValue(!props?.all) ? "server-options" : "workaround-options";
  });

  const extraOptions = computed(() => {
    let temp = {};
    if (toValue(props?.enableMultiSelection)) {
      temp = { ...defaultMultiSelectionOptions.value };
    }
    temp = {
      ...temp,
      ...props?.extraTableOptions,
      "rows-per-page-message": t("rows per page:"),
    };
    return temp;
  });

  const headers = computed(() => {
    if (toValue(props?.includedHeaders?.length)) {
      let temp = [];
      toValue(props?.includedHeaders).forEach((element) => {
        const tempHeader = defaultHeaders.value.find(
          (innerElement) => innerElement.value == element
        );
        if (tempHeader) {
          temp.push(tempHeader);
        }
      });
      return temp;
    } else {
      return toValue(defaultHeaders);
    }
  });

  const { ignoreUpdates } = watchIgnorable(
    serverOptions,
    (v) => triggerAPICall(v),
    {
      immediate: true,
    }
  );

  async function triggerAPICall(
    {
      page,
      rowsPerPage: per_page,
      sortBy: sort_by,
      sortType: order,
    } = serverOptions.value
  ) {
    try {
      if (!apiCall) {
        return;
      }
      loading.value = true;
      const response = await apiCall(
        {
          page,
          per_page,
          sort_by,
          order,
          all: toValue(props?.all) ? true : null,
        },
        searchValue.value
      );
      serverItemsLength.value = response?.meta?.total;
      serverItems.value = response.data || [];
    } catch (error) {
      console.error("Error in table", error);
    } finally {
      loading.value = false;
    }
  }

  const triggerServerRefresh = async (resetPage = true) => {
    if (resetPage) {
      ignoreUpdates(() => {
        serverOptions.value = {
          ...serverOptions.value,
          page: 1,
        };
      });
    }
    await triggerAPICall();
  };

  return {
    defaultMultiSelectionOptions,
    sortBy,
    sortType,
    searchValue,
    defaultHeaders,
    extraOptions,
    headers,
    selectedItems,
    getColumnItemName,
    getColumnHeaderName,
    vModelWorkaround,
    vModelServerOptionsWorkaround,
    serverOptions,
    serverItemsLength,
    serverItems,
    offset,
    loading,
    triggerServerRefresh,
  };
}
