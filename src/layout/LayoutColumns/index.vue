<template>
  <el-container class="layout-container" :class="{ 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }">
    <div class="aside-split">
      <div class="logo flx-center" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div
            class="split-item flx-center"
            :class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
            v-for="item in menuList"
            :key="item.path"
            @click="changeMenuItem(item)"
          >
            <CommonIcon v-if="item.meta.icon" :icon="item.meta.icon" />
            <div class="flx-center" style="width: 100%">
              <Tooltip :effect="settings.tooltipEffect">
                <span class="title">{{ item.meta.title }}</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside :class="{ 'not-aside': !menuItem.length }">
      <div class="logo flx-center">
        <span v-show="menuItem.length">{{ isCollapse ? "K" : settings.title }}</span>
      </div>
      <el-scrollbar>
        <Menu :menu-list="menuItem" />
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

<script setup lang="ts" name="LayoutVertical">
import { useSettingsStore } from "@/stores/settings";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import { usePermissionStore } from "@/stores/permission";
import { useLayout } from "@/hooks/useLayout";
import settings from "@/config/settings";
import CommonIcon from "@/layout/components/CommonIcon/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import Tooltip from "@/components/Tooltip/index.vue";
import { HOME_URL } from "@/router/routesConfig";

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
  if (settings.moreRouteChildrenHideInMenuThenOnlyOne) {
    const menu = getMenuListByRouter(permissionStore.loadedRouteList);
    return getMenuListByRouter(menu);
  } else return getMenuListByRouter(permissionStore.loadedRouteList);
});

watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;
    splitActive.value = route.path;
    const item = menuList.value.filter(
      item => route.path === item.path || `/${route.path.split("/")[1]}` === item.path
    );
    if (item[0].children?.length) return (menuItem.value = item[0].children);
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

<style lang="scss" scoped>
@import "./index-scoped.scss";
</style>

<style lang="scss">
@import "./index-unlimited.scss";
</style>
