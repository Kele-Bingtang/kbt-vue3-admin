<template>
  <Maximize v-if="settingsStore.maximize" />
  <el-main>
    <component :is="TabsNavComponents[tabsNavMode]" v-if="showTabsNav" />
    <router-view v-slot="{ Component, route }">
      <CustomTransition name="fade-transform">
        <keep-alive :include="layoutStore.keepAliveName">
          <component :is="Component" :key="route.path" v-if="isRouterShow" class="main-content" />
        </keep-alive>
      </CustomTransition>
    </router-view>
    <FrameLayout />
  </el-main>
</template>

<script setup lang="ts" name="MainContent">
import { computed, ref, nextTick, provide, watchEffect, type Component } from "vue";
import { ElMain } from "element-plus";
import { useLayoutStore, useSettingsStore } from "@/stores";
import ClassicTabsNav from "@/layout/components/TabsNav/ClassicTabsNav/index.vue";
import ElTabsNav from "@/layout/components/TabsNav/ElTabsNav/index.vue";
import CustomTransition from "./components/CustomTransition.vue";
import Maximize from "./components/Maximize.vue";
import FrameLayout from "../FrameLayout/index.vue";
import { getUrlParams } from "@/utils";
import { RefreshKey } from "@/config/symbols";

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const tabsNavMode = computed(() => settingsStore.tabsNavMode);
const showTabsNav = computed(() => settingsStore.showTabsNav);

const TabsNavComponents: Record<string, Component> = {
  classic: ClassicTabsNav,
  popular: ElTabsNav,
};

// 刷新当前页面
const isRouterShow = ref(true);
const refreshCurrentPage = (value?: boolean) => {
  if (value !== undefined) {
    isRouterShow.value = value;
    return true;
  }
  isRouterShow.value = false;
  nextTick(() => {
    isRouterShow.value = true;
  });
  return true;
};
provide(RefreshKey, refreshCurrentPage);

// 监听当前页是否最大化，动态添加 class
watchEffect(() => {
  const urlParams = getUrlParams();
  if (urlParams._maximize) {
    const app = document.getElementById("app") as HTMLElement;
    if (!app.className.includes("main-maximize")) app?.classList.add("main-maximize");
  } else {
    const app = document.getElementById("app") as HTMLElement;
    if (settingsStore.maximize) app?.classList.add("main-maximize");
    else app?.classList.remove("main-maximize");
  }
});

const isFixTabsNav = computed(() => {
  if (settingsStore.fixTabsNav) return "auto";
  return "";
});
</script>

<style lang="scss" scoped>
.#{$el-namespace}-main {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow-x: hidden;
  background-color: #f0f2f5;

  .main-content {
    margin: 10px 12px;
    overflow: v-bind(isFixTabsNav);
  }

  &::-webkit-scrollbar {
    background-color: #f0f2f5;
  }
}
</style>
