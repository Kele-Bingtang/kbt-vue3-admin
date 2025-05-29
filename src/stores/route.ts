import { ref, computed, unref } from "vue";
import { defineStore } from "pinia";
import { useRoutes } from "@/composables";
import { staticRoutes, errorRouter, notFoundRouter } from "@/router/routesConfig";
import { HOME_NAME } from "@/config";

export const useRouteStore = defineStore("routeStore", () => {
  const loadedRouteList = ref<RouterConfig[]>([]);
  const flatRoleRouteList = ref<RouterConfig[]>([]);
  const flatRouteList = ref<RouterConfig[]>([]);

  const { processRouteMeta, findRouteByName, filterFlatRoutes, ascending } = useRoutes();

  const homeRoute = computed(() => findRouteByName(loadedRouteList.value, HOME_NAME)); // 路由里首页的 name 值，必须填且正确，默认为 Home

  const loadPermissionRoutes = (routers: RouterConfig[]) => {
    loadedRouteList.value = ascending(
      processRouteMeta(staticRoutes).concat(routers).concat(errorRouter).concat(notFoundRouter)
    );
    flatRoleRouteList.value = filterFlatRoutes(routers);
    flatRouteList.value = filterFlatRoutes(
      processRouteMeta(staticRoutes).concat(routers).concat(errorRouter).concat(notFoundRouter) as RouterConfig[]
    );

    return unref(flatRouteList);
  };

  return {
    loadedRouteList,
    homeRoute,
    flatRouteList,

    loadPermissionRoutes,
  };
});
