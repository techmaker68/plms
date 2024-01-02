/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
*/
export const LOIApplicationStatusEnum = {
  Closed: 2,
  Open: 1,
};

export const LOIApplicationIssuedEnum = {
  NotIssued: 1,
  Issued: 2,
};

export const LOIApplicantStatusEnum = {
  Approved: 1,
  Rejected: 2,
  Cancelled: 3,
  GiveUp: 4,
};

export const LOITypes = {
  ThreeMonths: 1,
  SixMonths: 2,
  TwelveMonths: 3,
};

export const LOINationCategories = {
  Foreign: 1,
  Arab: 2,
  Syrian: 3,
};

export const LOITimelineDocumentDeleteEnum = {
  BocMoo: "boc_moo_index",
  MFD: "mfd_index",
  HQ: "hq_index",
  Payment: "payment_copy_index",
  Photo: "loi_photo_copy_index",
};

export const LOIDocsEnum = {
  Majnoon: "Majnoon",
  Moo: "Moo",
  Moi49: "Moi49",
  Moi51: "Moi51",
};

export const LOIPriority = {
  Low: 1,
  Normal: 2,
  High: 3,
};

export const LOITimelineDocumentSections = {
  AddPaxes: "add_paxes",
  MFD: "boc_mfd",
  HQ: "boc_hq",
  MOO: "moo",
  MOI: "moi",
  LOI: "loi",
  Sent: "sent_loi",
  Closed: "close",
};
