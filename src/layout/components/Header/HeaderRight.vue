<template>
  <div :class="prefixClass">
    <div :class="`${prefixClass}__icon`">
      <MenuSearch id="menuSearch" />
      <Fullscreen id="fullscreen" v-if="!isMobile" />
      <LayoutSizeSelect id="layoutSizeSelect" />
      <LanguageSelect id="languageSelect" />
      <Message id="message" />
      <ErrorLog
        id="errorLog"
        :errorCount="errorCount"
        v-if="SystemConfig.layoutConfig.errorLog.showInHeader && errorCount > 0 && !isMobile"
      />
      <User id="user" />
    </div>
  </div>
</template>

<script setup lang="ts" name="HeaderRight">
import Fullscreen from "./components/Fullscreen.vue";
import LanguageSelect from "./components/LanguageSelect.vue";
import LayoutSizeSelect from "./components/LayoutSizeSelect.vue";
import MenuSearch from "./components/MenuSearch.vue";
import Message from "./components/Message.vue";
import User from "./components/User.vue";
import ErrorLog from "./components/ErrorLog.vue";
import SystemConfig from "@/config";
import { useErrorLogStore, useLayoutStore } from "@/stores";
import { useDesign } from "@/hooks";
import { computed } from "vue";
import { DeviceEnum } from "@/enums/appEnum";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("header-right");

const layoutStore = useLayoutStore();
const errorLogStore = useErrorLogStore();

const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});

const isMobile = computed(() => layoutStore.device === DeviceEnum.Mobile);
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-header-right;

.#{$prefix-class} {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px 0 0;

  &__icon {
    display: flex;
    align-items: center;
    color: var(--header-text-color);

    .#{$el-namespace}-dropdown {
      color: var(--header-text-color);
    }

    & > * {
      margin-left: 21px;
    }

    :deep(.svg-icon:hover use) {
      fill: var(--#{$el-namespace}-color-primary) !important;
    }
  }
}
</style>
