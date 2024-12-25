import type { CSSProperties } from "vue";

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
