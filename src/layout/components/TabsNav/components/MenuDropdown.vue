<template>
  <el-dropdown trigger="click" :teleported="false">
    <slot>
      <el-button text size="small" type="primary" @click="expandDropdown">
        <span>{{ $t("_tabsNav.more") }}</span>
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
    </slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refreshSelectedTab(selectedTab)" :disabled="!contextMenuCondition.refresh">
          <el-icon><Refresh /></el-icon>
          {{ $t("_tabsNav.refresh") }}
        </el-dropdown-item>
        <el-dropdown-item @click="useMaximize">
          <el-icon><FullScreen /></el-icon>
          {{ $t("_tabsNav.maximize") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrentTab(selectedTab)" :disabled="!contextMenuCondition.current">
          <el-icon><Close /></el-icon>
          {{ $t("_tabsNav.closeCurrent") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeLeftTab(selectedTab)" :disabled="!contextMenuCondition.left">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t("_tabsNav.closeLeft") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeRightTab(selectedTab)" :disabled="!contextMenuCondition.right">
          <el-icon><ArrowRight /></el-icon>
          {{ $t("_tabsNav.closeRight") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeOthersTabs(selectedTab)" :disabled="!contextMenuCondition.other">
          <el-icon><SemiSelect /></el-icon>
          {{ $t("_tabsNav.closeOthers") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTabs()" :disabled="!contextMenuCondition.all">
          <el-icon><FolderDelete /></el-icon>
          {{ $t("_tabsNav.closeAll") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="MenuButton">
import { useSettingsStore } from "@/stores/settings";
import { useDebounceFn } from "@vueuse/core";
import { useTabsNav } from "../useTabsNav";

const {
  contextMenuCondition,
  getOneTab,
  initContextMenu,
  refreshSelectedTab,
  closeCurrentTab,
  closeLeftTab,
  closeRightTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabsNav();

const route = useRoute();
const settingStore = useSettingsStore();

const selectedTab = ref(getOneTab(route));

const expandDropdown = () => {
  useDebounceFn(() => {
    initContextMenu(selectedTab.value);
  }, 100)();
};

const useMaximize = () => {
  settingStore.$patch({ maximize: true });
};

watch(
  () => route.fullPath,
  () => (selectedTab.value = getOneTab(route))
);
</script>

<style lang="scss" scoped></style>
