<script setup lang="ts" name="TabsNavSwitch">
import { TabsNavModeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";
import { CircleCheckFilled, Menu, Close, HomeFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const ns = useNamespace("tabs-nav-switch");

const settingsStore = useSettingsStore();

const handleTabsNav = (value: TabsNavModeEnum) => {
  settingsStore.$patch({ tabsNavMode: value });

  if (value === TabsNavModeEnum.Classic) {
    return settingsStore.$patch({ showTabsNavIcon: false });
  }

  if (value === TabsNavModeEnum.Popular) {
    return settingsStore.$patch({ showTabsNavIcon: true });
  }
};
</script>

<template>
  <div :class="ns.b()">
    <slot />

    <div :class="ns.e('item')">
      <el-tooltip effect="dark" content="经典" placement="left" :show-after="200">
        <div :class="ns.e('theme')" @click="handleTabsNav(TabsNavModeEnum.Classic)">
          <div :class="ns.em('theme', 'classic')">
            <div class="dot"></div>
            <span class="title">首页</span>
            <el-icon><Close /></el-icon>
          </div>

          <div :class="[ns.em('theme', 'classic'), 'active']">
            <div class="dot"></div>
            <span class="title">其他</span>
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </el-tooltip>

      <el-icon :class="ns.e('icon')" v-if="settingsStore.tabsNavMode === TabsNavModeEnum.Classic">
        <CircleCheckFilled />
      </el-icon>
    </div>

    <div :class="ns.e('item')">
      <el-tooltip effect="dark" content="流行" placement="left" :show-after="200">
        <div :class="ns.e('theme')" @click="handleTabsNav(TabsNavModeEnum.Popular)">
          <div :class="ns.em('theme', 'el')">
            <el-icon><HomeFilled /></el-icon>
            <span class="title">首页</span>
          </div>

          <div :class="ns.em('theme', 'el')">
            <el-icon><Menu /></el-icon>
            <span class="title">其他</span>
          </div>
        </div>
      </el-tooltip>
      <el-icon :class="ns.e('icon')" v-if="settingsStore.tabsNavMode === TabsNavModeEnum.Popular">
        <CircleCheckFilled />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@include b(tabs-nav-switch) {
  @include e(item) {
    position: relative;
  }

  @include e(icon) {
    position: absolute;
    top: 6px;
    right: 15px;
    color: var(--#{$el-namespace}-color-primary);
    transition: all 0.2s;
  }

  @include e(theme) {
    @include m(classic) {
      position: relative;
      display: flex;
      align-items: center;
      width: 60px;
      height: 19px;
      margin-top: 5px;
      margin-left: 7px;

      .dot {
        position: absolute;
        top: 6px;
        left: 3px;
        width: 7px;
        height: 7px;
        background-color: #e8eaec;
        border-radius: 50%;
      }

      .#{$el-namespace}-icon {
        width: 12px;
        height: 12px;
        margin-left: 5px;
        font-size: 12px;
        color: #000000;
        border-radius: 50%;
      }

      &.active {
        background-color: var(--#{$el-namespace}-color-primary);

        .dot {
          background-color: #ffffff;
        }

        .#{$el-namespace}-icon {
          color: #ffffff;
        }

        .title {
          color: #ffffff;
        }
      }
    }

    @include m(el) {
      display: flex;
      align-items: center;
      width: 100px;
      height: 100%;
      color: #cccccc;

      &.active {
        color: var(--#{$el-namespace}-color-primary);
        border-bottom: 1px solid var(--#{$el-namespace}-color-primary);

        .#{$el-namespace}-icon {
          color: var(--#{$el-namespace}-color-primary);
        }
      }

      .title {
        margin-top: 3px;
      }

      .#{$el-namespace}-icon {
        position: relative;
        top: -1px;
        left: 10px;
        width: 12px;
        height: 12px;
        margin-top: 3px;
      }
    }

    position: relative;
    display: inline-flex;
    width: 150px;
    height: 30px;
    cursor: pointer;
    background-color: #ffffff;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 10%) !important;

    .title {
      margin-left: 15px;
      font-size: 12px;
    }
  }

  text-align: center;

  .tabs-nav-theme:first-child {
    margin-bottom: 15px;
  }
}
</style>
