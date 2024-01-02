<!--
***********************************
@author Mohanned Hassan, Umair
@create_date 1st Oct 2023

Add users to roles

***********************************
-->
<script setup>
import { UsersHeaders } from "@/data";
import UsersTable from "./UsersTable.vue";
import { onMounted, ref } from "vue";
import { toRefs } from "@vueuse/core";
import SaveButton from "@/components/common/SaveButton.vue";
const props = defineProps({
  initialData: {
    type: Object,
  },
});

const { initialData } = toRefs(props);
const emit = defineEmits(["submit"]);

const usersTable = ref(null);
const includedHeaders = ref([UsersHeaders.Name, UsersHeaders.Email]);

function onSubmit() {
  emit("submit", usersTable.value.selectedItems);
}

onMounted(() => {
  if (initialData.value?.users) {
    usersTable.value.selectedItems = initialData.value?.users;
  }
});
</script>

<template>
  <div class="members-form">
    <div
      class="border-form-custom d-flex flex-column justify-content-start align-items-stretch"
      style="gap: 1rem"
    >
      <UsersTable
        from-roles
        enable-multi-selection
        disable-click
        :included-headers="includedHeaders"
        all
        :extra-table-options="{
          'rows-items': [10, 20, 50],
          'rows-per-page': 10,
        }"
        ref="usersTable"
      ></UsersTable>
    </div>

    <div class="d-flex flex-column justify-content-end align-items-center">
      <SaveButton @click="onSubmit" type="button" class="btn btn-blue">
        <span v-t="'Submit'"></span>
      </SaveButton>
    </div>
  </div>
</template>
