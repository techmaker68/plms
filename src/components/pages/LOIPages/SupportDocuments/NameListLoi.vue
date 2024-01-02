<template>
  <DefineTemplate>
    <ApplicantContent
      :application="application"
      :applicants="applicants"
      class="name-list-loi--pdf"
    />
  </DefineTemplate>
  <div class="name-list-loi letter-view mx-auto w-100">
    <div class="printApplicants">
      <div class="row">
        <div class="col-md-6"></div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end mt-3" style="gap: 0.5rem">
            <ExportButton
              @confirm="downloadExcelAr"
              class="btn btn-outline-primary btn-icon text-nowrap"
            >
              <span class="icon-downloadIcon"></span>
            </ExportButton>
            <button
              @click="downloadWordAr"
              class="btn btn-outline-primary btn-icon text-nowrap"
            >
              <span class="icon-downloadIcon"></span>
              <span v-t="'Export as Doc'"></span>
            </button>
            <button
              @click="generatePDF"
              class="btn btn-outline-primary btn-icon text-nowrap"
            >
              <span class="icon-downloadIcon"></span>
              <span v-t="'Export as PDF'"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="applicantListHtml" style="margin-block-end: 10px">
      <div class="applicantHeader">
        <div class="logo">
          <img src="@/assets/img/antonLogo.png" alt="Anton Logo" />
          <img
            id="profilePic"
            class="d-none small-profile-image"
            src="@/assets/img/profile.png"
            alt="Anton Logo"
          />
        </div>
      </div>
    </div>
    <ReuseTemplate />
  </div>

  <vue3-html2pdf
    :show-layout="false"
    :float-layout="true"
    :enable-download="true"
    :preview-modal="false"
    :filename="downloadedFileName"
    :pdf-quality="2"
    :html-to-pdf-options="htmlToPDFOptions"
    manual-pagination
    pdf-content-width="100%"
    ref="html2Pdf"
    pdf-orientation="landscape"
  >
    <template #pdf-content>
      <div class="m-4 pdf-container">
        <ReuseTemplate />
      </div>
    </template>
  </vue3-html2pdf>
</template>

<script>
import { defineComponent } from "vue";
import ApplicantContent from "../PdfContent/ApplicantContent.vue";
import { saveAs } from "file-saver";
import { useConfigStore, useLOIStore, usePLMSStore } from "@/stores";
import { mapStores } from "pinia";
import Vue3Html2pdf from "vue3-html2pdf";
import profile from "@/assets/img/profile.png";
import antonLogo from "@/assets/img/antonLogo.png";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  BorderStyle,
  PageOrientation,
  VerticalAlign,
  convertInchesToTwip,
  HeightRule,
  WidthType,
} from "docx";
import {
  checkValidValue,
  cleanArrayObjects,
  generateExcelFile,
  numLatinToAr,
  pdfGeneratorConfig,
} from "@/helpers";
import { createReusableTemplate } from "@vueuse/core";
import ExportButton from "@/components/common/ExportButton.vue";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

