import { useLayout } from "@/hooks/useLayout";
import beforeClose from "@/router/beforeClose";
import type { TabProp } from "@/stores";
import { useLayoutStore } from "@/stores/layout";
import { usePermissionStore } from "@/stores/permission";
import { getUrlParams } from "@/utils";
import Sortable from "sortablejs";
import type { RefreshFunction } from "../MainContent/index.vue";
import settings from "@/config/settings";
import { HOME_URL } from "@/router/routesConfig";
import { useBoolean } from "@/hooks/useBoolean";

type ContextMenu = "refresh" | "current" | "left" | "right" | "other" | "all";

export interface ContextMenuCondition {
  refresh: boolean;
  current: boolean;
  left: boolean;
  right: boolean;
  other: boolean;
  all: boolean;
}

export const useTabsNav = () => {
  const route = useRoute();
  const router = useRouter();
  const layoutStore = useLayoutStore();
  const permissionStore = usePermissionStore();
  const { getTitle } = useLayout();
  const refreshCurrentPage = inject("refresh") as RefreshFunction;

  const { bool: rightMenuVisible, setFalse } = useBoolean(); // 右键菜单显示

  // 激活的 tab
  const selectedTab = ref<TabProp>({
    path: "", // 路由的 path
    name: "", // 路由的 name
    title: "", // 展示的描述
    icon: "", // 图标
    close: true, // 是否允许关闭
    meta: {},
  });
  const contextMenuCondition = reactive<ContextMenuCondition>({
    refresh: false, // 刷新当前标签页
    current: false, // 关闭当前标签页
    left: false, // 关闭当左侧标签页
    right: false, // 关闭右侧标签页
    other: false, // 关闭其他标签页
    all: false, // 关闭全部标签页
  });

  // 右键菜单位置
  const rightMenuLeft = ref(0);
  const rightMenuTop = ref(0);

  const tabNavList = computed(() => layoutStore.tabNavList);

  const isActive = (tab: TabProp) => {
    const fullPath = resolveFullPath(route);
    return fullPath === tab.path || fullPath === tab.path + "/";
  };
  // 标签拖拽排序
  const tabsDrop = (className: string, draggable: string) => {
    Sortable.create(document.querySelector(className) as HTMLElement, {
      draggable: draggable,
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

  // 判断当前激活的 tab
  const getOneTab = (route: RouteConfig | RouterConfig) => {
    return {
      path: resolveFullPath(route as RouteConfig),
      name: (route.name as string) || route.path,
      title: getTitle(route),
      icon: route.meta.icon || "",
      close: !route.meta.isAffix,
      meta: route.meta,
    };
  };

  // 判断 tab 的地址，因为携带不同的参数可以引起多个重复的标签，这里可以设置当同一个 path 携带参数不一样，只渲染一个 tab，原理就是去掉 ? 后面的参数
  const resolveFullPath = (r: RouteConfig) => {
    if (r.path !== route.path || r.path === HOME_URL) return r.meta._fullPath;
    const url = window.location.href;
    const urlKey = Object.keys(getUrlParams(url));
    // 存在 ? 才进入判断
    const index = url.indexOf("?");
    if (index !== -1) {
      if (urlKey.length) {
        // 如果存在 key=value，则判断是否完全匹配 key
        for (const item of urlKey) if (settings.tabActiveExcludes.includes(item)) return r.meta._fullPath;
      } else {
        // 如果不存在 key=value ，则模糊匹配 ? 后的参数
        for (const item of settings.tabActiveExcludes) if (url.slice(index).includes(item)) return r.meta._fullPath;
      }
    }
    return r.fullPath || r.meta._fullPath;
  };
  // 初始化固定在标签栏的 tabs
  const initTabs = () => {
    permissionStore.flatRouteList.forEach(item => {
      if (item.meta.isAffix && !item.meta.isFull) {
        const tabParam = getOneTab(item);
        layoutStore.addTab(tabParam);
        item.meta.isKeepAlive && layoutStore.addKeepAliveName(item.name as string);
      }
    });
  };
  // 添加一个 tab
  const addOneTab = () => {
    if (route.name) {
      const tab: TabProp = getOneTab(route);
      layoutStore.addTab(tab);
      route.meta.isKeepAlive && layoutStore.addKeepAliveName(route.name as string);
    }
  };

  const initContextMenu = (tab: TabProp) => {
    const t = tabNavList.value;
    const tabLength = t.length;
    const currentIndex = t.findIndex(t => t.path === tab.path);
    // 如果选择的是固定在标签栏的标签
    if (!tab.close && currentIndex > 0) {
      // 如果左右都是固定的或者最后一个标签，则只显示刷新
      if (tabLength - 1 === currentIndex || (!t[currentIndex - 1].close && !t[currentIndex + 1].close)) {
        multiMenuChange(["current", "left", "right", "other", "all"], false);
      } else {
        multiMenuChange(["current", "left"], false);
        multiMenuChange(["refresh", "right", "other", "all"], true);
      }
    } else {
      // 不是固定的标签
      if (currentIndex === 0) {
        // 如果是第一个标签页，且只有一个标签页
        multiMenuChange(["current", "left", "right", "other", "all"], false);
      } else if (currentIndex === 1 && tabLength === 2) {
        // 左侧的菜单是首页，右侧不存在别的菜单
        multiMenuChange(["left", "right", "other"], false);
        multiMenuChange(["current", "all"], true);
      } else if (currentIndex === 1 && tabLength !== 2) {
        // 左侧的菜单是首页，右侧存在别的菜单
        contextMenuCondition.left = false;
        multiMenuChange(["refresh", "current", "right", "other", "all"], true);
      } else if (tabLength - 1 === currentIndex && currentIndex !== 0) {
        // 当前 tab 是所有 tab 中的最后一个
        contextMenuCondition.right = false;
        multiMenuChange(["refresh", "current", "left", "other", "all"], true);
      } else multiMenuChange(["refresh", "current", "left", "right", "other", "all"], true);
    }
    // 如果没有选择当前的标签，则不允许刷新
    if (tab.path !== route.fullPath && currentIndex !== 0) {
      contextMenuCondition.refresh = false;
    } else {
      contextMenuCondition.refresh = true;
    }
  };

  const multiMenuChange = (menuList: Partial<ContextMenu>[], status: boolean) => {
    menuList.forEach(menu => {
      contextMenuCondition[menu] = status;
    });
  };

  // 打开右键菜单，并初始化菜单布局、内容
  const openRightMenu = (e: MouseEvent, tab: TabProp, tabsNavRef?: HTMLElement) => {
    initContextMenu(tab);
    const menuMinWidth = 0;
    const offsetLeft = tabsNavRef?.getBoundingClientRect().left as number; // margin-left 的数值
    const offsetWidth = tabsNavRef?.offsetWidth as number; //  width 数值
    const maxLeft = offsetWidth - menuMinWidth;
    const left = e.clientX - offsetLeft + 14;
    if (left > maxLeft) rightMenuLeft.value = maxLeft;
    else rightMenuLeft.value = left;
    rightMenuTop.value = e.offsetY + 12;
    rightMenuVisible.value = true;
    selectedTab.value = tab;
  };

  // 关闭一个 tab，并激活到上一个 tab
  const closeCurrentTab = async (tab: TabProp) => {
    if (tab.meta && tab.meta.beforeCloseName && tab.meta.beforeCloseName in beforeClose) {
      const isClose = await new Promise(resolve => {
        beforeClose[tab.meta.beforeCloseName as string](resolve, route);
      });
      if (isClose) closeSelectedTab(tab);
    } else closeSelectedTab(tab);
  };

  // 关闭选择的 tab
  const closeSelectedTab = (tab: TabProp) => {
    layoutStore.removeCurrentTab(tab);
    layoutStore.removeKeepAliveName(tab.name);
    if (isActive(tab)) toLastTab();
  };

  // 刷新选中的 tab
  const refreshSelectedTab = (tab: TabProp) => {
    layoutStore.removeKeepAliveName(tab.name);
    refreshCurrentPage(false);
    nextTick(() => {
      layoutStore.addKeepAliveName(tab.name);
      refreshCurrentPage(true);
    });
  };

  const closeLeftTab = async (tab: TabProp) => {
    layoutStore.removeLeftTab(tab);
  };

  const closeRightTab = async (tab: TabProp) => {
    layoutStore.removeRightTab(tab);
    if (route.path !== tab.path) {
      router.push(tab.path).catch(err => console.warn(err));
    }
  };

  // 关闭除当前选中 tab 的其他 tab
  const closeOthersTabs = (tab: TabProp) => {
    layoutStore.removeOtherTabs(tab);
    if (route.meta.isKeepAlive) layoutStore.setKeepAliveName([route.name] as string[]);
    if (route.path !== tab.path) {
      router.push(tab.path).catch(err => console.warn(err));
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

  watchEffect(() => {
    // 关闭右侧菜单
    if (rightMenuVisible.value) {
      document.body.addEventListener("click", setFalse);
    } else {
      document.body.removeEventListener("click", setFalse);
    }
  });

  return {
    tabNavList,
    selectedTab,
    rightMenuVisible,
    contextMenuCondition,
    rightMenuLeft,
    rightMenuTop,

    isActive,
    tabsDrop,
    initTabs,
    getOneTab,
    addOneTab,
    resolveFullPath,
    openRightMenu,
    initContextMenu,
    closeCurrentTab,
    closeSelectedTab,
    closeLeftTab,
    closeRightTab,
    refreshSelectedTab,
    closeOthersTabs,
    closeAllTabs,
  };
};
