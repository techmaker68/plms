<!--
***********************************
@author Umair
@create_date 15th Oct 2023

Add/Delete LOI presentations

***********************************
-->
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useLOIStore } from "@/stores";
import Fa from "vue-fa";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import InputFileTooltip from "@/components/common/InputFileTooltip.vue";
import SaveButton from "@/components/common/SaveButton.vue";
import { generateUIDs } from "@/helpers";
import { useModal } from "@kouts/vue-modal";
import ConfirmModal from "@/components/common/ConfirmModal.vue";

const presentations = ref([]);
const fileInput = ref(null);
const selectedDeleteIndex = ref(null);

const state = reactive({
  hasFile: true,
  files: [],
});

const { saveLOIPresentations, getLOIPresentations, deletePresentation } =
  useLOIStore();

const { show, hide } = useModal();

const [confirmDeleteModal] = generateUIDs(1);

function imgUpload() {
  presentations.value = fileInput.value.files;
  state.hasFile = false;
}

async function submit() {
  try {
    const response = await saveLOIPresentations({
      presentations: presentations.value,
    });
    fileInput.value = [];
    state.files = response.files;
  } catch (error) {
    console.log("Error", error);
  }
}
async function getCurrentPresentations() {
  try {
    const response = await getLOIPresentations();
    state.files = response.files;
  } catch (error) {
    console.log("Error", error);
  }
}
async function deleteRecord() {
  try {
    const response = await deletePresentation(selectedDeleteIndex.value);
    state.files = response.files;
    hideConfirmModal();
  } catch (error) {
    console.log("Error", error);
  }
}

function hideConfirmModal() {
  hide(confirmDeleteModal);
}

function showConfirmModal(index) {
  show(confirmDeleteModal);
  selectedDeleteIndex.value = index;
}

function resetDocumentIndex() {
  selectedDeleteIndex.value = null;
}

onMounted(async () => {
  getCurrentPresentations();
});
</script>

<template>
  <VueModal :name="confirmDeleteModal" @closed="resetDocumentIndex">
    <ConfirmModal
      @close="hideConfirmModal"
      @confirm="deleteRecord"
      :title="$t('Delete presentation')"
      :message="$t('Are you sure you want to delete this presentation?')"
    />
  </VueModal>

  <div
    class="d-flex flex-column justify-content-start align-items-stretch"
    style="gap: 1rem"
  >
    <h3 class="fs-3 text-primary" v-t="'LOI Presentations'"></h3>

    <div>
      <input
        type="file"
        class="form-control mt-3 personal-fields"
        ref="fileInput"
        @input="imgUpload"
        multiple
      />
      <InputFileTooltip />
    </div>
    <div v-for="(file, index) in state.files" :key="index">
      <a class="fw-bold text text-danger" :href="file"
        >{{ $t("File") }} {{ index + 1 }}
      </a>
      <Fa
        :icon="faXmark"
        class="cursor-pointer ms-2"
        style="color: rgb(255, 54, 54)"
        size="lg"
        fw
        @click="showConfirmModal(index)"
      />
    </div>
    <div class="d-flex flex-row justify-content-end align-items-center">
      <SaveButton
        :disabled="state.hasFile"
        type="button"
        class="btn btn-primary"
        @click="submit"
        >{{ $t("Update") }}</SaveButton
      >
    </div>
  </div>
</template>
