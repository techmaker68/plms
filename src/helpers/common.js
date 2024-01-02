/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Common helpers for misc functionalities

***********************************
*/
import { allowedLOIUploadTypes } from "@/data";
import { mapValues, omitBy, isNil } from "lodash-es";
import { useRouter } from "vue-router";
import { utils, writeFile, write } from "xlsx";
import { v4 as uuidv4 } from "uuid";

export const generateUIDs = (number) => {
  if (!number) {
    return uuidv4();
  } else {
    let temp = [];
    for (let i = 0; i < number; i++) {
      temp.push(uuidv4());
    }
    return temp;
  }
};

export const resolveLabelFromId = (array = [], id) => {
  if (id && array.length) {
    return array.find((element) => element.id == id).label;
  } else {
    return "";
  }
};

export const convertNullStringToNull = (value) => {
  if (typeof value === "string") {
    return value?.toLowerCase() === "null".toLowerCase() ? null : value;
  } else {
    return null;
  }
};

export const checkValidValue = (value) => {
  if (
    value == null ||
    value == "null" ||
    value == "0000-00-00" ||
    value == "" ||
    value == undefined
  ) {
    return "";
  } else {
    return value;
  }
};

export const isValidObject = (value) => {
  if (value) {
    return Object.keys(value).length != 0;
  } else {
    return !!value;
  }
};

export const cleanArrayObjects = (array) =>
  array.map((element) => mapValues(element, (v) => (v ? v : "")));

export const pdfGeneratorConfig = (
  filename,
  options = {},
  html2canvasOptions = {},
  jsPDFOptions = {}
) => ({
  margin: [5, 2],
  filename,
  pagebreak: { avoid: "tr" },
  html2canvas: {
    scale: 2,
    useCORS: true,
    ...html2canvasOptions,
  },
  jsPDF: {
    format: "letter",
    orientation: "portrait",
    ...jsPDFOptions,
  },
  ...options,
});

export const uploadFile = (input, withBase64) => {
  let response = {
    file: null,
    error: null,
    name: null,
  };
  let file = input.files;
  if (file && file[0]) {
    response.name = file[0].name;
    if (
      allowedLOIUploadTypes.includes(
        file[0]["name"].split(".").pop().toLowerCase()
      )
    ) {
      let reader = new FileReader();
      response.file = file[0];
      reader.readAsDataURL(file[0]);
    } else {
      response.error = "Invalid Extension";
    }
  }
  return response;
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const extractFiles = (input) => {
  let response = {
    files: null,
  };
  const files = input.files;
  if (files.length) {
    response.files = files;
  }
  return response;
};

function readFileAsDataURL(file) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve(fr.result);
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsDataURL(file);
  });
}

export const readMultipleFiles = async (input) => {
  let files = input.files;
  if (files.length) {
    let promises = [];
    let fileErr;
    files.forEach((file) => {
      if (
        ["png", "jpeg", "jpg", "pdf"].includes(
          file["name"].split(".").pop().toLowerCase()
        )
      ) {
        if (file["size"] < 2000000) {
          promises.push(readFileAsDataURL(file));
        } else {
          fileErr = "Size exeed";
        }
      } else {
        fileErr = "Invalid Extension";
      }
    });
    const values = await Promise.all(promises);
    return { data: values, error: fileErr };
  } else {
    throw new Error("Invalid input");
  }
};

export const acceptedFileInputs = () => {
  return allowedLOIUploadTypes.map((element) => `.${element}`).join(",");
};

export const getSmallestIdRecord = (array = []) =>
  array.reduce((acc, obj) => {
    if (obj.sequence_no < acc.sequence_no) {
      return obj;
    } else {
      return acc;
    }
  });

export const getLargestIdRecord = (array = []) =>
  array.reduce((acc, obj) => {
    if (obj.sequence_no > acc.sequence_no) {
      return obj;
    } else {
      return acc;
    }
  });

export const sanitizeObject = (myObj) => {
  let temp = { ...myObj };
  Object.keys(temp).forEach((i) => {
    temp[i] = checkValidValue(temp[i]);
  });
  return temp;
};

export const removeInvalidFields = (myObj) =>
  omitBy(myObj, (v) => !checkValidValue(v));

export const generateExcelFile = (list, name = "", save = true) => {
  if (list?.length > 0) {
    const options = {
      bookType: "xlsx",
      type: "binary",
    };
    const fileName = `${name}.xlsx`;
    const worksheet = utils.json_to_sheet(list);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    if (save) {
      writeFile(workbook, fileName, options);
    }
    return {
      file: write(workbook, { ...options, type: "base64" }),
      name: fileName,
    };
  } else {
    console.log("Error: No data to be exported");
  }
};

export const resetValidationObject = (objectValue) => {
  let temp = { ...objectValue };
  Object.keys(temp).forEach((i) => (temp[i] = {}));
  return temp;
};

export const resetObject = (objectValue) => {
  let temp = { ...objectValue };
  Object.keys(temp).forEach((i) => {
    if (Array.isArray(temp[i])) {
      temp[i] = [];
    }

    if (typeof temp[i] == "string" || typeof temp[i] == "number") {
      temp[i] = "";
    }

    if (typeof temp[i] == "boolean") {
      temp[i] = false;
    }
  });
  return temp;
};

export const excludeFromArray = (array, excludes) => {
  let temp = [...array];
  return temp.filter((item) => !excludes.includes(item));
};

export const includeUniqueToArray = (array, includes = []) => {
  let temp = [...array];

  includes.forEach((element) => {
    if (!temp.includes(element)) {
      temp.push(element);
    }
  });
  return temp;
};
