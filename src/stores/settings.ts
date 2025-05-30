import { ref } from "vue";
import { defineStore } from "pinia";
import { useStorage, useCache } from "@/composables";
import { LayoutModeEnum, MenuThemeEnum, TabNavModeEnum } from "@/enums/appEnum";
import SystemConfig from "@/config";

export const useSettingsStore = defineStore(
  "settingsStore",
  () => {
    const { themeConfig, layoutConfig } = SystemConfig;

    const primaryColor = ref(themeConfig.primaryColor);
    const titleMode = ref(themeConfig.titleMode);
    const layoutMode = ref(themeConfig.layoutMode || LayoutModeEnum.Classic);
    const tabNavMode = ref(themeConfig.tabNavMode || TabNavModeEnum.Simple);
    const menuTheme = ref(themeConfig.menuTheme || MenuThemeEnum.Light);
    const showSettings = ref(themeConfig.showSettings);
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

    const closeSideMenu = () => {
      isCollapse.value = true;
    };

    const toggleSideMenu = () => {
      isCollapse.value = !isCollapse.value;
    };

    const resetSettings = () => {
      const { removeStorage } = useStorage();
      removeStorage(`${layoutConfig.cacheKeyPrefix}:settingsStore`);
      if (!recordTabNav.value) useCache().removeCacheTabNavList();
    };

    return {
      primaryColor,
      titleMode,
      layoutMode,
      tabNavMode,
      menuTheme,
      showSettings,
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

      closeSideMenu,
      toggleSideMenu,
      resetSettings,
    };
  },
  {
    persist: true,
  }
);
