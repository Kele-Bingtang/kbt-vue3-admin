import { defineStore } from "pinia";
import SystemConfig from "@/config";
import { ref } from "vue";
import { useStorage, useCache } from "@/hooks";
import { LayoutModeEnum, MenuThemeEnum, TabsNavModeEnum } from "@/enums/appEnum";

export const useSettingsStore = defineStore(
  "settingsStore",
  () => {
    const { themeConfig, layoutConfig } = SystemConfig;

    const primaryTheme = ref(themeConfig.primaryTheme);
    const titleMode = ref(themeConfig.titleMode);
    const layoutMode = ref<LayoutModeEnum>(themeConfig.layoutMode || LayoutModeEnum.Classic);
    const tabsNavMode = ref<TabsNavModeEnum>(themeConfig.tabsNavMode || TabsNavModeEnum.Popular);
    const menuTheme = ref<MenuThemeEnum>(themeConfig.menuTheme || MenuThemeEnum.Light);
    const showSettings = ref(layoutConfig.showSettings);
    const showTabsNav = ref(themeConfig.showTabsNav);
    const recordTabsNav = ref(themeConfig.recordTabsNav);
    const showLayoutLogo = ref(themeConfig.showLayoutLogo);
    const showBreadcrumb = ref(themeConfig.showBreadcrumb);
    const showBreadcrumbIcon = ref(themeConfig.showBreadcrumbIcon);
    const showTabsNavIcon = ref(themeConfig.showTabsNavIcon);
    const isCollapse = ref(themeConfig.isCollapse);
    const menuAccordion = ref(themeConfig.menuAccordion);
    const fixTabsNav = ref(themeConfig.fixTabsNav);
    const isDark = ref(themeConfig.isDark);
    const isWeak = ref(themeConfig.isWeak);
    const isGrey = ref(themeConfig.isGrey);
    const headerTheme = ref<MenuThemeEnum>(themeConfig.menuTheme || MenuThemeEnum.Light);
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
      const { removeStorage } = useStorage("localStorage");
      removeStorage(`${layoutConfig.cacheKeyPrefix}_settingsStore`);
      if (!recordTabsNav.value) useCache().removeCacheTabNavList();
    };

    return {
      primaryTheme,
      titleMode,
      layoutMode,
      tabsNavMode,
      menuTheme,
      showSettings,
      showTabsNav,
      recordTabsNav,
      showLayoutLogo,
      showBreadcrumb,
      showBreadcrumbIcon,
      showTabsNavIcon,
      isCollapse,
      menuAccordion,
      fixTabsNav,
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
