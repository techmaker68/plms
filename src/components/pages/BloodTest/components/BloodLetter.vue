<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Blood letter table
Schedule, and assign penalties
Export as pdf 

***********************************
-->
<script setup>
import Vue3Html2pdf from "vue3-html2pdf";
import { createReusableTemplate, templateRef } from "@vueuse/core";
import {
  convertNullStringToNull,
  checkValidValue,
  pdfGeneratorConfig,
  cleanArrayObjects,
  generateExcelFile,
  generateUIDs,
} from "@/helpers";
import { computed, ref } from "vue";
import { useModal } from "@kouts/vue-modal";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  ImageRun,
  convertMillimetersToTwip,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  HorizontalPositionRelativeFrom,
  AlignmentType,
  BorderStyle,
  FrameAnchorType,
  SectionType,
  WidthType,
  TextDirection,
  VerticalAlign,
  HeightRule,
} from "docx";
import antonLogo from "@/assets/img/antonLogo.png";
import { PenaltyTypeEnum, PermissionsEnum, ScheduledEnum } from "@/data";
import AppointmentModal from "./AppointmentModal.vue";
import BloodPenaltyModal from "./BloodPenaltyModal.vue";
import VisaPenaltyModal from "./VisaPenaltyModal.vue";
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
  "newAppointment",
  "newPenalty",
  "rowClick",
]);

const { show, hide } = useModal();

const [appointmentModal, bloodPenaltyModal, visaPenaltyModal] = generateUIDs(3);
const { hasPermission } = useUserStore();

const selectedApplicant = ref(null);

const applicantsFilteredList = computed(() =>
  cleanArrayObjects(props.applicantsList)
);
const hasEditPermission = computed(() =>
  hasPermission(PermissionsEnum.BLOOD_TEST_APPLICANT_EDIT)
);

