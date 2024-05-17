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
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("fullscreen");

const { toggle, isFullscreen } = useFullscreen();
</script>
