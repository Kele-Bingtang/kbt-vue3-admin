<script setup lang="ts" name="LayoutVertical">
import { computed } from "vue";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useSettingsStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import SystemConfig from "@/config";
import HeaderLeft from "@/layout/components/Header/HeaderLeft.vue";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";
import { useRouter } from "vue-router";

const ns = useNamespace("classic-layout");

const router = useRouter();
const settingsStore = useSettingsStore();

const isCollapse = computed(() => settingsStore.isCollapse);
</script>

<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <el-header class="flx-justify-between">
      <Header>
        <template #left>
          <div :class="[ns.e('header-left'), 'flx-align-center']">
            <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
              <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
              <span>{{ SystemConfig.themeConfig.title }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside>
        <Menu
          :class="[ns.b('menu'), ns.join('layout-menu')]"
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
