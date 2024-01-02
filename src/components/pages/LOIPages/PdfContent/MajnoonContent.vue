<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
-->
<template>
  <div class="pdfDocView">
    <table
      class="noHover"
      cellpadding="0"
      cellspacing="0"
      style="border-collapse: collapse; width: 100%; background-color: white"
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
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" class="doc-wrapper">
              <tbody>
                <tr>
                  <td
                    style="
                      width: 45%;
                      vertical-align: top;
                      padding-block-start: 10px;
                    "
                  >
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      style="border-collapse: collapse; width: 100%"
                    >
                      <tbody>
                        <tr>
                          <td style="font-size: 12px; color: #000">
                            Ref. No:
                            <strong v-if="application">
                              {{ refText }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #000">
                            Date:
                            <strong v-if="application">
                              {{ getFormattedDate(application.majnoon_date) }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding-block-start: 30px;
                              padding-block-end: 30px;
                            "
                          >
                            <strong style="font-size: 13px; color: #000">
                              Re: Multi Entry Visa ({{ loiTypeObject?.value }})
                              Issuance Request
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-block-end: 30px">
                            <strong style="font-size: 13px; color: #000">
                              To: Majnoon Oil Field Production and Development
                              Authority
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #000">
                            You are kindly requested to secure official
                            approvals to issue multi entry visa ({{
                              loiTypeObject?.value
                            }}) for the individuals listed in the attached
                            table, whom working at AntonOil Services DMCC in
                            Majnoon Oilfield According to the contract
                            No.<strong>MFD-BOC-001.</strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-block-end: 8px;
                            "
                          >
                            List of names starts with
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-inline-start: 10px;
                              padding-block-end: 8px;
                            "
                          >
                            <strong v-if="application && applicants.length > 0">
                              1-
                              {{ smallestApplicantIdRecord.full_name }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-block-end: 8px;
                            "
                          >
                            Ends with
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-inline-start: 10px;
                              padding-block-end: 8px;
                            "
                          >
                            <strong v-if="application && applicants.length > 0">
                              {{ applicants.length }}-
                              {{ largestApplicantIdRecord.full_name }}
                            </strong>
                            <div>
                              Kindly inform the Iraqi embassies\ consulates in
                              both of
                              <strong>Dubai and their countries.</strong>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding: 15px 0;
                            "
                          >
                            We also would like to confirm that the personnel
                            listed in the attached table cannot be replaced with
                            local workers.
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding: 15px 0;
                            "
                          >
                            With regards,
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-block-start: 30px;
                            "
                          >
                            <strong>
                              <div>YANG, CHENG</div>
                              <div>Assistant Managing Director</div>
                              <div>AntonOil Services DMCC</div>
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    style="
                      width: 45%;
                      vertical-align: top;
                      padding-block-start: 10px;
                    "
                  >
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      style="border-collapse: collapse; width: 100%"
                      dir="rtl"
                    >
                      <tbody>
                        <tr>
                          <td style="font-size: 12px; color: #000">
                            <!-- العدد \ IFMS-04 -->
                            العدد:
                            <strong v-if="application">
                              {{ refText }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #000">
                            التاريخ:
                            <strong v-if="application">
                              {{ getFormattedDate(application.majnoon_date) }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding-block-start: 30px;
                              padding-block-end: 30px;
                            "
                          >
                            <strong style="font-size: 13px; color: #000">
                              الموضوع: طلب منح سمات دخول متعددة (لمدة
                              {{
                                convertToArabicNumbers(loiTypeObject?.value_ar)
                              }})
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-block-end: 30px">
                            <strong style="font-size: 13px; color: #000">
                              الى: هيئة انتاج وتطوير حقل مجنون النفطي
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #000">
                            يرجى التفضل بإستحصال الموافقات الاصولية على إصدار
                            سمات دخول متعددة (لمدة
                            {{
                              convertToArabicNumbers(loiTypeObject?.value_ar)
                            }}) للافراد المدرجة اسمائهم في القوائم المرفقة طياً
                            والعاملين في شركة انطونويل سيرفيز م.د.م.س العاملة في
                            حقل مجنون النفطي وفق العقد المرقم
                            <strong>MFD-BOC-001 .</strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-block-end: 8px;
                            "
                          >
                            قائمة تبدأ بالتسلسل
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-inline-end: 10px;
                              padding-block-end: 8px;
                            "
                          >
                            <strong v-if="application && applicants.length > 0">
                              {{ convertToArabicNumbers(1) }}-
                              {{
                                smallestApplicantIdRecord.arab_full_name ||
                                smallestApplicantIdRecord.full_name
                              }}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-block-end: 8px;
                            "
                          >
                            وتنتهي بالتسلسل
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding-inline-end: 10px;
                              padding-block-end: 8px;
                            "
                          >
                            <strong v-if="application && applicants.length > 0">
                              <!-- -14 محمد محسن العبد الرحيم -->
                              {{ convertToArabicNumbers(applicants.length) }}-
                              {{
                                largestApplicantIdRecord.arab_full_name ||
                                largestApplicantIdRecord.full_name
                              }}
                            </strong>
                            <div>
                              والتفضل بإشعار السفارات/ القنصليات العراقية في
                              كلاً من <strong>دبي وبلدانهم.</strong>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding: 15px 0;
                            "
                          >
                            كما نود التأكيد على انه لايمكن إستبدال الموظفين
                            المدرجة اسمائهم في القوائم المرفقة بالعمالة المحلية.
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #000;
                              padding: 15px 0;
                            "
                          >
                            مع التقدير
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-size: 12px;
                              color: #0f243e;
                              padding-block-start: 30px;
                            "
                          >
                            <strong>
                              <div>يانك جينك</div>
                              <div>مساعد المدير العام</div>
                              <div>انطونويل سيرفيز م.د.م.س</div>
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  formatDate,
  getLargestIdRecord,
  getSmallestIdRecord,
  numLatinToAr,
} from "@/helpers";
import { useLOIStore } from "@/stores";
import { mapStores } from "pinia";

export default defineComponent({
  name: "MajnoonDoc",
  data() {
    return {};
  },
  props: {
    application: Object,
    applicants: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getFormattedDate(dt) {
      return formatDate(dt);
    },
    convertToArabicNumbers(n) {
      return numLatinToAr(n);
    },
  },
  computed: {
    ...mapStores(useLOIStore),
    smallestApplicantIdRecord() {
      return getSmallestIdRecord(this.applicants);
    },
    largestApplicantIdRecord() {
      return getLargestIdRecord(this.applicants);
    },
    loiTypeObject() {
      return this.loiStore.getLOITypeById(this.application?.loi_type);
    },
    refText() {
      return this.application?.majnoon_ref
        ? `IFMS-${this.application?.majnoon_ref}`
        : "";
    },
  },
});
</script>

<style scoped>
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
.doc-wrapper {
  border-collapse: collapse;
  margin-inline-start: 30px !important;
  margin-inline-end: 30px !important;
}
</style>