export default defineComponent({
  name: "NamesListLoi",
  data() {
    return {};
  },
  components: {
    ApplicantContent,
    Vue3Html2pdf,
    DefineTemplate,
    ReuseTemplate,
    ExportButton,
  },
  props: {
    application: Object,
    applicants: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapStores(usePLMSStore, useLOIStore, useConfigStore),
    batchNumber() {
      return this.application?.batch_no;
    },
    applicantsFilteredList() {
      return cleanArrayObjects(this.applicants);
    },
    downloadedFileName() {
      if (this.batchNumber) {
        let fileName = this.batchNumber + "_applicants_list";
        return fileName;
      } else {
        return "applicants_list";
      }
    },
    companyName() {
      return checkValidValue(this.application?.company?.name);
    },
    companyCountry() {
      return checkValidValue(
        this.application?.company?.country?.country_name_short_ar
      );
    },
    htmlToPDFOptions() {
      return pdfGeneratorConfig(this.downloadedFileName, null, null, {
        orientation: "landscape",
      });
    },
    loiTypeObject() {
      return this.loiStore.getLOITypeById(this.application?.loi_type);
    },
    loiPriorityObject() {
      return this.loiStore.getLOIPriorityById(this.application?.priority);
    },
  },
  methods: {
    generatePDF() {
      this.$refs.html2Pdf.downloadPdf();
    },
    convertToArabicNumbers(n) {
      return numLatinToAr(n);
    },
    checkValidValue(n) {
      return checkValidValue(n);
    },
    async downloadWordAr(save = true) {
      const filteredList = this.applicantsFilteredList;
      const maxWidth = 10000;

      const profileImage = await (await fetch(profile)).blob();
      const antonLogoImage = await (await fetch(antonLogo)).blob();

      const headerImage = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: antonLogoImage, // Path to the image file
                        transformation: {
                          width: 150,
                          height: 20,
                        },
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  top: {
                    color: "#FFFFFF",
                  },
                  bottom: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 1, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun(" ")],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  bottom: {
                    color: "FF0000", // Red color for the bottom border
                    size: 4, // Border size
                    style: BorderStyle.SINGLE, // Border style
                  },
                  top: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 1, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun(" \n")],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  bottom: {
                    color: "#FFFFFF",
                    // Border style
                  },
                  top: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 1, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: " استمارة طلب سمات الدخول للشركات المتعاقدة مع الدولة ",
                        size: 24, // 24 in docx.js is equivalent to 12pt in Word
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                borders: {
                  bottom: {
                    color: "#FFFFFF",
                    // Border style
                  },
                  top: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 1, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun(" \n")],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                borders: {
                  bottom: {
                    color: "#FFFFFF",
                    // Border style
                  },
                  top: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 1, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
        ],
        width: {
          size: 100, // Set the overall width of the table
          type: "pct", // Set the width type to percentage
        },
        columnWidths: [maxWidth],
      });

      let headerRows = [
        [
          this.convertToArabicNumbers("1-  اسم الشركة:"),
          this.companyName,
          this.convertToArabicNumbers("5-  جنسية الشركة:"),
          this.companyCountry,
        ],
        [
          this.convertToArabicNumbers("2-  عنوان الشركة داخل العراق:"),
          checkValidValue(this.application?.company_address_iraq_ar),
          this.convertToArabicNumbers("6-  عنوان الشركة خارج العراق:"),
          checkValidValue(this.application?.company_address_ar),
        ],
        [
          this.convertToArabicNumbers("3-  الغاية من الدخول:"),
          checkValidValue(this.application?.entry_purpose),
          this.convertToArabicNumbers("7-  نوع سمة الدخول:"),
          `متعددة الدخول ${this.convertToArabicNumbers(
            this.loiTypeObject?.value_ar
          )}`,
        ],
        [
          this.convertToArabicNumbers("4-  مدة البقاء المتوقعة داخل العراق:"),
          this.convertToArabicNumbers(this.loiTypeObject?.value_ar),
          this.convertToArabicNumbers("8-  تاريخ انتهاء العقد:"),
          this.convertToArabicNumbers(this.application?.contract_expiry),
        ],
      ];

      const defaultHeaderCellOptions = {
        bidirectional: true,
        verticalAlign: VerticalAlign.CENTER,
        /* margins: {
          top: convertInchesToTwip(0.05),
          bottom: convertInchesToTwip(0.05),
          left: convertInchesToTwip(0.05),
          right: convertInchesToTwip(0.05),
        }, */
        borders: {
          top: {
            color: "#FFFFFF",
          },
          bottom: {
            color: "#FFFFFF",
          },
          left: {
            color: "#FFFFFF",
          },
          right: {
            color: "#FFFFFF",
          },
        },
      };

      // headerRows = headerRows.reverse();
      const headerTable = new Table({
        visuallyRightToLeft: true,
        rows: [
          ...headerRows.map((row, index) => {
            return new TableRow({
              height: {
                value: 450,
                rule: HeightRule.ATLEAST,
              },
              children: [
                ...row.map(
                  (text, innerIndex) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text,
                              size: 20, // Apply font size here too for consistency
                              rightToLeft: true,
                            }),
                          ],
                          alignment: AlignmentType.RIGHT,
                        }),
                      ],
                      width: {
                        size: innerIndex % 2 == 0 ? 15 : 25,
                        type: WidthType.PERCENTAGE,
                      },
                      ...defaultHeaderCellOptions,
                    })
                ),
                ...(index == 0
                  ? [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              index == 0
                                ? new ImageRun({
                                    data: profileImage, // Path to the image file
                                    transformation: {
                                      width: 125,
                                      height: 125,
                                    },
                                  })
                                : "",
                            ],
                            alignment: AlignmentType.CENTER,
                            bidirectional: true,
                          }),
                        ],
                        rowSpan: 6,
                        ...defaultHeaderCellOptions,
                      }),
                    ]
                  : []),
              ],
            });
          }),
          new TableRow({
            // To add spacing
            height: {
              value: 450,
              rule: HeightRule.ATLEAST,
            },
            children: [],
          }),
        ],
        width: {
          size: 100, // Set the overall width of the table
          type: WidthType.PERCENTAGE,
        },
      });

      const defaultCellOptions = {
        alignment: AlignmentType.RIGHT,
        verticalAlign: VerticalAlign.CENTER,
        margins: {
          top: convertInchesToTwip(0.05),
          bottom: convertInchesToTwip(0.05),
          left: convertInchesToTwip(0.05),
          right: convertInchesToTwip(0.05),
        },
      };

      const tableRows = filteredList.map((applicant) => {
        return new TableRow({
          children: [
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [new TextRun(applicant.remarks)],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun(
                      applicant?.pax?.country_residence?.country_name_short_ar
                    ),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun(
                      applicant?.pax?.arab_position || applicant?.pax?.position
                    ),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun("مطار بغداد الدولي / مطار البصرة الدولي	"),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [new TextRun("حقل مجنون - شركة انطونويل	")],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(
                        checkValidValue(
                          applicant?.pax?.latest_passport?.passport_no
                        )
                      ),
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(
                        applicant?.pax?.nationality?.country_name_short_ar
                      ),
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(applicant?.pax?.latest_passport?.full_name),
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              ...defaultCellOptions,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${applicant.sequence_no}`,
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        });
      });

      const footerContent = [
        "   \n",
        "أني المخول (ليث حسين محمد) أتعهد بعدم التصرف باوراق الشركة دون علمها او إضافة او تغير او تعديل بيانات المعلومات أعلاه وعدم اخفاء اي معلومة عن مديرية شؤون الأقامة وبخلاف ذلك اتحمل كافة التبعات القانونية.",
        "ختم وتوقيع مدير الشركة",
        "YANG, CHENG",
        "Assistant Managing Director",
        "التوقيع",
        "اسم ممثل الشركة: ليث حسين محمد",
        "رقم الهوية: 199040682061",
        "محل وتأريخ الإصدار: دائرة احوال - بغداد 7\\12\\2021",
      ];

      const footerTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[0] })],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  top: {
                    color: "#FFFFFF",
                  },
                  bottom: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 10, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[1] })],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                borders: {
                  top: {
                    color: "#FFFFFF",
                  },
                  bottom: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 10, // Set the columnSpan to the number of columns in the table
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[5] })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[6] })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[7] })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[8] })],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                borders: {
                  top: {
                    color: "#FFFFFF",
                  },
                  bottom: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 5,
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[2] })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[3] })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: footerContent[4] })],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                borders: {
                  top: {
                    color: "#FFFFFF",
                  },
                  bottom: {
                    color: "#FFFFFF",
                  },
                  left: {
                    color: "#FFFFFF",
                  },
                  right: {
                    color: "#FFFFFF",
                  },
                },
                columnSpan: 5,
              }),
            ],
          }),
        ],
        width: {
          size: 100,
          type: "pct",
        },
        columnWidths: Array(9).fill(maxWidth / 10),
      });

      const table = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [new TextRun("التأمينات")],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                // borders: {
                //   top: {
                //     color: "#FFFFFF",
                //   },
                //   bottom: {
                //     color: "#FFFFFF",
                //   },
                //   left: {
                //     color: "#FFFFFF",
                //   },
                //   right: {
                //     color: "#FFFFFF",
                //   },
                // },
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [new TextRun("بلد الاقامة	")],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [new TextRun("المهنة والوظيفة	")],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [new TextRun("اسم المنفذ الحدودي للدخول	")],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [new TextRun("عنوان الاقامة داخل العراق	")],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "رقم الجواز	",
                        bold: true,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "الجنسية",
                        bold: true,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "الاسم",
                        bold: true,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                ...defaultCellOptions,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "تسلسل",
                        bold: true,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                bold: true,
              }),
            ],
          }),
          ...tableRows,
          // new TableRow({
          //   children: [footerCell],
          // }),
        ],
        width: {
          size: 100, // Set the overall width of the table
          type: "pct", // Set the width type to percentage
        },
        columnWidths: Array(9).fill(maxWidth / 10),
      });

      const doc = new Document({
        creator: "new",
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation: PageOrientation.LANDSCAPE,
                },
                margin: {
                  top: 567 * 1.75,
                  right: 567 * 0.75,
                  bottom: 567 * 0.75,
                  left: 567 * 0.95,
                },
              },
            },
            children: [headerImage, headerTable, table, footerTable],
          },
        ],
      });

      const fileName = this.batchNumber + "_applicantList.docx";
      const docBlob = await Packer.toBlob(doc);

      if (save) {
        saveAs(docBlob, fileName);
      }

      return {
        file: docBlob,
        name: fileName,
      };
    },
    downloadExcelAr(save = true) {
      const filteredList = this.applicantsFilteredList.map((applicant) => {
        return {
          التأمينات: applicant.remarks,
          "بلد الاقامة":
            applicant?.pax?.country_residence?.country_name_short_ar,
          "المهنة والوظيفة":
            applicant?.pax?.arab_position || applicant?.pax?.position,
          "اسم المنفذ الحدودي للدخول": "مطار بغداد الدولي / مطار البصرة الدولي",
          "عنوان الاقامة داخل العراق": "حقل مجنون - شركة انطونويل	",
          رقم_الجواز: applicant?.pax?.latest_passport?.passport_no,
          الجنسية: applicant?.pax?.nationality?.country_name_short_ar,
          الاسم_الكامل: applicant?.pax?.latest_passport?.full_name,
        };
      });
      return generateExcelFile(
        filteredList,
        this.batchNumber + "_applicantList",
        save
      );
    },
  },
  async mounted() {},
  watch: {},
  expose: ["downloadWordAr", "downloadExcelAr"],
});
</script>

<style scoped lang="scss">
.printApplicants {
  position: relative;
  z-index: 100;
}
.name-list-loi:deep(.name-list-loi--pdf) {
  box-shadow: none;
  border: 1px solid black;
  border-radius: 0;
}
</style>
