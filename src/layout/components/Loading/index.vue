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
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout-loading");
</script>

<style lang="scss" scoped>
@import "./index";
</style>
