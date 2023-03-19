import { DeviceType } from "@/stores/index.d";
import { useLayoutStore } from "@/stores/layout";
import { usePermissionStore } from "@/stores/permission";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import settings from "@/config/settings";
import { useSettingsStore } from "@/stores/settings";
import { useUserStore } from "@/stores/user";

export const useLayout = () => {
  const layoutStore = useLayoutStore();
  const settingsStore = useSettingsStore();
  const userStore = useUserStore();
  const { homeRoute } = usePermissionStore();
  const { t } = useI18n();

  /**
   * @description 是否为移动端
   * @returns boolean：true 是，false 不是
   */
  const isMobile = () => {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < 767; // 这里以 ipad Mini 的宽度为移动端的阈值
  };
  /**
   * @description 计算页面尺寸
   */
  const resizeHandler = () => {
    if (!document.hidden) {
      const result = isMobile();
      layoutStore.toggleDevice(result ? DeviceType.Mobile : DeviceType.Desktop);
      if (result) settingsStore.closeSideMenu();
    }
  };

  /**
   * @description 根据当前跳转的路由设置显示在浏览器标签的 title
   * @param route 当前路由
   */
  const setTitle = (route: RouteConfig | RouterConfig) => {
    const { title } = settings;
    const pageTitle = getTitle(route);
    let resTitle = pageTitle ? `${title} - ${pageTitle}` : title; // 默认标题的模式
    const { titleMode } = settingsStore;
    // 展示标题的多种模式判断
    if (titleMode === "0") resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
    else if (titleMode === "1") {
      const { username } = userStore.userInfo;
      if (username && pageTitle) resTitle = `${username} - ${pageTitle}`;
      else if (username) resTitle = `${title} - ${username}`;
      else if (!pageTitle) resTitle = title;
    } else if (titleMode === "2") resTitle = title;
    else if (titleMode === "3") resTitle = pageTitle;
    window.document.title = resTitle;
  };

  /**
   * @description 处理页面标题、侧边菜单、面包屑、tabsNav 展示的 title
   * @param route 当前路由
   * @returns 路由的 title
   */
  const getTitle = (route: RouteConfig | RouterConfig) => {
    const { routeUseI18n: useI18nSetting } = settings;
    const name = route.name as string | undefined;
    let title = "";
    // 如果路由没有 meta 或者 meta 没有 title，则以 name 为 title
    if (!route.meta.title) title = name || "no-name";
    else {
      route = handleRouteTitle(route);
      // 进入 else 代表 route.meta 必定存在
      title = route.meta?.title as string;
    }
    // name 如果有 $_noUseI18n_，代表不使用多语言 I18n
    const noUseI18n = name?.startsWith("_noUseI18n_");
    if (useI18nSetting && !noUseI18n) {
      if (title.includes("{{") && title.includes("}}") && useI18nSetting) {
        title = title.replace(/({{[\s\S]+?}})/, (m: any, str: string) =>
          str.replace(/{{([\s\S]*)}}/, (m: any, _: string) => t(_.trim()))
        );
      } else if (!route.meta?.__titleIsFunction__ && name) {
        title = t(`_route.${name}`);
        // 如果转换多语言后，还是 _route.${route.name}，代表没有配置多语言，然后把 _route. 去掉
        title = title === `_route.${name}` ? name : title;
      }
    } else if (!route.meta?.title && title.startsWith("_noUseI18n_")) title = title.slice("_noUseI18n_".length);
    return title;
  };

  /**
   * @description 处理路由的 title，因为 title 支持函数格式，所以这里解析出函数的返回值
   * @param route 当前路由
   * @returns
   */
  const handleRouteTitle = (route: RouteConfig | RouterConfig) => {
    const r = { ...route };
    const meta = r.meta;
    const routeTitle = meta?.title as string | undefined | ((route: RouteConfig) => string);
    let title = "";
    if (meta && routeTitle) {
      if (typeof routeTitle === "function") {
        (meta.__titleIsFunction__ as boolean) = true;
        title = routeTitle(r as RouteConfig);
      } else title = routeTitle;
      meta.title = title;
      r.meta = meta;
    }
    return r;
  };

  /**
   * @description 获取面包屑列表
   * @returns 面包屑列表
   */
  const getBreadcrumbs = (route: RouteConfig): RouteConfig[] => {
    // 首页不存在
    if (!homeRoute.path || !homeRoute.name) {
      ElMessage({
        message: "您的首页无法获取，请前往 router/routesConfig 下的 24 行，修改为您首页路由的 name 值",
        type: "error",
        duration: 10000,
      });
      return [];
    }
    let matched = route.matched;
    // 如果是首页，直接返回
    if (homeRoute && matched.some(item => item.name === homeRoute.name)) return [homeRoute] as RouteConfig[];
    // 首页加上其他页面
    matched = [homeRoute as any, ...matched];
    const routeMatched: RouteConfig[] = [];
    /**
     * 如果 route.meta.title 是 function，那么需要 route 的信息，所以将 matched 转成 route，一个面包屑就是一个 route
     * 因为 matched 专门存放匹配的路由 path、name、meta，所以这是匹配路由唯一的，而其他就是 route 唯一，两者并不重复且冲突
     * 因为需要 redirect，所以 Breadcrumbs 类型是 route + redirect
     */
    matched.forEach(item => {
      routeMatched.push({
        path: item.path,
        name: item.name,
        meta: item.meta as any,
        fullPath: item.meta._fullPath as string,
        redirect: item.redirect as string,
        matched,
        hash: route.hash,
        params: route.params,
        query: route.query,
        redirectedFrom: route.redirectedFrom,
      });
    });
    // 过滤掉 hideInBread 的配置
    return routeMatched.filter(
      item => (item.name || item.meta?.title) && item.meta && !item.meta.hideInBread
    ) as RouteConfig[];
  };

  /**
   * @description 通过路由表获取菜单列表
   * @param loadRolesRoutes 权限路由
   * @returns 菜单列表
   */
  const getMenuListByRouter = (loadRolesRoutes: RouterConfig[]) => {
    const menusList: RouterConfig[] = [];
    loadRolesRoutes.forEach(route => {
      // 如果配置了 hideInMenu: true，则跳过该路由
      if (route.meta?.hideInMenu) return;

      // 如果只有一个子路由且 alwaysShowRoot 为 false | undefined，则子路由成为一级菜单
      if (route.children?.length === 1 && !route.meta?.alwaysShowRoot) {
        menusList.push(getMenuListByRouter(route.children)[0]);
      } else {
        // 否则，生成子菜单列表
        const children = getMenuListByRouter(route.children || []);
        if (children.length) {
          route.children = children;
        }
        menusList.push(route);
      }
    });
    return menusList;
  };

  return {
    isMobile,
    resizeHandler,
    getBreadcrumbs,
    setTitle,
    getTitle,
    getMenuListByRouter,
  };
};
