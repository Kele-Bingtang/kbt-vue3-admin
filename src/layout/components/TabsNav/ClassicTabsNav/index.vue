<script setup lang="ts" name="TabsNav">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ElButton, ElIcon } from "element-plus";
import { Close, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useLayoutStore, useSettingsStore, type TabProp } from "@/stores";
import { useNamespace } from "@/composables";
import { useTabsNav } from "../useTabsNav";
import MenuDropdown from "../components/MenuDropdown.vue";
import RightMenu from "../components/RightMenu.vue";

import "./index.scss";

const ns = useNamespace("classic-tabs-nav");

const route = useRoute();
const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();

const tabBodyLeft = ref(0); // tabsNav 滚动
const tabsNavRef = ref<HTMLElement>(); // 根标签
const scrollContainerDom = ref<HTMLElement>(); // 滚动栏标签
const scrollBodyDom = ref<HTMLElement>();
const tabsDom = ref(); // tab 标签

const {
  selectedTab,
  tabNavList,
  rightMenuVisible,
  contextMenuCondition,
  rightMenuLeft,
  rightMenuTop,
  isActive,
  tabsDrop,
  initTabs,
  getOneTab,
  addOneTab,
  openRightMenu,
  closeCurrentTab,
} = useTabsNav();

onMounted(() => {
  tabsDrop(`.${ns.e("scroll-body")}`, `.${ns.e("tab")}`);
  initTabs();
  addOneTab();
});

/**
 * 更换 tab 颜色为全局 primaryTheme
 */
const activeStyle = (tab: TabProp) => {
  if (!isActive(tab)) return {};
  return {
    "background-color": settingsStore.primaryTheme,
    "border-color": settingsStore.primaryTheme,
  };
};

/**
 * 找出访问的目标 tab
 */
const findTargetTab = async () => {
  await nextTick();

  if (!tabsDom.value) return;

  for (const tab of tabsDom.value) {
    if (route.path === tab.to) {
      moveToTargetTab(tab.$el);
      // 当 query 不一样
      if (tab.to.path !== route.fullPath) {
        const tabParam = getOneTab(route);
        layoutStore.updateTab(tabParam);
      }
    }
  }
};

// 移动到目标 tab，如果目标 tab 在 TabsNav 可视区域外面，则有滚动的动画效果
const moveToTargetTab = (tabElement: HTMLElement) => {
  const outerWidth = scrollContainerDom.value?.offsetWidth as number;
  const bodyWidth = scrollBodyDom.value?.offsetWidth as number;
  const outerPadding = 4;

  if (bodyWidth < outerWidth) tabBodyLeft.value = 0;
  else if (tabElement.offsetLeft < -tabBodyLeft.value) {
    tabBodyLeft.value = -tabElement.offsetLeft + outerPadding;
  } else if (
    // 标签在可视区域左侧
    tabElement.offsetLeft > -tabBodyLeft.value &&
    tabElement.offsetLeft + tabElement.offsetWidth < -tabBodyLeft.value + outerWidth
  ) {
    tabBodyLeft.value = Math.min(0, outerWidth - tabElement.offsetWidth - tabElement.offsetLeft - outerPadding);
  } else tabBodyLeft.value = -(tabElement.offsetLeft - (outerWidth - outerPadding - tabElement.offsetWidth)); // 标签在可视区域右侧
};

// 鼠标中键滚动回调
const handleScrollOnDom = (e: MouseEvent & { wheelDelta: number }) => {
  const type = e.type;
  let delta = 0;
  if (type === "DOMMouseScroll" || type === "mousewheel") {
    delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
  }
  handleScroll(delta);
};

// TagsNav 滚动回调
const handleScroll = (offset: number) => {
  const outerWidth = scrollContainerDom.value?.offsetWidth as number;
  const bodyWidth = scrollBodyDom.value?.offsetWidth as number;

  if (offset > 0) tabBodyLeft.value = Math.min(0, tabBodyLeft.value + offset);
  else if (outerWidth < bodyWidth) {
    if (tabBodyLeft.value >= -(bodyWidth - outerWidth)) {
      tabBodyLeft.value = Math.max(tabBodyLeft.value + offset, outerWidth - bodyWidth);
    }
  } else tabBodyLeft.value = 0;
};

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    addOneTab();
    findTargetTab();
  }
);
</script>

<template>
  <div :class="[ns.b(), 'flx-align-center']" ref="tabsNavRef">
    <div :class="[ns.e('btn'), ns.is('left')]">
      <el-button plain @click="handleScroll(240)">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
    </div>

    <div :class="ns.e('scroll')" ref="scrollContainerDom">
      <div
        ref="scrollBodyDom"
        :class="ns.e('scroll-body')"
        :style="{ left: tabBodyLeft + 'px' }"
        @DOMMouseScroll="handleScrollOnDom"
        @mousewheel="handleScrollOnDom"
      >
        <router-link
          ref="tabsDom"
          v-for="tab in tabNavList"
          :key="tab.path"
          :to="tab.path"
          :class="[ns.e('tab'), { active: isActive(tab) }]"
          :style="activeStyle(tab)"
          @contextmenu.prevent="openRightMenu($event, tab, tabsNavRef)"
        >
          <span class="dot" v-if="!settingsStore.showTabsNavIcon" />
          <Icon
            v-if="tab.meta.icon && settingsStore.showTabsNavIcon"
            :icon="tab.meta.icon"
            :class="ns.em('tab', 'icon')"
          />
          <span>{{ tab.title }}</span>
          <el-icon class="icon-close" v-if="tab.close" @click.prevent.stop="closeCurrentTab(tab)">
            <Close />
          </el-icon>
        </router-link>
      </div>
    </div>

    <div :class="[ns.e('btn'), ns.is('right')]">
      <el-button plain @click="handleScroll(-240)">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>

    <MenuDropdown :class="ns.e('menu-dropdown')"></MenuDropdown>

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
