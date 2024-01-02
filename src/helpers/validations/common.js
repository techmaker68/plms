/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Misc form validators

***********************************
*/
export const validName = {
  $validator: (name) => {
    // const validNamePattern = /^[a-zA-Z'-]+(?:\s[a-zA-Z'-]+)?$/;
    if (name) {
      const validNamePattern = /^[A-Za-z ]+$/;
      return validNamePattern.test(name);
    } else {
      return true;
    }
  },
  $message: "The value must be in English",
  $params: {
    type: "EnglishName",
  },
};

export const validNameArabic = {
  $validator: (name) => {
    if (name) {
      const validNamePattern = /^[\u0600-\u06FF ]+$/;
      return validNamePattern.test(name);
    } else {
      return true;
    }
  },
  $message: "The value must be in Arabic",
  $params: {
    type: "ArabicName",
  },
};

export const validPhoneNumber = {
  $validator: (phone) => {
    if (phone) {
      const validPhoneNumberPattern = /^[0-9\- ]{6,15}?$/;
      return validPhoneNumberPattern.test(phone);
    } else {
      return true;
    }
  },
  $message: "The value must be a valid phone",
  $params: {
    type: "phoneNumber",
  },
};
