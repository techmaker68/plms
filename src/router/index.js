/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

***********************************
*/
import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes";
import { useRouterStore } from "@/stores";
import { Routes } from "@/data";

const router = createRouter({
  history: createWebHistory(),
  routes,
  mode: "hash",
  linkActiveClass: "active",
});

// Add route guard for each route redirection
router.beforeEach((to, from) => {
  const { routeHasPermission } = useRouterStore();
  const hasPermission = routeHasPermission(to.name);

  if (hasPermission) {
    return true;
  } else {
    // If there's no from, redirect to forbidden
    if (from?.name) {
      return false;
    } else {
      return { name: Routes.Forbidden };
    }
  }
});

export * from "./guards";
export default router;
