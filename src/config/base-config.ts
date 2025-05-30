import { LayoutModeEnum, MenuThemeEnum, PageTransitionEnum, TabNavModeEnum, TitleModeEnum } from "@/enums/appEnum";
import type { SystemInfo, LayoutConfig, SystemConfig, ThemeConfig, RouterConfig, KeyConfig } from "./types";

const systemInfo: SystemInfo = {
  name: "Teek Design Pro",
};

const themeConfig: ThemeConfig = {
  primaryColor: "#395AE3",
  titleMode: TitleModeEnum.ProjectPage,
  layoutMode: LayoutModeEnum.Vertical,
  tabNavMode: TabNavModeEnum.Simple,
  menuTheme: MenuThemeEnum.Light,
  pageTransition: PageTransitionEnum.SlideLeft,
  showSettings: true,
  showBreadcrumb: true,
  showTabNav: true,
  showLayoutLogo: true,
  showBreadcrumbIcon: true,
  showTabNavIcon: true,
  showTabNavDot: true,
  recordTabNav: false,
  isCollapse: false,
  menuAccordion: false,
  fixTabNav: true,
  isDark: false,
  isWeak: false,
  isGrey: false,
  maximize: false,
  menuWidth: 240,
  headerHeight: 55,
  radius: 0.75,
};

const layoutConfig: LayoutConfig = {
  errorLog: { showInHeader: true, env: [""] },
  moreRouteChildrenHideInMenuThenOnlyOne: false,
  tooltipEffect: "light",
  layoutSize: "default",
  language: "zh-CN",
  watchFrame: false,
  cacheKeyPrefix: "teek",
};

const routerConfig: RouterConfig = {
  whiteList: [""],
  routeUseI18n: true,
  isKeepAlive: false,
  isFull: false,
  cacheDynamicRoutes: false,
  routeUseTooltip: false,
};

const keyConfig: KeyConfig = {
  tabsNavCacheKey: `${layoutConfig.cacheKeyPrefix}:tabsNav`,
  cacheDynamicRoutesKey: `${layoutConfig.cacheKeyPrefix}:dynamic:routes`,
  versionCacheKey: `${layoutConfig.cacheKeyPrefix}:version`,
  tabActiveExcludes: ["layoutMode"],
};

export const createBaseConfig = (): SystemConfig => ({
  systemInfo,
  themeConfig,
  layoutConfig,
  routerConfig,
  keyConfig,
});
