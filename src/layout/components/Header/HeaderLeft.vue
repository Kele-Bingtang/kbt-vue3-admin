<template>
  <div class="header-left-container">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && layoutStore.device !== DeviceType.Mobile" />
  </div>
</template>

<script setup lang="ts" name="ToolBarLeft">
import CollapseTrigger from "./components/CollapseTrigger.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import { useSettingsStore } from "@/stores/settings";
import { useLayoutStore } from "@/stores/layout";
import { DeviceType } from "@/stores/index.d";

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const showBreadcrumb = computed(() => settingsStore.showBreadcrumb);
</script>

<style lang="scss" scoped>
.header-left-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>
