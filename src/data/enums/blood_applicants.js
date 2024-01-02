/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
*/
export const TestStatusEnum = {
  Tested: 1,
  NoShow: 2,
  NoNeedToTest: 3,
};

export const TestPurposesEnum = {
  Bloods: "Bloods",
  MEEV: "MEEV",
  VisaCancellation: "Visa Cancellation",
};

export const MEEVTypeEnum = {
  New: "New",
  Renewal: "Renewal",
  Modify: "Modify",
};

export const BloodVisaTypesEnum = {
  Offboard: "Offboard",
  Extension: "Extension",
};

export const BloodTestTypesEnum = {
  Malaria: "M",
  HIV: "HIV",
  HBS: "HBS",
  Modify: "Modify",
};

export const TestStatus = [
  {
    id: TestStatusEnum.Tested,
    label: "Tested",
  },
  {
    id: TestStatusEnum.NoShow,
    label: "No show",
  },
  {
    id: TestStatusEnum.NoNeedToTest,
    label: "No need to test",
  },
];

export const ScheduledEnum = {
  UnScheduled: 0,
  Scheduled: 1,
};

export const PenaltyTypeEnum = {
  Blood: "blood",
  Visa: "visa",
};
