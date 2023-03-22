<template>
  <ul v-show="visible" :style="{ left: `${left}px`, top: `${top}px` }" class="context-menu">
    <li v-if="condition.refresh" @click="refreshSelectedTab(selectedTab)">
      <el-icon><Refresh /></el-icon>
      {{ $t("_tabsNav.refresh") }}
    </li>
    <li v-if="condition.current" @click="closeCurrentTab(selectedTab)">
      <el-icon><Close /></el-icon>
      {{ $t("_tabsNav.closeCurrent") }}
    </li>
    <li v-if="condition.left" @click="closeLeftTab(selectedTab)">
      <el-icon><ArrowLeft /></el-icon>
      {{ $t("_tabsNav.closeLeft") }}
    </li>
    <li v-if="condition.right" @click="closeRightTab(selectedTab)">
      <el-icon><ArrowRight /></el-icon>
      {{ $t("_tabsNav.closeRight") }}
    </li>
    <li v-if="condition.other" @click="closeOthersTabs(selectedTab)">
      <el-icon><SemiSelect /></el-icon>
      {{ $t("_tabsNav.closeOthers") }}
    </li>
    <li v-if="condition.all" @click="closeAllTabs()">
      <el-icon><FolderDelete /></el-icon>
      {{ $t("_tabsNav.closeAll") }}
    </li>
  </ul>
</template>

<script setup lang="ts" name="RightMenu">
import type { TabProp } from "@/stores";
import { useTabsNav, type ContextMenuCondition } from "../useTabsNav";

const { refreshSelectedTab, closeCurrentTab, closeLeftTab, closeRightTab, closeOthersTabs, closeAllTabs } =
  useTabsNav();

interface RightMenuProps {
  selectedTab: TabProp;
  visible?: boolean;
  left?: number;
  top?: number;
  condition?: ContextMenuCondition;
}

withDefaults(defineProps<RightMenuProps>(), {
  visible: false,
  left: 0,
  right: 0,
  condition: () => ({ refresh: false, current: false, left: false, right: false, other: false, all: false }),
});
</script>

<style lang="scss" scoped>
.context-menu {
  margin: 0;
  background: #fff;
  z-index: 4000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0 12px;
    cursor: pointer;
    line-height: 31px;
    &:hover {
      color: var(--el-color-primary);
    }
    .el-icon {
      margin-right: 8px;
    }
  }
}
</style>
