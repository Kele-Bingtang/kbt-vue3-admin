import type { LayoutModeType, LayoutThemeType, TabsNavModeType } from "@/stores";

interface Settings {
  title: string; // 项目 title
  titleMode: string; // 标题在浏览器标签上的多种模式。0：项目 title + 页面 title，1：用户名 + 页面 title，2：项目 title，3：页面 title
  layoutMode: LayoutModeType; // 布局设置，0：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧，1：Header 占顶部一行，SideMenu 占下方左侧，Main Content 占下方右侧
  tabsNavMode: TabsNavModeType; // 布局设置，0：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧，1：Header 占顶部一行，SideMenu 占下方左侧，Main Content 占下方右侧
  showSettings: boolean; // 是否显示设置
  showBreadcrumb: boolean; // 是否使用 Breadcrumb
  showTabsNav: boolean; // 是否使用 tagsNav
  showLayoutLogo: boolean; // 是否显示布局 Logo
  showBreadcrumbIcon: boolean; // 面包屑 Icon 是否显示
  showTabsNavIcon: boolean; // 标签栏 Icon 是否显示
  isCollapse: boolean; // 是否折叠菜单栏
  isDark: boolean; // 是否开启暗色主题
  isWeak: boolean; // 是否开启灰色主题
  isGrey: boolean; // 是否开启色弱主题
  routeUseI18n: boolean; // 「路由」布局是否使用国际化，默认为 false，如果不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'} 用来在菜单中显示文字
  recordTabsNav: boolean; // 是否记录打开过（没关闭）的 tags，下次打开会加载在 tagsNav
  menuTextTheme: boolean; // 如果是 true，则菜单的激活色跟随系统颜色
  primaryTheme: string; // 主题色
  layoutTheme: LayoutThemeType; // 侧边菜单栏的主题色，暗色和亮色，默认为暗色
  errorLog: {
    showInHeader: boolean; // 设为 false 后不会在顶部显示错误日志徽标
    env: string[]; // 日志收集的环境，默认是 production 生成环境
  };
  /**
   * 白名单额三种模式：["*"]、["next"]、[to.path, ...]
   * * 代表加载所有路由；next 代表直接放行，但不加载权限路由；to.path 表示指定的路由可以放行，可以填多个
   * 优先级：* > next > to.path
   */
  whiteList: string[];
  /**
   * 这是路由和菜单呼应可能产生的问题而需要配置：alwaysShowRoot 为 false 情况（确保您了解路由的配置规则，如果不了解，前往 router/router-config 查看）
   * true：存在多个二级路由，但是只有一个二级路由 hideInMenu 为 false，举例：有 5 个二级路由，但是有 4 个二级路由 hideInMenu: true，则需要开启 true，确保菜单只渲染剩下的路由
   *
   * 为 true 的场景较少见，如果真的遇到，则开启为 true，否则不建议开启，虽然 true 能无需后顾之忧，但是会多重复一次过滤递归，即消耗点性能
   *
   * 如果看不懂这个配置没关系，当您配置路由时遇到为 true 的场景时，自然懂得
   */
  moreRouteChildrenHideInMenuThenOnlyOne: boolean;
  settingCacheKey: string; // 缓存配置的 key
  layoutCacheKey: string; // 缓存布局的 key
  tabsNavCacheKey: string; // 缓存标签页的 key
  tabActiveExcludes: string[]; // 当 URL 携带 ? 的参数时，会打开新的标签页，造成多个重复的只是 ? 参数不一样的标签页，该选项指定当出现的参数，不会打开新的标签页，而是继续在当前标签页打开
}

const settings: Settings = {
  title: "kbt-vue3-admin",
  titleMode: "0",
  layoutMode: "vertical",
  tabsNavMode: "classic",
  showSettings: true,
  showBreadcrumb: true,
  showTabsNav: true,
  showLayoutLogo: true,
  showBreadcrumbIcon: true,
  showTabsNavIcon: false,
  isCollapse: false,
  isDark: false,
  isWeak: false,
  isGrey: false,
  routeUseI18n: true,
  recordTabsNav: true,
  menuTextTheme: true,
  primaryTheme: "#168BF7", // 蓝色偏暗：#168BF7，官方：#409EFF
  layoutTheme: "light",
  errorLog: {
    showInHeader: true,
    env: ["production"],
  },
  whiteList: [""],
  moreRouteChildrenHideInMenuThenOnlyOne: false,
  settingCacheKey: "kbt_settingsStore",
  layoutCacheKey: "kbt_layoutStore",
  tabsNavCacheKey: "kbt_tabsNav",
  tabActiveExcludes: ["layoutMode"],
};

export default settings;
