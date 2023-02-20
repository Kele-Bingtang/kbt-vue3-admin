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
          :to="{ path: tab.path }"
          :class="isActive(tab) ? 'active' : ''"
          :style="activeStyle(tab)"
          class="tabs-link"
          ref="tabsDom"
          @contextmenu.prevent.native="openRightMenu(tab, $event)"
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
  meta: {},
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

const getOneTab = (route: RouteConfig | RouterConfig) => {
  return {
    path: route.meta._fullPath,
    name: (route.name as string) || route.path,
    title: getTitle(route),
    icon: route.meta.icon || "",
    close: !route.meta.isAffix,
    meta: route.meta,
  };
};

const closeRightMenu = () => {
  rightMenuVisible.value = false;
};

const isActive = (tab: TabProp) => {
  return route.fullPath === tab.path || route.fullPath === tab.path + "/";
};

const activeStyle = (tab: TabProp) => {
  if (!isActive(tab)) return {};
  return {
    "background-color": settingsStore.theme,
    "border-color": settingsStore.theme,
  };
};

const initTabs = () => {
  permissionStore.flatRouteList.forEach(item => {
    if (item.meta.isAffix && !item.meta.isFull) {
      const tabParam = getOneTab(item);
      layoutStore.addTab(tabParam);
      item.meta.isKeepAlive && layoutStore.addKeepAliveName(item.name as string);
    }
  });
};

const addOneTab = () => {
  if (route.name) {
    let tab: TabProp = getOneTab(route as RouteConfig);
    layoutStore.addTab(tab);
    route.meta.isKeepAlive && layoutStore.addKeepAliveName(route.name as string);
    findTargetTab();
  }
};

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

const moveToTargetTab = (tabElement: HTMLElement) => {
  const outerWidth = scrollContainerDom.value?.offsetWidth as number;
  const bodyWidth = scrollBodyDom.value?.offsetWidth as number;
  const outerPadding = 4;
  if (bodyWidth < outerWidth) tabBodyLeft.value = 0;
  else if (tabElement.offsetLeft < -tabBodyLeft.value)
    tabBodyLeft.value = -tabElement.offsetLeft + outerPadding; // 标签在可视区域左侧
  else if (
    tabElement.offsetLeft > -tabBodyLeft.value &&
    tabElement.offsetLeft + tabElement.offsetWidth < -tabBodyLeft.value + outerWidth
  )
    tabBodyLeft.value = Math.min(0, outerWidth - tabElement.offsetWidth - tabElement.offsetLeft - outerPadding);
  // 标签在可视区域
  // 标签在可视区域右侧
  else tabBodyLeft.value = -(tabElement.offsetLeft - (outerWidth - outerPadding - tabElement.offsetWidth));
};

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

const handleCloseTab = async (tab: TabProp) => {
  if (tab.meta && tab.meta.beforeCloseName && tab.meta.beforeCloseName in beforeClose) {
    const isClose = await new Promise(beforeClose[tab.meta.beforeCloseName]);
    if (isClose) closeSelectedTab(tab);
  } else closeSelectedTab(tab);
};

const closeSelectedTab = (tab: TabProp) => {
  layoutStore.removeTab(tab);
  layoutStore.removeKeepAliveName(tab.name);
  if (isActive(tab)) toLastTab();
};

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

const closeOthersTabs = () => {
  layoutStore.removeOtherTabs(selectedTab);
  if (route.path !== selectedTab.path) {
    router.push(selectedTab.path).catch(err => console.warn(err));
  }
};

const closeAllTabs = () => {
  layoutStore.removeAllTabs();
  layoutStore.setKeepAliveName();
  toLastTab();
};

const toLastTab = () => {
  // 获取最后一个 tab 数据
  const lastTab = layoutStore.tabNavList.slice(-1)[0];
  const path = lastTab ? lastTab.path : permissionStore.homeRoute.meta._fullPath;
  router.push(path).catch(err => console.warn(err));
};

const handleScrollOnDom = (e: MouseEvent & { wheelDelta: number }) => {
  const type = e.type;
  let delta = 0;
  if (type === "DOMMouseScroll" || type === "mousewheel") {
    delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
  }
  handleScroll(delta);
};

const handleScroll = (offset: number) => {
  const outerWidth = scrollContainerDom.value?.offsetWidth as number;
  const bodyWidth = scrollBodyDom.value?.offsetWidth as number;
  if (offset > 0) tabBodyLeft.value = Math.min(0, tabBodyLeft.value + offset);
  else if (outerWidth < bodyWidth) {
    if (tabBodyLeft.value >= -(bodyWidth - outerWidth))
      tabBodyLeft.value = Math.max(tabBodyLeft.value + offset, outerWidth - bodyWidth);
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

watchEffect(() => {
  if (rightMenuVisible.value) {
    document.body.addEventListener("click", closeRightMenu);
  } else {
    document.body.removeEventListener("click", closeRightMenu);
  }
});
</script>

<style lang="scss" scoped>
.tabs-nav {
  width: 100%;
  height: 38px;
  position: relative;
  line-height: 31px;
  padding: 1px 4px 0;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  white-space: nowrap;
  -webkit-transition: left 0.3s ease;
  transition: left 0.3s ease;
  .scroll-container {
    position: absolute;
    left: 28px;
    right: 28px;
    top: 0;
    bottom: 0;
    .scroll-body {
      display: inline-block;
      padding: 1px 4px 0;
      overflow: visible;
      white-space: nowrap;
      -webkit-transition: left 0.3s ease;
      transition: left 0.3s ease;
      position: absolute;
      .tabs-link {
        height: 28px;
        line-height: 27px;
        border: 1px solid #e8eaec;
        padding: 0 10px;
        margin: 2px 4px 2px 0;
        cursor: pointer;
        font-size: 12px;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        border-radius: 3px;
        &.active {
          background-color: #4c9bd8;
          color: #fff;
          .dot {
            background-color: #fff;
          }
        }
        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 7px;
          border-radius: 50%;
          background-color: #e8eaec;
          position: relative;
          top: 1px;
          transition: background 0.2s ease;
        }
        .tab-icon {
          font-size: 15px;
          position: relative;
          top: 2px;
          margin-right: 4px;
        }
        .icon-close {
          width: 16px;
          height: 16px;
          display: inline-block;
          margin-left: 10px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-origin: 100% 50%;
          text-align: center;
          vertical-align: 2px;
          padding-right: 1px;
          &:hover {
            background-color: #b4bccc;
            color: #fff;
          }
          svg {
            vertical-align: -3px;
          }
        }
      }
    }
  }
  .btn-icon {
    position: absolute;
    top: 0px;
    height: 100%;
    z-index: 10;
    &.left-btn {
      left: 0px;
    }
    &.right-btn {
      right: 0px;
    }
    .el-button {
      width: 28px;
      height: 100%;
      padding: 6px 4px;
      line-height: 14px;
      text-align: center;
      border-color: #dfe5f3;
      border-top: none;
      border-bottom: none;
      &:hover {
        border-left: 1px solid #cbd3e7;
        border-right: 1px solid #cbd3e7;
      }
      &:active {
        border-color: #a2d0ff !important;
      }
      .el-icon-arrow-left,
      .el-icon-arrow-right {
        font-weight: 600;
      }
    }
  }
  .contextmenu {
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
      margin: 0;
      padding: 0 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
