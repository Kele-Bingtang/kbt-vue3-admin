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
   * 是否为移动端
   * @returns boolean：true 是，false 不是
   */
  const isMobile = () => {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < 767; // 这里以 ipad Mini 的宽度为移动端的阈值
  };
  /**
   * 计算页面尺寸
   */
  const resizeHandler = () => {
    if (!document.hidden) {
      const result = isMobile();
      layoutStore.toggleDevice(result ? DeviceType.Mobile : DeviceType.Desktop);
      if (result) settingsStore.closeSideMenu();
    }
  };

  /**
   * 根据当前跳转的路由设置显示在浏览器标签的 title
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
   * 处理页面标题、侧边菜单、面包屑、tagsNav 展示的 title
   * @param route 当前路由
   * @returns 路由的 title
   */
  const getTitle = (route: RouteConfig | RouterConfig) => {
    const { routeUseI18n: useI18nSetting } = settings;
    const name = route.name as string | undefined;
    let title = "";
    let __titleIsFunction__ = false;
    // 如果路由没有 meta 或者 meta 没有 title，则以 name 为 title
    if (!route.meta.title) title = name || "no-name";
    else {
      route = handleRouteTitle(route);
      // 进入 else 代表 route.meta 必定存在
      title = route.meta?.title as string;
      __titleIsFunction__ = (route.meta?.__titleIsFunction__ as boolean) || false;
    }
    // name 如果有 $_noUseI18n_，代表不使用多语言 I18n
    const noUseI18n = name?.startsWith("_noUseI18n_");
    if (useI18nSetting && !noUseI18n) {
      if (title.includes("{{") && title.includes("}}") && useI18nSetting) {
        title = title.replace(/({{[\s\S]+?}})/, (m: any, str: string) =>
          str.replace(/{{([\s\S]*)}}/, (m: any, _: string) => t(_.trim()))
        );
      } else if (!__titleIsFunction__ && name) {
        title = t(`_route.${name}`);
        // 如果转换多语言后，还是 _route.${route.name}，代表没有配置多语言，然后把 _route. 去掉
        title = title === `_route.${name}` ? name : title;
      }
    } else if (!route.meta?.title && title.startsWith("_noUseI18n_")) title = title.slice("_noUseI18n_".length);
    return title;
  };

  /**
   * 处理路由的 title，因为 title 支持函数格式，所以这里解析出函数的返回值
   * @param route 当前路由
   * @returns
   */
  const handleRouteTitle = (route: RouteConfig | RouterConfig) => {
    const r = { ...route };
    const meta = r.meta;
    const routeTitle = meta?.title as string | undefined | ((route: RouteConfig | RouterConfig) => string);
    let title = "";
    if (meta && routeTitle) {
      if (typeof routeTitle === "function") {
        (meta.__titleIsFunction__ as boolean) = true;
        title = routeTitle(r);
      } else title = routeTitle;
      meta.title = title;
      r.meta = meta;
    }
    return r;
  };

  /**
   * 获取面包屑列表
   * @returns 面包屑列表
   */
  const getBreadcrumbs = (route: RouteConfig) => {
    // 首页不存在
    if (!homeRoute.path || !homeRoute.name) {
      ElMessage({
        message: "您的首页无法获取，请前往 store/permission.ts 下的 23 行，修改为您首页路由的 name 值",
        type: "error",
        duration: 10000,
      });
      return [] as unknown as RouteConfig[];
    }
    const matched = route.matched;
    // 如果是首页，直接返回
    if (homeRoute && matched.some(item => item.name === homeRoute.name)) return [homeRoute] as unknown as RouteConfig[];
    // 首页加上其他页面
    const routeMatched = [homeRoute, ...matched];
    // 过滤掉 hideInBread 的配置
    return routeMatched.filter(
      item => (item.name || item.meta?.title) && item.meta && !item.meta.hideInBread
    ) as unknown as RouteConfig[];
  };

  /**
   * 通过路由表获取菜单列表
   * @param loadRolesRoutes 权限路由
   * @returns 菜单列表
   */
  const getMenuListByRouter = (loadRolesRoutes: RouterConfig[]): RouterConfig[] => {
    const menusList: RouterConfig[] = [];
    loadRolesRoutes.forEach(route => {
      let r = { ...route };
      // 如果配置了 hideInMenu: true，则隐藏菜单，如果配置了 alwaysShowRoot: false | undefined 且子路由只有一个，则子路由成为一级菜单
      if (!r.meta || !r.meta.hideInMenu) {
        // 如果存在 children
        if (r.children && r.children.length !== 0) {
          // 如果 children 长度为 1 且 alwaysShowRoot 为 false | undefined，则子路由成为一级菜单
          if (r.children.length === 1) {
            if (!r.meta || !r.meta.alwaysShowRoot) r = getMenuListByRouter(r.children)[0];
            else r.children = getMenuListByRouter(r.children);
          } else r.children = getMenuListByRouter(r.children);
        }
        if (r) menusList.push(r);
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
