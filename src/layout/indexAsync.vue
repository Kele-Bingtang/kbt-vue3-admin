<template>
  <suspense>
    <template #default>
      <component :is="LayoutComponents[layoutMode]" />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </suspense>
  <ThemeDrawer />
</template>

<script setup lang="ts" name="Layout">
import { useSettingsStore } from "@/stores/settings";
import { useLayout } from "@/hooks/useLayout";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";
import Loading from "./components/Loading/index.vue";

const LayoutComponents: { [key: string]: Component } = {
  vertical: defineAsyncComponent(() => import("./LayoutVertical/index.vue")),
  classic: defineAsyncComponent(() => import("./LayoutClassic/index.vue")),
  transverse: defineAsyncComponent(() => import("./LayoutTransverse/index.vue")),
  columns: defineAsyncComponent(() => import("./LayoutColumns/index.vue")),
  mixins: defineAsyncComponent(() => import("./LayoutMixins/index.vue")),
  subsystem: defineAsyncComponent(() => import("./LayoutSubsystem/index.vue")),
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
