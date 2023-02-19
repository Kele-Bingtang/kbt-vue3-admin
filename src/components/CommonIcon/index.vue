<template>
  <el-icon v-if="isElIcon" :class="icon">
    <component :is="icon"></component>
  </el-icon>
  <svg-icon v-else :name="icon.slice(4)" :class="icon" />
</template>

<script setup lang="ts" name="CommonIcon">
const { icon } = defineProps<{ icon: string }>();

const isElIcon = computed(() => {
  if (icon.startsWith("svg-")) return false;
  return true;
});
</script>

<style lang="scss" scoped></style>
