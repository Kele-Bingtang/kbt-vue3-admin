<template>
  <div class="tabs-nav" ref="tabsNavDom">
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
          <el-icon class="icon-close" v-if="tab.close" @click.prevent.stop="handleCloseTab(tab)"><Close /></el-icon>
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
    <ul v-show="rightMenuVisible" :style="{ left: rightMenuLeft + 'px', top: rightMenuTop + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTab(selectedTab)">{{ $t("_tabsNav.refresh") }}</li>
      <li v-if="selectedTab.close" @click="handleCloseTab(selectedTab)">{{ $t("_tabsNav.close") }}</li>
      <li @click="closeOthersTabs">{{ $t("_tabsNav.closeOthers") }}</li>
      <li @click="closeAllTabs()">{{ $t("_tabsNav.closeAll") }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="TabsNav">
import { useLayout } from "@/hooks/useLayout";
import type { TabProp } from "@/stores/index.d";
import { useLayoutStore } from "@/stores/layout";
import { usePermissionStore } from "@/stores/permission";
import { useSettingsStore } from "@/stores/settings";
import beforeClose from "@/router/before-close";
import CommonIcon from "@/components/CommonIcon/index.vue";
import Sortable from "sortablejs";

const rightMenuVisible = ref(false); // 右键菜单显示
const tabBodyLeft = ref(0); // tabsNav 滚动
// 右键菜单位置
const rightMenuLeft = ref(0);
const rightMenuTop = ref(0);
// 激活的 tab
let selectedTab = reactive<TabProp>({
  path: "", // 路由的 path
  name: "", // 路由的 name
  title: "", // 展示的描述
  icon: "", // 图标
  close: true, // 是否允许关闭
  meta: {}, // 路由 meta
});

const tabsNavDom = ref<HTMLElement>(); // 根标签
const scrollContainerDom = ref<HTMLElement>(); // 滚动栏标签
const scrollBodyDom = ref<HTMLElement>();
const tabsDom = ref(); // tab 标签

const route = useRoute();
const router = useRouter();
const layoutStore = useLayoutStore();
const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();
const { getTitle } = useLayout();

const tabNavList = computed(() => layoutStore.tabNavList);

onMounted(() => {
  tabsDrop();
  initTabs();
  addOneTab();
});

// 标签拖拽排序
const tabsDrop = () => {
  Sortable.create(document.querySelector(".scroll-body") as HTMLElement, {
    draggable: ".tabs-link",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const tabsList = [...tabNavList.value];
      const currRow = tabsList.splice(oldIndex as number, 1)[0];
      tabsList.splice(newIndex as number, 0, currRow);
      layoutStore.$patch({
        tabNavList: tabsList,
      });
    },
  });
};

// 获取一个 tab 对象
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

// 判断当前激活的 tab
const isActive = (tab: TabProp) => {
  return route.fullPath === tab.path || route.fullPath === tab.path + "/";
};

// 更换 tab 颜色为全局 theme
const activeStyle = (tab: TabProp) => {
  if (!isActive(tab)) return {};
  return {
    "background-color": settingsStore.theme,
    "border-color": settingsStore.theme,
  };
};

// 初始化固定在 TabsNav 的 tabs
const initTabs = () => {
  permissionStore.flatRouteList.forEach(item => {
    if (item.meta.isAffix && !item.meta.isFull) {
      const tabParam = getOneTab(item);
      layoutStore.addTab(tabParam);
      item.meta.isKeepAlive && layoutStore.addKeepAliveName(item.name as string);
    }
  });
};

// 添加 tab
const addOneTab = () => {
  if (route.name) {
    const tab: TabProp = getOneTab(route as RouteConfig);
    layoutStore.addTab(tab);
    route.meta.isKeepAlive && layoutStore.addKeepAliveName(route.name as string);
    findTargetTab();
  }
};

// 找出访问的目标 tab
const findTargetTab = () => {
  nextTick(() => {
    if (tabsDom.value) {
      for (const tab of tabsDom.value) {
        if (route.path === tab.to.path) {
          moveToTargetTab(tab.$el);
          // 当 query 不一样
          if (tab.to.path !== route.fullPath) {
            const tabParam = getOneTab(route as RouteConfig);
            layoutStore.updateTab(tabParam);
          }
        }
      }
    }
  });
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

// 右键菜单回调
const openRightMenu = (tab: TabProp, e: MouseEvent) => {
  const menuMinWidth = 0;
  const offsetLeft = tabsNavDom.value?.getBoundingClientRect().left as number; // margin-left 的数值
  const offsetWidth = tabsNavDom.value?.offsetWidth as number; //  width 数值
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 14;
  if (left > maxLeft) {
    rightMenuLeft.value = maxLeft;
  } else {
    rightMenuLeft.value = left;
  }
  rightMenuTop.value = e.offsetY + 12;
  rightMenuVisible.value = true;
  selectedTab = tab;
};

// 关闭一个 tab，并激活到上一个 tab
const handleCloseTab = async (tab: TabProp) => {
  if (tab.meta && tab.meta.beforeCloseName && tab.meta.beforeCloseName in beforeClose) {
    const isClose = await new Promise(beforeClose[tab.meta.beforeCloseName]);
    if (isClose) closeSelectedTab(tab);
  } else closeSelectedTab(tab);
};

// 关闭选择的 tab
const closeSelectedTab = (tab: TabProp) => {
  layoutStore.removeTab(tab);
  layoutStore.removeKeepAliveName(tab.name);
  if (isActive(tab)) toLastTab();
};

// 刷新选中的 tab
const refreshSelectedTab = (tab: TabProp) => {
  const refreshCurrentPage = inject("refresh") as Function;
  layoutStore.removeTab(tab);
  layoutStore.removeKeepAliveName(tab.name);
  refreshCurrentPage(false);
  nextTick(() => {
    layoutStore.addKeepAliveName(tab.name);
    refreshCurrentPage(true);
  });
};

// 关闭除当前选中 tab 的其他 tab
const closeOthersTabs = () => {
  layoutStore.removeOtherTabs(selectedTab);
  if (route.path !== selectedTab.path) {
    router.push(selectedTab.path).catch(err => console.warn(err));
  }
};

// 关闭除固定在 tabsNav 的所有其他 tabs
const closeAllTabs = () => {
  layoutStore.removeAllTabs();
  layoutStore.setKeepAliveName();
  toLastTab();
};

// 跳转到上一个 tab
const toLastTab = () => {
  // 获取最后一个 tab 数据
  const lastTab = layoutStore.tabNavList.slice(-1)[0];
  const path = lastTab ? lastTab.path : permissionStore.homeRoute.meta._fullPath;
  router.push(path).catch(err => console.warn(err));
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
  }
);

// 关闭右键菜单
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
</style>
