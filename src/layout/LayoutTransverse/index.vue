<script setup lang="ts" name="LayoutTransverse">
import { ElContainer, ElHeader } from "element-plus";
import MainContent from "@/layout/components/MainContent/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import SystemConfig from "@/config";
import HeaderRight from "@/layout/components/Header/HeaderRight.vue";
import { useSettingsStore } from "@/stores";
import { HOME_URL } from "@/router/routesConfig";
import { useNamespace } from "@/composables";
import { useRouter } from "vue-router";

const ns = useNamespace("transverse-layout");

const router = useRouter();
const settingsStore = useSettingsStore();
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b()]">
    <el-header class="flx-justify-between">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span>{{ SystemConfig.themeConfig.title }}</span>
      </div>

      <Menu
        mode="horizontal"
        :is-collapse="false"
        :wrap-style="{ overflow: 'hidden' }"
        :class="[ns.b('menu'), ns.join('layout-menu')]"
        :popper-class="`${ns.b('menu-popper')} ${ns.join('layout-menu-popper')}`"
      />
      <HeaderRight />
    </el-header>

    <MainContent />
  </el-container>
</template>

<style lang="scss">
@use "./index";
@use "../base-layout";
</style>
