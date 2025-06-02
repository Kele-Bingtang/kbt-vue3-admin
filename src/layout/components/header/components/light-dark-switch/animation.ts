import { useTheme } from "@/composables";
import { SystemThemeEnum } from "@/enums/appEnum";
import { useSettingStore } from "@/stores";
import { setCssVar } from "@/utils";

const { Dark, Light } = SystemThemeEnum;

/**
 * 主题切换动画
 */
export const switchThemeWithAnimation = (e: any) => {
  const x = e.clientX;
  const y = e.clientY;
  // 计算鼠标点击位置距离视窗的最大圆半径
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  // 设置 CSS 变量
  setCssVar("--x", x + "px");
  setCssVar("--y", y + "px");
  setCssVar("--r", endRadius + "px");

  if (document.startViewTransition) document.startViewTransition(() => toggleTheme());
  else toggleTheme();
};

/**
 * 切换主题
 */
const toggleTheme = () => {
  const { changeSystemTheme } = useTheme();
  const { isDark } = useSettingStore();

  changeSystemTheme(isDark ? Light : Dark);
};
