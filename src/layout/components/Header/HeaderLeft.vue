<script setup lang="ts" name="HeaderLeft">
import { computed } from "vue";
import { useSettingsStore } from "@/stores";
import { useNamespace } from "@/composables";
import { useMediaQuery } from "@vueuse/core";
import { mobileMaxWidthMedia } from "@/config";
import Breadcrumb from "./components/Breadcrumb.vue";
import CollapseTrigger from "./components/CollapseTrigger.vue";

defineOptions({ name: "HeaderLeft" });

const ns = useNamespace("header-left");
const settingsStore = useSettingsStore();
const showBreadcrumb = computed(() => settingsStore.showBreadcrumb);

const isMobile = useMediaQuery(mobileMaxWidthMedia);
</script>

<template>
  <div :class="[ns.b(), 'flx-center']">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && !isMobile" />
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
