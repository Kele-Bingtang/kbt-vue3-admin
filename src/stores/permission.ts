import { defineStore } from "pinia";
import { useRoutes } from "@/composables";
import { constantRoutes, errorRouter, HOME_NAME, notFoundRouter } from "@/router/routesConfig";
import { ref, computed, unref } from "vue";

export const usePermissionStore = defineStore("permissionStore", () => {
  const loadedRouteList = ref<RouterConfig[]>([]);
  const flatRoleRouteList = ref<RouterConfig[]>([]);
  const flatRouteList = ref<RouterConfig[]>([]);

  const { processRouteMeta, findRouteByName, filterFlatRoutes, ascending } = useRoutes();

  const homeRoute = computed(() => findRouteByName(loadedRouteList.value, HOME_NAME)); // 路由里首页的 name 值，必须填且正确，默认为 Home

  const loadPermissionRoutes = (routers: RouterConfig[]) => {
    loadedRouteList.value = ascending(
      processRouteMeta(constantRoutes).concat(routers).concat(errorRouter).concat(notFoundRouter)
    );
    flatRoleRouteList.value = filterFlatRoutes(routers);
    flatRouteList.value = filterFlatRoutes(
      processRouteMeta(constantRoutes).concat(routers).concat(errorRouter).concat(notFoundRouter) as RouterConfig[]
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
