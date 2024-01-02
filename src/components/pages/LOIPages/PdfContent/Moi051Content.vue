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
              <td
                style="border-bottom: 2px solid #bf0022; padding-block-end: 5px"
              >
                <img
                  src="@/assets/img/antonLogo.png"
                  style="display: block; margin-inline-start: auto"
                />
              </td>
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
            </tr>
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
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 15px;
                  "
                >
                  العدد:
                  <span v-if="application">
                    {{ refText }}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #000">
                  التاريخ:
                  <span v-if="application">
                    {{ getFormattedDate(application.moi_2_date) }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 50px;
                  "
                >
                  <strong> الى: وزارة الداخلية/ مديرية شؤون الإقامة </strong>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 20px;
                  "
                >
                  <strong>
                    الموضوع:
                    <u
                      >طلب منح سمات دخول متعددة ({{
                        convertToArabicNumbers(loiTypeObject?.value_ar)
                      }})
                    </u>
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 30px;
                  "
                >
                  يرجى التفضل بالموافقة على منح سمات دخول متعددة لمدة ({{
                    convertToArabicNumbers(loiTypeObject?.value_ar)
                  }}) للسادة المدرجة اسمائهم وتفاصيل جوازاتهم بالقوائم المرفقة
                  طياً حسب العقد المبرم مع شركة نفط البصرة المرقم MFD-BOC-001 في
                  تاريخ 2018/06/30 والخاص بتقديم خدمات إدارة ميدانية متكاملة
                  لحقل مجنون تشمل جميع عمليات الصيانة وإدارة المنشأت
                  الهيدروكربونية المركبة للحقل علماً ان العقد مجدد لغاية
                  30\6\2024، راجين مفاتحة مكتب اقامة البصرة بذالك.
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 15px;
                  "
                >
                  كما نود التأكيد على انه لايمكن إستبدال الموظفين المدرجة
                  اسمائهم في القوائم المرفقة بالعمالة المحلية.
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 30px;
                  "
                >
                  قائمة تبدأ بالتسلسل
                </td>
              </tr>
              <tr>
                <td
                  style="font-size: 14px; color: #000; padding-inline-end: 15px"
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
                    font-size: 14px;
                    color: #000;
                    padding-block-start: 10px;
                  "
                >
                  وتنتهي بالتسلسل
                </td>
              </tr>
              <tr>
                <td
                  style="font-size: 14px; color: #000; padding-inline-end: 15px"
                >
                  <strong v-if="application && applicants.length > 0">
                    {{ convertToArabicNumbers(applicants.length) }}-
                    {{
                      largestApplicantIdRecord.arab_full_name ||
                      largestApplicantIdRecord.full_name
                    }}
                  </strong>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #000;
                    padding-inline-end: 15px;
                    padding-block-start: 30px;
                  "
                >
                  <span>مع التقدير.</span>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-size: 14px;
                    color: #0f243e;
                    padding-inline-end: 15px;
                    padding-block-start: 80px;
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
  name: "Moi051Content",
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
      return this.application?.moi_2_ref
        ? `ANTON-${this.application?.moi_2_ref}`
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
