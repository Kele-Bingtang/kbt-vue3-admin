<script setup lang="ts" name="LayoutVertical">
import { computed } from "vue";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useSettingsStore } from "@/stores";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import SystemConfig, { HOME_URL } from "@/config";
import HeaderLeft from "@/layout/components/Header/HeaderLeft.vue";
import { useNamespace } from "@/composables";
import { useRouter } from "vue-router";

import "./index.scss";

const ns = useNamespace("classic-layout");

const router = useRouter();
const settingsStore = useSettingsStore();

const isCollapse = computed(() => settingsStore.isCollapse);
</script>

<template>
  <!-- 布局：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧 -->
  <el-container :class="[ns.join('layout'), ns.b(), ns.is('collapse', isCollapse), ns.is('expand', !isCollapse)]">
    <el-header :class="[ns.join('layout-header'), 'flx-justify-between']">
      <Header>
        <template #left>
          <div :class="[ns.e('header-left'), 'flx-align-center']">
            <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
              <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
              <span v-show="!isCollapse">{{ SystemConfig.systemInfo.name }}</span>
            </div>
            <HeaderLeft />
          </div>
        </template>
      </Header>
    </el-header>

    <el-container :class="ns.e('content')">
      <el-aside :class="ns.join('layout-aside')">
        <Menu
          :class="[ns.join('layout-menu'), ns.b('menu')]"
          :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
        />
      </el-aside>

      <MainContent />
    </el-container>
  </el-container>
</template>
