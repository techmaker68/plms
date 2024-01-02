<!--
***********************************
@author Mohanned Hassan
@create_date 19th Dec 2023

***********************************
-->
<script setup>
import { ref, computed } from "vue";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Fa from "vue-fa";
import { fileToBase64, uploadFile } from "@/helpers";
import defaultProfilePic from "@/assets/img/profile.svg";

const props = defineProps({
  photo: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["updateProfile"]);

const fileInput = ref(null);
const lastSelectedImage = ref(defaultProfilePic);
const displayPhoto = computed(() => props.photo || lastSelectedImage.value);

async function imgUpload() {
  const { file, error } = uploadFile(fileInput.value);
  emit("updateProfile", {
    file,
    error,
  });
  lastSelectedImage.value = await fileToBase64(file);
}

function simulateClick() {
  fileInput.value?.click();
}
</script>

<template>
  <div @click="simulateClick" class="d-flex justify-content-center profile-img">
    <img
      :src="displayPhoto"
      height="225"
      width="225"
      class="fit-img"
      v-bind="$attrs"
    />
    <div class="profile-overlay">
      <div class="icon-container">
        <Fa :icon="faPlus" fw class="plus-icon" />
      </div>

      <p>{{ $t("Upload / Replace ID Picture") }}</p>
    </div>
    <input
      type="file"
      style="display: none"
      @input="imgUpload"
      ref="fileInput"
      :disabled="viewOnly"
    />
  </div>
</template>

<style scoped lang="scss">
.profile-img {
  position: relative;
  cursor: pointer;
  .profile-overlay {
    opacity: 0;
    position: absolute;
    inset-inline-end: 0px;
    inset-block-start: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    color: var(--primary-color);
    gap: 4rem;

    transition: 0.25s opacity ease-in-out;

    .icon-container {
      padding-block-start: 4rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .plus-icon {
      font-size: 5rem;
    }

    p {
      font-size: 1.25rem;

      font-weight: bold;
      color: var(--primary-color);
    }
  }

  &:hover {
    .profile-overlay {
      opacity: 1;
    }
  }
}
</style>
