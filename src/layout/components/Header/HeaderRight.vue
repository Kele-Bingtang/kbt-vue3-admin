<template>
  <div class="header-right-container">
    <div class="header-icon">
      <MenuSearch id="menuSearch" />
      <Fullscreen id="fullscreen" v-if="!isMobile" />
      <LayoutSizeSelect id="layoutSizeSelect" />
      <LanguageSelect id="languageSelect" />
      <Message id="message" />
      <ErrorLog
        id="errorLog"
        :errorCount="errorCount"
        v-if="settings.errorLog.showInHeader && errorCount > 0 && !isMobile"
      />
      <User id="user" />
    </div>
  </div>
</template>

<script setup lang="ts" name="ToolBarRight">
import Fullscreen from "./components/Fullscreen.vue";
import LanguageSelect from "./components/LanguageSelect.vue";
import LayoutSizeSelect from "./components/LayoutSizeSelect.vue";
import MenuSearch from "./components/MenuSearch.vue";
import Message from "./components/Message.vue";
import User from "./components/User.vue";
import ErrorLog from "./components/ErrorLog.vue";
import settings from "@/config/settings";
import { useErrorLogStore, useLayoutStore, DeviceType } from "@/stores";

const layoutStore = useLayoutStore();
const errorLogStore = useErrorLogStore();

const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});

const isMobile = computed(() => layoutStore.device === DeviceType.Mobile);
</script>

<style lang="scss" scoped>
.header-right-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px 0 0;

  .header-icon {
    display: flex;
    align-items: center;

    & > * {
      margin-left: 21px;
    }

    :deep(.svg-icon:hover use) {
      fill: var(--el-color-primary) !important;
    }
  }
}
</style>
