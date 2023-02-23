<template>
  <component :is="TabsNavComponents[tabsNavMode]" v-if="showTabsNav" />
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="layoutStore.keepAliveName">
          <component :is="Component" :key="route.path" v-if="isRouterShow" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
</template>

<script setup lang="ts" name="MainContent">
import { useLayoutStore } from "@/stores/layout";
import { useSettingsStore } from "@/stores/settings";
import ClassicTabsNav from "@/layout/components/TabsNav/ClassicTabsNav/index.vue";
import ElTabsNav from "@/layout/components/TabsNav/ElTabsNav/index.vue";
export type RefreshFunction = (value?: boolean) => boolean;

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const tabsNavMode = computed(() => settingsStore.tabsNavMode);
const showTabsNav = computed(() => settingsStore.showTabsNav);

const TabsNavComponents: { [key: string]: Component } = {
  classic: ClassicTabsNav,
  popular: ElTabsNav,
};

// 刷新当前页面
const isRouterShow = ref(true);
const refreshCurrentPage: RefreshFunction = (value?: boolean) => {
  if (value) {
    isRouterShow.value = value;
    return true;
  }
  isRouterShow.value = false;
  nextTick(() => {
    isRouterShow.value = true;
  });
  return true;
};
provide("refresh", refreshCurrentPage);
</script>

<style lang="scss" scoped>
.el-main {
  box-sizing: border-box;
  padding: 10px 12px;
  overflow-x: hidden;
  background-color: #f0f2f5;
  &::-webkit-scrollbar {
    background-color: #f0f2f5;
  }
}
</style>
