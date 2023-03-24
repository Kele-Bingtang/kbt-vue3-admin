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
import { useSettingsStore } from "@/stores/settings";
import { useLayout } from "@/hooks/useLayout";

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
</script>

<style lang="scss"></style>
