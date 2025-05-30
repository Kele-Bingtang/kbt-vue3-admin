import { toRaw } from "vue";
import { ElMessage } from "element-plus";
import { getLightColor, getDarkColor, setStyleVar } from "@/utils";
import { useSettingsStore } from "@/stores";
import { useNamespace } from "@/composables";
import SystemConfig from "@/config";

/**
 * @description 切换主题
 * */
export const useTheme = () => {
  const settingsStore = useSettingsStore();
  const ns = useNamespace();

  // 切换暗黑模式
  const switchDark = () => {
    const body = document.documentElement;
    if (settingsStore.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
    changePrimary(settingsStore.primaryColor);
    return toRaw(settingsStore.isDark);
  };

  // 修改主题颜色
  const changePrimary = (value: string | null) => {
    if (!value) {
      value = SystemConfig.themeConfig.primaryColor;
      ElMessage({ type: "success", message: `主题颜色已重置为 ${settingsStore.primaryColor}` });
    }
    settingsStore.$patch({
      primaryColor: value,
    });
    // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
    setStyleVar(`--${ns.elNamespace}-color-primary`, settingsStore.primaryColor);
    setStyleVar(
      `--${ns.elNamespace}-color-primary-dark-2`,
      settingsStore.isDark
        ? `${getLightColor(settingsStore.primaryColor, 0.2)}`
        : `${getDarkColor(settingsStore.primaryColor, 0.3)}`
    );
    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setStyleVar(
        `--${ns.elNamespace}-color-primary-light-${i}`,
        settingsStore.isDark
          ? `${getDarkColor(settingsStore.primaryColor, i / 10)}`
          : `${getLightColor(settingsStore.primaryColor, i / 10)}`
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

  // 初始化 primaryColor 配置
  const initTheme = () => {
    switchDark();
    // changePrimary(settingsStore.primaryColor);
    if (settingsStore.isGrey) changeGreyOrWeak(true, "grey");
    if (settingsStore.isWeak) changeGreyOrWeak(true, "weak");

    // 修改 EP 默认色调
    setStyleVar(`--${ns.elNamespace}-color-success`, "#0bb449");
    setStyleVar(`--${ns.elNamespace}-color-warning`, "#fa9014");
    setStyleVar(`--${ns.elNamespace}-color-danger`, "#ef4a38");
    setStyleVar(`--${ns.elNamespace}-color-error`, "#ef4a38");
    setStyleVar(`--${ns.elNamespace}-color-info`, "#909399");
  };

  return {
    initTheme,
    switchDark,
    changePrimary,
    changeGreyOrWeak,
  };
};
