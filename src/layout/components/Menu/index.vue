<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="var(--menu-bg-color)"
      text-color="var(--menu-text-color)"
      :active-text-color="primaryTheme"
      unique-opened
      :collapse-transition="false"
      :mode="props.mode"
    >
      <MenuItem v-for="menu in menuList" :key="menu.path" :menu-item="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts" name="Menu">
import { useLayout } from "@/hooks/useLayout";
import { usePermissionStore } from "@/stores/permission";
import { useSettingsStore } from "@/stores/settings";
import settings from "@/config/settings";
import MenuItem from "@/layout/components/Menu/MenuItem.vue";

interface MenuProps {
  menuList?: RouterConfig[];
  activeMenu?: string;
  mode?: "vertical" | "horizontal";
  isCollapse?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  mode: "vertical",
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
const primaryTheme = computed(() => settingsStore.primaryTheme);

const menuList = computed(() => {
  if (props.menuList) return props.menuList;
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
  if (settings.moreRouteChildrenHideInMenuThenOnlyOne) {
    const menu = getMenuListByRouter(permissionStore.loadedRouteList);
    return getMenuListByRouter(menu);
  } else {
    return getMenuListByRouter(permissionStore.loadedRouteList);
  }
});
</script>

<style lang="scss" scoped></style>
