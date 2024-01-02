<template>
  <DefineTemplate>
    <Moi051Content :application="application" :applicants="applicants" />
  </DefineTemplate>

  <div class="document-align">
    <div class="letter-view">
      <slot></slot>
      <ReuseTemplate />
    </div>
    <button
      @click="generatePDF"
      class="btn btn-outline-primary mb-4 ms-5 d-block btn-icon"
    >
      <span class="icon-pdfIcon"></span> {{ $t("Print") }}
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

import Moi051Content from "../PdfContent/Moi051Content.vue";
import { usePDF, usePDFEmits, usePDFProps } from "@/composables";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

export default defineComponent({
  name: "Moi051Doc",
  setup(props, { emit }) {
    const { beforeDownload } = usePDF(props, emit);

    return { beforeDownload };
  },
  data() {
    return {};
  },
  components: {
    Vue3Html2pdf,
    Moi051Content,
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
        this.application?.moi_2_ref ? this.application?.moi_2_ref + "-" : ""
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
.document-align {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  justify-content: center;
}
</style>
