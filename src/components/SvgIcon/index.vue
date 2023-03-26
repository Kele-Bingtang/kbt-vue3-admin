<template>
  <svg :class="iconClass" :style="style" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import type { CSSProperties } from "vue";

interface SvgProps {
  name: string; // 图标的名称，必传
  color?: string; // 填充的颜色，非必传
  prefix?: string; // 图标的前缀，非必传（默认为 icon）
  iconStyle?: CSSProperties; // 图标的样式， 非必传
  width?: string;
  height?: string;
}
// 接收父组件参数并设置默认值
const props = withDefaults(defineProps<SvgProps>(), {
  color: "",
  prefix: "icon",
  width: "",
  height: "",
  iconStyle: () => ({ width: "1em", height: "1em" }),
});

const iconName = computed(() => `#${props.prefix}-${props.name}`);
const iconClass = computed(() => {
  if (props.name) {
    return `svg-icon ${props.name}`;
  }
  return "svg-icon";
});
const style = computed(() => {
  const { width, height, iconStyle } = props;
  if (width) iconStyle.width = width;
  if (height) iconStyle.height = height;
  return iconStyle;
});
</script>

<style lang="scss" scoped>
.svg-icon {
  overflow: hidden;
  // width: 1em;
  // height: 1em;
  vertical-align: -0.15em;
  fill: currentcolor;

  &:focus {
    outline: none;
  }
}
</style>
