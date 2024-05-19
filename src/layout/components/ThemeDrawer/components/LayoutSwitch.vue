<template>
  <div :class="prefixClass">
    <slot />

    <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-vertical`,
          settingsStore.layoutMode == LayoutModeType.Vertical ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeType.Vertical)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__container`">
          <div :class="`${prefixClass}__item__light`"></div>
          <div :class="`${prefixClass}__item__content`"></div>
        </div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Vertical"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-classic`,
          settingsStore.layoutMode === LayoutModeType.Classic ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeType.Classic)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__container`">
          <div :class="`${prefixClass}__item__light`"></div>
          <div :class="`${prefixClass}__item__content`"></div>
        </div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Classic"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-transverse`,
          settingsStore.layoutMode === LayoutModeType.Transverse ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeType.Transverse)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__content`"></div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Transverse"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-columns`,
          settingsStore.layoutMode === LayoutModeType.Columns ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeType.Columns)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__light`"></div>
        <div :class="`${prefixClass}__item__content`"></div>
        <el-icon v-if="settingsStore.layoutMode === LayoutModeType.Columns"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="混合" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-mixins`,
          settingsStore.layoutMode == LayoutModeType.Mixins ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeType.Mixins)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__container`">
          <div :class="`${prefixClass}__item__dark`"></div>
          <div :class="`${prefixClass}__item__content`"></div>
        </div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Mixins"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="子系统" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-subsystem`,
          settingsStore.layoutMode === LayoutModeType.Subsystem ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeType.Subsystem)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__content`"></div>
        <el-icon v-if="settingsStore.layoutMode === LayoutModeType.Subsystem"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts" name="LayoutSwitch">
import { useDesign } from "@/hooks";
import { useSettingsStore, LayoutModeType } from "@/stores";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout-switch");

const settingsStore = useSettingsStore();

const changeLayout = (value: LayoutModeType) => {
  settingsStore.$patch({
    layoutMode: value,
  });
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-layout-switch;

.#{$prefix-class} {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  &__item {
    position: relative;
    box-sizing: border-box;
    width: 95px;
    height: 67px;
    padding: 6px;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--el-border-color-lighter);
    transition: all 0.2s;

    &__dark {
      background-color: var(--el-color-primary);
      border-radius: 3px;
    }

    &__light {
      background-color: var(--el-color-primary-light-5);
      border-radius: 3px;
    }

    &__content {
      background-color: var(--el-color-primary-light-8);
      border: 1px dashed var(--el-color-primary);
      border-radius: 3px;
    }

    .#{$el-namespace}-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--el-color-primary);
      transition: all 0.2s;
    }

    &:hover {
      box-shadow: 0 0 5px 1px var(--el-border-color-darker);
    }
  }

  .is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary) !important;
  }

  &-vertical {
    display: flex;
    justify-content: space-between;

    .#{$prefix-class}__item__dark {
      width: 20%;
    }

    .#{$prefix-class}__item__container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 72%;

      .#{$prefix-class}__item__light {
        height: 20%;
      }

      .#{$prefix-class}__item__content {
        height: 67%;
      }
    }
  }

  &-classic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .#{$prefix-class}__item__dark {
      height: 22%;
    }

    .#{$prefix-class}__item__container {
      display: flex;
      justify-content: space-between;
      height: 70%;

      .#{$prefix-class}__item__light {
        width: 20%;
      }

      .#{$prefix-class}__item__content {
        width: 70%;
      }
    }
  }

  &-transverse {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .#{$prefix-class}__item__dark {
      height: 20%;
    }

    .#{$prefix-class}__item__content {
      height: 67%;
    }
  }

  &-columns {
    display: flex;
    justify-content: space-between;

    .#{$prefix-class}__item__dark {
      width: 14%;
    }

    .#{$prefix-class}__item__light {
      width: 17%;
    }

    .#{$prefix-class}__item__content {
      width: 55%;
    }
  }

  &-mixins {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .#{$prefix-class}__item__dark {
      height: 22%;
    }

    .#{$prefix-class}__item__container {
      display: flex;
      justify-content: space-between;
      height: 70%;

      .#{$prefix-class}__item__dark {
        width: 20%;
        height: 100%;
      }

      .#{$prefix-class}__item__content {
        width: 70%;
      }
    }
  }

  &-subsystem {
    display: flex;
    justify-content: space-between;

    .#{$prefix-class}__item__dark {
      width: 22%;
    }

    .#{$prefix-class}__item__content {
      width: 70%;
    }
  }
}
</style>
