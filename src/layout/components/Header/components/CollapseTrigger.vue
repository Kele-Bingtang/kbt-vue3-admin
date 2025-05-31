<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useSettingStore } from "@/stores";
import { useNamespace } from "@/composables";

defineOptions({ name: "CollapseTrigger" });

const ns = useNamespace("collapse-trigger");
const settingStore = useSettingStore();
const { isCollapse } = storeToRefs(settingStore);

const toggleTrigger = () => {
  settingStore.toggleSideMenu();
};
</script>

<template>
  <Icon :class="ns.b()" @click.stop="toggleTrigger">
    <component :is="isCollapse ? Expand : Fold"></component>
  </Icon>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(collapse-trigger) {
  width: 45px;
  height: 100%;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color var(--#{$el-namespace}-transition-duration);

  &:hover {
    background-color: cssVar(gray-200);
  }
}
</style>
