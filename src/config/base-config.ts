import { LayoutModeEnum, MenuThemeEnum, TabsNavModeEnum } from "@/enums/appEnum";
import type { LayoutConfig, SystemConfig, ThemeConfig, RouterConfig, KeyConfig } from "./types";

const themeConfig: ThemeConfig = {
  primaryTheme: "#395AE3",
  title: "teek-vue-admin",
  titleMode: "0",
  layoutMode: LayoutModeEnum.Vertical,
  tabsNavMode: TabsNavModeEnum.Simple,
  showBreadcrumb: true,
  showTabsNav: true,
  showLayoutLogo: true,
  showBreadcrumbIcon: true,
  showTabsNavIcon: true,
  recordTabsNav: false,
  isCollapse: false,
  menuAccordion: false,
  fixTabsNav: true,
  isDark: false,
  isWeak: false,
  isGrey: false,
  maximize: false,
  menuTheme: MenuThemeEnum.Light,
  menuWidth: 210,
  headerHeight: 55,
};

const layoutConfig: LayoutConfig = {
  showSettings: true,
  errorLog: {
    showInHeader: true,
    env: [""],
  },
  moreRouteChildrenHideInMenuThenOnlyOne: false,
  tooltipEffect: "light",
  layoutSize: "default",
  language: "zh-CN",
  watchFrame: false,
  cacheKeyPrefix: "kbt",
};

const routerConfig: RouterConfig = {
  routeUseI18n: true,
  whiteList: [""],
  isKeepAlive: false,
  isFull: false,
  cacheDynamicRoutes: false,
  routeUseTooltip: false,
};

const keyConfig: KeyConfig = {
  tabsNavCacheKey: `${layoutConfig.cacheKeyPrefix}_tabsNav`,
  cacheDynamicRoutesKey: `${layoutConfig.cacheKeyPrefix}_dynamic_routes`,
  versionCacheKey: `${layoutConfig.cacheKeyPrefix}_version`,
  tabActiveExcludes: ["layoutMode"],
};

export const createBaseConfig = (): SystemConfig => ({
  themeConfig,
  layoutConfig,
  routerConfig,
  keyConfig,
  // 菜单主题列表
  menuThemeList: [
    {
      theme: MenuThemeEnum.Light,
      background: "#ffffff",
      systemNameColor: "#68758E",
      iconColor: "#6B6B6B",
      textColor: "#29343D",
      textActiveColor: "#3F8CFF",
      iconActiveColor: "#333333",
      tabBarBackground: "#FFFFFF",
      systemBackground: "#F8F8F8",
      leftLineColor: "#EDEEF0",
      rightLineColor: "#EDEEF0",
    },
    {
      theme: MenuThemeEnum.Dark,
      background: "#191A23",
      systemNameColor: "#BABBBD",
      iconColor: "#BABBBD",
      textColor: "#BABBBD",
      textActiveColor: "#FFFFFF",
      iconActiveColor: "#FFFFFF",
      tabBarBackground: "#FFFFFF",
      systemBackground: "#F8F8F8",
      leftLineColor: "#3F4257",
      rightLineColor: "#EDEEF0",
    },
    {
      theme: MenuThemeEnum.Design,
      background: "#FFFFFF",
      systemNameColor: "var(--art-text-gray-800)",
      iconColor: "#6B6B6B",
      textColor: "#29343D",
      textActiveColor: "#3F8CFF",
      iconActiveColor: "#333333",
      tabBarBackground: "#FAFBFC",
      systemBackground: "#FAFBFC",
      leftLineColor: "#EDEEF0",
      rightLineColor: "#EDEEF0",
    },
  ],
});
