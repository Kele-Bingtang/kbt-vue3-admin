<script setup lang="ts" name="HeaderLeft">
import CollapseTrigger from "./components/CollapseTrigger.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import { useSettingsStore, useLayoutStore } from "@/stores";
import { useNamespace } from "@/composables";
import { computed } from "vue";
import { DeviceEnum } from "@/enums/appEnum";

const ns = useNamespace("header-left");

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const showBreadcrumb = computed(() => settingsStore.showBreadcrumb);
</script>

<template>
  <div :class="ns.b()">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && layoutStore.device !== DeviceEnum.Mobile" />
  </div>
</template>

<style lang="scss" scoped>
@include b(header-left) {
  @include joins("breadcrumb__item:hover") {
    color: var(--#{$el-namespace}-color-primary);
  }

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;

  :deep(.#{$el-namespace}-breadcrumb__inner) {
    color: var(--header-text-color);

    &:hover {
      color: var(--#{$el-namespace}-color-primary);
    }
  }

  // 最后一个面包屑 item
  :deep(
    .#{$el-namespace}-breadcrumb__item .#{$el-namespace}-breadcrumb__inner .no-click,
    .#{$el-namespace}-breadcrumb__item .#{$el-namespace}-breadcrumb__inner .no-click:hover
  ) {
    color: #a8abb0;
  }
}
</style>
