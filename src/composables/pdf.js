/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Composable to handle components with PDF download

***********************************
*/
export const usePDFProps = {
  enableDownload: {
    type: Boolean,
    default: true,
  },
};

export const usePDFEmits = ["pdfData"];

export function usePDF(props, emit) {
  async function beforeDownload({ html2pdf, options, pdfContent }) {
    try {
      const saveFn = html2pdf()
        .set(options)
        .from(pdfContent)
        .toPdf()
        .output("datauristring")
        .then((base64) => {
          emit("pdfData", {
            base64,
            filename: options.filename,
          });
        });

      if (props.enableDownload) {
        await saveFn.save();
      }
    } catch (error) {
      console.log("Error downloading", error);
    }
  }

  return {
    beforeDownload,
  };
}
