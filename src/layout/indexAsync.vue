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
import { useSettingsStore } from "@/stores";
import { useLayout } from "@/hooks";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";
import Loading from "./components/Loading/index.vue";
import { getPx, setStyleVar } from "@/utils";
import { type Component, defineAsyncComponent, computed, watch, watchEffect } from "vue";

const LayoutComponents: Record<string, Component> = {
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

watchEffect(() => setStyleVar("--aside-width", getPx(settingsStore.menuWidth)));

watchEffect(() => setStyleVar("--header-height", getPx(settingsStore.headerHeight)));
</script>
