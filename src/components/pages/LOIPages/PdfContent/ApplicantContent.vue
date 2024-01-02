<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Namelist doc

***********************************
-->
<template>
  <div
    class="pdfDocView d-flex justify-content-start align-items-stretch"
    style="overflow-x: auto"
  >
    <table
      class="noHover"
      cellpadding="0"
      cellspacing="0"
      style="border-collapse: collapse; background-color: #ffffff"
      dir="rtl"
    >
      <tr>
        <td>
          <table
            cellpadding="0"
            cellspacing="0"
            style="border-collapse: collapse; width: 100%"
          >
            <tr>
              <td style="vertical-align: top">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  style="border-collapse: collapse; width: 100%"
                >
                  <tr>
                    <td
                      style="
                        text-align: center;
                        padding-block-start: 5px;
                        padding-block-end: 5px;
                        font-size: 12px;
                        color: #000;
                      "
                    >
                      استمارة طلب سمات الدخول للشركات المتعاقدة مع الدولة
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        style="border-collapse: collapse; width: 100%"
                      >
                        <tr>
                          <td>
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              style="border-collapse: collapse; width: 100%"
                            >
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(1) }}- اسم الشركة:
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ companyName }}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(2) }}- عنوان الشركة
                                  داخل العراق :
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{
                                    checkValidValue(
                                      application?.company_address_iraq_ar
                                    )
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(3) }}- الغاية من
                                  الدخول :
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{
                                    checkValidValue(application?.entry_purpose)
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(4) }}- مدة البقاء
                                  المتوقعه داخل العراق:
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{
                                    convertToArabicNumbers(
                                      loiTypeObject?.value_ar
                                    )
                                  }}
                                </td>
                              </tr>
                              <tr class="hide-in-pdf">
                                <td
                                  style="
                                    padding-bottom: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(5) }}- الأولوية
                                </td>
                                <td
                                  style="
                                    padding-bottom: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{
                                    convertToArabicNumbers(
                                      loiPriorityObject?.value_ar
                                    )
                                  }}
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="vertical-align: initial">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              style="border-collapse: collapse; width: 100%"
                            >
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(6) }}- جنسية الشركة
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ companyCountry }}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(7) }}- عنوان الشركة
                                  خارج العراق
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{
                                    checkValidValue(
                                      application?.company_address_ar
                                    )
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(8) }}- نوع سمة
                                  الدخول:
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  متعددة الدخول
                                  {{
                                    convertToArabicNumbers(
                                      loiTypeObject?.value_ar
                                    )
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(9) }}- تاريخ انتهاء
                                  العقد
                                </td>
                                <td
                                  style="
                                    padding-block-end: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{
                                    convertToArabicNumbers(
                                      application?.contract_expiry
                                    )
                                  }}
                                </td>
                              </tr>
                              <tr class="hide-in-pdf">
                                <td
                                  style="
                                    padding-bottom: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ convertToArabicNumbers(10) }}- تاريخ
                                  الإصدار المتوقع
                                </td>
                                <td
                                  style="
                                    padding-bottom: 5px;
                                    font-size: 12px;
                                    color: #000;
                                  "
                                >
                                  {{ application?.expected_issue_date }}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td>
                <img
                  src="@/assets/img/profile.png"
                  class="small-profile-image"
                  style="display: block"
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td
                style="
                  border: 1px solid #000;
                  text-align: center;
                  width: 5%;
                  font-weight: bold;
                "
              >
                تسلسل
              </td>
              <td
                style="
                  border: 1px solid #000;
                  text-align: center;
                  width: 25%;
                  font-weight: bold;
                "
              >
                الاسم
              </td>
              <td
                style="
                  border: 1px solid #000;
                  text-align: center;
                  width: 5%;
                  font-weight: bold;
                "
              >
                الجنسية
              </td>
              <td
                style="
                  border: 1px solid #000;
                  text-align: center;
                  width: 10%;
                  font-weight: bold;
                "
              >
                رقم الجواز
              </td>
              <td
                style="border: 1px solid #000; text-align: center; width: 10%"
              >
                عنوان الاقامة داخل العراق
              </td>
              <td
                style="border: 1px solid #000; text-align: center; width: 10%"
              >
                اسم المنفذ الحدودي للدخول
              </td>
              <td
                style="border: 1px solid #000; text-align: center; width: 10%"
              >
                المهنة والوظيفة
              </td>
              <td style="border: 1px solid #000; text-align: center; width: 5%">
                بلد الاقامة
              </td>
              <td
                style="border: 1px solid #000; text-align: center; width: 25%"
              >
                التأمينات
              </td>
            </tr>
            <template v-if="applicants.length">
              <tr v-for="applicant in applicants" :key="applicant.id">
                <td
                  style="
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                  "
                >
                  {{ applicant.sequence_no }}
                </td>
                <td
                  style="
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                  "
                >
                  {{
                    checkValidValue(applicant?.pax?.latest_passport?.full_name)
                  }}
                </td>
                <td
                  style="
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                  "
                >
                  {{
                    checkValidValue(
                      applicant?.pax?.nationality?.country_name_short_ar
                    )
                  }}
                </td>
                <td
                  style="
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                  "
                >
                  {{
                    checkValidValue(
                      applicant?.pax?.latest_passport?.passport_no
                    )
                  }}
                </td>
                <td style="border: 1px solid #000; text-align: center">
                  حقل مجنون - شركة انطونويل
                </td>
                <td style="border: 1px solid #000; text-align: center">
                  مطار بغداد الدولي / مطار البصرة الدولي
                </td>
                <td style="border: 1px solid #000; text-align: center">
                  {{
                    checkValidValue(
                      applicant?.pax?.arab_position || applicant?.pax?.position
                    )
                  }}
                </td>
                <td style="border: 1px solid #000; text-align: center">
                  {{
                    checkValidValue(
                      applicant?.pax?.country_residence?.country_name_short_ar
                    )
                  }}
                </td>
                <td style="border: 1px solid #000; text-align: center">
                  {{ applicant.remarks }}
                </td>
              </tr>
            </template>

            <tr v-else>
              <td
                colspan="9"
                style="
                  border: 1px solid #000;
                  text-align: center;
                  padding: 10px;
                "
              >
                <span v-t="'No Available Data'"></span>
              </td>
            </tr>
          </table>

          <div class="footer-row">
            <p>
              أني المخول (ليث حسين محمد) اتعهد بعدم التصرف باوراق الشركة دون
              علمها او أضافة او تغير او تعديل بيانات المعلومات اعلاه وعدم اخفاء
              اي معلومة عن مديرية شؤون الأقامة وبخلاف ذلك اتحمل كافة التبعات
              القانونية.
            </p>

            <div class="signature-container">
              <div class="signature-column align-items-center">
                <span>ختم و توقيع مدير الشركة</span>
                <span>Yang, Cheng</span>
                <span>Assistant Managing Director</span>
              </div>

              <div class="signature-column">
                <div class="signature-info-row">
                  <label>التوقيع</label>
                </div>
                <div class="signature-info-row">
                  <label>اسم ممثل الشركة</label>
                  <span>ليث حسين محمد</span>
                </div>
                <div class="signature-info-row">
                  <label>رقم الهوية</label>
                  <span>199040682061</span>
                </div>
                <div class="signature-info-row">
                  <label>محل و تاريخ دائرة الأحوال</label>
                  <span>بغداد - 7\12\2021</span>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { checkValidValue, numLatinToAr } from "@/helpers";