function exportExcel() {
  const filteredList = applicantsFilteredList.value.map((applicant) => {
    return {
      "Name in Passport": applicant.arab_full_name || applicant.full_name,
      "Passport Number": checkValidValue(applicant.passport_no),
      Nationality: applicant.nationality,
    };
  });
  generateExcelFile(filteredList, "applicationList");
}
async function downloadWord() {
  const antonLogoImage = await (await fetch(antonLogo)).blob();

  const tableRows = applicantsFilteredList.value.map((applicant, index) => {
    return new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          children: [
            new Paragraph({
              style: "table-cell",
              children: [
                new TextRun({
                  text: `${index + 1}`,
                  size: "12pt",
                  bold: false,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: applicant?.pax?.eng_full_name,
              style: "table-cell",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: checkValidValue(
                applicant?.pax?.latest_passport?.passport_no
              ),
              style: "table-cell",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: applicant?.pax?.nationality?.country_name_short_en,
              style: "table-cell",
            }),
          ],
        }),
      ],
    });
  });

  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },

    rows: [
      new TableRow({
        height: {
          rule: HeightRule.ATLEAST,
          value: "0.5in",
        },
        tableHeader: true,
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "#",
                style: "table-header",
              }),
            ],
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "808080",
              color: "ffffff",
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Name in Passport",
                style: "table-header",
              }),
            ],
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "808080",
              color: "ffffff",
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Badge",
                style: "table-header",
              }),
            ],
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "808080",
              color: "ffffff",
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Nationality",
                style: "table-header",
              }),
            ],
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
            textDirection: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "808080",
              color: "ffffff",
            },
          }),
        ],
      }),
      ...tableRows,
    ],
  });

  const doc = new Document({
    creator: "new",
    styles: {
      paragraphStyles: [
        {
          id: "header-text",
          name: "Header Text",
          paragraph: {
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: {
              after: 50,
            },
          },
          run: {
            size: "12pt",
            bold: true,
            rightToLeft: true,
            position: AlignmentType.CENTER,
          },
        },
        {
          id: "footer-text",
          name: "Footer Text",
          paragraph: {
            alignment: AlignmentType.CENTER,
            bidirectional: true,
          },
          run: {
            size: "14pt",
            font: "Calibri",
            bold: true,
            rightToLeft: true,
            position: AlignmentType.CENTER,
          },
        },
        {
          id: "table-header",
          name: "Table Header Text",
          paragraph: {
            alignment: AlignmentType.CENTER,
            bidirectional: true,
          },
          run: {
            size: "12pt",
            font: "Calibri",
            bold: true,
            position: AlignmentType.CENTER,
            color: "ffffff",
          },
        },
        {
          id: "table-cell",
          name: "Table Cell Text",
          paragraph: {
            alignment: AlignmentType.CENTER,
            bidirectional: true,
          },
          run: {
            size: "10.5pt",
            font: "Calibri",
            bold: true,
            position: AlignmentType.CENTER,
          },
        },
      ],
      characterStyles: [
        {
          id: "label",
          name: "Label",
          run: {
            size: "11pt",
            bold: false,
            rightToLeft: true,
          },
        },
        {
          id: "value",
          name: "Value",
          run: {
            size: "11pt",
            bold: true,
            font: "Calibri",
            rightToLeft: true,
          },
        },
      ],
    },
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                border: {
                  bottom: {
                    color: "1e2678",
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
                children: [
                  new TextRun({
                    text: "www.antonil.com",
                    font: "Calibri",
                    size: "9pt",
                    color: "1e2678",
                  }),
                  new ImageRun({
                    data: antonLogoImage,
                    transformation: {
                      width: 200,
                      height: 25,
                    },
                    floating: {
                      horizontalPosition: {
                        align: HorizontalPositionAlign.CENTER,
                        relative: HorizontalPositionRelativeFrom.PAGE,
                      },
                      verticalPosition: {
                        offset: convertMillimetersToTwip(5500),
                        relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                      },
                    },
                  }),
                ],
              }),
            ],
          }),
        },
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.START,
            bidirectional: true,
            children: [
              new TextRun({
                text: ` ${props.batch?.batch_no} `,
                style: "value",
              }),
              new TextRun({
                text: ":العدد ",
                style: "label",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.START,
            bidirectional: true,
            children: [
              new TextRun({
                text: ` ${props.batch?.submit_date} `,
                style: "value",
              }),
              new TextRun({
                text: ":التاريخ ",
                style: "label",
              }),
            ],
          }),
          new Paragraph({
            style: "header-text",
            children: [
              new TextRun({
                text: `الى: دائرة صحة البصرة`,
              }),
            ],
          }),
          new Paragraph({
            style: "header-text",
            children: [
              new TextRun({
                text: "قسم الصحة العامة",
              }),
            ],
          }),
          new Paragraph({
            style: "header-text",
            children: [
              new TextRun({
                text: "شعبة السيطرة على العوز المناعي",
              }),
            ],
          }),
          new Paragraph({
            style: "header-text",
            children: [
              new TextRun({
                text: "م/ تأكيد",
                underline: true,
                size: "16pt",
              }),
            ],
          }),
          new Paragraph({
            style: "header-text",
            position: AlignmentType.RIGHT,
            spacing: {
              before: "0.3in",
              after: "0.3in",
            },
            children: [
              new TextRun({
                text: "نحن شركة انطونويل نؤيد لكم صحة اسماء و ارقام جوازاتهم المدرجة ادناه لموضفينا علما هم يعملون لدى شركتنا",
              }),
            ],
          }),
          table,
          new Paragraph({
            style: "footer-text",
            spacing: {
              before: "0.5in",
              after: "0.5in",
            },
            children: [
              new TextRun({
                text: "مع الشكر و التقدير.....",
              }),
            ],
          }),
          new Paragraph({
            style: "footer-text",
            alignment: AlignmentType.END,
            children: [
              new TextRun({
                text: "قسم لوجستيات الافراد",
              }),
            ],
          }),
        ],
      },
    ],
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

function showAppointmentModal(applicant) {
  if (!hasEditPermission.value) {
    return;
  }
  selectedApplicant.value = applicant;
  show(appointmentModal);
}

function hideAppointmentModal() {
  hide(appointmentModal);
}

