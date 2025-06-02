<script setup lang="ts" name="Header">
import HeaderLeft from "./header-left.vue";
import HeaderRight from "./header-right.vue";
</script>

<template>
  <slot name="left">
    <HeaderLeft />
  </slot>
  <slot name="right">
    <HeaderRight />
  </slot>
</template>
