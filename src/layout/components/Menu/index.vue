<script setup lang="ts" name="Menu">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ElScrollbar, ElMenu } from "element-plus";
import SystemConfig from "@/config";
import { useLayout } from "@/composables";
import { usePermissionStore, useSettingsStore } from "@/stores";
import MenuItem from "./MenuItem.vue";

interface MenuProps {
  menuList?: RouterConfig[];
  activeMenu?: string;
  isCollapse?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  menuList: () => [],
  activeMenu: "",
  isCollapse: undefined,
});

const route = useRoute();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const { getMenuListByRouter } = useLayout();

const activeMenu = computed(() =>
  props.activeMenu ? props.activeMenu : ((route.meta.activeMenu || route.meta._fullPath || route.path) as string)
);
const isCollapse = computed(() => (props.isCollapse === undefined ? settingsStore.isCollapse : props.isCollapse));

const menuList = computed(() => {
  if (props.menuList?.length) return props.menuList;
  /**
   * 第一次是将 hideInMenu 和 Children 为 1 的过滤掉，第二次是将最终 Children 为 1 的过滤掉（可能第一次 Children 有多个，只有一个 hideInMenu 不为 true）
   *
   * 场景：alwaysShowRoot 为 false
   *    如果一个路由有一个子路由，那么菜单只渲染出该子路由
   *    如果一个路由有两个子路由，其中一个子路由为 hideInMenu 为 true，那么菜单只渲染出另一个子路由
   * 如果一个路由有两个子路由，且都不是 hideInMenu，那么两个子路由为二级菜单
   *
   * 如果您确保您的路由不会出现：多个子路由且只有一个 hideInMenu 不为 true，可以只过滤一次提升性能，即直接 return this.getMenuListByRouter(PermissionModule.loadedRouteList);
   */
  if (SystemConfig.layoutConfig.moreRouteChildrenHideInMenuThenOnlyOne) {
    const menu = getMenuListByRouter(permissionStore.loadedRouteList);
    return getMenuListByRouter(menu);
  } else {
    return getMenuListByRouter(permissionStore.loadedRouteList);
  }
});
</script>

<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="settingsStore.menuAccordion"
      :collapse-transition="false"
      v-bind="{ ...$attrs, class: undefined }"
    >
      <MenuItem v-for="menu in menuList" :key="menu.path" :menu-item="menu" />
    </el-menu>
  </el-scrollbar>
</template>
