import { getLightColor, getDarkColor } from "@/utils/themeTool";
import settings from "@/config/settings";
import { ElMessage } from "element-plus";
import { useSettingsStore } from "@/stores/settings";
import variables from "@/styles/variables.module.scss";

/**
 * @description 切换主题
 * */
export const useTheme = () => {
  const settingsStore = useSettingsStore();

  watchEffect(() => {
    if (settingsStore.menuTheme === "dark") {
      document.documentElement.style.setProperty("--vertical-menu-bg-color", variables.menuBgDark);
      document.documentElement.style.setProperty("--vertical-menu-text-color", variables.menuTextDark);
      document.documentElement.style.setProperty("--vertical-menu-hover-bg-color", variables.menuHoverBgDark);
      document.documentElement.style.setProperty("--vertical-menu-active-bg-color", variables.menuActiveBgDark);
      document.documentElement.style.setProperty("--vertical-sub-menu-bg-color", variables.subMenuBgDark);
      document.documentElement.style.setProperty("--vertical-sub-menu-hover-bg-color", variables.subMenuHoverBgDark);
      document.documentElement.style.setProperty("--vertical-sub-menu-active-bg-color", variables.subMenuActiveBgDark);
      document.documentElement.style.setProperty("--vertical-icon-color", variables.iconDark);
      document.documentElement.style.setProperty("--vertical-logo-line-color", variables.logoLineDark);
      document.documentElement.style.setProperty("--vertical-logo-title-color", variables.logoTitleDark);
    } else if (settingsStore.menuTheme === "light") {
      document.documentElement.style.setProperty("--vertical-menu-bg-color", variables.menuBgLight);
      document.documentElement.style.setProperty("--vertical-menu-text-color", variables.menuTextLight);
      document.documentElement.style.setProperty("--vertical-menu-hover-bg-color", variables.menuHoverBgLight);
      document.documentElement.style.setProperty("--vertical-menu-active-bg-color", variables.menuActiveBgLight);
      document.documentElement.style.setProperty("--vertical-sub-menu-bg-color", variables.subMenuBgLight);
      document.documentElement.style.setProperty("--vertical-sub-menu-hover-bg-color", variables.subMenuHoverBgLight);
      document.documentElement.style.setProperty("--vertical-sub-menu-active-bg-color", variables.subMenuActiveBgLight);
      document.documentElement.style.setProperty("--vertical-icon-color", variables.iconLight);
      document.documentElement.style.setProperty("--vertical-logo-line-color", variables.logoLineLight);
      document.documentElement.style.setProperty("--vertical-logo-title-color", variables.logoTitleLight);
    }
  });

  // 切换暗黑模式
  const switchDark = () => {
    const body = document.documentElement as HTMLElement;
    if (settingsStore.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
    changePrimary(settingsStore.theme);
  };

  // 修改主题颜色
  const changePrimary = (val: string | null) => {
    if (!val) {
      val = settings.theme;
      ElMessage({ type: "success", message: `主题颜色已重置为 ${settingsStore.theme}` });
    }
    settingsStore.$patch({
      theme: val,
    });
    // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
    document.documentElement.style.setProperty("--el-color-primary", settingsStore.theme);
    document.documentElement.style.setProperty(
      "--el-color-primary-dark-2",
      settingsStore.isDark ? `${getLightColor(settingsStore.theme, 0.2)}` : `${getDarkColor(settingsStore.theme, 0.3)}`
    );
    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        settingsStore.isDark
          ? `${getDarkColor(settingsStore.theme, i / 10)}`
          : `${getLightColor(settingsStore.theme, i / 10)}`
      );
    }
  };

  // 灰色和弱色切换
  const changeGreyOrWeak = (value: boolean, type: string) => {
    const body = document.body as HTMLElement;
    if (!value) return body.setAttribute("style", "");
    if (type === "grey") body.setAttribute("style", "filter: grayscale(1) ");
    if (type === "weak") body.setAttribute("style", "filter: invert(80%)");
    let propName = type == "grey" ? "isWeak" : "isGrey";
    settingsStore.$patch({
      [propName]: false,
    });
  };

  // 初始化 theme 配置
  const initTheme = () => {
    switchDark();
    // changePrimary(settingsStore.theme);
    if (settingsStore.isGrey) changeGreyOrWeak(true, "grey");
    if (settingsStore.isWeak) changeGreyOrWeak(true, "weak");
  };

  return {
    initTheme,
    switchDark,
    changePrimary,
    changeGreyOrWeak,
  };
};
