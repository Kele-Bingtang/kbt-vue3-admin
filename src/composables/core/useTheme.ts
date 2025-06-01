import { ElMessage } from "element-plus";
import { getLightColor, getDarkColor, setCssVar } from "@/utils";
import { useSettingStore } from "@/stores";
import { useNamespace } from "@/composables";
import SystemConfig from "@/config";
import { SystemThemeEnum } from "@/enums/appEnum";

/**
 * @description 切换主题
 * */
export const useTheme = () => {
  const settingStore = useSettingStore();
  const ns = useNamespace();

  const { Light, Dark } = SystemThemeEnum;

  const { isDark } = storeToRefs(settingStore);

  const systemThemeStyle = {
    [Light]: { className: "" },
    [Dark]: { className: SystemThemeEnum.Dark },
  };

  /**
   * 禁用过渡效果
   */
  const disableTransitions = () => {
    const style = document.createElement("style");
    style.setAttribute("id", "disable-transitions");
    style.textContent = "* { transition: none !important; }";
    document.head.appendChild(style);
  };

  /**
   * 启用过渡效果
   */
  const enableTransitions = () => {
    const style = document.getElementById("disable-transitions");
    if (style) style.remove();
  };

  /**
   * 修改系统主题
   */
  const switchSystemTheme = (theme: SystemThemeEnum) => {
    // 临时禁用过渡效果
    disableTransitions();

    settingStore.$patch({ systemThemeMode: theme });

    const currentTheme = systemThemeStyle[isDark.value ? Dark : Light];
    if (currentTheme) document.documentElement.setAttribute("class", currentTheme.className);

    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setCssVar(
        `--${ns.elNamespace}-color-primary-light-${i}`,
        isDark.value
          ? `${getDarkColor(settingStore.primaryColor, i / 10)}`
          : `${getLightColor(settingStore.primaryColor, i / 10)}`
      );
    }

    // 使用 requestAnimationFrame 确保在下一帧恢复过渡效果
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enableTransitions();
      });
    });
  };

  /**
   * 修改主题颜色
   */
  const changePrimary = (value: string | null) => {
    if (!value) {
      value = SystemConfig.themeConfig.primaryColor;
      ElMessage.success(`主题颜色已重置为 ${settingStore.primaryColor}`);
    }
    settingStore.$patch({ primaryColor: value });

    // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅的具体颜色
    setCssVar(`--${ns.elNamespace}-color-primary`, settingStore.primaryColor);
    setCssVar(
      `--${ns.elNamespace}-color-primary-dark-2`,
      settingStore.isDark
        ? `${getLightColor(settingStore.primaryColor, 0.2)}`
        : `${getDarkColor(settingStore.primaryColor, 0.3)}`
    );

    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      setCssVar(
        `--${ns.elNamespace}-color-primary-light-${i}`,
        settingStore.isDark
          ? `${getDarkColor(settingStore.primaryColor, i / 10)}`
          : `${getLightColor(settingStore.primaryColor, i / 10)}`
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
    settingStore.$patch({ [propName]: false });
  };

  // 初始化 primaryColor 配置
  const initTheme = () => {
    switchSystemTheme(settingStore.systemThemeMode);
    if (settingStore.isGrey) changeGreyOrWeak(true, "grey");
    if (settingStore.isWeak) changeGreyOrWeak(true, "weak");

    // 修改 EP 默认色调
    // setCssVar(`--${ns.elNamespace}-color-success`, "#0bb449");
    // setCssVar(`--${ns.elNamespace}-color-warning`, "#fa9014");
    // setCssVar(`--${ns.elNamespace}-color-danger`, "#ef4a38");
    // setCssVar(`--${ns.elNamespace}-color-error`, "#ef4a38");
    // setCssVar(`--${ns.elNamespace}-color-info`, "#909399");
  };

  return {
    initTheme,
    switchSystemTheme,
    changePrimary,
    changeGreyOrWeak,
  };
};
