<script setup lang="ts" name="HeaderRight">
import { computed } from "vue";
import SystemConfig from "@/config";
import { useErrorLogStore, useLayoutStore } from "@/stores";
import { useNamespace } from "@/composables";
import { DeviceEnum } from "@/enums/appEnum";
import Fullscreen from "./components/Fullscreen.vue";
import LanguageSelect from "./components/LanguageSelect.vue";
import LayoutSizeSelect from "./components/LayoutSizeSelect.vue";
import MenuSearch from "./components/MenuSearch.vue";
import Message from "./components/Message.vue";
import User from "./components/User.vue";
import ErrorLog from "./components/ErrorLog.vue";

const ns = useNamespace("header-right");

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

<template>
  <div :class="[ns.b(), 'flx-center']">
    <div :class="[ns.e('btn'), 'flx-align-center']" :style="{ '--icon-size': ns.cssVar('layout-header-icon-size') }">
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

<style lang="scss" scoped>
@include b(header-right) {
  height: 100%;

  @include e(btn) {
    gap: 10px;
    height: 100%;

    > div:not(.#{$admin-namespace}-user-dropdown) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 100%;
      cursor: pointer;
      transition: width 0.3s;

      &:hover {
        background-color: getCssVar(gray-200);
      }
    }

    .#{$admin-namespace}-user-dropdown {
      margin-left: 14px;
    }
  }
}
</style>
