<template>
  <i v-if="conditionIcon('uni')" class="iconfont" v-bind="attrs" :style="{ color }">{{ icon }}</i>
  <svg v-if="conditionIcon('svg')" class="icon-svg" aria-hidden="true" v-bind="attrs" :style="{ color }">
    <use :xlink:href="'#' + icon"></use>
  </svg>
  <i v-else class="iconfont" :class="icon" v-bind="attrs" :style="{ color }"></i>
</template>

<script setup lang="ts">
import { defineOptions, useAttrs } from "vue";

defineOptions({ name: "FontIcon" });

interface FontIconProps {
  icon: string;
  color?: string;
}

defineProps<FontIconProps>();

const attrs = useAttrs();

const conditionIcon = (iconType: string) => {
  return Object.keys(attrs).includes(iconType) || attrs?.iconType === iconType;
};
</script>
