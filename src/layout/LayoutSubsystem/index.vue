<template>
  <el-container
    class="layout-container"
    :class="{ mobile: isMobile(), 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }"
  >
    <el-aside>
      <div class="logo flx-center" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ settings.title }}</span>
      </div>
      <div class="menu-header">
        <CollapseTrigger />
        <template v-if="!isCollapse">
          <Fullscreen />
          <MenuSearch v-if="errorCount === 0" />
          <ErrorLog id="errorLog" :errorCount="errorCount" v-if="settings.errorLog.showInHeader && errorCount > 0" />
          <LayoutSizeSelect />
          <LanguageSelect />
          <User id="user" :show-avatar="false" />
        </template>
      </div>
      <Menu />
    </el-aside>
    <div v-if="isMobile() && !isCollapse" class="drawer-bg" @click="handleClickOutSide" />
    <el-container>
      <MainContent />
    </el-container>
  </el-container>
</template>
<script setup lang="ts" name="LayoutSubsystem">
import { useLayout } from "@/hooks/useLayout";
import { DeviceType } from "@/stores/index.d";
import { useLayoutStore } from "@/stores/layout";
import { useSettingsStore } from "@/stores/settings";
import MainContent from "@/layout/components/MainContent/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import Fullscreen from "@/layout/components/Header/components/Fullscreen.vue";
import LanguageSelect from "@/layout/components/Header/components/LanguageSelect.vue";
import LayoutSizeSelect from "@/layout/components/Header/components/LayoutSizeSelect.vue";
import MenuSearch from "@/layout/components/Header/components/MenuSearch.vue";
import ErrorLog from "@/layout/components/Header/components/ErrorLog.vue";
import User from "@/layout/components/Header/components/User.vue";
import CollapseTrigger from "@/layout/components/Header/components/CollapseTrigger.vue";
import { useErrorLogStore } from "@/stores/errorLog";
import { HOME_URL } from "@/router/routesConfig";
const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();
const { resizeHandler, isMobile } = useLayout();
const errorLogStore = useErrorLogStore();
const errorCount = computed(() => {
  const noReadErrorLogs = errorLogStore.errorLogs.filter(errorLog => {
    return !errorLog.hasRead;
  });
  return noReadErrorLogs.length;
});
const isCollapse = computed(() => settingsStore.isCollapse);
const device = computed(() => layoutStore.device);
// 监听路由的变化，判断是移动端还是桌面端
watch(
  () => route.fullPath,
  () => {
    if (device.value === DeviceType.Mobile && !isCollapse.value) {
      settingsStore.closeSideMenu();
    }
  }
);
onBeforeMount(() => {
  window.addEventListener("resize", resizeHandler);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandler);
});
const handleClickOutSide = () => {
  settingsStore.closeSideMenu();
};
</script>
<style lang="scss" scoped>
@import "./index-scoped.scss";
</style>
<style lang="scss">
@import "./index-unlimited.scss";
</style>
