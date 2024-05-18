<template>
  <div :class="prefixClass">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && layoutStore.device !== DeviceType.Mobile" />
  </div>
</template>

<script setup lang="ts" name="HeaderLeft">
import CollapseTrigger from "./components/CollapseTrigger.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import { useSettingsStore, useLayoutStore, DeviceType } from "@/stores";
import { useDesign } from "@/hooks";
import { computed } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("header-left");

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const showBreadcrumb = computed(() => settingsStore.showBreadcrumb);
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-header-left;

.#{$prefix-class} {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}
</style>
