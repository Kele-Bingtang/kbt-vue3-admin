<script setup lang="ts" name="LayoutVertical">
import { computed, watch, ref, unref } from "vue";
import { ElContainer, ElAside, ElHeader, ElScrollbar } from "element-plus";
import { useSettingsStore, usePermissionStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import { useLayout } from "@/composables";
import SystemConfig from "@/config";
import Menu from "@/layout/components/Menu/index.vue";
import { Tooltip } from "@/components";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";
import { useRoute, useRouter } from "vue-router";

const ns = useNamespace("columns-layout");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const { getMenuListByRouter } = useLayout();

// 子菜单
const menuItem = ref<RouterConfig[]>([]);
const splitActive = ref<string>(""); // 菜单是否激活

const isCollapse = computed(() => settingsStore.isCollapse);

const menuList = computed(() => {
  if (SystemConfig.layoutConfig.moreRouteChildrenHideInMenuThenOnlyOne) {
    const menu = getMenuListByRouter(permissionStore.loadedRouteList);
    return getMenuListByRouter(menu);
  } else return getMenuListByRouter(permissionStore.loadedRouteList);
});

watch(
  route,
  () => {
    // 当前菜单没有数据直接 return
    if (!unref(menuList).length) return;
    splitActive.value = route.path;
    const item = unref(menuList).filter(
      item => route.path === item.path || `/${route.path.split("/")[1]}` === item.path
    );

    if (item[0] && item[0].children?.length) return (menuItem.value = item[0].children);
    menuItem.value = [];
  },
  {
    deep: true,
    immediate: true,
  }
);

const changeMenuItem = (item: RouterConfig) => {
  splitActive.value = item.path;
  if (item.children?.length) return (menuItem.value = item.children);
  menuItem.value = [];
  router.push(item.path);
};
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <div :class="[ns.e('aside'), 'flx-column']">
      <div :class="[ns.e('logo'), ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
      </div>

      <el-scrollbar>
        <ul :class="ns.e('aside__list')">
          <li
            :class="[
              ns.e('aside__list-item'),
              ns.is('active', splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path),
              'flx-center',
            ]"
            v-for="item in menuList"
            :key="item.path"
            @click="changeMenuItem(item)"
          >
            <Icon v-if="item.meta?.icon" :icon="item.meta.icon" />
            <div class="flx-center" style="width: 100%">
              <Tooltip :effect="SystemConfig.layoutConfig.tooltipEffect">
                <span class="title">{{ item.meta?.title }}</span>
              </Tooltip>
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </div>

    <el-aside :class="['flx-column', { 'not-aside': !menuItem.length }]">
      <div :class="[ns.e('logo'), ns.join('layout-logo'), 'flx-center']">
        <span v-show="menuItem.length">{{ isCollapse ? "K" : SystemConfig.themeConfig.title }}</span>
      </div>

      <el-scrollbar v-if="menuItem?.length">
        <Menu
          :menu-list="menuItem"
          :class="[ns.b('menu'), ns.join('layout-menu')]"
          :popper-class="`${ns.b('menu-popper')} ${ns.join('layout-menu-popper')}`"
        />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="flx-justify-between">
        <Header />
      </el-header>
      <MainContent />
    </el-container>
  </el-container>
</template>

<style lang="scss">
@use "./index";
@use "../base-layout";
</style>
