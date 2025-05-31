<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMediaQuery } from "@vueuse/core";
import { ElContainer, ElAside, ElHeader } from "element-plus";
import { useSettingStore } from "@/stores";
import { useNamespace } from "@/composables";
import SystemConfig, { HOME_URL, mobileMaxWidthMedia } from "@/config";
import MainContent from "@/layout/components/MainContent/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Menu from "@/layout/components/Menu/index.vue";

import "./index.scss";

defineOptions({ name: "LayoutVertical" });

const ns = useNamespace("vertical-layout");
const router = useRouter();
const settingStore = useSettingStore();

const { isCollapse } = storeToRefs(settingStore);
const isMobile = useMediaQuery(mobileMaxWidthMedia);

watch(isMobile, newVal => {
  if (newVal) settingStore.closeSideMenu();
});

const handleClickOutSide = () => {
  settingStore.closeSideMenu();
};
</script>

<template>
  <el-container
    :class="[
      ns.join('layout'),
      ns.b(),
      ns.is('collapse', isCollapse),
      ns.is('expand', !isCollapse),
      { mobile: isMobile },
    ]"
  >
    <el-aside :class="[ns.join('layout-aside'), 'flx-column']">
      <div :class="[ns.join('layout-logo'), 'flx-center']" @click="router.push(HOME_URL)">
        <img src="@/assets/images/logo.png" alt="logo" v-if="settingStore.showLayoutLogo" />
        <span v-show="!isCollapse">{{ SystemConfig.systemInfo.name }}</span>
      </div>

      <Menu
        :class="[ns.join('layout-menu'), ns.b('menu')]"
        :popper-class="`${ns.join('layout-menu-popper')} ${ns.b('menu-popper')}`"
      />
    </el-aside>

    <div v-if="isMobile && !isCollapse" :class="ns.e('drawer-bg')" @click="handleClickOutSide" />

    <el-container>
      <el-header :class="[ns.join('layout-header'), 'flx-justify-between']">
        <Header />
      </el-header>
      <MainContent />
    </el-container>
  </el-container>
</template>
