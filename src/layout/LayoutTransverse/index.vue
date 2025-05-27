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

import "./index.scss";

const ns = useNamespace("transverse-layout");

const router = useRouter();
const settingsStore = useSettingsStore();
</script>

<template>
  <el-container :class="[ns.join('layout'), ns.b()]">
    <el-header :class="[ns.join('layout-header'), 'flx-justify-between']">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingsStore.showLayoutLogo" />
        <span>{{ SystemConfig.systemInfo.name }}</span>
      </div>

      <Menu
        mode="horizontal"
        :is-collapse="false"
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
      <HeaderRight />
    </el-header>

    <MainContent />
  </el-container>
</template>
