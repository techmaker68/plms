/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Object containing all routes internal settings
used to control Header/Side menus

***********************************
*/
import { PermissionsEnum, Routes } from "@/data/enums";
import i18n from "@/i18n";

const { t } = i18n.global;

const defaultLinks = Object.freeze([
  {
    label: t("Home"),
    label_ar: "الرئيسية",
    name: Routes.DashboardModule,
    visibility: true,
    class: "icon-discgraph",
    headerClass: "icon-HomeIcon",
    children: [
      {
        label: "Home",
        label_ar: "الرئيسية",
        name: Routes.DashboardPage,
        menuClass: "icon-discgraph",
        visibility: true,
      },
    ],
  },
  {
    label: "PAX",
    label_ar: "PAX",
    name: Routes.PaxModule,
    visibility: true,
    class: "icon-userIcon",
    headerClass: "icon-person",
    permissions: [PermissionsEnum.PAXES_GET, PermissionsEnum.PASSPORTS_GET],
    children: [
      {
        label: "PAXES",
        label_ar: "PAXES",
        name: Routes.PaxProfiles,
        menuClass: "icon-person",
        visibility: true,
        extraRoutes: [Routes.PLMSPaxProfileView],
        permissions: [PermissionsEnum.PAXES_GET],
      },

      {
        label: "Passports",
        label_ar: "الجوازات",
        name: Routes.Passport,
        menuClass: "icon-contacts",
        visibility: true,
        permissions: [PermissionsEnum.PASSPORTS_GET],
      },
      {
        label: "PAX Profile",
        name: Routes.PLMSPaxProfileView,
        menuClass: "icon-testtube",
        visibility: false,
      },
    ],
  },
  {
    label: "LOI",
    label_ar: "LOI",
    name: Routes.LOIModule,
    visibility: true,
    class: "icon-certificateGreen",
    headerClass: "icon-success",
    permissions: [
      PermissionsEnum.LOI_BATCHES_GET,
      PermissionsEnum.LOI_MANAGEMENT_GET,
    ],
    children: [
      {
        label: "LOI Batches",
        label_ar: "دفعات LOI",
        name: Routes.LOIApplications,
        menuClass: "icon-envelope",
        visibility: true,
        extraRoutes: [Routes.LOIRequest],
        permissions: [PermissionsEnum.LOI_BATCHES_GET],
      },
      {
        label: "LOI Management",
        label_ar: "LOI Management",
        name: Routes.LOIManagement,
        menuClass: "icon-success",
        visibility: true,
        permissions: [PermissionsEnum.LOI_MANAGEMENT_GET],
      },
      // We add this here but invisible so store can detect it in module
      {
        label: "LOI Application Details",
        label_ar: "تفاصيل طلب LOI",
        name: Routes.LOIApplicationDetails,
        menuClass: "icon-testtube",
        visibility: false,
      },
      {
        label: "LOI Request",
        label_ar: "طلب LOI",
        name: Routes.LOIRequest,
        menuClass: "icon-success",
        visibility: false,
      },
    ],
  },
  {
    label: "Blood Test",
    label_ar: "فحص الدم",
    name: Routes.BloodModule,
    visibility: true,
    class: "icon-testTube",
    headerClass: "icon-testtube",
    permissions: [
      PermissionsEnum.BLOOD_TESTS_GET,
      PermissionsEnum.TEST_RECORDS_GET,
      PermissionsEnum.VISAS_GET,
    ],
    children: [
      {
        label: "Test Batches",
        label_ar: "دفعة الفحص",
        name: Routes.BloodTest,
        menuClass: "icon-testtube",
        visibility: true,
        permissions: [PermissionsEnum.BLOOD_TESTS_GET],
      },
      // We add this here but invisible so store can detect it in module
      {
        label: "Blood Test Submission",
        label_ar: "تقديم اختبار الدم",
        name: Routes.BloodTestSubmission,
        menuClass: "icon-testtube",
        visibility: false,
        permissions: [PermissionsEnum.BLOOD_TESTS_GET],
      },
      {
        label: "Test Records",
        label_ar: "سجلات الاختبارات",
        name: Routes.BloodTestRecords,
        menuClass: "icon-search",
        visibility: false,
        permissions: [PermissionsEnum.TEST_RECORDS_GET],
      },
      {
        label: "Visas",
        label_ar: "فيزا",
        name: Routes.VisaManagement,
        menuClass: "icon-certificate",
        visibility: true,
        permissions: [PermissionsEnum.VISAS_GET],
      },
    ],
  },

  {
    label: "Company",
    label_ar: "الشركة",
    name: Routes.CompanyModule,
    visibility: true,
    class: "icon-company",
    headerClass: "icon-person",
    permissions: [
      PermissionsEnum.COMPANIES_GET,
      PermissionsEnum.DEPARTMENTS_GET,
    ],
    children: [
      {
        label: "Companies",
        label_ar: "الشركات",
        name: Routes.ContractorRegister,
        menuClass: "icon-person",
        visibility: true,
        permissions: [PermissionsEnum.COMPANIES_GET],
      },
      {
        label: "Departments",
        label_ar: "الأقسام",
        name: Routes.ContractorDepartmentsRegister,
        menuClass: "icon-person",
        visibility: true,
        permissions: [PermissionsEnum.DEPARTMENTS_GET],
      },
      {
        label: "Contractor Register",
        label_ar: "سجل المقاولين",
        name: Routes.ContractorManagement,
        menuClass: "icon-person",
        visibility: false,
      },
    ],
  },
  {
    label: "Settings",
    label_ar: "الإعدادات",
    name: Routes.SettingsModule,
    visibility: true,
    class: "icon-settings",
    headerClass: "icon-settings",
    permissions: [
      PermissionsEnum.USERS_GET,
      PermissionsEnum.ROLES_GET,
      PermissionsEnum.PERMISSIONS_GET,
    ],
    children: [
      {
        label: "Users",
        label_ar: "المستخدمون",
        name: Routes.UserManagement,
        menuClass: "icon-search",
        visibility: true,
        permissions: [PermissionsEnum.USERS_GET],
      },
      {
        label: "Roles",
        label_ar: "أدوار المستخدمين",
        name: Routes.Roles,
        menuClass: "icon-person",
        visibility: true,
        permissions: [PermissionsEnum.ROLES_GET],
      },
      {
        label: "Permissions",
        label_ar: "الصلاحيات",
        name: Routes.Permissions,
        menuClass: "icon-success",
        visibility: true,
        permissions: [PermissionsEnum.PERMISSIONS_GET],
      },
      {
        label: "Configurations",
        label_ar: "الضبط",
        name: Routes.Configurations,
        menuClass: "icon-settings",
        visibility: true,
        permissions: [PermissionsEnum.CONFIGURATIONS_GET],
      },
    ],
  },
]);

export default defaultLinks;
