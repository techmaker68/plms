<!--
***********************************
@author Mohanned Hassan
@create_date 6th Dec 2023

Unified import excel modal

***********************************
-->
<script setup>
import { ref, computed } from "vue";
import ConfirmModal from "./ConfirmModal.vue";
import FileUpload from "primevue/fileupload";
import { EnvironmentEnum, excelContentType } from "@/data";
import { useConfigStore } from "@/stores";
import { useI18n } from "vue-i18n";
import InputFileTooltip from "./InputFileTooltip.vue";
import { useVModel } from "@vueuse/core";

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  batch: {
    type: Number,
    required: false,
    default: null,
  },
});

const acceptTypes = [".csv", excelContentType];
const emit = defineEmits(["uploadSuccess", "update:modelValue"]);
const {
  importExcel,
  downloadExcelExample,
  displaySuccessToast,
  displayErrorToast,
} = useConfigStore();
const { t } = useI18n();

const modelValue = useVModel(props, "modelValue", emit);
const importFile = ref(null);

const disableConfirm = computed(() => {
  return !importFile.value;
});

function hideModal() {
  modelValue.value = false;
}

function onInputChange(event) {
  importFile.value = event.target.files?.[0];
}

async function downloadExample() {
  try {
    const url = await downloadExcelExample(props.type);

    // Create a temporary anchor element to initiate the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", url.split("/").pop()); // Set the desired filename

    // Append the anchor to the document and click it to start the download
    document.body.appendChild(link);
    link.click();

    // Clean up the temporary anchor element
    link.parentNode.removeChild(link);
  } catch (error) {
    console.log("Error downloading example", error);
  }
}

async function uploadFile() {
  try {
    await importExcel({ file: importFile.value }, props.type, props.batch);
    emit("uploadSuccess");
    displaySuccessToast("Imported successfully");
  } catch (error) {
    console.log("Error", error);
    displayErrorToast("Couldn't upload file \n " + error.response.data.error);
  } finally {
    hideModal();
  }
}
</script>

<template>
  <VueModal v-model="modelValue">
    <ConfirmModal
      @close="hideModal"
      @confirm="uploadFile"
      :confirm-label="$t('Import')"
      :disable-confirm="disableConfirm"
      :title="props.text || t('Import Excel')"
    >
      <div
        class="d-flex flex-column justify-content-start align-items-stretch"
        style="gap: 0.5rem"
      >
        <p>
          {{ t("Use this") }}
          <a class="fw-bold cursor-pointer" @click="downloadExample">{{
            t("Template")
          }}</a>
          {{ t("as reference to add records") }}
        </p>

        <div>
          <input
            ref="fileRef"
            type="file"
            class="form-control"
            placeholder=""
            :accept="acceptTypes.join(',')"
            @change="onInputChange"
          />
          <InputFileTooltip />
        </div>
        <!-- <FileUpload mode="advanced" @select="onSelect" /> -->
      </div>
    </ConfirmModal>
  </VueModal>
</template>
