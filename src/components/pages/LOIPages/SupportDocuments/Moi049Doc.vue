<!--
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
-->
<template>
  <DefineTemplate>
    <Moi049Content :application="application" :applicants="applicants" />
  </DefineTemplate>

  <div class="document-align">
    <div class="letter-view">
      <slot></slot>
      <ReuseTemplate />
    </div>
    <button
      class="btn btn-outline-primary mb-4 ms-5 d-block btn-icon"
      @click="generatePDF"
    >
      <span class="icon-pdfIcon"></span>
      {{ $t("Print") }}
    </button>
    <vue3-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      :filename="downloadedFileName"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-content-width="800px"
      ref="html2Pdf"
      @beforeDownload="beforeDownload($event)"
    >
      <template #pdf-content>
        <div class="m-4">
          <ReuseTemplate />
        </div>
      </template>
    </vue3-html2pdf>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Vue3Html2pdf from "vue3-html2pdf";
import { createReusableTemplate } from "@vueuse/core";

import Moi049Content from "../PdfContent/Moi049Content.vue";
import { usePDF, usePDFEmits, usePDFProps } from "@/composables";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

export default defineComponent({
  name: "Moi049Doc",
  setup(props, { emit }) {
    const { beforeDownload } = usePDF(props, emit);

    return { beforeDownload };
  },
  data() {
    return {};
  },
  components: {
    Moi049Content,
    Vue3Html2pdf,
    DefineTemplate,
    ReuseTemplate,
  },
  emits: [...usePDFEmits],
  methods: {
    generatePDF() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  props: {
    ...usePDFProps,
    application: Object,
    applicants: {
      type: Array,
      default: () => [],
    },
  },
  async mounted() {},
  computed: {
    batchNumber() {
      return this.application?.batch_no;
    },
    downloadedFileName() {
      let fileName = `${
        this.application?.moi_ref ? this.application?.moi_ref + "-" : ""
      }MOI`;
      if (this.batchNumber) {
        fileName = `${this.batchNumber}_${fileName}`;
      }
      return fileName;
    },
  },
  watch: {},
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
.document-align {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  justify-content: center;
}
</style>
