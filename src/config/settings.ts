import {
  LayoutModeType,
  LayoutThemeType,
  TabsNavModeType,
  type LanguageType,
  type LayoutSizeType,
} from "@/stores/interface";

interface Settings {
  title: string; // 项目 title
  titleMode: string; // 标题在浏览器标签上的多种模式。0：项目 title + 页面 title，1：用户名 + 页面 title，2：项目 title，3：页面 title
  layoutMode: LayoutModeType; // 布局设置：vertical、classic、transverse、columns、subsystem、mixins
  tabsNavMode: TabsNavModeType; // 标签页设置：classic、popular
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
  menuWidth: number; // 菜单宽度
  headerHeight: number; // 顶部高度
  maximize: boolean; // MainContent 是否开启最大化，默认不开启（false）
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
  layoutSize: LayoutSizeType;
  language: LanguageType;
  settingCacheKey: string; // 缓存配置的 key
  layoutCacheKey: string; // 缓存布局的 key
  tabsNavCacheKey: string; // 缓存标签页的 key
  versionCacheKey: string; // 缓存版本号的 key
  tabActiveExcludes: string[]; // 当 URL 携带 ? 的参数时，标签页的 path 也会携带参数，当 recordTabsNav 为 true 时，会造成多个重复的只是 ? 参数不一样的标签页，该选项指定当出现指定参数不会加载到 path，即该标签的 path 只保留 ? 前面的链接。当存在多个条件，满足任意一个即可
  isKeepAlive: boolean; // 路由是否开启缓存
  isFull: boolean; // 是否全屏，不渲染 Layout 布局，只渲染当前路由组件
  cacheDynamicRoutes: boolean; // 是否缓存路由，默认不开启（false）
  cacheDynamicRoutesKey: string; // 缓存路由的 key
  tooltipEffect: "light" | "dark"; // 布局的 el-toolTip 风格
  routeUseTooltip: boolean; // 菜单的文字超出后，是否使用 el-toolTip 提示，仅针二级路由及以上生效
  watchFrame: boolean; // 是否监听 IFrame 传来的通信，用于 Portal 门户系统，来监听门户所有 IFrame 嵌入系统的通信，比如 A 系统想打开 B 系统，则告诉 Portal 门户帮忙打开
}

const themeSettings: Partial<Settings> = {
  title: "kbt-vue3-admin",
  titleMode: "0",
  layoutMode: LayoutModeType.Vertical,
  tabsNavMode: TabsNavModeType.Classic,
  showBreadcrumb: true,
  showTabsNav: true,
  showLayoutLogo: true,
  showBreadcrumbIcon: true,
  showTabsNavIcon: false,
  recordTabsNav: false,
  isCollapse: false,
  isDark: false,
  isWeak: false,
  isGrey: false,
  maximize: false,
  primaryTheme: "#168BF7", // 蓝色偏暗：#168BF7，官方：#409EFF
  layoutTheme: LayoutThemeType.Light,
  menuWidth: 210,
  headerHeight: 55,
};

const layoutSettings: Partial<Settings> = {
  showSettings: true,
  errorLog: {
    showInHeader: true,
    env: ["production"],
  },
  moreRouteChildrenHideInMenuThenOnlyOne: false,
  tooltipEffect: "light",
  layoutSize: "default",
  language: "zh-CN",
  watchFrame: false,
};

const routerSettings: Partial<Settings> = {
  routeUseI18n: true,
  whiteList: [""],
  isKeepAlive: false,
  isFull: false,
  cacheDynamicRoutes: false,
  routeUseTooltip: false,
};

const keySetting: Partial<Settings> = {
  settingCacheKey: "kbt_settingsStore",
  layoutCacheKey: "kbt_layoutStore",
  tabsNavCacheKey: "kbt_tabsNav",
  cacheDynamicRoutesKey: "kbt_dynamic_routes",
  versionCacheKey: "kbt_version",
  tabActiveExcludes: ["layoutMode"],
};

const settings: Settings = {
  ...(themeSettings as Settings),
  ...(layoutSettings as Settings),
  ...(routerSettings as Settings),
  ...(keySetting as Settings),
};

export default settings;
