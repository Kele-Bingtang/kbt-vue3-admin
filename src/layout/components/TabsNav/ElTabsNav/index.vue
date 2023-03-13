<template>
  <div class="tabs-nav" ref="tabsNavDom">
    <div class="tabs-content">
      <el-tabs v-model="tabsNavValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="tab in tabNavList"
          :key="tab.path"
          :label="tab.title"
          :name="tab.path"
          :closable="tab.close"
        >
          <template #label>
            <div style="display: inline-block" @contextmenu.prevent="openRightMenu(tab, $event)">
              <CommonIcon
                v-if="tab.meta.icon && settingsStore.showTabsNavIcon"
                :icon="tab.meta.icon"
                class="tab-icon"
              />
              <span>{{ tab.title }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <MoreButton /> -->
    </div>
    <transition name="el-zoom-in-top">
      <ul
        v-show="rightMenuVisible"
        :style="{ left: rightMenuLeft + 'px', top: rightMenuTop + 'px' }"
        class="context-menu"
      >
        <li v-if="contextMenuCondition.refresh" @click="refreshSelectedTab(selectedTab)">
          <el-icon><Refresh /></el-icon>
          {{ $t("_tabsNav.refresh") }}
        </li>
        <li v-if="contextMenuCondition.current" @click="closeCurrentTab(selectedTab)">
          <el-icon><Close /></el-icon>
          {{ $t("_tabsNav.closeCurrent") }}
        </li>
        <li v-if="contextMenuCondition.left" @click="closeLeftTab(selectedTab)">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t("_tabsNav.closeLeft") }}
        </li>
        <li v-if="contextMenuCondition.right" @click="closeRightTab(selectedTab)">
          <el-icon><ArrowRight /></el-icon>
          {{ $t("_tabsNav.closeRight") }}
        </li>
        <li v-if="contextMenuCondition.other" @click="closeOthersTabs">
          <el-icon><DCaret /></el-icon>
          {{ $t("_tabsNav.closeOthers") }}
        </li>
        <li v-if="contextMenuCondition.all" @click="closeAllTabs()">
          <el-icon><SemiSelect /></el-icon>
          {{ $t("_tabsNav.closeAll") }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts" name="ElTabsNav">
import beforeClose from "@/router/beforeClose";
import type { TabProp } from "@/stores";
import { useSettingsStore } from "@/stores/settings";
import type { TabPaneName, TabsPaneContext } from "element-plus";
import CommonIcon from "@/components/CommonIcon/index.vue";
import { useTabsNav } from "../useTabsNav";

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

const tabsNavValue = ref(route.fullPath);

const tabsNavDom = ref<HTMLElement>(); // 根标签
// 右键菜单位置
const rightMenuLeft = ref(0);
const rightMenuTop = ref(0);

const {
  tabNavList,
  selectedTab,
  rightMenuVisible,
  contextMenuCondition,
  tabsDrop,
  initTabs,
  addOneTab,
  initContextMenu,
  closeCurrentTab,
  closeSelectedTab,
  refreshSelectedTab,
  closeLeftTab,
  closeRightTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabsNav();

onMounted(() => {
  tabsDrop(".el-tabs__nav", ".el-tabs__item");
  initTabs();
  addOneTab();
});

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    tabsNavValue.value = route.fullPath;
    addOneTab();
  }
);

// Tab 点击回调
const tabClick = (tabItem: TabsPaneContext) => {
  const fullPath = tabItem.props.name as string;
  router.push(fullPath);
};

// 删除一个 Tab
const tabRemove = async (fullPath: TabPaneName) => {
  const tab = tabNavList.value.filter(item => item.path === fullPath)[0];
  if (tab.meta && tab.meta.beforeCloseName && tab.meta.beforeCloseName in beforeClose) {
    const isClose = await new Promise(beforeClose[tab.meta.beforeCloseName]);
    if (isClose) closeSelectedTab(tab);
  } else closeSelectedTab(tab);
};
const openRightMenu = (tab: TabProp, e: MouseEvent) => {
  initContextMenu(tab);
  const menuMinWidth = 0;
  const offsetWidth = tabsNavDom.value?.offsetWidth as number; //  width 数值
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX + 14;
  if (left > maxLeft) {
    rightMenuLeft.value = maxLeft;
  } else {
    rightMenuLeft.value = left;
  }
  rightMenuTop.value = e.clientY + 7;
  rightMenuVisible.value = true;
  selectedTab.value = tab;
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
@import "../index.scss";
</style>
