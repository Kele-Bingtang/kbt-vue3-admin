<script setup lang="ts">
import { mittBus } from "@/utils";
import { useNamespace } from "@/composables";

import "./input.scss";

defineOptions({ name: "GlobalSearchInput" });

const ns = useNamespace("global-search-input");

const isWindows = navigator.userAgent.includes("Windows");

const openSearchDialog = () => {
  mittBus.emit("openSearchDialog");
};
</script>

<template>
  <div :class="[ns.b(), 'customize']">
    <div :class="ns.e('input')" @click="openSearchDialog">
      <div :class="[ns.e('content'), 'flx-align-center']">
        <Icon icon="search" :size="17" />
        <span>{{ $t("_headerBar.search") }}</span>
      </div>

      <div :class="ns.e('keydown')">
        <span v-if="isWindows">Crtl</span>
        <Icon v-else icon="command" :size="13"></Icon>
        <span>k</span>
      </div>
    </div>
  </div>
</template>
