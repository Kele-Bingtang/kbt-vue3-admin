<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="Layout">
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";
import LayoutTransverse from "./LayoutTransverse/index.vue";
import LayoutColumns from "./LayoutColumns/index.vue";
import LayoutMixins from "./LayoutMixins/index.vue";
import LayoutSubsystem from "./LayoutSubsystem/index.vue";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";
import { useSettingsStore } from "@/stores";
import { useLayout } from "@/hooks";
import { getPx, setStyleVar } from "@/utils";

const LayoutComponents: { [key: string]: Component } = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns,
  mixins: LayoutMixins,
  subsystem: LayoutSubsystem,
};

const settingsStore = useSettingsStore();
const layoutMode = computed(() => settingsStore.layoutMode);

const route = useRoute();
const { setBrowserTitle } = useLayout();

watch(
  () => route.fullPath,
  () => setBrowserTitle(route), // 修改页面的 title
  {
    immediate: true,
  }
);

watchEffect(() => setStyleVar("--aside-width", getPx(settingsStore.menuWidth)));

watchEffect(() => setStyleVar("--el-menu-horizontal-height", getPx(settingsStore.headerHeight)));
</script>

<style lang="scss">
// 暗色模式布局恢复默认颜色，如果暗黑模式的某些样式被自定义样式覆盖，则在这里让它生效
.dark {
  .header-left {
    .#{$el-namespace}-breadcrumb__inner {
      color: var(--el-text-color-regular) !important;
    }
  }

  .#{$el-namespace}-header {
    color: var(--el-text-color-regular) !important;
  }

  .#{$el-namespace}-dropdown {
    color: var(--el-text-color-regular) !important;
  }
}
</style>
