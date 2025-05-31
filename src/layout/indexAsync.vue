<template>
  <suspense>
    <template #default>
      <component :is="LayoutComponents[layoutMode]" />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </suspense>
  <ThemePanel />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores";
import { LayoutModeEnum } from "@/enums/appEnum";
import ThemePanel from "@/layout/components/ThemePanel/index.vue";
import Loading from "./components/Loading/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

const LayoutComponents: Record<string, Component> = {
  [LayoutModeEnum.Vertical]: defineAsyncComponent(() => import("./LayoutVertical/index.vue")),
  [LayoutModeEnum.Classic]: defineAsyncComponent(() => import("./LayoutClassic/index.vue")),
  [LayoutModeEnum.Transverse]: defineAsyncComponent(() => import("./LayoutTransverse/index.vue")),
  [LayoutModeEnum.Columns]: defineAsyncComponent(() => import("./LayoutColumns/index.vue")),
  [LayoutModeEnum.Mixins]: defineAsyncComponent(() => import("./LayoutMixins/index.vue")),
  [LayoutModeEnum.Subsystem]: defineAsyncComponent(() => import("./LayoutSubsystem/index.vue")),
};

const settingStore = useSettingStore();
const { layoutMode } = storeToRefs(settingStore);
</script>
