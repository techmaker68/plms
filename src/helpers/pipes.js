/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Pipes are simple transformation functions

***********************************
*/
// Pipes are functions that manipulate displayed elements
import dayjs from "dayjs";
import { checkValidValue } from "./common";
import { isArray, isString } from "lodash-es";
import { LanguagesEnum } from "@/data";
import i18n from "@/i18n";

export const defaultDateFormat = "YYYY-MM-DD";
const today = dayjs()
  .set("hour", 0)
  .set("minute", 0)
  .set("second", 0)
  .set("millisecond", 0);

export const convertToFormData = (jsonObject) => {
  let temp = new FormData();
  for (let key in jsonObject) {
    // Special code for blobs upload
    if (jsonObject[key] instanceof FileList) {
      Array.from(jsonObject[key]).forEach((element) => {
        if (element instanceof Blob) {
          temp.append(`${key}[]`, element);
        }
      });
    } else {
      temp.append(key, jsonObject[key]);
    }
  }
  return temp;
};

export const convertToDayjs = (date) => dayjs(date);

export const formatDate = (
  dt,
  originalFormat,
  returnFormat = defaultDateFormat,
  getSource = false
) => {
  if (checkValidValue(dt)) {
    const temp = dayjs(dt, originalFormat);
    return getSource ? temp : temp.format(returnFormat);
  } else {
    return "";
  }
};

export const appendDate = (
  dt,
  amount,
  unit,
  format = defaultDateFormat,
  getSource = false
) => {
  if (checkValidValue(dt)) {
    let temp = dayjs(dt, defaultDateFormat);
    temp = temp.add(amount, unit);
    return getSource ? temp : temp.format(format);
  } else {
    return "";
  }
};

export const datesDifference = (dt1, dt2 = new Date(), unit = "day") => {
  if (checkValidValue(dt1) && checkValidValue(dt2)) {
    return dayjs(dt1, defaultDateFormat).diff(dt2, unit);
  } else {
    return "";
  }
};

export const convertFilterObject = (objectValue) => {
  let temp = { ...objectValue };
  Object.keys(temp).forEach((i) => {
    if (Array.isArray(temp[i])) {
      temp[i] = temp[i].join(",");
    }
  });
  return temp;
};

export const stringToBoolean = (value) => {
  if (typeof value == "string" && value != "") {
    return value == "true" ? true : false;
  } else {
    console.warn("Value isn't a valid string");
    return !!value;
  }
};

export const numLatinToAr = (n) =>
  checkValidValue(n) && String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export const translateObject = (object, key) => {
  if (i18n.global.locale.value == LanguagesEnum.Arabic) {
    return object[`${key}_ar`] ? object[`${key}_ar`] : object[`${key}`];
  } else {
    return object[key];
  }
};

export const convertQueryStringToArray = (query) =>
  isString(query) ? query.split(",") : query;

export const convertQueryStringToBoolean = (query) =>
  query ? query.toLowerCase() == "true" : false;

export const countryToNationalityLabel = (country) =>
  `${country.nationality} (${country.EngName})`;

export const issueDisabledDates = (date) => {
  const nextDate = dayjs().subtract(10, "years");
  return date > today.toDate() || date < nextDate.toDate();
};

export const dobDisabledDates = (date) => {
  const prevDate = dayjs().subtract(10, "years");
  return date > prevDate.toDate();
};

export const expiryDisabledDates = (date) => {
  const nextDate = dayjs().add(10, "years");
  return date > nextDate.toDate() || date < today.toDate();
};

export const defaultDisabledDates = (date) => {
  const maxDate = dayjs().add(20, "years");
  const minDate = dayjs("01-01-1920", "MM-DD-YYYY");
  return date > maxDate || date < minDate;
};
