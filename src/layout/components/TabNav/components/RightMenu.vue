<script setup lang="ts">
import type { TabProp } from "@/stores";
import { useTabNav, type ContextMenuCondition } from "../useTabNav";
import { Refresh, Close, ArrowLeft, ArrowRight, SemiSelect, FolderDelete } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";

defineOptions({ name: "RightMenu" });

const ns = useNamespace("right-menu");

const { refreshSelectedTab, closeCurrentTab, closeLeftTab, closeRightTab, closeOthersTabs, closeAllTabs } = useTabNav();

interface RightMenuProps {
  selectedTab: TabProp;
  visible?: boolean;
  left?: number;
  top?: number;
  condition?: ContextMenuCondition;
}

withDefaults(defineProps<RightMenuProps>(), {
  visible: false,
  left: 0,
  right: 0,
  condition: () => ({ refresh: false, current: false, left: false, right: false, other: false, all: false }),
});
</script>

<template>
  <ul v-show="visible" :style="{ left: `${left}px`, top: `${top}px` }" :class="ns.b()">
    <li v-if="condition.refresh" @click="refreshSelectedTab(selectedTab)">
      <Icon class="right-menu-icon"><Refresh /></Icon>
      {{ $t("_tabNav.refresh") }}
    </li>
    <li v-if="condition.current" @click="closeCurrentTab(selectedTab)">
      <Icon class="right-menu-icon"><Close /></Icon>
      {{ $t("_tabNav.closeCurrent") }}
    </li>
    <li v-if="condition.left" @click="closeLeftTab(selectedTab)">
      <Icon class="right-menu-icon"><ArrowLeft /></Icon>
      {{ $t("_tabNav.closeLeft") }}
    </li>
    <li v-if="condition.right" @click="closeRightTab(selectedTab)">
      <Icon class="right-menu-icon"><ArrowRight /></Icon>
      {{ $t("_tabNav.closeRight") }}
    </li>
    <li v-if="condition.other" @click="closeOthersTabs(selectedTab)">
      <Icon class="right-menu-icon"><SemiSelect /></Icon>
      {{ $t("_tabNav.closeOthers") }}
    </li>
    <li v-if="condition.all" @click="closeAllTabs()">
      <Icon class="right-menu-icon"><FolderDelete /></Icon>
      {{ $t("_tabNav.closeAll") }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(right-menu) {
  position: absolute;
  z-index: 4000;
  padding: 5px 0;
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  list-style-type: none;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);

  li {
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin: 0;
    line-height: 31px;
    cursor: pointer;

    &:hover {
      color: cssVar(main-color);
    }

    .right-menu-icon {
      margin-right: 8px;
    }
  }
}
</style>
