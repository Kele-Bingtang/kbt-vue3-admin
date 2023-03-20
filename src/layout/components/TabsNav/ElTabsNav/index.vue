<template>
  <div class="tabs-nav" ref="tabsNavRef">
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
            <div style="display: inline-block" @contextmenu.prevent="openRightMenu($event, tab, tabsNavRef)">
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
      <RightMenu
        :visible="rightMenuVisible"
        :left="rightMenuLeft"
        :top="rightMenuTop"
        :condition="contextMenuCondition"
      />
    </transition>
  </div>
</template>

<script setup lang="ts" name="ElTabsNav">
import beforeClose from "@/router/beforeClose";
import { useSettingsStore } from "@/stores/settings";
import type { TabPaneName, TabsPaneContext } from "element-plus";
import CommonIcon from "@/components/CommonIcon/index.vue";
import { useTabsNav } from "../useTabsNav";
import RightMenu from "../components/rightMenu.vue";

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

const tabsNavValue = ref(route.fullPath);
const tabsNavRef = ref<HTMLElement>(); // 根标签

const {
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  tabsDrop,
  initTabs,
  addOneTab,
  closeSelectedTab,
  openRightMenu,
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
    const isClose = await new Promise(resolve => {
      beforeClose[tab.meta.beforeCloseName as string](resolve, route);
    });
    if (isClose) closeSelectedTab(tab);
  } else closeSelectedTab(tab);
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
