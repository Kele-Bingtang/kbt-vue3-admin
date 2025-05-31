<template>
  <component :is="LayoutComponents[layoutMode]" />
  <ThemePanel />
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "@/stores";
import { LayoutModeEnum } from "@/enums/appEnum";
import ThemePanel from "@/layout/components/ThemePanel/index.vue";
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

const settingStore = useSettingStore();
const { layoutMode } = storeToRefs(settingStore);
</script>
