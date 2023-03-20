import { defineStore } from "pinia";
import { useRoutes } from "@/hooks/useRoutes";
import { constantRoutes, HOME_NAME } from "@/router/routesConfig";

export const usePermissionStore = defineStore("permissionStore", () => {
  const loadedRouteList = ref<RouterConfig[]>([]);
  const flatRouteList = ref<RouterConfig[]>([]);
  const isLoadedRoutes = ref(false);

  const { getFullPathAndTitle, getHomeRoute, filterFlatRoutes, ascending } = useRoutes();

  const homeRoute = computed(() => getHomeRoute(loadedRouteList.value, HOME_NAME)); // 路由里首页的 name 值，必须填且正确，默认为 Home

  const loadRolesRoutes = (routers: RouterConfigRaw[]) => {
    loadedRouteList.value = ascending(getFullPathAndTitle(constantRoutes).concat(routers)) as RouterConfig[];
    flatRouteList.value = filterFlatRoutes(routers) as RouterConfig[];
    isLoadedRoutes.value = true;
  };

  return {
    loadedRouteList,
    homeRoute,
    isLoadedRoutes,
    flatRouteList,

    loadRolesRoutes,
  };
});
