import { ref } from "vue";
import { defineStore } from "pinia";
import { removeCacheTabNavList } from "@/utils/cache";
import type { LayoutModeType, menuThemeType } from ".";
import defaultSettings from "@/config/settings";

const {
  theme: themeSetting,
  titleMode: titleModeSetting,
  layoutMode: layoutModeSetting,
  menuTheme: menuThemeSetting,
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
} = defaultSettings;

export const useSettingsStore = defineStore(
  "settingsStore",
  () => {
    const theme = ref(themeSetting);
    const titleMode = ref(titleModeSetting);
    const layoutMode = ref<LayoutModeType>(layoutModeSetting);
    const menuTheme = ref<menuThemeType>(menuThemeSetting);
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

    const closeSideMenu = () => {
      isCollapse.value = true;
    };

    const toggleSideMenu = () => {
      isCollapse.value = !isCollapse.value;
    };

    const resetSettings = () => {
      localStorage.removeItem("kbt_settingsStore");
      if (!recordTabsNav) {
        removeCacheTabNavList();
      }
    };

    return {
      theme,
      titleMode,
      layoutMode,
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

      closeSideMenu,
      toggleSideMenu,
      resetSettings,
    };
  },
  {
    persist: {
      key: "kbt_settingsStore",
      storage: localStorage,
    },
  }
);
