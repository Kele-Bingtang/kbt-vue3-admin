<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemeDrawer />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { computed, watchEffect } from "vue";
import { useSettingsStore, useUserStore, useWebSocketStore } from "@/stores";
import { useBrowserTitle } from "@/composables";
import { useNamespace } from "@/composables";
import { addUnit, setStyleVar } from "@/utils";
import { WebSocketKey } from "@/config/symbols";
import { LayoutModeEnum } from "@/enums/appEnum";
import ThemeDrawer from "@/layout/components/ThemeDrawer/index.vue";
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";
import LayoutTransverse from "./LayoutTransverse/index.vue";
import LayoutColumns from "./LayoutColumns/index.vue";
import LayoutMixins from "./LayoutMixins/index.vue";
import LayoutSubsystem from "./LayoutSubsystem/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

const LayoutComponents: Record<string, Component> = {
  [LayoutModeEnum.Vertical]: LayoutVertical,
  [LayoutModeEnum.Classic]: LayoutClassic,
  [LayoutModeEnum.Transverse]: LayoutTransverse,
  [LayoutModeEnum.Columns]: LayoutColumns,
  [LayoutModeEnum.Mixins]: LayoutMixins,
  [LayoutModeEnum.Subsystem]: LayoutSubsystem,
};

const ns = useNamespace("layout");
const settingsStore = useSettingsStore();
const layoutMode = computed(() => settingsStore.layoutMode);

useBrowserTitle();

watchEffect(() => setStyleVar(ns.cssVarName("layout-open-aside-width"), addUnit(settingsStore.menuWidth)));
watchEffect(() => setStyleVar(ns.cssVarName("layout-close-aside-width"), "64px"));

watchEffect(() => setStyleVar(ns.cssVarName("layout-header-height"), addUnit(settingsStore.headerHeight)));

// 初始化 WebSocket
if (import.meta.env.VITE_WEBSOCKET === "true") {
  const useWebSocket = useWebSocketStore();
  const url = import.meta.env.VITE_WEBSOCKET_URL || "";

  // url 后面的 ?token= 为认证信息，需要后端配合获取 token 来认证（这是普通的 GET 请求，WebSocket 无法放入请求头或者发起 POST 请求）
  url && useWebSocket.connect(url + "?token=" + useUserStore().accessToken);

  provide(WebSocketKey, useWebSocket);
}
</script>
