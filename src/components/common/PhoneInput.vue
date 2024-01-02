<!--
***********************************
@author Mohanned Hassan
@create_date 1st Aug 2023

***********************************
-->
<script setup>
import { useAttrs } from "vue";

import { useI18n } from "vue-i18n";
import { useVModel, useVModels } from "@vueuse/core";

import { useConfigStore } from "@/stores";
import { storeToRefs } from "pinia";
import Dropdown from "primevue/dropdown";
import CountryFlag from "vue-country-flag-next";

const { t } = useI18n();

const { countries } = storeToRefs(useConfigStore());
const { getCountryById } = useConfigStore();

const props = defineProps({
  phone: String,
  country: String,
});

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const emit = defineEmits(["update:phone", "update:country"]);

function countryCodeLabel(country) {
  return `+${country.calling_code}`;
}

const { phone, country } = useVModels(props, emit);
</script>
<template>
  <div class="phone-box" v-bind="$attrs">
    <Dropdown
      class="country-code-input"
      v-model="country"
      :options="countries"
      optionValue="ID"
      :optionLabel="countryCodeLabel"
      :placeholder="t('Code')"
      :disabled="attrs.disabled"
    >
      <template #value="{ value, placeholder }">
        <div
          class="d-flex flex-row justify-content-start align-items-center custom-phone-dropdown-value"
          style="gap: 8px"
        >
          <template v-if="value">
            <country-flag
              :country="getCountryById(value)?.country_code"
              size="small"
            />

            {{ `+${getCountryById(value)?.calling_code}` }}
          </template>
          <template v-else>{{ placeholder }}</template>
        </div>
      </template>
      <template #option="{ option }">
        <div class="d-flex flex-row justify-content-start align-items-center">
          <country-flag :country="option.country_code" size="small" />

          {{ `+(${option?.calling_code})` }} {{ option?.EngName }}
        </div>
      </template>
    </Dropdown>

    <input
      type="number"
      class="form-control phone-input hide-spinner"
      :placeholder="$t('Phone Number')"
      v-model="phone"
      v-bind="$attrs"
    />
  </div>
</template>
<style scoped lang="scss">
.phone-box {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;

  input {
    flex-grow: 1;
  }
}

.form-control:not(.no-input-group-append) {
  &:focus {
    box-shadow: none;
  }
}

input.phone-input {
  border-start-start-radius: 0px !important;
  border-end-start-radius: 0px !important;
}

.country-code-input {
  border-end-end-radius: 0px !important;
  border-start-end-radius: 0px !important;
  border-start-start-radius: 8px !important;
  border-end-start-radius: 8px !important;
}

.country-code-input {
  margin-top: 4px;
  height: 40px;
  flex: 0 0 10rem;
}

.view-only-container {
  .custom-phone-dropdown-value {
    height: 100%;
  }
}
</style>
