<template>
  <SvgIcon
    v-if="isSvgIcon(name, icon)"
    :name="name ? name : (icon as string).slice(4)"
    v-bind="attrsComputed as any"
  ></SvgIcon>
  <FontIcon
    v-else-if="isFontIcon(icon)"
    :icon="fontIcon.iconName"
    :iconType="fontIcon.iconType"
    v-bind="attrsComputed"
  ></FontIcon>
  <IconifyOffline v-else-if="isIconifyOffline(icon)" :icon="icon" v-bind="attrsComputed"></IconifyOffline>
  <IconifyOnline v-else-if="isIconifyOnline(icon)" :icon="icon" v-bind="attrsComputed"></IconifyOnline>
</template>

<script setup lang="ts" name="Icon">
import SvgIcon from "./components/vue/SvgIcon.vue";
import FontIcon from "./components/vue/FontIcon.vue";
import IconifyOffline from "./components/vue/IconifyOffline.vue";
import IconifyOnline from "./components/vue/IconifyOnline.vue";
import type { IconType } from "./iconType";
import type { IconifyIcon } from "@iconify/vue";

const ifReg = /^IF-/;
const svgReg = /^SVG-/;

type IconTypes = string | Object | IconifyIcon;

interface IconProps {
  icon?: IconTypes;
  name?: string;
  attrs?: IconType;
}

const props = defineProps<IconProps>();
const attrsProp = useAttrs();

const attrsComputed = computed(() => Object.assign({}, attrsProp, props.attrs));

const isSvgIcon = (name: string | undefined, icon: IconTypes | undefined): name is string =>
  !!name || (typeof icon === "string" && svgReg.test(icon));

const isFontIcon = (icon: IconTypes | undefined): icon is string =>
  !!icon && typeof icon === "string" && ifReg.test(icon);

const isIconifyOffline = (icon: IconTypes | undefined): icon is string | Object | IconifyIcon =>
  !!icon && (typeof icon === "object" || !icon?.includes(":"));

const isIconifyOnline = (icon: IconTypes | undefined): icon is string => !!icon && typeof icon === "string";

const fontIcon = computed(() => {
  if (props.icon && isFontIcon(props.icon)) {
    const name = (props.icon as string)?.split(ifReg)[1];
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
