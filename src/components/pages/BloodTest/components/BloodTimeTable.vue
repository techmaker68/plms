<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Scheduled blood applicants

***********************************
-->
<script setup>
import Vue3Html2pdf from "vue3-html2pdf";
import { useModal } from "@kouts/vue-modal";
import { createReusableTemplate, templateRef } from "@vueuse/core";
import {
  convertNullStringToNull,
  generateExcelFile,
  generateUIDs,
  pdfGeneratorConfig,
} from "@/helpers";
import { computed, ref } from "vue";
import { cleanArrayObjects } from "@/helpers";
import { utils, writeFile } from "xlsx";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
} from "docx";
import { PermissionsEnum, ScheduledEnum } from "@/data";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { sortBy } from "lodash-es";
import draggable from "vuedraggable";
import Fa from "vue-fa";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/stores";
import ExportButton from "@/components/common/ExportButton.vue";

const props = defineProps({
  applicantsList: {
    type: Array,
    required: true,
    default: () => [],
  },
  batch: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits([
  "schedule",
  "sequenceChange",
  "emailToApplicants",
  "rowClick",
]);
const { show, hide } = useModal();
const [confirmEmailModal] = generateUIDs(1);
const { hasPermission } = useUserStore();

const scheduledApplicants = computed({
  // getter
  get() {
    return sortBy(
      cleanArrayObjects(props.applicantsList).filter(
        (element) => element.scheduled_status == ScheduledEnum.Scheduled
      ),
      (o) => o.sequence_no
    );
  },
  // setter
  set(newValue) {
    emit(
      "sequenceChange",
      newValue.map(({ id }) => id)
    );
  },
});
const hasEditPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_APPLICANT_EDIT)
);

function exportExcel() {
  const filteredList = scheduledApplicants.value.map((applicant) => {
    return {
      Name_in_passport: applicant?.pax?.eng_full_name,
      Time: applicant.appoint_time,
      "Appointment Date": applicant.appoint_date,
      "Test Place": props.batch?.venue,
      Company: applicant?.pax?.company?.name,
    };
  });
  generateExcelFile(filteredList, "applicantList");
}

function hideEmailConfirmModal() {
  hide(confirmEmailModal);
}

function showEmailConfirmModal() {
  show(confirmEmailModal);
}

function downloadWord() {
  const tableRows = scheduledApplicants.value.map((applicant) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph(applicant?.pax?.eng_full_name)],
        }),
        new TableCell({
          children: [new Paragraph(applicant.appoint_time)],
        }),
        new TableCell({
          children: [new Paragraph(applicant.appoint_date)],
        }),
        new TableCell({
          children: [new Paragraph(props.batch?.venue)],
        }),
        new TableCell({
          children: [new Paragraph(applicant?.pax?.company?.name)],
        }),
      ],
    });
  });

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph("Name")],
            width: {
              size: 20,
            },
          }),
          new TableCell({
            children: [new Paragraph("Time")],
            width: {
              size: 10,
            },
          }),
          new TableCell({
            children: [new Paragraph("Appointment Date")],
            width: {
              size: 20,
            },
          }),
          new TableCell({
            children: [new Paragraph("Test Place")],
            width: {
              size: 20,
            },
          }),
          new TableCell({
            children: [new Paragraph("Company")],
            width: {
              size: 20,
            },
          }),
        ],
      }),
      ...tableRows,
    ],
    width: {
      size: 100, // Set the overall width of the table
      type: "pct", // Set the width type to percentage
    },
    columnWidths: [2000, 1000, 2000, 2000, 2000],
  });

  const doc = new Document({
    creator: "new",
    sections: [{ children: [table] }],
  });
  doc.addSection({
    children: [table],
  });

  const fileName = "applicantList.docx";
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, fileName);
  });
}

const pdfGeneratorRef = templateRef("pdfGenerator");
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const pdfFileName = computed(() => `${props?.batch?.batch_no}-applicationList`);

const htmlToPDFOptions = computed(() => pdfGeneratorConfig(pdfFileName.value));

function generatePDF() {
  pdfGeneratorRef.value.downloadPdf();
}

function emitSchedule(id) {
  emit("schedule", { id: id.toString() });
}

function emitRow(applicant) {
  emit("rowClick", applicant);
}

function emailToApplicants() {
  emit("emailToApplicants");
  hideEmailConfirmModal();
}
</script>

