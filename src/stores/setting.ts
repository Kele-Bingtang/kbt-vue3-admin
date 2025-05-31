import { ref } from "vue";
import { defineStore } from "pinia";
import { useStorage, useCache } from "@/composables";
import { HeaderStyleEnum, LayoutModeEnum, MenuThemeEnum, PageTransitionEnum, TabNavModeEnum } from "@/enums/appEnum";
import SystemConfig from "@/config";

export const useSettingStore = defineStore(
  "settingStore",
  () => {
    const { themeConfig, layoutConfig } = SystemConfig;

    const primaryColor = ref(themeConfig.primaryColor);
    const titleMode = ref(themeConfig.titleMode);
    const layoutMode = ref(themeConfig.layoutMode || LayoutModeEnum.Classic);
    const tabNavMode = ref(themeConfig.tabNavMode || TabNavModeEnum.Simple);
    const menuTheme = ref(themeConfig.menuTheme || MenuThemeEnum.Light);
    const pageTransition = ref(themeConfig.pageTransition || PageTransitionEnum.SlideLeft);
    const headerStyle = ref(themeConfig.headerStyle || HeaderStyleEnum.Page);
    const showSetting = ref(themeConfig.showSetting);
    const showTabNav = ref(themeConfig.showTabNav);
    const recordTabNav = ref(themeConfig.recordTabNav);
    const showLayoutLogo = ref(themeConfig.showLayoutLogo);
    const showBreadcrumb = ref(themeConfig.showBreadcrumb);
    const showBreadcrumbIcon = ref(themeConfig.showBreadcrumbIcon);
    const showTabNavIcon = ref(themeConfig.showTabNavIcon);
    const showTabNavDot = ref(themeConfig.showTabNavDot);
    const isCollapse = ref(themeConfig.isCollapse);
    const menuAccordion = ref(themeConfig.menuAccordion);
    const fixTabNav = ref(themeConfig.fixTabNav);
    const isDark = ref(themeConfig.isDark);
    const isWeak = ref(themeConfig.isWeak);
    const isGrey = ref(themeConfig.isGrey);
    const headerTheme = ref(themeConfig.menuTheme || MenuThemeEnum.Light);
    const maximize = ref(themeConfig.maximize);
    const menuWidth = ref(themeConfig.menuWidth);
    const headerHeight = ref(themeConfig.headerHeight);
    const radius = ref(themeConfig.radius);

    const closeSideMenu = () => {
      isCollapse.value = true;
    };

    const toggleSideMenu = () => {
      isCollapse.value = !isCollapse.value;
    };

    const resetSetting = () => {
      const { removeStorage } = useStorage();
      removeStorage(`${layoutConfig.cacheKeyPrefix}:settingStore`);
      if (!recordTabNav.value) useCache().removeCacheTabNavList();
    };

    return {
      primaryColor,
      titleMode,
      layoutMode,
      tabNavMode,
      menuTheme,
      headerStyle,
      pageTransition,
      showSetting,
      showTabNav,
      recordTabNav,
      showLayoutLogo,
      showBreadcrumb,
      showBreadcrumbIcon,
      showTabNavIcon,
      showTabNavDot,
      isCollapse,
      menuAccordion,
      fixTabNav,
      isDark,
      isWeak,
      isGrey,
      headerTheme,
      maximize,
      menuWidth,
      headerHeight,
      radius,

      closeSideMenu,
      toggleSideMenu,
      resetSetting,
    };
  },
  {
    persist: true,
  }
);