import { useConfigStore, useLOIStore } from "@/stores";
import { mapStores } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ApplicantContent",
  props: {
    application: Object,
    applicants: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    convertToArabicNumbers(n) {
      return numLatinToAr(n);
    },
    checkValidValue(n) {
      return checkValidValue(n);
    },
  },
  computed: {
    ...mapStores(useLOIStore, useConfigStore),
    loiTypeObject() {
      return this.loiStore.getLOITypeById(this.application?.loi_type);
    },
    loiPriorityObject() {
      return this.loiStore.getLOIPriorityById(this.application?.priority);
    },
    companyName() {
      return checkValidValue(this.application?.company?.name);
    },
    companyCountry() {
      return checkValidValue(
        this.application?.company?.country?.country_name_short_ar
      );
    },
  },
});
</script>

<style scoped lang="scss">
.sidebar--moreInfoSidebar__large {
  width: 35rem;
}
.form-check {
  padding-inline-start: 1.5em;
}
th .form-check {
  padding-block-end: 0;
}
.batch-list {
  position: relative;
  margin: 2rem -1.5rem;
  padding: 1rem 2rem;
}
.batch-list::after {
  content: "";
  position: absolute;
  border-bottom: 1px solid #dadada;
  width: 100%;
  left: 0;
  bottom: 0;
}
main {
  width: calc(100% - 53rem);
}
.label-value li label {
  width: 40%;
}
.label-value li.col-md-12 label {
  width: 19.5%;
}
.Addpassport .form-control {
  padding: 1rem;
  border-radius: 3px;
}
.Addpassport .form-label {
  color: #000;
}
.nav.nav-tabs .nav-link {
  padding: 0.5rem 1.5rem;
}

table {
  width: 100%;

  td {
    min-width: 10rem;
  }
}

.footer-row {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 1rem;
  margin-block-start: 4rem;
  padding: 4rem 1rem;
  border-top: black 1px dashed;
  $font-size: 125%;

  p {
    font-size: $font-size;
  }

  .signature-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    font-size: $font-size;

    .signature-column {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 0.5rem;

      .signature-info-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        text-align: start;
        gap: 8px;

        span {
        }

        label {
          color: #000;
          &:after {
            content: ":";
            color: #000;
          }
        }
      }
    }
  }
}
</style>
