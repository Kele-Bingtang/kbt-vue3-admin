<script setup lang="ts">
import { computed, ref, nextTick, provide, watchEffect, type Component } from "vue";
import { ElMain } from "element-plus";
import { RefreshKey } from "@/config/symbols";
import { getUrlParams, mittBus } from "@/utils";
import { useLayoutStore, useSettingsStore } from "@/stores";
import SimpleTabNav from "@/layout/components/TabsNav/SimpleTabNav/index.vue";
import ClassicTabNav from "@/layout/components/TabsNav/ClassicTabNav/index.vue";
import ElTabNav from "@/layout/components/TabsNav/ElTabNav/index.vue";
import CustomTransition from "./components/CustomTransition.vue";
import Maximize from "./components/Maximize.vue";
import FrameLayout from "../FrameLayout/index.vue";

defineOptions({ name: "MainContent" });

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();

const tabsNavMode = computed(() => settingsStore.tabsNavMode);
const showTabNav = computed(() => settingsStore.showTabNav);

const TabsNavComponents: Record<string, Component> = {
  simple: SimpleTabNav,
  classic: ClassicTabNav,
  popular: ElTabNav,
};

// 刷新当前页面
const isRouterShow = ref(true);
const refreshCurrentPage = (value?: boolean) => {
  if (value !== undefined) isRouterShow.value = value;
  isRouterShow.value = false;

  nextTick(() => {
    isRouterShow.value = true;
  });
};
provide(RefreshKey, refreshCurrentPage);

mittBus.on("refreshCurrentPage", () => refreshCurrentPage());

// 监听当前页是否最大化，动态添加 class
watchEffect(() => {
  const urlParams = getUrlParams();
  const app = document.getElementById("app") as HTMLElement;

  if (urlParams.get("_maximize")) {
    if (!app?.className.includes("main-maximize")) app?.classList.add("main-maximize");
  } else {
    if (settingsStore.maximize) app?.classList.add("main-maximize");
    else app?.classList.remove("main-maximize");
  }
});

const isFixTabNav = computed(() => {
  if (settingsStore.fixTabNav) return "auto";
  return "";
});
</script>

<template>
  <Maximize v-if="settingsStore.maximize" />
  <el-main class="flx-column">
    <component :is="TabsNavComponents[tabsNavMode]" v-if="showTabNav" />
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

<style lang="scss" scoped>
.#{$el-namespace}-main {
  padding: 0;
  background-color: var(--#{$admin-namespace}-bg-color);

  .main-content {
    flex: 1;
    margin: 10px 12px;
    overflow: v-bind(isFixTabNav);
  }
}
</style>

<style lang="scss">
/* 当前页面最大化 */
.main-maximize {
  .#{$admin-namespace}-columns-layout__aside,
  .#{$el-namespace}-aside,
  .#{$el-namespace}-header,
  .#{$el-namespace}-footer,
  .tabs-nav {
    display: none !important;
  }
}
</style>
