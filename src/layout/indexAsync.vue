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

<script setup lang="ts">
import type { Component } from "vue";
import { defineAsyncComponent, computed, watchEffect } from "vue";
import { useSettingsStore } from "@/stores";
import { useBrowserTitle } from "@/composables";
import { addUnit, setStyleVar } from "@/utils";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";
import Loading from "./components/Loading/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

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

useBrowserTitle();

watchEffect(() => setStyleVar("--aside-width", addUnit(settingsStore.menuWidth)));

watchEffect(() => setStyleVar("--header-height", addUnit(settingsStore.headerHeight)));
</script>
