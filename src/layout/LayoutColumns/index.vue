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

import "./index.scss";

const ns = useNamespace("columns-layout");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const { getMenuListByRouter } = useLayout();

// 子菜单
const menuItem = ref<RouterConfig[]>([]);
// 菜单是否激活
const active = ref<string>("");

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
    active.value = route.path;
    const item = unref(menuList).filter(item => [route.path, `/${route.path.split("/")[1]}`].includes(item.path));

    if (item[0] && item[0].children?.length) return (menuItem.value = item[0].children);
    menuItem.value = [];
  },
  {
    deep: true,
    immediate: true,
  }
);

const changeMenuItem = (item: RouterConfig) => {
  active.value = item.path;
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
              ns.is('active', [active, `/${active.split('/')[1]}`].includes(item.path)),
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

    <el-aside :class="[ns.join('layout-aside'), 'flx-column', { 'not-aside': !menuItem.length }]">
      <div :class="[ns.e('logo'), ns.join('layout-logo'), 'flx-center']">
        <span v-show="menuItem.length">{{ isCollapse ? "K" : SystemConfig.themeConfig.title }}</span>
      </div>

      <el-scrollbar v-if="menuItem?.length">
        <Menu
          :menu-list="menuItem"
          :class="[ns.join('layout-menu'), ns.b('menu')]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
        />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header :class="[ns.join('layout-header'), 'flx-justify-between']">
        <Header />
      </el-header>
      <MainContent />
    </el-container>
  </el-container>
</template>
