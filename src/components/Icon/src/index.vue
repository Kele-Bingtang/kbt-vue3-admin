<template>
  <ElIcon v-if="isElIcon(icon)">
    <component v-if="isString(icon)" :is="icon.slice(3)"></component>
    <component v-else :is="iconRaw"></component>
  </ElIcon>
  <SvgIcon
    v-else-if="isSvgIcon(name, icon)"
    :name="name ? name : (icon as string).slice(4)"
    :color="color"
    v-bind="attrsComputed as any"
    :class="prefixClass"
  ></SvgIcon>
  <FontIcon
    v-else-if="isFontIcon(icon)"
    :icon="fontIcon.iconName"
    :iconType="fontIcon.iconType"
    v-bind="attrsComputed"
    :color="color"
    :class="prefixClass"
  ></FontIcon>
  <IconifyOffline
    v-else-if="isIconifyOffline(icon)"
    :icon="icon"
    v-bind="attrsComputed"
    :color="color"
    :class="prefixClass"
  ></IconifyOffline>
  <IconifyOnline v-else-if="isIconifyOnline(icon)" :icon="icon" v-bind="attrsComputed" :color="color"></IconifyOnline>
</template>

<script setup lang="ts">
import SvgIcon from "./components/vue/SvgIcon.vue";
import FontIcon from "./components/vue/FontIcon.vue";
import IconifyOffline from "./components/vue/IconifyOffline.vue";
import IconifyOnline from "./components/vue/IconifyOnline.vue";
import type { IconType } from "./iconType";
import type { IconifyIcon } from "@iconify/vue";
import { defineOptions, useAttrs, computed, type Component, toRaw } from "vue";
import { ElIcon } from "element-plus";
import { useDesign } from "@/hooks";

defineOptions({ name: "Icon" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("icon");

type IconTypes = string | Object | IconifyIcon | Component;

type Undefined<T> = T | undefined;

interface IconProps {
  icon?: IconTypes;
  name?: string;
  color?: string;
  hoverColor?: string;
  attrs?: IconType;
}

const props = defineProps<IconProps>();
const attrsProp = useAttrs();

const attrsComputed = computed(() => Object.assign({}, attrsProp, props.attrs));

const iconRaw = computed(() => toRaw(props.icon));

const isElIcon = (icon: Undefined<IconTypes>) => {
  if (isString(icon) && icon.toLowerCase().startsWith("el-")) return true;
  if ((icon as Component)?.name) return true;
  return false;
};

const isSvgIcon = (name: Undefined<string>, icon: Undefined<IconTypes>): name is string =>
  !!name || (isString(icon) && icon.toLowerCase().startsWith("svg-"));

const isFontIcon = (icon: Undefined<IconTypes>): icon is string =>
  !!icon && isString(icon) && icon.toLowerCase().startsWith("if-");

const isIconifyOffline = (icon: Undefined<IconTypes>): icon is string | Object | IconifyIcon =>
  !!icon && (!!(icon as IconifyIcon)?.body || !(icon as string)?.includes(":"));

const isIconifyOnline = (icon: Undefined<IconTypes>): icon is string => !!icon && isString(icon);

const fontIcon = computed(() => {
  if (props.icon && isFontIcon(props.icon)) {
    const name = (props.icon as string)?.toLowerCase().split("if-")[1];
    const iconName = name.slice(0, name.indexOf(" ") === -1 ? name.length : name.indexOf(" "));
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return {
      iconName,
      iconType,
    };
  }
  return {
    iconName: "",
    iconType: "",
  };
});

const isString = (icon: Undefined<IconTypes>): icon is string => {
  return typeof icon === "string";
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-icon;

.#{$prefix-class} {
  &:hover {
    color: v-bind(hoverColor) !important;
  }
}

.iconify {
  &:hover {
    color: v-bind(hoverColor) !important;
  }
}
</style>

<style lang="scss">
$prefix-class: #{$namespace}-icon;

.#{$prefix-class}.iconfont {
  &:hover {
    color: v-bind(hoverColor) !important;
  }
}
</style>
