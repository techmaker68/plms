/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Route modules guards

***********************************
*/
import { Routes } from "@/data";
import { useUserStore } from "@/stores";

export const authGuard = (to, from, next) => {
  const { hasToken } = useUserStore();

  if (hasToken) {
    next({ name: Routes.DashboardModule });
  } else {
    next();
  }
};

export const dashboardGuard = (to, from, next) => {
  const { hasToken } = useUserStore();

  if (hasToken) {
    next();
  } else {
    next({ name: Routes.AuthModule });
  }
};
