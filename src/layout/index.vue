<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemePanel />
  <Watermark />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores";
import { useUpgrade } from "@/composables";
import { LayoutModeEnum } from "@/enums/appEnum";
import ThemePanel from "./components/ThemePanel/index.vue";
import Watermark from "./components/watermark/index.vue";
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutClassic from "./LayoutClassic/index.vue";
import LayoutHorizontal from "./LayoutHorizontal/index.vue";
import LayoutColumns from "./LayoutColumns/index.vue";
import LayoutMixins from "./LayoutMixins/index.vue";
import LayoutIFrame from "./LayoutIFrame/index.vue";

import "./base-layout.scss";

defineOptions({ name: "Layout" });

const LayoutComponents: Record<string, Component> = {
  [LayoutModeEnum.Vertical]: LayoutVertical,
  [LayoutModeEnum.Classic]: LayoutClassic,
  [LayoutModeEnum.Horizontal]: LayoutHorizontal,
  [LayoutModeEnum.Columns]: LayoutColumns,
  [LayoutModeEnum.Mixins]: LayoutMixins,
  [LayoutModeEnum.IFrame]: LayoutIFrame,
};

const settingStore = useSettingStore();
const { layoutMode } = storeToRefs(settingStore);

// 系统版本升级
useUpgrade();
</script>
