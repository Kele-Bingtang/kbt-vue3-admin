<template>
  <el-container class="layout-container" :class="{ 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }">
    <el-header class="flx-justify-between">
      <div class="logo flx-center" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span>{{ settings.title }}</span>
      </div>
      <CollapseTrigger />
      <Menu
        :menu-list="parentMenu"
        :active-menu="activeMenu"
        mode="horizontal"
        :is-collapse="false"
        class="mixins-header-menu"
      />
      <HeaderRight />
    </el-header>
    <el-container class="mixins-container">
      <el-aside :class="{ 'not-aside': !childrenMenu.length }">
        <Menu :menu-list="childrenMenu" />
      </el-aside>
      <div class="mixins-main-content">
        <MainContent />
      </div>
    </el-container>
  </el-container>
</template>
<script setup lang="ts" name="LayoutMixins">
import { useSettingsStore } from "@/stores/settings";
import MainContent from "@/layout/components/MainContent/index.vue";
import { usePermissionStore } from "@/stores/permission";
import { useLayout } from "@/hooks/useLayout";
import settings from "@/config/settings";
import Menu from "@/layout/components/Menu/index.vue";
import CollapseTrigger from "@/layout/components/Header/components/CollapseTrigger.vue";
import HeaderRight from "@/layout/components/Header/HeaderRight.vue";
import { HOME_URL } from "@/router/routesConfig";
const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const { getMenuListByRouter } = useLayout();
// 子菜单
const activeMenu = ref("");
const childrenMenu = ref<RouterConfig[]>([]);
const isCollapse = computed(() => settingsStore.isCollapse);
const menuList = computed(() => {
  if (settings.moreRouteChildrenHideInMenuThenOnlyOne) {
    const menu = getMenuListByRouter(permissionStore.loadedRouteList);
    return getMenuListByRouter(menu);
  } else return getMenuListByRouter(permissionStore.loadedRouteList);
});
const parentMenu = computed(() => {
  const parentMenu: RouterConfig[] = [];
  menuList.value.forEach(menuItem => {
    const item = { ...menuItem };
    item.children ? (item.children = []) : "";
    parentMenu.push({ ...item });
  });
  return parentMenu;
});
watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;
    activeMenu.value = `/${route.path.split("/")[1]}` || route.path;
    const item = menuList.value.filter(
      item => route.path === item.path || `/${route.path.split("/")[1]}` === item.path
    );
    if (item[0].children?.length) return (childrenMenu.value = item[0].children);
    childrenMenu.value = [];
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss" scoped>
@import "./index-scoped.scss";
</style>
<style lang="scss">
@import "./index-unlimited.scss";
</style>
