/*
***********************************
@author Mohanned Hassan
@create_date 4th Dec 2023

Composable to handle common router functionalities

***********************************
*/

import { useRouter } from "vue-router";

export function useRouterHelpers() {
  const router = useRouter();

  const navigateToRouteInNewTab = (name) => {
    const routeData = router.resolve({
      name,
    });
    window.open(routeData.href, "_blank");
  };

  return {
    navigateToRouteInNewTab,
  };
}
