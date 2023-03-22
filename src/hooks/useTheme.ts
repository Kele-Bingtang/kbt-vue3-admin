import { getLightColor, getDarkColor } from "@/utils/layout/themeTool";
import settings from "@/config/settings";
import { ElMessage } from "element-plus";
import { useSettingsStore } from "@/stores/settings";

/**
 * @description 切换主题
 * */
export const useTheme = () => {
  const settingsStore = useSettingsStore();

  // 切换暗黑模式
  const switchDark = () => {
    const body = document.documentElement;
    if (settingsStore.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
    changePrimary(settingsStore.primaryTheme);
    return toRaw(settingsStore.isDark);
  };

  // 修改主题颜色
  const changePrimary = (value: string | null) => {
    if (!value) {
      value = settings.primaryTheme;
      ElMessage({ type: "success", message: `主题颜色已重置为 ${settingsStore.primaryTheme}` });
    }
    settingsStore.$patch({
      primaryTheme: value,
    });
    // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
    document.documentElement.style.setProperty("--el-color-primary", settingsStore.primaryTheme);
    document.documentElement.style.setProperty(
      "--el-color-primary-dark-2",
      settingsStore.isDark
        ? `${getLightColor(settingsStore.primaryTheme, 0.2)}`
        : `${getDarkColor(settingsStore.primaryTheme, 0.3)}`
    );
    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        settingsStore.isDark
          ? `${getDarkColor(settingsStore.primaryTheme, i / 10)}`
          : `${getLightColor(settingsStore.primaryTheme, i / 10)}`
      );
    }
  };

  // 灰色和弱色切换
  const changeGreyOrWeak = (value: boolean, type: string) => {
    const body = document.body as HTMLElement;
    if (!value) return body.setAttribute("style", "");
    if (type === "grey") body.setAttribute("style", "filter: grayscale(1) ");
    if (type === "weak") body.setAttribute("style", "filter: invert(80%)");
    const propName = type === "grey" ? "isWeak" : "isGrey";
    settingsStore.$patch({
      [propName]: false,
    });
  };

  // 初始化 primaryTheme 配置
  const initTheme = () => {
    switchDark();
    // changePrimary(settingsStore.primaryTheme);
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
