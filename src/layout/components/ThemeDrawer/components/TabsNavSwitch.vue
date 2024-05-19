<template>
  <div :class="prefixClass">
    <slot />

    <div :class="`${prefixClass}__item`">
      <el-tooltip effect="dark" content="经典" placement="left" :show-after="200">
        <div :class="`${prefixClass}__item__theme`" @click="handleTabsNav(TabsNavModeType.Classic)">
          <div :class="`${prefixClass}__item__theme-classic`">
            <div class="dot"></div>
            <span class="title">首页</span>
            <el-icon><Close /></el-icon>
          </div>
          <div :class="`${prefixClass}__item__theme-classic active`">
            <div class="dot"></div>
            <span class="title">其他</span>
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </el-tooltip>
      <el-icon :class="`${prefixClass}__item__icon`" v-if="settingsStore.tabsNavMode === 'classic'">
        <CircleCheckFilled />
      </el-icon>
    </div>
    <div :class="`${prefixClass}__item`">
      <el-tooltip effect="dark" content="流行" placement="left" :show-after="200">
        <div :class="`${prefixClass}__item__theme`" @click="handleTabsNav(TabsNavModeType.Popular)">
          <div :class="`${prefixClass}__item__theme-el active`">
            <el-icon><HomeFilled /></el-icon>
            <span class="title">首页</span>
          </div>
          <div :class="`${prefixClass}__item__theme-el`">
            <el-icon><Menu /></el-icon>
            <span class="title">其他</span>
          </div>
        </div>
      </el-tooltip>
      <el-icon :class="`${prefixClass}__item__icon`" v-if="settingsStore.tabsNavMode === TabsNavModeType.Popular">
        <CircleCheckFilled />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts" name="TabsNavSwitch">
import { useDesign } from "@/hooks";
import { useSettingsStore, TabsNavModeType } from "@/stores";
import { CircleCheckFilled, Menu, Close, HomeFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("tabs-nav-switch");

const settingsStore = useSettingsStore();

const handleTabsNav = (value: TabsNavModeType) => {
  settingsStore.$patch({ tabsNavMode: value });

  if (value === TabsNavModeType.Classic) {
    return settingsStore.$patch({ showTabsNavIcon: false });
  }

  if (value === TabsNavModeType.Popular) {
    return settingsStore.$patch({ showTabsNavIcon: true });
  }
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-tabs-nav-switch;

.#{$prefix-class} {
  text-align: center;

  .tabs-nav-theme:first-child {
    margin-bottom: 15px;
  }

  &__item {
    position: relative;

    &__theme {
      position: relative;
      display: inline-flex;
      width: 150px;
      height: 30px;
      cursor: pointer;
      background-color: #ffffff;
      box-shadow: 0 0 0 2px rgb(0 0 0 / 10%) !important;

      &-classic {
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
          background-color: var(--el-color-primary);

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

      &-el {
        display: flex;
        align-items: center;
        width: 100px;
        height: 100%;
        color: #cccccc;

        &.active {
          color: var(--el-color-primary);
          border-bottom: 1px solid var(--el-color-primary);

          .#{$el-namespace}-icon {
            color: var(--el-color-primary);
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

      .title {
        margin-left: 15px;
        font-size: 12px;
      }
    }

    &__icon {
      position: absolute;
      top: 6px;
      right: 15px;
      color: var(--el-color-primary);
      transition: all 0.2s;
    }
  }
}
</style>
