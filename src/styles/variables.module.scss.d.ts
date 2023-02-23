export interface ScssVariables {
  [x: string]: unknown;
  // 暗色主题
  menuTextDark: string; // // 所有菜单文字颜色
  menuBgDark: string; // 一级菜单背景色
  menuHoverBgDark: string; // 一级菜单悬停背景色
  menuActiveBgDark: string; // 一级菜单激活文字颜色
  subMenuBgDark: string; // 二级菜单背景色
  subMenuHoverBgDark: string; // 二级菜单悬停背景色
  subMenuActiveBgDark: string; // 二级菜单激活文字颜色
  iconDark: string; // 图标颜色
  logoLineDark: string; // logo 底部线条颜色
  logoTitleDark: string; // logo 右侧文字颜色
  splitMenuActiveBgDark: string;

  // 亮色主题
  menuBgLight: string;
  menuTextLight: string;
  menuHoverBgLight: string;
  menuActiveBgLight: string;
  subMenuBgLight: string;
  subMenuHoverBgLight: string;
  subMenuActiveBgLight: string;
  iconLight: string;
  logoLineLight: string;
  logoTitleLight: string;
  splitMenuActiveBgLight: string;
}

export const variables: ScssVariables;

export default variables;
