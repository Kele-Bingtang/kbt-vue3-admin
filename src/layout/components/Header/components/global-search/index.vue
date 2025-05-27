<script setup lang="ts">
import { mittBus } from "@/utils";

import "./index.scss";

defineOptions({ name: "GlobalSearchInput" });

const isWindows = navigator.userAgent.includes("Windows");

const openSearchDialog = () => {
  mittBus.emit("openSearchDialog");
};
</script>

<template>
  <div class="search-wrap customize">
    <div class="search-input" @click="openSearchDialog">
      <div class="left flx-align-center">
        <Icon icon="search" :size="17" />
        <span>搜索</span>
      </div>
      <div class="search-keydown">
        <span v-if="isWindows">Crtl</span>
        <span v-else>*</span>
        <span>k</span>
      </div>
    </div>
  </div>
</template>
