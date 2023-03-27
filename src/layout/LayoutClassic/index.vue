<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container
    class="layout-container"
    :class="{ mobile: isMobile(), 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }"
  >
    <el-header class="flx-justify-between">
      <Header>
        <template #left>
          <div class="header-left">
            <div class="logo flx-center" @click="router.push(HOME_URL)">
              <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
              <span>{{ settings.title }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>
    <div v-if="isMobile() && !isCollapse" class="drawer-bg" @click="handleClickOutSide" />
    <el-container class="classic-container">
      <el-aside>
        <Menu />
      </el-aside>
      <div class="classic-main-content">
        <MainContent />
      </div>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="LayoutVertical">
import { useLayout } from "@/hooks/useLayout";
import { DeviceType } from "@/stores/index.d";
import { useLayoutStore } from "@/stores/layout";
import { useSettingsStore } from "@/stores/settings";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import HeaderLeft from "@/layout/components/Header/HeaderLeft.vue";
import { HOME_URL } from "@/router/routesConfig";

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();
const { resizeHandler, isMobile } = useLayout();

const isCollapse = computed(() => settingsStore.isCollapse);
const device = computed(() => layoutStore.device);

// 监听路由的变化
watch(
  () => route.fullPath,
  () => {
    if (device.value === DeviceType.Mobile && !isCollapse.value) {
      settingsStore.closeSideMenu();
    }
  }
);

onBeforeMount(() => {
  window.addEventListener("resize", resizeHandler);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandler);
});

const handleClickOutSide = () => {
  settingsStore.closeSideMenu();
};
</script>

<style lang="scss" scoped>
@import "./index-scoped.scss";
</style>

<style lang="scss">
@import "./index-unlimited.scss";
</style>
