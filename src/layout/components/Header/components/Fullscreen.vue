<template>
  <div :class="prefixClass">
    <Icon
      :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      @click.stop="toggle"
      width="1.8rem"
      height="1.8rem"
      :icon-style="{ cursor: 'pointer' }"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from "@vueuse/core";
import { useNamespace } from "@/composables";

const ns = useNamespace("fullscreen");
const prefixClass = ns.b();

const { toggle, isFullscreen } = useFullscreen();
</script>
