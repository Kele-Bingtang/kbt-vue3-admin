import type { Component, CSSProperties } from "vue";
import type { IconifyIcon } from "@iconify/vue";

export interface IconProps {
  /**
   * 图标
   */
  icon?: string | Object | Component | IconifyIcon;
  /**
   * 图标类型
   */
  iconType?: "svg" | "unicode" | "iconfont" | "symbol" | "img" | "component" | "iconifyOffline" | "iconifyOnline";
  /**
   * 图标大小
   *
   * @default 'inherit'
   */
  size?: string | number;
  /**
   * 图标颜色
   *
   * @default 'inherit'
   */
  color?: string;
  /**
   * 图标是否可悬停
   *
   * @default false
   */
  hover?: boolean;
  /**
   * 图标悬停时的颜色，仅当 hover 为 true 时有效
   */
  hoverColor?: string;
  /**
   * img 标签的 alt，当 iconType 为 img 时生效
   */
  imgAlt?: string;
  /**
   * 是否使用鼠标手形
   */
  pointer?: boolean;
  /**
   * 自定义图标样式
   */
  style?: Record<string, any>;
}

export interface IconType {
  inline?: boolean;
  width?: string | number;
  height?: string | number;
  horizontalFlip?: boolean;
  verticalFlip?: boolean;
  flip?: string;
  rotate?: number | string;
  color?: string;
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  align?: string;
  onLoad?: () => void;
  includes?: () => void;
  name?: string;
  prefix?: string;

  //  all icon
  style?: CSSProperties;
}
