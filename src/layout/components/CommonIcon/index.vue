<template>
  <el-icon v-if="isElIcon" :class="icon">
    <component :is="icon"></component>
  </el-icon>
  <svg-icon v-else :name="icon.slice(4)" :class="icon" />
</template>

<script setup lang="ts" name="CommonIcon">
const props = defineProps<{ icon: string }>();

const isElIcon = computed(() => {
  if (props.icon.startsWith("svg-")) return false;
  return true;
});
</script>

<style lang="scss" scoped></style>

<!-- 内置两个图标系统：Element Plu Icon 和 SVG。根据传来的 icon 判断是哪种图标，SVG 的图标必选手动加上前缀 svg-，否则默认以 Element Plu Icon 为渲染的 icon -->
