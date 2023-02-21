import { ref } from "vue";
import { defineStore } from "pinia";
import { useRoutes } from "@/hooks/useRoutes";
import { constantRoutes } from "@/router/routes-config";

export const usePermissionStore = defineStore("permissionStore", () => {
  const loadedRouteList = ref<RouterConfig[]>([]);
  const flatRouteList = ref<RouterConfig[]>([]);
  const isLoadedRoutes = ref(false);

  const { getRouteFullPath, getHomeRoute, getFlatArray } = useRoutes();

  const homeRoute = computed(() => getHomeRoute(loadedRouteList.value, "Home")); // 路由里首页的 name 值，必须填且正确，默认为 Home

  const loadRolesRoutes = (routes: RouterConfigRaw[]) => {
    loadedRouteList.value = getRouteFullPath(constantRoutes).concat(
      getRouteFullPath(routes)
    ) as unknown as RouterConfig[];
    flatRouteList.value = getFlatArray(routes) as unknown as RouterConfig[];
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
