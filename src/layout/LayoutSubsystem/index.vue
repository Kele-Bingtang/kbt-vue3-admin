<script setup lang="ts" name="LayoutSubsystem">
import { computed, watch, onMounted, onBeforeMount, onBeforeUnmount, unref } from "vue";
import { ElContainer, ElAside } from "element-plus";
import { useLayout } from "@/composables";
import { useLayoutStore, useSettingsStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import SystemConfig from "@/config";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";
import { useRoute, useRouter } from "vue-router";
import { DeviceEnum } from "@/enums/appEnum";

import "./index.scss";

const ns = useNamespace("subsystem-layout");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const layoutStore = useLayoutStore();
const { resizeHandler } = useLayout();

const isCollapse = computed(() => settingsStore.isCollapse);
const isMobile = computed(() => layoutStore.device === DeviceEnum.Mobile);

// 监听路由的变化，判断是移动端还是桌面端
watch(
  () => route.fullPath,
  () => {
    if (layoutStore.device === DeviceEnum.Mobile && !unref(isCollapse)) {
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

<template>
  <el-container
    :class="[
      ns.join('layout'),
      ns.b(),
      ns.is('collapse', isCollapse),
      ns.is('expand', !isCollapse),
      { mobile: isMobile },
    ]"
  >
    <el-aside :class="[ns.join('layout-aside'), 'flx-column']">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ SystemConfig.themeConfig.title }}</span>
      </div>
      <Menu
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
    </el-aside>

    <div v-if="isMobile && !isCollapse" :class="ns.e('drawer-bg')" @click="handleClickOutSide" />

    <el-container>
      <MainContent />
    </el-container>
  </el-container>
</template>
