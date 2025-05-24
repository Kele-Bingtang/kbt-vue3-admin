<template>
  <div :class="prefixClass">
    <div :class="`${prefixClass}__wrap`">
      <span class="dot dot-spin">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts" name="Loading">
import { useNamespace } from "@/composables";

const ns = useNamespace("layout-loading");
const prefixClass = ns.b();
</script>

<style lang="scss" scoped>
@use "./index";
</style>
