import { useSettingStore } from "@/stores";
import { addUnit, removeStyleVar, setCssVar } from "@/utils";
import { HeaderStyleEnum } from "@/enums/appEnum";
import { useNamespace } from "./useNamespace";

export const useWatchCssVar = () => {
  const ns = useNamespace();
  const settingStore = useSettingStore();

  const { menuWidth, headerHeight, headerStyle, radius } = storeToRefs(settingStore);

  // 展开菜单宽度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-open-aside-width"), addUnit(menuWidth.value)));
  //  折叠菜单宽度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-close-aside-width"), "64px"));
  // 顶部高度变量
  watchEffect(() => setCssVar(ns.cssVarName("layout-header-height"), addUnit(headerHeight.value)));
  // 圆角变量
  watchEffect(() => setCssVar(ns.cssVarName("radius"), addUnit(radius.value, "rem")));
  // 顶部和标签栏的背景色、线条变量
  watchEffect(() => {
    const headerBg = ns.cssVarName("layout-header-bg-color");
    const tabBg = ns.cssVarName("layout-tab-bg-color");
    const bgStyle = `var(--${ns.namespace}-main-bg-color)`;

    const headerLine = ns.cssVarName("layout-header-line");
    const tabLine = ns.cssVarName("layout-tab-line");
    const borderStyle = `1px solid var(--${ns.namespace}-card-border)`;

    if (headerStyle.value === HeaderStyleEnum.Page) return removeStyleVar([headerBg, tabBg, headerLine, tabLine]);

    if (headerStyle.value === HeaderStyleEnum.Bg) {
      removeStyleVar([headerLine, tabLine]);

      setCssVar(headerBg, bgStyle);
      setCssVar(tabBg, bgStyle);
    }

    if (headerStyle.value === HeaderStyleEnum.Line) {
      removeStyleVar([headerBg, tabBg]);

      setCssVar(headerLine, borderStyle);
      setCssVar(tabLine, borderStyle);
    }

    if (headerStyle.value === HeaderStyleEnum.BgLine) {
      setCssVar(headerBg, bgStyle);
      setCssVar(tabBg, bgStyle);
      setCssVar(headerLine, borderStyle);
      setCssVar(tabLine, borderStyle);
    }
  });
};
