<template>
  <i v-if="conditionIcon('uni')" class="iconfont" v-bind="attrs">{{ icon }}</i>
  <svg v-if="conditionIcon('svg')" class="icon-svg" aria-hidden="true" v-bind="attrs">
    <use :xlink:href="'#' + icon"></use>
  </svg>
  <i v-else class="iconfont" :class="icon" v-bind="attrs"></i>
</template>

<script setup lang="ts" name="FontIcon">
interface FontIconProps {
  icon: string;
}

defineProps<FontIconProps>();

const attrs = useAttrs();

const conditionIcon = (iconType: string) => {
  return Object.keys(attrs).includes(iconType) || attrs?.iconType === iconType;
};
</script>
