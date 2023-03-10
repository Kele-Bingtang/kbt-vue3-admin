<template>
  <div class="tabs-nav" ref="tabsNavDom">
    <div style="height: 39px">
      <div class="scroll-container" ref="scrollContainerDom">
        <div
          class="scroll-body"
          ref="scrollBodyDom"
          :style="{ left: tabBodyLeft + 'px' }"
          @DOMMouseScroll="handleScrollOnDom"
          @mousewheel="handleScrollOnDom"
        >
          <router-link
            v-for="tab in tabNavList"
            :key="tab.path"
            :to="tab.path"
            :class="isActive(tab) ? 'active' : ''"
            :style="activeStyle(tab)"
            class="tabs-link"
            ref="tabsDom"
            @contextmenu.prevent="openRightMenu(tab, $event)"
          >
            <span class="dot" v-if="!settingsStore.showTabsNavIcon" />
            <CommonIcon v-if="tab.meta.icon && settingsStore.showTabsNavIcon" :icon="tab.meta.icon" class="tab-icon" />
            <span>{{ tab.meta.title }}</span>
            <el-icon class="icon-close" v-if="tab.close" @click.prevent.stop="closeCurrentTab(tab)">
              <Close />
            </el-icon>
          </router-link>
        </div>
      </div>
      <div class="btn-icon left-btn">
        <el-button plain @click="handleScroll(240)">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
      </div>
      <div class="btn-icon right-btn">
        <el-button plain @click="handleScroll(-240)">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
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
  </div>
</template>

<script setup lang="ts" name="TabsNav">
import { useLayout } from "@/hooks/useLayout";
import type { TabProp } from "@/stores/index.d";
import { useLayoutStore } from "@/stores/layout";
import { useSettingsStore } from "@/stores/settings";
import CommonIcon from "@/components/CommonIcon/index.vue";
import { useTabsNav } from "../useTabsNav";

const tabBodyLeft = ref(0); // tabsNav ??????
// ??????????????????
const rightMenuLeft = ref(0);
const rightMenuTop = ref(0);

const tabsNavDom = ref<HTMLElement>(); // ?????????
const scrollContainerDom = ref<HTMLElement>(); // ???????????????
const scrollBodyDom = ref<HTMLElement>();
const tabsDom = ref(); // tab ??????

const route = useRoute();
const layoutStore = useLayoutStore();
const settingsStore = useSettingsStore();
const { getTitle } = useLayout();

const {
  tabNavList,
  selectedTab,
  rightMenuVisible,
  contextMenuCondition,
  isActive,
  tabsDrop,
  initTabs,
  addOneTab,
  initContextMenu,
  closeCurrentTab,
  closeLeftTab,
  closeRightTab,
  refreshSelectedTab,
  closeOthersTabs,
  closeAllTabs,
} = useTabsNav();

onMounted(() => {
  tabsDrop(".scroll-body", ".tabs-link");
  initTabs();
  addOneTab();
});

// ???????????? tab ??????
const getOneTab = (route: RouteConfig | RouterConfig) => {
  return {
    path: (route as RouteConfig).fullPath || route.meta._fullPath,
    name: (route.name as string) || route.path,
    title: getTitle(route),
    icon: route.meta.icon || "",
    close: !route.meta.isAffix,
    meta: route.meta,
  };
};

// ?????? tab ??????????????? primaryTheme
const activeStyle = (tab: TabProp) => {
  if (!isActive(tab)) return {};
  return {
    "background-color": settingsStore.primaryTheme,
    "border-color": settingsStore.primaryTheme,
  };
};

// ????????????????????? tab
const findTargetTab = () => {
  nextTick(() => {
    if (tabsDom.value) {
      for (const tab of tabsDom.value) {
        if (route.path === tab.to.path) {
          moveToTargetTab(tab.$el);
          // ??? query ?????????
          if (tab.to.path !== route.fullPath) {
            const tabParam = getOneTab(route as RouteConfig);
            layoutStore.updateTab(tabParam);
          }
        }
      }
    }
  });
};

// ??????????????? tab??????????????? tab ??? TabsNav ????????????????????????????????????????????????
const moveToTargetTab = (tabElement: HTMLElement) => {
  const outerWidth = scrollContainerDom.value?.offsetWidth as number;
  const bodyWidth = scrollBodyDom.value?.offsetWidth as number;
  const outerPadding = 4;
  if (bodyWidth < outerWidth) tabBodyLeft.value = 0;
  else if (tabElement.offsetLeft < -tabBodyLeft.value) {
    tabBodyLeft.value = -tabElement.offsetLeft + outerPadding;
  } else if (
    // ???????????????????????????
    tabElement.offsetLeft > -tabBodyLeft.value &&
    tabElement.offsetLeft + tabElement.offsetWidth < -tabBodyLeft.value + outerWidth
  ) {
    tabBodyLeft.value = Math.min(0, outerWidth - tabElement.offsetWidth - tabElement.offsetLeft - outerPadding);
  } else tabBodyLeft.value = -(tabElement.offsetLeft - (outerWidth - outerPadding - tabElement.offsetWidth)); // ???????????????????????????
};

// ??????????????????
const openRightMenu = (tab: TabProp, e: MouseEvent) => {
  initContextMenu(tab);
  const menuMinWidth = 0;
  const offsetLeft = tabsNavDom.value?.getBoundingClientRect().left as number; // margin-left ?????????
  const offsetWidth = tabsNavDom.value?.offsetWidth as number; //  width ??????
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 14;
  if (left > maxLeft) rightMenuLeft.value = maxLeft;
  else rightMenuLeft.value = left;
  rightMenuTop.value = e.offsetY + 12;
  rightMenuVisible.value = true;
  selectedTab.value = tab;
};

// ????????????????????????
const handleScrollOnDom = (e: MouseEvent & { wheelDelta: number }) => {
  const type = e.type;
  let delta = 0;
  if (type === "DOMMouseScroll" || type === "mousewheel") {
    delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
  }
  handleScroll(delta);
};

// TagsNav ????????????
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

// ?????????????????????
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    addOneTab();
    findTargetTab();
  }
);

// ??????????????????
const closeRightMenu = () => {
  rightMenuVisible.value = false;
};

watchEffect(() => {
  if (rightMenuVisible.value) {
    document.body.addEventListener("click", closeRightMenu);
  } else {
    document.body.removeEventListener("click", closeRightMenu);
  }
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
@import "../index.scss";
</style>
