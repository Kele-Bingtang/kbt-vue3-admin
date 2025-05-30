<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ElButton } from "element-plus";
import { Close, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useLayoutStore, useSettingsStore } from "@/stores";
import { useNamespace } from "@/composables";
import { useTabNav } from "../useTabNav";
import TabNavButton from "../components/TabNavButton.vue";
import RightMenu from "../components/RightMenu.vue";

import "./index.scss";

defineOptions({ name: "ClassicTabNav" });

const ns = useNamespace("classic-tabs-nav");

const { type = "simple" } = defineProps<{ type?: "simple" | "classic" }>();

const route = useRoute();
const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();

const tabBodyLeft = ref(0); // tabsNav 滚动
const tabsNavRef = ref<HTMLElement>(); // 根标签
const scrollContainerDom = ref<HTMLElement>(); // 滚动栏标签
const scrollBodyDom = ref<HTMLElement>();
const tabsDom = ref(); // tab 标签
const hasScroll = ref(false);

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
} = useTabNav();

onMounted(() => {
  tabsDrop(`.${ns.e("scroll-body")}`, `.${ns.e("tab")}`);
  initTabs();
  addOneTab();
});

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

// 移动到目标 tab，如果目标 tab 在 TabNav 可视区域外面，则有滚动的动画效果
const moveToTargetTab = (tabElement: HTMLElement) => {
  const outerWidth = scrollContainerDom.value?.offsetWidth || 0;
  const bodyWidth = scrollBodyDom.value?.offsetWidth || 0;
  hasScroll.value = bodyWidth > outerWidth;

  if (bodyWidth <= outerWidth) {
    tabBodyLeft.value = 0;
    return;
  }

  const outerPadding = 4;
  const tabOffsetLeft = tabElement.offsetLeft;
  const tabWidth = tabElement.offsetWidth;
  const currentScrollLeft = -tabBodyLeft.value;

  // 可视区域右边界
  const visibleRightEdge = currentScrollLeft + outerWidth - outerPadding;
  // Tab 的右边界
  const tabRightEdge = tabOffsetLeft + tabWidth;

  // 如果 Tab 完全在可视区域内，无需滚动
  if (tabOffsetLeft >= currentScrollLeft && tabRightEdge <= visibleRightEdge) return;
  // Tab 在左侧不可见
  if (tabOffsetLeft < currentScrollLeft) {
    tabBodyLeft.value = -tabOffsetLeft + outerPadding;
  }
  // Tab 在右侧不可见
  else if (tabRightEdge > visibleRightEdge) {
    const newScrollLeft = tabRightEdge - outerWidth + outerPadding;
    tabBodyLeft.value = -newScrollLeft;
  }
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
  <div :class="[ns.b(), 'flx-align-center', ns.is(type)]" ref="tabsNavRef">
    <div v-show="hasScroll" :class="[ns.e('btn'), ns.is('left')]">
      <el-button plain @click="handleScroll(240)">
        <Icon><ArrowLeft /></Icon>
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
          :class="[ns.e('tab'), ns.is('active', isActive(tab))]"
          @contextmenu.prevent="openRightMenu($event, tab, tabsNavRef)"
        >
          <span class="dot" v-if="settingsStore.showTabNavDot && !settingsStore.showTabNavIcon" />
          <Icon
            v-if="tab.meta.icon && settingsStore.showTabNavIcon"
            :icon="tab.meta.icon"
            :class="ns.em('tab', 'icon')"
          />
          <span>{{ tab.title }}</span>
          <Icon class="icon-close" v-if="tab.close" @click.prevent.stop="closeCurrentTab(tab)">
            <Close />
          </Icon>
        </router-link>
      </div>
    </div>

    <div v-show="hasScroll" :class="[ns.e('btn'), ns.is('right')]">
      <el-button plain @click="handleScroll(-240)">
        <Icon><ArrowRight /></Icon>
      </el-button>
    </div>

    <TabNavButton :class="ns.e('menu-dropdown')" />

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
