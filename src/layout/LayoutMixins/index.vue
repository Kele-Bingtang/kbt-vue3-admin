<script setup lang="ts" name="LayoutMixins">
import { computed, watch, ref } from "vue";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useSettingsStore, usePermissionStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import { useLayout, useRoutes } from "@/composables";
import SystemConfig from "@/config";
import CollapseTrigger from "@/layout/components/Header/components/CollapseTrigger.vue";
import Menu from "@/layout/components/Menu/index.vue";
import HeaderRight from "@/layout/components/Header/HeaderRight.vue";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";
import { useRoute, useRouter } from "vue-router";

const ns = useNamespace("mixins-layout");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const { getMenuListByRouter } = useLayout();
const { findParentRoutesByPath } = useRoutes();

// 子菜单
const activeMenu = ref("");
const childrenMenu = ref<RouterConfig[]>([]);

const isCollapse = computed(() => settingsStore.isCollapse);
const menuList = ref<RouterConfig[]>([]);

const headerMenu = computed(() => {
  const parentMenu: RouterConfig[] = [];

  menuList.value.forEach(menuItem => {
    const item = { ...menuItem };
    if (item.children) item.children = [];

    parentMenu.push({ ...item });
  });

  return parentMenu;
});

const initMenuList = () => {
  if (SystemConfig.layoutConfig.moreRouteChildrenHideInMenuThenOnlyOne) {
    const menu = getMenuListByRouter(permissionStore.loadedRouteList);
    return getMenuListByRouter(menu);
  }
  return getMenuListByRouter(permissionStore.loadedRouteList);
};

onMounted(() => {
  menuList.value = initMenuList();
});

watch(
  () => route.path,
  async () => {
    await nextTick();
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;

    const item = menuList.value.filter(
      item =>
        [route.path, `/${route.path.split("/")[1]}`].includes(item.path) ||
        route.path === item.redirect ||
        findParentRoutesByPath(route.path, permissionStore.loadedRouteList, "path")[0] === item.path ||
        findParentRoutesByPath(`/${route.path.split("/")[1]}`, permissionStore.loadedRouteList, "path")[0] === item.path
    );

    activeMenu.value = item[0]?.path || "";

    if (item[0]?.children?.length) childrenMenu.value = item[0].children;
    else {
      childrenMenu.value = [];
      // 关闭菜单栏折叠功能
      settingsStore.$patch({ isCollapse: false });
    }
  },
  { immediate: true }
);
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <el-header class="flx-justify-between">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ SystemConfig.themeConfig.title }}</span>
      </div>

      <CollapseTrigger :class="{ 'has-trigger': !childrenMenu.length }" />

      <Menu
        :menu-list="headerMenu"
        :active-menu="activeMenu"
        mode="horizontal"
        :is-collapse="false"
        :class="[ns.e('header-menu'), ns.join('layout-menu')]"
        :popper-class="`${ns.b('menu-popper')} ${ns.join('layout-menu-popper')}`"
      />

      <HeaderRight />
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside v-if="childrenMenu.length">
        <Menu
          :menu-list="childrenMenu"
          :class="[ns.e('aside-menu'), ns.join('layout-menu')]"
          :popper-class="`${ns.b('menu-popper')} ${ns.join('layout-menu-popper')}`"
        />
      </el-aside>

      <MainContent />
    </el-container>
  </el-container>
</template>

<style lang="scss">
@use "./index";
@use "../base-layout";
</style>
