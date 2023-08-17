<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container class="layout-container" :class="{ 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }">
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
import { useSettingsStore } from "@/stores/settings";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import HeaderLeft from "@/layout/components/Header/HeaderLeft.vue";
import { HOME_URL } from "@/router/routesConfig";

const router = useRouter();
const settingsStore = useSettingsStore();

const isCollapse = computed(() => settingsStore.isCollapse);
</script>

<style lang="scss" scoped>
@import "./index-scoped";
</style>

<style lang="scss">
@import "./index-unlimited";
</style>
