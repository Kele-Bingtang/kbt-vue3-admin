<template>
  <div class="hedaer-right-container">
    <div class="header-icon">
      <Fullscreen id="fullscreen" />
      <LayoutSizeSelect id="layoutSizeSelect" />
      <LanguageSelect id="languageSelect" />
      <ErrorLog id="errorLog" :errorCount="errorCount" v-if="settings.errorLog.showInHeader && errorCount > 0" />
      <User id="user" />
    </div>
  </div>
</template>

<script setup lang="ts" name="ToolBarRight">
import Fullscreen from "./components/Fullscreen.vue";
import LanguageSelect from "./components/LanguageSelect.vue";
import LayoutSizeSelect from "./components/LayoutSizeSelect.vue";
import User from "./components/User.vue";
import ErrorLog from "./components/ErrorLog.vue";
import settings from "@/config/settings";
import { useErrorLogStore } from "@/stores/errorLog";

const errorLogStore = useErrorLogStore();
const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});
</script>

<style lang="scss" scoped>
.hedaer-right-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 30px 0 0;
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
