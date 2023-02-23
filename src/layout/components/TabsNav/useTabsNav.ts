import { useLayout } from "@/hooks/useLayout";
import beforeClose from "@/router/before-close";
import type { TabProp } from "@/stores";
import { useLayoutStore } from "@/stores/layout";
import { usePermissionStore } from "@/stores/permission";
import Sortable from "sortablejs";

export const useTabsNav = () => {
  const route = useRoute();
  const router = useRouter();
  const layoutStore = useLayoutStore();
  const permissionStore = usePermissionStore();
  const { getTitle } = useLayout();
  const refreshCurrentPage = inject("refresh") as Function;

  const rightMenuVisible = ref(false); // 右键菜单显示
  // 激活的 tab
  const selectedTab = ref<TabProp>({
    path: "", // 路由的 path
    name: "", // 路由的 name
    title: "", // 展示的描述
    icon: "", // 图标
    close: true, // 是否允许关闭
    meta: {},
  });

  const tabNavList = computed(() => layoutStore.tabNavList);

  const isActive = (tab: TabProp) => {
    return route.fullPath === tab.path || route.fullPath === tab.path + "/";
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
      path: (route as RouteConfig).fullPath || route.meta._fullPath,
      name: (route.name as string) || route.path,
      title: getTitle(route),
      icon: route.meta.icon || "",
      close: !route.meta.isAffix,
      meta: route.meta,
    };
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
      const tab: TabProp = getOneTab(route as RouteConfig);
      layoutStore.addTab(tab);
      route.meta.isKeepAlive && layoutStore.addKeepAliveName(route.name as string);
    }
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
    layoutStore.removeKeepAliveName(tab.name);
    refreshCurrentPage(false);
    nextTick(() => {
      layoutStore.addKeepAliveName(tab.name);
      refreshCurrentPage(true);
    });
  };

  // 关闭除当前选中 tab 的其他 tab
  const closeOthersTabs = () => {
    layoutStore.removeOtherTabs(selectedTab.value);
    if (route.meta.isKeepAlive) layoutStore.setKeepAliveName([route.name] as string[]);
    if (route.path !== selectedTab.value.path) {
      router.push(selectedTab.value.path).catch(err => console.warn(err));
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

  // 关闭右侧菜单
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

  return {
    tabNavList,
    selectedTab,
    rightMenuVisible,

    tabsDrop,
    initTabs,
    addOneTab,
    handleCloseTab,
    closeSelectedTab,
    refreshSelectedTab,
    closeOthersTabs,
    closeAllTabs,
  };
};
