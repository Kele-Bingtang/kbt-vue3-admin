<template>
  <TabsNav v-if="showTabsNav" />
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
import TabsNav from "@/layout/components/TabsNav/index.vue";

const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const showTabsNav = computed(() => settingsStore.showTabsNav);

// 刷新当前页面
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
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
