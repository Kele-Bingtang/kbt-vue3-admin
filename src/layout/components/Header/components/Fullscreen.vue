<template>
  <div class="fullscreen-container">
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
const { toggle, isFullscreen } = useFullscreen();
</script>
