import { defineStore } from "pinia";
import { useRoutes } from "@/hooks";
import { constantRoutes, HOME_NAME } from "@/router/routesConfig";
import { ref, computed } from "vue";

export const usePermissionStore = defineStore("permissionStore", () => {
  const loadedRouteList = ref<RouterConfig[]>([]);
  const flatRouteList = ref<RouterConfig[]>([]);

  const { processRouteMeta, findRouteByName, filterFlatRoutes, ascending } = useRoutes();

  const homeRoute = computed(() => findRouteByName(loadedRouteList.value, HOME_NAME)); // 路由里首页的 name 值，必须填且正确，默认为 Home

  const loadPermissionRoutes = (routers: RouterConfig[]) => {
    loadedRouteList.value = ascending(processRouteMeta(constantRoutes).concat(routers)) as RouterConfig[];
    flatRouteList.value = filterFlatRoutes(routers) as RouterConfig[];
    return flatRouteList.value;
  };

  return {
    loadedRouteList,
    homeRoute,
    flatRouteList,

    loadPermissionRoutes,
  };
});
