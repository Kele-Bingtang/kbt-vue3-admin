<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container
    class="layout-container"
    :class="{ mobile: isMobile(), 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }"
  >
    <el-aside>
      <div class="logo flx-center">
        <img src="@/assets/img/logo.png" alt="logo" />
        <span v-show="!isCollapse">{{ settings.title }}</span>
      </div>
      <Menu />
    </el-aside>
    <div v-if="isMobile() && !isCollapse" class="drawer-bg" @click="handleClickOutSide" />
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <MainContent />
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

const route = useRoute();
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
@import "./index.scss";
</style>

<style lang="scss">
.vertical {
  .el-menu,
  .el-menu--popup {
    .el-menu-item {
      &.is-active {
        background: var(--vertical-menu-active-bg-color);
        &::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 4px;
          content: "";
          background: var(--el-color-primary);
        }
      }
      &:hover {
        background: var(--vertical-menu-hover-bg-color);
      }
      &:not(.is-active) {
        .el-icon,
        .svg-icon {
          color: var(--vertical-icon-color);
        }
      }
    }
    // 二级菜单
    .el-sub-menu:not(.is-active) {
      .el-icon,
      .svg-icon {
        color: var(--vertical-icon-color);
      }
    }
  }
  // 菜单折叠的样式
  .el-popper {
    .el-menu,
    .el-menu--popup {
      background: var(--vertical-sub-menu-bg-color);
      .el-menu-item {
        &.is-active {
          background: var(--vertical-sub-menu-active-bg-color);
        }
        &:hover {
          background: var(--vertical-sub-menu-hover-bg-color);
        }
      }
    }
  }
}
</style>
