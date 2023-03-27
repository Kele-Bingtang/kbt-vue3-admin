<template>
  <el-container class="layout-container">
    <el-header class="flx-justify-between">
      <div class="logo flx-center" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span>{{ settings.title }}</span>
      </div>
      <Menu mode="horizontal" />
      <HeaderRight />
    </el-header>
    <MainContent />
  </el-container>
</template>

<script setup lang="ts" name="LayoutTransverse">
import MainContent from "@/layout/components/MainContent/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import HeaderRight from "@/layout/components/Header/HeaderRight.vue";
import { useSettingsStore } from "@/stores/settings";
import { HOME_URL } from "@/router/routesConfig";

const router = useRouter();
const settingsStore = useSettingsStore();
</script>

<style lang="scss" scoped>
@import "./index-scoped.scss";
</style>

<style lang="scss">
@import "./index-unlimited.scss";
</style>
