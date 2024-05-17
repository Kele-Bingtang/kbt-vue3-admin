<template>
  <el-container :class="[prefixClass, { mobile: isMobile, 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }]">
    <el-aside>
      <div :class="`${prefixClass}__logo flx-center`" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ settings.title }}</span>
      </div>
      <Menu />
    </el-aside>
    <div v-if="isMobile && !isCollapse" :class="`${prefixClass}__drawer-bg`" @click="handleClickOutSide" />
    <el-container>
      <el-header class="flx-justify-between">
        <Header />
      </el-header>
      <MainContent />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="LayoutVertical">
import { computed, watch, onMounted, onBeforeMount, onBeforeUnmount, unref } from "vue";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useLayout } from "@/hooks";
import { useLayoutStore, useSettingsStore, DeviceType } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import { HOME_URL } from "@/router/routesConfig";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();
const { resizeHandler } = useLayout();

const isCollapse = computed(() => settingsStore.isCollapse);
const device = computed(() => layoutStore.device);
const isMobile = computed(() => device.value === DeviceType.Mobile);

// 监听路由的变化，判断是移动端还是桌面端
watch(
  () => route.fullPath,
  () => {
    if (device.value === DeviceType.Mobile && !unref(isCollapse)) {
      settingsStore.closeSideMenu();
    }
  }
);

onMounted(() => {
  resizeHandler();
});

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
@import "./index-scoped";
</style>

<style lang="scss">
@import "./index-unlimited";
</style>
