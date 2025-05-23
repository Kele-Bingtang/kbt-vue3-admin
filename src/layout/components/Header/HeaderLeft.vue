<template>
  <div :class="prefixClass">
    <CollapseTrigger />
    <Breadcrumb v-if="showBreadcrumb && layoutStore.device !== DeviceEnum.Mobile" />
  </div>
</template>

<script setup lang="ts" name="HeaderLeft">
import CollapseTrigger from "./components/CollapseTrigger.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import { useSettingsStore, useLayoutStore } from "@/stores";
import { useDesign } from "@/hooks";
import { computed } from "vue";
import { DeviceEnum } from "@/enums/appEnum";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("header-left");

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const showBreadcrumb = computed(() => settingsStore.showBreadcrumb);
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-header-left;

.#{$prefix-class} {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;

  & > * {
    &:hover {
      color: var(--#{$el-namespace}-color-primary);
    }

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
}
</style>