function showBloodPenaltyModal(applicant) {
  if (!hasEditPermission.value) {
    return;
  }
  selectedApplicant.value = applicant;
  show(bloodPenaltyModal);
}

function hideBloodPenaltyModal() {
  hide(bloodPenaltyModal);
}

function showVisaPenaltyModal(applicant) {
  if (!hasEditPermission.value) {
    return;
  }
  selectedApplicant.value = applicant;
  show(visaPenaltyModal);
}

function hideVisaPenaltyModal() {
  hide(visaPenaltyModal);
}

function resetValues() {
  selectedApplicant.value = null;
}

function emitAppointment($event) {
  emit("newAppointment", $event);
  hideAppointmentModal();
}

function emitPenalty($event, type) {
  emit("newPenalty", {
    ...$event,
    type,
  });
  hideBloodPenaltyModal();
  hideVisaPenaltyModal();
}
</script>

<template>
  <DefineTemplate>
    <div class="letter-content">
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
                        style="display: block"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <p
                style="
                  text-align: right;
                  font-size: 120%;
                  margin-block-start: 16px;
                "
              >
                {{ props?.batch?.batch_no }} :العدد
              </p>
              <p style="text-align: right; font-size: 120%">
                {{ props?.batch?.submit_date }} :التاريخ
              </p>
              <p>الى: دائرة صحة البصرة</p>
              <p>قسم الصحة العامة</p>
              <p>شعبة السيطرة على العوز المناعي</p>
              <div
                class="d-flex flex-column justify-content-center align-items-center"
              >
                <div>
                  <p style="font-size: 175%; line-height: 1.25">م/ تأكيد</p>
                  <div style="height: 2px; background-color: black"></div>
                </div>
              </div>
              <p style="text-align: right; margin-block-start: 12px">
                نحن شركة انطونويل نؤيد لكم صحة اسماء و ارقام جوازاتهم المدرجة
                ادناه لموضفينا علما هم يعملون لدى شركتنا
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        style="text-align: center; margin-block-start: 8px"
        cellpadding="10"
        cellspacing="0"
        width="100%"
      >
        <thead class="row-bordered">
          <tr>
            <th bgcolor="#ddd">#</th>
            <th bgcolor="#ddd" v-t="'Name in Passport'"></th>
            <th bgcolor="#ddd" v-t="'Passport No'"></th>
            <th bgcolor="#ddd" v-t="'Nationality'"></th>
            <th
              bgcolor="#ddd"
              class="schedule-header hide-in-pdf"
              v-t="'Schedule'"
            ></th>
            <th bgcolor="#ddd" class="hide-in-pdf" v-t="'Appointment'"></th>
            <th
              bgcolor="#ddd"
              class="hide-in-pdf"
              v-t="'Blood Penalty Fee'"
            ></th>
            <th
              bgcolor="#ddd"
              class="hide-in-pdf"
              v-t="'Visa Penalty Fee'"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="row-bordered"
            v-for="(item, index) in applicantsList"
            :key="item.id"
          >
            <td>
              {{ index + 1 }}
            </td>
            <td class="cursor-pointer" @click="emitRow(item)">
              {{ item?.pax?.eng_full_name }}
            </td>
            <td>
              {{ checkValidValue(item?.pax?.latest_passport?.passport_no) }}
            </td>
            <td>
              {{ item?.pax?.nationality?.country_name_short_en }}
            </td>
            <td class="schedule-cell hide-in-pdf">
              <button
                v-if="item.scheduled_status == ScheduledEnum.UnScheduled"
                :disabled="!hasEditPermission"
                @click="emitSchedule(item.id)"
                class="btn btn-outline-primary btn-icon ms-auto mb-4"
              >
                <span v-t="'Schedule'"></span>
              </button>

              <span v-else class="text-success" v-t="'Scheduled'"></span>
            </td>

            <td
              class="hide-in-pdf cursor-pointer"
              @click="showAppointmentModal(item)"
            >
              <div>
                <button
                  v-if="!item?.new_appoint_date && hasEditPermission"
                  class="btn btn-outline-primary btn-icon ms-auto"
                >
                  <span v-t="'New Appointment'"></span>
                </button>

                <span v-else>{{
                  item?.new_appoint_date
                    ? `${$t("Next appointment:")} ${item?.new_appoint_date}`
                    : ""
                }}</span>
              </div>
            </td>

            <td
              class="hide-in-pdf cursor-pointer"
              @click="showBloodPenaltyModal(item)"
            >
              <button
                v-if="!item?.penalty_fee && hasEditPermission"
                class="btn btn-outline-primary btn-icon ms-auto"
              >
                <span v-t="'Penalty Fee'"></span>
              </button>

              <span v-else>{{
                item?.penalty_fee
                  ? `${$t("Blood Penalty:")} ${item?.penalty_fee}`
                  : ""
              }}</span>
            </td>

            <td
              class="hide-in-pdf cursor-pointer"
              @click="showVisaPenaltyModal(item)"
            >
              <button
                v-if="!item?.visa_penalty_fee && hasEditPermission"
                class="btn btn-outline-primary btn-icon ms-auto"
              >
                <span v-t="'Visa Penalty Fee'"></span>
              </button>

              <span v-else>{{
                item?.visa_penalty_fee
                  ? `${$t("Visa Penalty:")} ${item?.visa_penalty_fee}`
                  : ""
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="d-flex flex-column justify-content-center align-items-stretch"
        style="margin-block-start: 8px"
      >
        <p style="text-align: center; font-size: 175%; direction: rtl">
          مع الشكر و التقدير.....
        </p>
        <p style="text-align: left; font-size: 175%">قسم لوجستيات الافراد</p>
      </div>
    </div>
  </DefineTemplate>

  <VueModal :name="appointmentModal" @closed="resetValues" wrapperClass="vm-md">
    <AppointmentModal
      :applicant="selectedApplicant"
      @submit="emitAppointment"
      @close="hideAppointmentModal"
    ></AppointmentModal>
  </VueModal>

  <VueModal
    :name="bloodPenaltyModal"
    @closed="resetValues"
    wrapperClass="vm-md"
  >
    <BloodPenaltyModal
      :applicant="selectedApplicant"
      @submit="($event) => emitPenalty($event, PenaltyTypeEnum.Blood)"
      @close="hideBloodPenaltyModal"
    ></BloodPenaltyModal>
  </VueModal>

  <VueModal :name="visaPenaltyModal" @closed="resetValues" wrapperClass="vm-md">
    <VisaPenaltyModal
      :applicant="selectedApplicant"
      @submit="($event) => emitPenalty($event, PenaltyTypeEnum.Visa)"
      @close="hideVisaPenaltyModal"
    ></VisaPenaltyModal>
  </VueModal>

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
        <ReuseTemplate />
      </div>
    </template>
  </vue3-html2pdf>

  <div class="p-4">
    <div class="row">
      <div class="col-md-6"></div>
      <div class="col-md-6">
        <div class="d-flex justify-content-end">
          <div class="me-2">
            <ExportButton
              @confirm="exportExcel"
              class="btn btn-outline-primary btn-icon ms-auto mb-4"
            >
              <span class="icon-downloadIcon"></span>
            </ExportButton>
          </div>
          <div class="me-2">
            <button
              @click="downloadWord"
              class="btn btn-outline-primary btn-icon ms-auto mb-4"
            >
              <span class="icon-downloadIcon"></span>
              <span>Export as Doc</span>
            </button>
          </div>
          <div class="me-2">
            <button
              @click="generatePDF"
              class="btn btn-outline-primary btn-icon ms-auto mb-4"
            >
              <span class="icon-downloadIcon"></span>
              <span>Export as PDF</span>
            </button>
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

tr.row-bordered {
  height: 40px;
}

.letter-content {
  p {
    margin: 0px;
    text-align: center;
    font-family: sans-serif;
    font-size: 16px;
    font-weight: bold;
  }

  .schedule-cell {
    button {
      margin: 0px !important;
    }
  }
}
</style>
