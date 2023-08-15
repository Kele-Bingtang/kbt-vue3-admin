<template>
  <SvgIcon
    v-if="isSvgIcon"
    :name="name ? name : (icon as string).slice(4)"
    v-bind="(Object.assign({}, $attrs, attrs) as any)"
  ></SvgIcon>
  <FontIcon
    v-else-if="isFontIcon"
    :icon="fontIcon.iconName"
    :iconType="fontIcon.iconType"
    v-bind="Object.assign({}, $attrs, attrs)"
  ></FontIcon>
  <IconifyOffline
    v-else-if="isIconifyOffline"
    :icon="icon"
    v-bind="(Object.assign({}, $attrs, attrs) as any)"
  ></IconifyOffline>
  <IconifyOnline
    v-else-if="isIconifyOnline"
    :icon="(icon as string)"
    v-bind="(Object.assign({}, $attrs, attrs) as any)"
  ></IconifyOnline>
</template>

<script setup lang="ts" name="Icon">
import SvgIcon from "./components/vue/SvgIcon.vue";
import FontIcon from "./components/vue/FontIcon.vue";
import IconifyOffline from "./components/vue/IconifyOffline.vue";
import IconifyOnline from "./components/vue/IconifyOnline.vue";
import type { IconType } from "./iconType";

const ifReg = /^IF-/;
const svgReg = /^SVG-/;

interface IconProps {
  icon?: any;
  name?: string;
  attrs?: IconType;
}

const props = defineProps<IconProps>();

const isSvgIcon = computed(() => {
  return props.name || (typeof props.icon === "string" && svgReg.test(props.icon));
});

const isFontIcon = computed(() => {
  return props.icon && typeof props.icon === "string" && ifReg.test(props.icon);
});

const isIconifyOffline = computed(() => {
  return props.icon && (typeof props.icon === "object" || !props.icon?.includes(":"));
});

const isIconifyOnline = computed(() => {
  return props.icon && typeof props.icon === "string";
});

const fontIcon = computed(() => {
  if (isFontIcon) {
    const name = props.icon.split(ifReg)[1];
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
</script>
