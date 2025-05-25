<script setup lang="ts" name="Header">
import HeaderLeft from "./HeaderLeft.vue";
import HeaderRight from "./HeaderRight.vue";
</script>

<template>
  <slot name="left">
    <HeaderLeft />
  </slot>
  <slot name="right">
    <HeaderRight />
  </slot>
</template>
