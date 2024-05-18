<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container :class="[prefixClass, { 'menu-collapse': isCollapse, 'menu-expand': !isCollapse }]">
    <el-header class="flx-justify-between">
      <Header>
        <template #left>
          <div :class="`${prefixClass}__header--left`">
            <div :class="`${prefixClass}__logo flx-center`" @click="router.push(HOME_URL)">
              <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
              <span>{{ settings.title }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>
    <el-container :class="`${prefixClass}__aside`">
      <el-aside>
        <Menu />
      </el-aside>
      <MainContent />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="LayoutVertical">
import { computed } from "vue";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useSettingsStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import HeaderLeft from "@/layout/components/Header/HeaderLeft.vue";
import { HOME_URL } from "@/router/routesConfig";
import { useDesign } from "@/hooks";
import { useRouter } from "vue-router";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout");

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
