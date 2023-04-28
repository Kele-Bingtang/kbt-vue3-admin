<template>
  <div class="function-component" @click.stop @contextmenu="rightClick">事件方式打开菜单</div>
</template>

<script setup lang="ts" name="UseFunction">
import { menusEvent, type menusItemType } from "vue3-menus";

const props = defineProps<{ menus: menusItemType[] }>();

const rightClick = (event: MouseEvent) => {
  menusEvent(event, props.menus, "");
  event.preventDefault();
};
</script>

<style lang="scss" scoped>
.function-component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  background-color: var(--el-color-primary-light-9);
  border: 3px dashed var(--el-color-primary);
  border-radius: 8px;
}
</style>
