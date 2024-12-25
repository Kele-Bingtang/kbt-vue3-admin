<template>
  <div :class="prefixClass" ref="tabsNavRef">
    <div :class="`${prefixClass}__content`">
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
              <Icon
                v-if="tab.meta.icon && settingsStore.showTabsNavIcon"
                :icon="tab.meta.icon"
                :class="`${prefixClass}__content--icon`"
              />
              <span>{{ tab.title }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <MenuButton />
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

<script setup lang="ts" name="ElTabsNav">
import { ref, onMounted, watch } from "vue";
import { ElTabs, ElTabPane, type TabPaneName, type TabsPaneContext } from "element-plus";
import { useSettingsStore } from "@/stores";
import { useTabsNav } from "../useTabsNav";
import RightMenu from "../components/RightMenu.vue";
import MenuButton from "../components/MenuDropdown.vue";
import { useDesign } from "@/hooks";
import { useRoute, useRouter } from "vue-router";

const { getPrefixClass, variables } = useDesign();
const prefixClass = getPrefixClass("tabs-nav");

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
} = useTabsNav();

const tabsNavValue = ref(resolveFullPath(route));
const tabsNavRef = ref<HTMLElement>(); // 根标签

onMounted(() => {
  tabsDrop(`.${variables.elNamespace}-tabs__nav`, `.${variables.elNamespace}-tabs__item`);
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
  const tab = tabNavList.value.filter(item => item.path === fullPath)[0];
  closeCurrentTab(tab);
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
