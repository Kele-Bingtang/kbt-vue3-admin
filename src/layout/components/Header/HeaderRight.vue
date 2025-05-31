<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useErrorLogStore } from "@/stores";
import { useNamespace } from "@/composables";
import SystemConfig, { mobileMaxWidthMedia } from "@/config";
import Fullscreen from "./components/Fullscreen.vue";
import LanguageSelect from "./components/LanguageSelect.vue";
import Message from "./components/Message.vue";
import User from "./components/User.vue";
import ErrorLog from "./components/ErrorLog.vue";
// import MenuSearch from "./components/MenuSearch.vue";
import GlobalSearch from "./components/global-search/index.vue";
import GlobalSearchInput from "./components/global-search/input.vue";

defineOptions({ name: "HeaderRight" });

const ns = useNamespace("header-right");
const errorLogStore = useErrorLogStore();

const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});

const isMobile = useMediaQuery(mobileMaxWidthMedia);
</script>

<template>
  <div :class="[ns.b(), 'flx-center']">
    <GlobalSearch />

    <div :class="[ns.e('btn'), 'flx-align-center']" :style="{ '--icon-size': ns.cssVar('layout-header-icon-size') }">
      <GlobalSearchInput id="menuSearch" />
      <!-- <MenuSearch id="menuSearch" /> -->
      <Fullscreen id="fullscreen" v-if="!isMobile" />
      <Message id="message" />
      <LanguageSelect id="languageSelect" />
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
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(header-right) {
  height: 100%;

  @include e(btn) {
    gap: 10px;
    height: 100%;

    > div:not(.customize) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 100%;
      cursor: pointer;
      transition:
        width var(--#{$el-namespace}-transition-duration),
        background-color var(--#{$el-namespace}-transition-duration);

      &:hover {
        background-color: cssVar(gray-200);
      }
    }

    .#{$admin-namespace}-user-dropdown {
      margin-left: 14px;
    }
  }
}
</style>
