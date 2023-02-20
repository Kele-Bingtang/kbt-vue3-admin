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
            <CommonIcon v-if="tab.meta.icon && settingsStore.showTabsNavIcon" :icon="tab.meta.icon" class="tab-icon" />
            <span @contextmenu.prevent.native="openRightMenu(tab, $event)">{{ tab.title }}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <MoreButton /> -->
    </div>
    <!-- <ul v-show="rightMenuVisible" :style="{ left: rightMenuLeft + 'px', top: rightMenuTop + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTab(selectedTab)">{{ $t("_tabsNav.refresh") }}</li>
      <li v-if="selectedTab.close" @click="handleCloseTab(selectedTab)">{{ $t("_tabsNav.close") }}</li>
      <li @click="closeOthersTabs">{{ $t("_tabsNav.closeOthers") }}</li>
      <li @click="closeAllTabs()">{{ $t("_tabsNav.closeAll") }}</li>
    </ul> -->
  </div>
</template>

<script setup lang="ts" name="ElTabsNav">
import { useLayout } from "@/hooks/useLayout";
import beforeClose from "@/router/before-close";
import type { TabProp } from "@/stores";
import { useLayoutStore } from "@/stores/layout";
import { usePermissionStore } from "@/stores/permission";
import { useSettingsStore } from "@/stores/settings";
import type { TabPaneName, TabsPaneContext } from "element-plus";
import Sortable from "sortablejs";

const route = useRoute();
const router = useRouter();
const layoutStore = useLayoutStore();
const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();
const { getTitle } = useLayout();

const tabsNavValue = ref(route.fullPath);
const tabNavList = computed(() => layoutStore.tabNavList);

const tabsNavDom = ref<HTMLElement>(); // 根标签
const rightMenuVisible = ref(false); // 右键菜单显示
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

onMounted(() => {
  tabsDrop();
  initTabs();
  addOneTab();
});

// 标签拖拽排序
const tabsDrop = () => {
  Sortable.create(document.querySelector(".el-tabs__nav") as HTMLElement, {
    draggable: ".el-tabs__item",
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
  }
};

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

const isActive = (tab: TabProp) => {
  return route.fullPath === tab.path || route.fullPath === tab.path + "/";
};

const toLastTab = () => {
  // 获取最后一个 tab 数据
  const lastTab = layoutStore.tabNavList.slice(-1)[0];
  const path = lastTab ? lastTab.path : permissionStore.homeRoute.meta._fullPath;
  router.push(path).catch(err => console.warn(err));
};

// 删除一个 Tab
const tabRemove = async (fullPath: TabPaneName) => {
  const tab = tabNavList.value.filter(item => item.path == fullPath)[0];
  if (tab.meta && tab.meta.beforeCloseName && tab.meta.beforeCloseName in beforeClose) {
    const isClose = await new Promise(beforeClose[tab.meta.beforeCloseName]);
    if (isClose) closeSelectedTab(tab);
  } else closeSelectedTab(tab);
  if (isActive(tab)) toLastTab();
};

const closeSelectedTab = (tab: TabProp) => {
  layoutStore.removeTab(tab);
  layoutStore.removeKeepAliveName(tab.name);
};

const openRightMenu = (tab: TabProp, e: MouseEvent) => {
  console.log("asd");
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
</style>
