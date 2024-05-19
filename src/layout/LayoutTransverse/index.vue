<template>
  <el-container :class="prefixClass">
    <el-header class="flx-justify-between">
      <div :class="`${prefixClass}__logo layout__logo flx-center`" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span>{{ settings.title }}</span>
      </div>
      <Menu
        mode="horizontal"
        :is-collapse="false"
        :wrap-style="{ overflow: 'hidden' }"
        :class="`${prefixClass}__menu`"
        :popper-class="`${prefixClass}__menu`"
      />
      <HeaderRight />
    </el-header>
    <MainContent />
  </el-container>
</template>

<script setup lang="ts" name="LayoutTransverse">
import { ElContainer, ElHeader } from "element-plus";
import MainContent from "@/layout/components/MainContent/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import settings from "@/config/settings";
import HeaderRight from "@/layout/components/Header/HeaderRight.vue";
import { useSettingsStore } from "@/stores";
import { HOME_URL } from "@/router/routesConfig";
import { useDesign } from "@/hooks";
import { useRouter } from "vue-router";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("transverse-layout");

const router = useRouter();
const settingsStore = useSettingsStore();
</script>

<style lang="scss" scoped>
@import "./index";
</style>

<style lang="scss">
@import "./menu";
</style>