<template>
  <VueModal :name="confirmEmailModal">
    <ConfirmModal
      @close="hideEmailConfirmModal"
      @confirm="emailToApplicants"
      :title="$t('Email Applicants')"
      :message="
        $t('This will send an email to all paxes in the schedule time table')
      "
    />
  </VueModal>

  <DefineTemplate>
    <div class="iframeWrap">
      <table
        class="noHover"
        cellpadding="0"
        cellspacing="0"
        style="
          border-collapse: collapse;
          width: 100%;
          text-align: right;
          font-family: sans-serif;
          font-size: 14px;
        "
      >
        <tbody>
          <tr>
            <td>
              <table
                cellpadding="0"
                cellspacing="0"
                style="border-collapse: collapse; width: 100%"
              >
                <tbody>
                  <tr>
                    <td
                      style="
                        text-align: left;
                        border-bottom: 2px solid #1e2678;
                        padding-block-end: 5px;
                        font-size: 12px;
                        color: #000;
                      "
                    >
                      <a
                        href="www.antonoil.com"
                        style="text-decoration: none; color: #1f4e78"
                      >
                        www.antonoil.com
                      </a>
                    </td>
                    <td
                      style="
                        border-bottom: 2px solid #bf0022;
                        padding-block-end: 5px;
                      "
                    >
                      <img
                        src="@/assets/img/antonLogo.png"
                        style="display: block; margin-inline-start: auto"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <table class="mt-4" cellpadding="10" cellspacing="0" width="100%">
        <thead class="row-bordered">
          <tr>
            <th bgcolor="#ddd" class="hide-in-pdf"></th>
            <th bgcolor="#ddd">#</th>
            <th bgcolor="#ddd" v-t="'Name in Passport'"></th>
            <th bgcolor="#ddd" v-t="'Test Place'"></th>
            <th bgcolor="#ddd" v-t="'Time'"></th>
            <th bgcolor="#ddd" v-t="'Appoint Date'"></th>
            <th bgcolor="#ddd" v-t="'Company'"></th>
            <th bgcolor="#ddd" class="hide-in-pdf" v-t="'Schedule'"></th>
          </tr>
        </thead>
        <draggable
          tag="tbody"
          class="draggable-body"
          handle=".handle"
          v-model="scheduledApplicants"
          item-key="id"
        >
          <template #item="{ index, element }">
            <tr class="row-bordered">
              <td class="handle hide-in-pdf" @click.stop>
                <Fa :icon="faGrip" />
              </td>
              <td>
                {{ index + 1 }}
              </td>
              <td class="cursor-pointer" @click="emitRow(element)">
                {{ element?.pax?.eng_full_name }}
              </td>
              <td>
                {{ props?.batch?.venue }}
              </td>
              <td>
                {{ element.appoint_time?.substring(0, 5) }}
              </td>
              <td>
                {{ element.appoint_date }}
              </td>
              <td>
                {{ element?.pax?.company?.name }}
              </td>
              <td class="schedule-cell hide-in-pdf">
                <button
                  @click="emitSchedule(element.id)"
                  :disabled="!hasEditPermission"
                  class="btn btn-outline-danger ms-auto mb-4"
                >
                  <span v-t="'Unschedule'"></span>
                </button>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>
  </DefineTemplate>

  <vue3-html2pdf
    :show-layout="false"
    :float-layout="true"
    :enable-download="true"
    :preview-modal="false"
    :filename="pdfFileName"
    :pdf-quality="2"
    manual-pagination
    pdf-content-width="100%"
    :html-to-pdf-options="htmlToPDFOptions"
    ref="pdfGenerator"
  >
    <template #pdf-content>
      <div class="p-4 pdf-container">
        <ReuseTemplate></ReuseTemplate>
      </div>
    </template>
  </vue3-html2pdf>
  <div class="p-4">
    <div class="row">
      <div class="col-md-6"></div>
      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <div class="me-2">
            <button
              @click="showEmailConfirmModal"
              class="btn btn-primary btn-icon ms-auto mb-4"
            >
              <span v-t="'Email Applicants'"></span>
            </button>
          </div>

          <div class="me-2">
            <button
              @click="generatePDF"
              class="btn btn-outline-primary btn-icon ms-auto mb-4"
            >
              <span class="icon-downloadIcon"></span>
              <span v-t="'Export as PDF'"></span>
            </button>
          </div>
          <div class="me-2">
            <ExportButton
              @confirm="exportExcel"
              class="btn btn-outline-primary btn-icon ms-auto mb-4"
            >
              <span class="icon-downloadIcon"></span>
            </ExportButton>
          </div>
          <div class="me-2">
            <!-- <button
              @click="downloadWord"
              class="btn btn-outline-primary btn-icon ms-auto mb-4"
            >
              <span class="icon-downloadIcon"></span>
              <span>Export as Word</span>
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <ReuseTemplate></ReuseTemplate>
  </div>
</template>
<style scoped lang="scss">
.row-bordered {
  border: 1px solid #ddd;
  text-align: center;

  td {
    padding: 5px;
    text-align: center;
    &:not(:last-child) {
      border-inline-end: 1px solid #ddd;
    }
  }
}

.schedule-cell {
  button {
    margin: 0px !important;
  }
}
</style>
