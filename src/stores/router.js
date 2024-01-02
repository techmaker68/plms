/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

Router store
Provides easy access to shared routes configurations

***********************************
*/
import { defineStore } from "pinia";
import { links } from "@/data";
import { useRoute } from "vue-router";
import { useUserStore } from "./user";
import { find, flatMap } from "lodash-es";

export const useRouterStore = defineStore("router", {
  state: () => ({
    routes: links,
  }),
  getters: {
    permissionFilteredRoutes(state) {
      const { hasAnyPermission } = useUserStore();

      // We filter routes based on permissions
      return state.routes.map((originalModule) => {
        let module = { ...originalModule };

        // We adjust visibility only if module has permissions
        if (module?.permissions) {
          if (module.visibility) {
            module.visibility = hasAnyPermission(module.permissions);
          }

          // We adjust children visibility
          module.children = module.children.map((originalChild) => {
            let child = { ...originalChild };
            // Adjust visibility only for visible children with permission
            if (child?.permissions?.length && child?.visibility) {
              child.visibility = hasAnyPermission(child.permissions);
            }
            return child;
          });

          // If module has no visible children at all, hide it as well
          const visibleChild = module.children.find(
            (element) => element.visibility
          );
          if (!visibleChild) {
            module.visibility = false;
          }
        }

        return module;
      });
    },
    getActiveModule(state) {
      const route = useRoute();
      if (state.routes && route) {
        return this.permissionFilteredRoutes?.find((module) => {
          return !!module.children.find((child) => child.name === route.name);
        });
      } else {
        return;
      }
    },
    routeHasPermission(state) {
      return (name) => {
        const { hasAnyPermission } = useUserStore();
        let correctChild;

        // For loop so we can break
        for (let i = 0; i < state.routes?.length; i++) {
          // Only look for child routes cause any module will redirect to a child
          correctChild = find(state.routes[i].children, {
            name,
          });

          if (correctChild) {
            break;
          }
        }

        // We return true in case route has no permissions defined
        return correctChild?.permissions?.length
          ? hasAnyPermission(correctChild?.permissions)
          : true;
      };
    },
  },
  actions: {},
});
