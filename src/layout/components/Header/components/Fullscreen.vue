<script lang="ts" setup>
import { useFullscreen } from "@vueuse/core";
import { useNamespace } from "@/composables";

defineOptions({ name: "Fullscreen" });

const ns = useNamespace("fullscreen");

const { toggle, isFullscreen } = useFullscreen();
</script>

<template>
  <div :class="ns.b()" @click.stop="toggle">
    <Icon :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
  </div>
</template>
