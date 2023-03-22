import { DeviceType } from "@/stores/index.d";
import { useLayoutStore } from "@/stores/layout";
import { usePermissionStore } from "@/stores/permission";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import settings from "@/config/settings";
import { useSettingsStore } from "@/stores/settings";
import { useUserStore } from "@/stores/user";
import { transformI18n } from "@/languages";
import { isFunction, isString } from "@/utils/layout/validate";
import { useRoutes } from "./useRoutes";
export const useLayout = () => {
  const layoutStore = useLayoutStore();
  const settingsStore = useSettingsStore();
  const userStore = useUserStore();
  const { homeRoute, loadedRouteList } = usePermissionStore();
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
  const setBrowserTitle = (route: RouteConfig) => {
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
    else if (titleMode === "3") resTitle = pageTitle + "";
    window.document.title = resTitle;
  };
  /**
   * @description 获取页面标题、侧边菜单、面包屑、tabsNav 展示的 title
   * @param route 当前路由
   * @param start 是否从头开始解析出 title，因为路由在编译阶段已经解析了一部分，所以涉及路由里的配置不需要从头开始解析，具体看 ./useRoutes.ts 的 processRouteMeta 函数
   * @returns 路由的 title
   */
  const getTitle = (route: RouteConfig | RouterConfig, start = false) => {
    if (start) return getLayoutTitle(route as RouteConfig);
    // 虽然 handleFunctionTitle 函数内部会对 title 是否是函数进行判断，但是因为 title 是函数的场景相比较小，所以这里先判断，减少往下执行的性能消耗
    if (route.meta.title && !isFunction(route.meta.title)) return route.meta.title + "";
    const { title, titleIsFunction } = handleFunctionTitle(route as RouteConfig);
    if (titleIsFunction) return handleI18nTitle(route.name as string | undefined, title, true, route.meta?.useI18n);
    return title;
  };
  /**
   * @description 完整获取页面标题、侧边菜单、面包屑、tabsNav 展示的 title
   * @param route 当前路由
   * @returns 路由的 title
   */
  const getLayoutTitle = (route: RouteConfig) => {
    const name = route.name as string | undefined;
    if (!route.meta?.title && !route.meta?.useI18n) return name || "no-name";
    const { title, titleIsFunction } = handleFunctionTitle(route);
    const t = title || name || "no-name";
    return handleI18nTitle(name, t, titleIsFunction, route.meta?.useI18n);
  };
  /**
   * @description 获取 i18n 转换后的文字
   * @param name 路由的 name
   * @param title 需要展示的 title
   * @param titleIsFunction 路由 meta 里的 title 是否是函数
   * @returns i18n 转换后的文字
   */
  const handleI18nTitle = (name: string | undefined, title: string, titleIsFunction = false, useI18n = false) => {
    const { routeUseI18n: useI18nSetting } = settings;
    if (!useI18nSetting || !useI18n) return title;
    // 处理 {{ }}，如 title 为 "{{ _route.Home }}"，则说明 _route.Home 需要 i18n 转化
    if (isString(title) && title.includes("{{") && title.includes("}}") && useI18nSetting) {
      return title.replace(/({{[\s\S]+?}})/, (m: any, str: string) =>
        str.replace(/{{([\s\S]*)}}/, (m: any, _: string) => t(_.trim()))
      );
    }
    // 转换多语言后，如果还是 _route.${route.name}，代表没有配置多语言，则直接返回 name
    if (!titleIsFunction && name) return t(`_route.${name}`) === `_route.${name}` ? name : t(`_route.${name}`);
    return title;
  };
  /**
   * @description 处理路由的 title，因为 title 支持函数格式，所以这里解析出函数的返回值
   * @param route 当前路由
   * @returns
   */
  function handleFunctionTitle(route: RouteConfig) {
    const meta = { ...route.meta }; // 取消 meta 响应式
    const title = meta?.title || "";
    if (title && isFunction(title)) return { title: title({ ...route }), titleIsFunction: true };
    return { title: title + "", titleIsFunction: false };
  }
  /**
   * @description 获取面包屑列表
   * @returns 面包屑列表
   */
  const getBreadcrumbs = (route: RouteConfig): RouteConfig[] => {
    // 首页不存在
    if (!homeRoute?.path || !homeRoute?.name) {
      ElMessage({
        message: "您的首页无法获取，请前往 router/routesConfig.ts，找到 HOME_NAME，修改为您首页路由的 name 值",
        type: "error",
        duration: 10000,
      });
      return [];
    }
    // 如果是首页，直接返回
    if (route.path === homeRoute?.path || route.name === homeRoute?.name) return [homeRoute] as RouteConfig[];
    // 当前路由的父级路由组成的数组
    let matched = useRoutes().findParentRoutesByPath(route.meta._fullPath, loadedRouteList) as RouteConfig[];
    matched.push(toRaw(route));
    // 首页加上其他页面
    matched = [homeRoute as RouteConfig, ...matched];
    // 过滤掉 hideInBread 的配置
    return matched.filter(item => (item.name || item.meta?.title) && !item.meta?.hideInBread);
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
        if (children.length) route.children = children;
        menusList.push(route);
      }
    });
    return menusList;
  };
  return {
    isMobile,
    resizeHandler,
    getBreadcrumbs,
    setBrowserTitle,
    getTitle,
    getLayoutTitle,
    getMenuListByRouter,
  };
};
/**
 * 非 setup 使用
 */
export const useLayoutNoSetup = () => {
  /**
   * @description 获取页面标题、侧边菜单、面包屑、tabsNav 展示的 title，不处理为函数的 title
   * @param route 当前路由
   * @returns 路由的 title
   */
  const getLayoutTitle = (route: RouteConfig) => {
    // 不处理为函数的 title
    if (isFunction(route.meta.title)) return route.meta.title;
    const name = route.name as string | undefined;
    if (!route.meta?.title && !route.meta?.useI18n) return name || "no-name";
    const title = route.meta?.title || name || "no-name";
    return handleI18nTitle(name, title + "", route.meta?.useI18n);
  };
  /**
   * @description 获取 i18n 转换后的文字
   * @param name 路由的 name
   * @param title 需要展示的 title
   * @param titleIsFunction 路由 meta 里的 title 是否是函数
   * @returns i18n 转换后的文字
   */
  const handleI18nTitle = (name: string | undefined, title: string, useI18n = false) => {
    const { routeUseI18n: useI18nSetting } = settings;
    if (!useI18nSetting || !useI18n) return title;
    // 处理 {{ }}，如 title 为 "{{ _route.Home }}"，则说明 _route.Home 需要 i18n 转化
    if (isString(title) && title.includes("{{") && title.includes("}}") && useI18nSetting) {
      return title.replace(/({{[\s\S]+?}})/, (m: any, str: string) =>
        str.replace(/{{([\s\S]*)}}/, (m: any, _: string) => transformI18n(_.trim()))
      );
    }
    // 转换多语言后，如果还是 _route.${route.name}，代表没有配置多语言，则直接返回 name
    if (name) {
      return transformI18n(`_route.${name}`) === `_route.${name}` ? name : transformI18n(`_route.${name}`);
    }
    return title;
  };
  return {
    getLayoutTitle,
    handleI18nTitle,
  };
};
