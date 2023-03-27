import { defineStore } from "pinia";
import { removeCacheTabNavList } from "@/utils/layout/cache";
import type { LayoutModeType, LayoutThemeType, TabsNavModeType } from ".";
import defaultSettings from "@/config/settings";

const {
  primaryTheme: primaryThemeSetting,
  titleMode: titleModeSetting,
  layoutMode: layoutModeSetting,
  tabsNavMode: tabsNavModeSetting,
  layoutTheme: layoutThemeSetting,
  showSettings: showSettingsSetting,
  showTabsNav: showTagsNavSetting,
  recordTabsNav: recordTagsNavSetting,
  showLayoutLogo: showLayoutLogoSetting,
  showBreadcrumb: showBreadcrumbSetting,
  showBreadcrumbIcon: showBreadcrumbIconSetting,
  showTabsNavIcon: tabsNavSetting,
  isCollapse: isCollapseSetting,
  isDark: isDarkSetting,
  isWeak: isWeakSetting,
  isGrey: isGreySetting,
  maximize: maximizeSetting,
} = defaultSettings;

export const useSettingsStore = defineStore(
  "settingsStore",
  () => {
    const primaryTheme = ref(primaryThemeSetting);
    const titleMode = ref(titleModeSetting);
    const layoutMode = ref<LayoutModeType>(layoutModeSetting);
    const tabsNavMode = ref<TabsNavModeType>(tabsNavModeSetting);
    const menuTheme = ref<LayoutThemeType>(layoutThemeSetting);
    const showSettings = ref(showSettingsSetting);
    const showTabsNav = ref(showTagsNavSetting);
    const recordTabsNav = ref(recordTagsNavSetting);
    const showLayoutLogo = ref(showLayoutLogoSetting);
    const showBreadcrumb = ref(showBreadcrumbSetting);
    const showBreadcrumbIcon = ref(showBreadcrumbIconSetting);
    const showTabsNavIcon = ref(tabsNavSetting);
    const isCollapse = ref(isCollapseSetting);
    const isDark = ref(isDarkSetting);
    const isWeak = ref(isWeakSetting);
    const isGrey = ref(isGreySetting);
    const headerTheme = ref<LayoutThemeType>(layoutThemeSetting);
    const maximize = ref(maximizeSetting);

    const closeSideMenu = () => {
      isCollapse.value = true;
    };

    const toggleSideMenu = () => {
      isCollapse.value = !isCollapse.value;
    };

    const resetSettings = () => {
      localStorage.removeItem(defaultSettings.settingCacheKey);
      if (!recordTabsNav.value) {
        removeCacheTabNavList();
      }
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
      isDark,
      isWeak,
      isGrey,
      headerTheme,
      maximize,

      closeSideMenu,
      toggleSideMenu,
      resetSettings,
    };
  },
  {
    persist: {
      key: defaultSettings.settingCacheKey,
      storage: localStorage,
    },
  }
);
