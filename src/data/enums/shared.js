/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Misc consts used throughout the application

***********************************
*/
export const StatusEnum = {
  Approved: 1,
  Expired: 2,
  ToBeRenewedNew: 3,
  ToBeRenewedOld: 4,
  Cancelled: 5,
};

export const VisaStatusRiskEnum = StatusEnum;

export const LanguagesEnum = {
  Arabic: "ar",
  English: "en",
};

export const CustomAxiosConfigEnum = {
  FileName: "fileName",
};

export const excelContentType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const excelButtonText = "Export as Excel";

export const iraqCountryId = 368;

export const SortApplicantsTypeEnum = {
  BloodApplicants: "blood_applicant",
  LOIApplicants: "loi_applicant",
};
