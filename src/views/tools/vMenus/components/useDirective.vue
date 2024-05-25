<template>
  <div class="directive-component" v-menus:left="menus">指令方式打开菜单（左击）</div>
</template>

<script setup lang="ts" name="UseDirective">
import { directive, type menusItemType } from "vue3-menus";

const vMenus = directive;

defineProps<{ menus: menusItemType[] }>();
</script>

<style lang="scss" scoped>
.directive-component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  background-color: var(--#{$el-namespace}-color-primary-light-9);
  border: 3px dashed var(--#{$el-namespace}-color-primary);
  border-radius: 8px;
}
</style>
