<script setup lang="ts">
import { computed, ref, nextTick, provide, watchEffect, type Component } from "vue";
import { ElMain } from "element-plus";
import { RefreshPageKey } from "@/config/symbols";
import { getUrlParams, mittBus } from "@/utils";
import { useLayoutStore, useSettingsStore } from "@/stores";
import { TabNavModeEnum } from "@/enums/appEnum";
import SimpleTabNav from "@/layout/components/TabNav/SimpleTabNav/index.vue";
import ClassicTabNav from "@/layout/components/TabNav/ClassicTabNav/index.vue";
import ElTabNav from "@/layout/components/TabNav/ElTabNav/index.vue";
import Maximize from "./components/Maximize.vue";
import FrameLayout from "../IFrameLayout/index.vue";

defineOptions({ name: "MainContent" });

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();

const tabNavMode = computed(() => settingsStore.tabNavMode);
const showTabNav = computed(() => settingsStore.showTabNav);

const TabNavComponents: Record<string, Component> = {
  [TabNavModeEnum.Simple]: SimpleTabNav,
  [TabNavModeEnum.Classic]: ClassicTabNav,
  [TabNavModeEnum.Element]: ElTabNav,
};

// 刷新当前页面
const isRefreshRoute = ref(true);
const refreshCurrentPage = (value?: boolean) => {
  if (value !== undefined) isRefreshRoute.value = value;
  isRefreshRoute.value = false;

  nextTick(() => {
    isRefreshRoute.value = true;
  });
};
provide(RefreshPageKey, refreshCurrentPage);

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
    <component :is="TabNavComponents[tabNavMode]" v-if="showTabNav" />

    <router-view v-slot="{ Component, route }">
      <Transition :name="settingsStore.pageTransition" mode="out-in" appear>
        <keep-alive :max="10" :include="layoutStore.keepAliveName">
          <component v-if="isRefreshRoute" :is="Component" :key="route.path" class="main-content" />
        </keep-alive>
      </Transition>
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
  .tab-nav {
    display: none !important;
  }
}
</style>
