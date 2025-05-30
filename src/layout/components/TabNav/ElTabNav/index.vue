<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ElTabs, ElTabPane, type TabPaneName, type TabsPaneContext } from "element-plus";
import { useSettingsStore } from "@/stores";
import { useTabNav } from "../useTabNav";
import RightMenu from "../components/RightMenu.vue";
import TabNavButton from "../components/TabNavButton.vue";
import { useNamespace } from "@/composables";
import { useRoute, useRouter } from "vue-router";

import "./index.scss";

defineOptions({ name: "ElTabNav" });

const ns = useNamespace("el-tabs-nav");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();

const {
  selectedTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  tabsDrop,
  initTabs,
  addOneTab,
  resolveFullPath,
  closeCurrentTab,
  openRightMenu,
} = useTabNav();

const tabsNavValue = ref(resolveFullPath(route));
const tabsNavRef = ref<HTMLElement>(); // 根标签

onMounted(() => {
  tabsDrop(`.${ns.elNamespace}-tabs__nav`, `.${ns.elNamespace}-tabs__item`);
  initTabs();
  addOneTab();
});

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    tabsNavValue.value = resolveFullPath(route);
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
  const tab = tabNavList.value.find(item => item.path === fullPath);
  if (tab) closeCurrentTab(tab);
};
</script>

<template>
  <div ref="tabsNavRef" :class="[ns.b(), 'tab-nav']">
    <div :class="[ns.e('content'), 'flx-align-center']">
      <el-tabs v-model="tabsNavValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="tab in tabNavList"
          :key="tab.path"
          :label="tab.title"
          :name="tab.path"
          :closable="tab.close"
        >
          <template #label>
            <div @contextmenu.prevent="openRightMenu($event, tab, tabsNavRef)">
              <Icon
                v-if="tab.meta.icon && settingsStore.showTabNavIcon"
                :icon="tab.meta.icon"
                :class="ns.em('content', 'icon')"
              />
              <span>{{ tab.title }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <TabNavButton />
    </div>

    <transition name="el-zoom-in-top">
      <RightMenu
        :selected-tab="selectedTab"
        :visible="rightMenuVisible"
        :left="rightMenuLeft"
        :top="rightMenuTop"
        :condition="contextMenuCondition"
      />
    </transition>
  </div>
</template>
