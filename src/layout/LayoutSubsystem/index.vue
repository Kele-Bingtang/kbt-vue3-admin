<template>
  <el-container :class="[prefixClass, isCollapse ? 'menu-collapse' : 'menu-expand']">
    <el-aside>
      <div :class="`${prefixClass}__logo layout__logo flx-center`" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ SystemConfig.themeConfig.title }}</span>
      </div>
      <div :class="`${prefixClass}__menu-header`">
        <CollapseTrigger />
        <template v-if="!isCollapse">
          <Fullscreen />
          <MenuSearch v-if="errorCount === 0" />
          <ErrorLog
            id="errorLog"
            :errorCount="errorCount"
            v-if="SystemConfig.layoutConfig.errorLog.showInHeader && errorCount > 0"
          />
          <LayoutSizeSelect />
          <LanguageSelect />
          <User id="user" :show-avatar="false" />
        </template>
      </div>
      <Menu :class="`${prefixClass}__menu`" :popper-class="`${prefixClass}__menu`" />
    </el-aside>
    <el-container>
      <MainContent />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="LayoutSubsystem">
import { computed, watch, onBeforeMount, onBeforeUnmount, unref } from "vue";
import { ElContainer, ElAside } from "element-plus";
import { useLayout } from "@/composables";
import { useLayoutStore, useSettingsStore, useErrorLogStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import SystemConfig from "@/config";
import Fullscreen from "@/layout/components/Header/components/Fullscreen.vue";
import LanguageSelect from "@/layout/components/Header/components/LanguageSelect.vue";
import LayoutSizeSelect from "@/layout/components/Header/components/LayoutSizeSelect.vue";
import MenuSearch from "@/layout/components/Header/components/MenuSearch.vue";
import ErrorLog from "@/layout/components/Header/components/ErrorLog.vue";
import User from "@/layout/components/Header/components/User.vue";
import CollapseTrigger from "@/layout/components/Header/components/CollapseTrigger.vue";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";
import { useRoute, useRouter } from "vue-router";
import { DeviceEnum } from "@/enums/appEnum";

const ns = useNamespace("subsystem-layout");
const prefixClass = ns.b();

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();
const { resizeHandler } = useLayout();
const { errorLogs } = useErrorLogStore();

const errorCount = computed(() => {
  const noReadErrorLogs = errorLogs.filter(errorLog => {
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
    if (device.value === DeviceEnum.Mobile && !unref(isCollapse)) {
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
</script>

<style lang="scss" scoped>
@use "./index";
</style>

<style lang="scss">
@use "./menu";
</style>
