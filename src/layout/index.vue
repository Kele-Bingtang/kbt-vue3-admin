<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="Layout">
import { computed, type Component } from "vue";
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";
import LayoutTransverse from "./LayoutTransverse/index.vue";
import LayoutColumns from "./LayoutColumns/index.vue";
import LayoutPortal from "./LayoutPortal/index.vue";
import { useSettingsStore } from "@/stores/settings";
import { useLayout } from "@/hooks/useLayout";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";

const LayoutComponents: { [key: string]: Component } = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns,
  portal: LayoutPortal,
};

const settingsStore = useSettingsStore();
const layoutMode = computed(() => settingsStore.layoutMode);

const route = useRoute();
const { setTitle } = useLayout();

watch(
  () => route.fullPath,
  () => setTitle(route as RouteConfig), // 修改页面的 title
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
// 暗色模式布局恢复默认颜色，如果暗黑模式的某些样式被自定义样式覆盖，则在这里让它生效
.dark {
  .header-left {
    .el-breadcrumb__inner {
      color: var(--el-text-color-regular) !important;
    }
  }
  .el-header {
    color: var(--el-text-color-regular) !important;
  }
  .el-dropdown {
    color: var(--el-text-color-regular) !important;
  }
}
</style>
