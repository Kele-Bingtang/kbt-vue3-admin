<template>
  <el-container class="layout-container">
    <el-header>
      <div class="logo flx-center">
        <img src="@/assets/img/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
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

const settingsStore = useSettingsStore();
</script>

<style lang="scss" scoped>
@import "./index-scoped.scss";
</style>

<style lang="scss">
@import "./index-unlimited.scss";
</style>
