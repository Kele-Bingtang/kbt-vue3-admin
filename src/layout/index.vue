<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="Layout">
import { computed, type Component } from "vue";
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";
import { useSettingsStore } from "@/stores/settings";
import { useLayout } from "@/hooks/useLayout";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";

const LayoutComponents: { [key: string]: Component } = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
};

const settingsStore = useSettingsStore();
const layoutMode = computed(() => settingsStore.layoutMode);

const route = useRoute();
const { setTitle } = useLayout();
onMounted(() => {
  // 修改页面的 title
  setTitle(route as RouteConfig);
});
</script>

<style lang="scss" scoped></style>
