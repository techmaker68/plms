/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Main router configuration

***********************************
*/
import { EnvironmentEnum, Routes } from "@/data";
import { authGuard, dashboardGuard } from "./guards";

const DashboardLayout = () => import("@/layouts/dashboard_layout.vue");
const AuthLayout = () => import("@/layouts/auth_layout.vue");

// Contractor
const ContractorRegister = () =>
  import("@/components/pages/Contractor/ContractorRegister.vue");

const ContractorDepartmentsRegister = () =>
  import("@/components/pages/Contractor/DepartmentsRegister.vue");

const LoiManagement = () =>
  import("@/components/pages/LOIPages/LoiManagement.vue");
const LoiApplications = () =>
  import("@/components/pages/LOIPages/LoiApplications.vue");
const LoiApplicationDetails = () =>
  import("@/components/pages/LOIPages/LoiApplicationDetails.vue");
const LoiRequest = () => import("@/components/pages/LOIPages/LoiRequest.vue");

// Visa
const VisaManagement = () =>
  import("@/components/pages/Visa/VisaManagement.vue");

// Dashboard
const DashboardPage = () =>
  import("@/components/pages/Dashboard/DashboardPage.vue");

// PLMS
const PaxProfiles = () => import("@/components/pages/Pax/PaxProfiles.vue");

// PAX PROFILE
const PaxProfileView = () => import("@/components/pages/Pax/PaxProfile.vue");

// passport
const PassportView = () =>
  import("@/components/pages/Passport/PassportView.vue");

// Blood Test
const TestRecords = () =>
  import("@/components/pages/BloodTest/TestRecords.vue");
const BloodTest = () => import("@/components/pages/BloodTest/BloodTest.vue");
const BloodTestSubmission = () =>
  import("@/components/pages/BloodTest/BloodTestSubmission.vue");
// Setting
const UserManagement = () =>
  import("@/components/pages/Settings/UserManagement.vue");
const RolesSettings = () =>
  import("@/components/pages/Settings/RolesSettings.vue");
const PermissionsSettings = () =>
  import("@/components/pages/Settings/PermissionsSettings.vue");
const ConfigurationsSettings = () =>
  import("@/components/pages/Settings/ConfigurationsSettings.vue");
// Errors
const Forbidden = () => import("@/components/pages/Errors/Forbidden.vue");
const NotFound = () => import("@/components/pages/Errors/NotFound.vue");

// Login
const LoginUserPage = () => import("@/components/pages/Auth/LoginUser.vue");

const baseRoute = import.meta.env[EnvironmentEnum.BaseRoute];

export const routes = [
  {
    path: "/",
    redirect: { name: Routes.DashboardPage },
  },
  {
    path: baseRoute ? baseRoute : "/",
    children: [
      {
        path: "auth/",
        name: Routes.AuthModule,
        component: AuthLayout,
        beforeEnter: authGuard,
        redirect: { name: Routes.Login },
        children: [
          {
            path: "login",
            name: Routes.Login,
            component: LoginUserPage,
          },
        ],
      },
      {
        path: "",
        name: Routes.DashboardModule,
        component: DashboardLayout,
        beforeEnter: dashboardGuard,
        redirect: { name: Routes.DashboardPage },
        children: [
          {
            path: "dashboard/",
            name: Routes.DashboardPage,
            component: DashboardPage,
          },
          {
            path: "pax",
            name: Routes.PaxModule,
            redirect: { name: Routes.PaxProfiles },
            children: [
              {
                path: "profiles",
                name: Routes.PaxProfiles,
                component: PaxProfiles,
              },
              {
                path: "passport",
                name: Routes.Passport,
                component: PassportView,
              },
              {
                path: ":id",
                name: Routes.PLMSPaxProfileView,
                component: PaxProfileView,
                props: true,
              },
            ],
          },
          {
            path: "loi",
            name: Routes.LOIModule,
            redirect: { name: Routes.LOIApplications },
            children: [
              {
                path: "loi-applications",
                name: Routes.LOIApplications,
                component: LoiApplications,
              },
              {
                path: "loi-management",
                name: Routes.LOIManagement,
                component: LoiManagement,
                children: [
                  {
                    path: ":id",
                    name: Routes.LOIApplicationDetails,
                    component: LoiApplicationDetails,
                    props: true,
                  },
                ],
              },
              {
                path: "loi-applications/:id",
                name: Routes.LOIRequest,
                component: LoiRequest,
                props: true,
              },
            ],
          },
          {
            path: "blood",
            name: Routes.BloodModule,
            redirect: { name: Routes.BloodTest },
            children: [
              {
                path: "blood-tests",
                name: Routes.BloodTest,
                component: BloodTest,
                children: [
                  {
                    path: ":id",
                    name: Routes.BloodTestSubmission,
                    component: BloodTestSubmission,
                    props: true,
                  },
                ],
              },
              {
                path: "test-records",
                name: Routes.BloodTestRecords,
                component: TestRecords,
              },
              {
                path: "visa-management",
                name: Routes.VisaManagement,
                component: VisaManagement,
              },
            ],
          },
          {
            path: "company",
            name: Routes.CompanyModule,
            redirect: { name: Routes.ContractorRegister },
            children: [
              {
                path: "contractor-register",
                name: Routes.ContractorRegister,
                component: ContractorRegister,
              },
              {
                path: "departments-register",
                name: Routes.ContractorDepartmentsRegister,
                component: ContractorDepartmentsRegister,
              },
            ],
          },
          {
            path: "settings",
            name: Routes.SettingsModule,
            redirect: { name: Routes.UserManagement },
            children: [
              {
                path: "user-management",
                name: Routes.UserManagement,
                component: UserManagement,
              },
              {
                path: "roles",
                name: Routes.Roles,
                component: RolesSettings,
              },
              {
                path: "permissions",
                name: Routes.Permissions,
                component: PermissionsSettings,
              },
              {
                path: "configurations",
                name: Routes.Configurations,
                component: ConfigurationsSettings,
              },
            ],
          },
        ],
      },
      {
        path: "forbidden",
        name: Routes.Forbidden,
        component: Forbidden,
      },
      {
        path: "404",
        name: Routes.NotFound,
        component: NotFound,
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: { name: Routes.NotFound } },
];
