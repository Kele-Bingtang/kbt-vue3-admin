import { StarFilled } from "@element-plus/icons-vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";

const detailsRoutes: RouterConfigRaw = {
  path: "/arg",
  name: "Arg",
  redirect: "/arg/params/1",
  meta: {
    hideInMenu: true,
    hideInBread: true,
  },
  children: [
    {
      path: "query",
      name: "Query",
      component: "/tabs/query-detail",
      meta: {
        title: (route: RouteLocationNormalizedLoaded) => `{{ _route.Query }}-${route.query.id}`,
        icon: StarFilled,
        beforeCloseName: "before_close_normal",
      },
    },
    {
      path: "params/:id",
      name: "Params",
      component: "/tabs/params-detail",
      meta: {
        title: (route: RouteLocationNormalizedLoaded) => `{{ _route.Params }}-${route.params.id}`,
        icon: StarFilled,
        beforeCloseName: "before_close_normal",
        dynamicLevel: 3,
      },
    },
  ],
};

export default detailsRoutes;
