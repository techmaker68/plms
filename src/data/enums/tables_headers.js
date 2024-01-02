export const PAXHeaders = Object.freeze({
  PAX: "pax_id",
  FullName: "eng_full_name",
  PAXType: "type",
  BadgeNo: "badge_no",
  Position: "position",
  Department: "department",
  Employer: "company_id",
  Passport: "passport_exist",
  PassportNo: "passport_no",
  Visa: "visa_exist",
  Email: "email",
  Nationality: "nationality",
  LOIExpiry: "LOIExpiry",
  VisaExpiry: "visa_expire_date",
  Docs: "docs",
  Actions: "actions",
});

export const RolesHeaders = Object.freeze({
  Role: "name",
  DisplayName: "display_name",
  Actions: "actions",
});

export const LOIApplicationsHeaders = Object.freeze({
  LOINo: "loi_no",
  Type: "loi_type",
  LOIIssueDate: "loi_issue_date",
  LOIExpiryDate: "close_date",
  BatchNo: "batch_no",
  NationCategory: "nation_category",
  ApplicantsCount: "applicants_count",
  SubmissionDate: "submission_date",
  BOCMFD: "mfd_date",
  BOCHQDate: "hq_date",
  MOODate: "boc_moo_date",
  MOIPaymentDate: "moi_payment_letter_date",
  LOIIssued: "loi_issued",
  Priority: "priority",
  Status: "status",
});

export const BloodApplicantsHeaders = Object.freeze({
  PAX: "pax_id",
  FullName: "full_name",
  BadgeNo: "badge_no",
  Company: "employer",
  PassportNo: "passport_no",
  Nationality: "nationality",
  Arrival: "arrival_date",
  Departure: "departure_date",
  PassportSubmitDate: "passport_submit_date",
  AppointTime: "appoint_time",
  Attendance: "attendance",
  PassportReturnDate: "passport_return_date",
  BatchNo: "batch_no",
  BatchSubmissionDate: "submission_date",
  LastHivDate: "last_hiv",
  NextHivDate: "next_hiv",
  LastHbsDate: "last_hbs",
  NextHbsDate: "next_hbs",
  Actions: "actions",
});

export const UsersHeaders = Object.freeze({
  Name: "name",
  Email: "email",
  Roles: "roles",
  Actions: "actions",
});

export const PermissionsHeaders = Object.freeze({
  Name: "name",
  Description: "description",
  Actions: "actions",
});

export const LOIApplicantsHeaders = Object.freeze({
  PAX: "pax_id",
  FullName: "full_name",
  Company: "employer",
  PassportNo: "passport_no",
  Nationality: "nationality",
  Department: "department",
  PaxType: "pax_type",
  DepositAmount: "deposit_amount",
  VisaNo: "visa_no",
});

export const VisaHeaders = Object.freeze({
  PAX: "pax_id",
  FullName: "full_name",
  Type: "type",
  PassportNo: "passport_no",
  Employer: "employer",
  Department: "department",
  DateOfIssue: "date_of_issue",
  DateOfExpiry: "date_of_expiry",
  ExpireInDays: "expire_in_days",
  Status: "status",
  Actions: "action",
});

export const PassportHeaders = Object.freeze({
  PAX: "pax_id",
  FullName: "full_name",
  Type: "type",
  PassportCountry: "passport_country",
  PassportNo: "passport_no",
  Birthday: "birthday",
  Employer: "employer",
  Department: "department",
  DateOfIssue: "date_of_issue",
  DateOfExpiry: "date_of_expiry",
  ExpireInDays: "expire_in_days",
  Status: "status",
});
