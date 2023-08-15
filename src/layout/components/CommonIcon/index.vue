<template>
  <el-icon v-if="isElIcon">
    <component v-if="isString(icon)" :is="icon.slice(3)"></component>
    <component v-else :is="iconRaw"></component>
  </el-icon>
  <Icon v-else-if="isSVG" :name="(icon as string).slice(4)" :class="icon" />
  <Icon
    v-else
    :icon="icon"
    :class="icon"
    style="width: var(--el-menu-icon-width) !important; margin-right: 5px; color: var(--menu-icon-color)"
  />
</template>

<script setup lang="ts" name="CommonIcon">
import { isString } from "@/utils/layout/validate";
import type { IconifyIcon } from "@iconify/vue";
import type { Component } from "vue";

type CommonIconProps = string | Object | IconifyIcon | Component;

const props = defineProps<{ icon: CommonIconProps }>();

const iconRaw = computed(() => toRaw(props.icon));

const isElIcon = computed(() => {
  const icon = props.icon;
  if (isString(icon) && icon.toLowerCase().startsWith("el-")) return true;
  if (isComponent(icon)) return true;
  return false;
});

const isSVG = computed(() => {
  if (isString(props.icon) && props.icon.toLowerCase().startsWith("svg-")) return true;
  return false;
});

/**
 * 判断是否为 Component
 */
const isComponent = (icon: CommonIconProps): icon is Component => {
  return !(isIconifyIcon(icon) || isSVG.value);
};

/**
 * 判断是否为 IconifyIcon
 */
const isIconifyIcon = (icon: CommonIconProps): icon is IconifyIcon => {
  return !!(icon as IconifyIcon).body;
};
</script>

<style lang="scss" scoped></style>
