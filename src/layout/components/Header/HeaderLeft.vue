<script setup lang="ts" name="HeaderLeft">
import { computed } from "vue";
import { useSettingsStore, useLayoutStore } from "@/stores";
import { useNamespace } from "@/composables";
import { DeviceEnum } from "@/enums/appEnum";
import Breadcrumb from "./components/Breadcrumb.vue";
import CollapseTrigger from "./components/CollapseTrigger.vue";

const ns = useNamespace("header-left");

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const showBreadcrumb = computed(() => settingsStore.showBreadcrumb);
</script>

<template>
  <div :class="[ns.b(), 'flx-center']">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && layoutStore.device !== DeviceEnum.Mobile" />
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

@include b(header-left) {
  height: 100%;
  padding-right: 15px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
