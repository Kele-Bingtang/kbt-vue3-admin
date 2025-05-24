<template>
  <div :class="prefixClass">
    <slot />

    <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-vertical`,
          settingsStore.layoutMode == LayoutModeEnum.Vertical ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeEnum.Vertical)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__container`">
          <div :class="`${prefixClass}__item__light`"></div>
          <div :class="`${prefixClass}__item__content`"></div>
        </div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeEnum.Vertical"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-classic`,
          settingsStore.layoutMode === LayoutModeEnum.Classic ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeEnum.Classic)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__container`">
          <div :class="`${prefixClass}__item__light`"></div>
          <div :class="`${prefixClass}__item__content`"></div>
        </div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeEnum.Classic"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-transverse`,
          settingsStore.layoutMode === LayoutModeEnum.Transverse ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeEnum.Transverse)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__content`"></div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeEnum.Transverse"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-columns`,
          settingsStore.layoutMode === LayoutModeEnum.Columns ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeEnum.Columns)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__light`"></div>
        <div :class="`${prefixClass}__item__content`"></div>
        <el-icon v-if="settingsStore.layoutMode === LayoutModeEnum.Columns"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="混合" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-mixins`,
          settingsStore.layoutMode == LayoutModeEnum.Mixins ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeEnum.Mixins)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__container`">
          <div :class="`${prefixClass}__item__dark`"></div>
          <div :class="`${prefixClass}__item__content`"></div>
        </div>
        <el-icon v-if="settingsStore.layoutMode == LayoutModeEnum.Mixins"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="子系统" placement="top" :show-after="200">
      <div
        :class="[
          `${prefixClass}__item ${prefixClass}-subsystem`,
          settingsStore.layoutMode === LayoutModeEnum.Subsystem ? 'is-active' : '',
        ]"
        @click="changeLayout(LayoutModeEnum.Subsystem)"
      >
        <div :class="`${prefixClass}__item__dark`"></div>
        <div :class="`${prefixClass}__item__content`"></div>
        <el-icon v-if="settingsStore.layoutMode === LayoutModeEnum.Subsystem"><CircleCheckFilled /></el-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts" name="LayoutSwitch">
import { LayoutModeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const ns = useNamespace("layout-switch");
const prefixClass = ns.b();

const settingsStore = useSettingsStore();

const changeLayout = (value: LayoutModeEnum) => {
  settingsStore.$patch({
    layoutMode: value,
  });
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-layout-switch;

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
    box-shadow: 0 0 5px 1px var(--#{$el-namespace}-border-color-lighter);
    transition: all 0.2s;

    &__dark {
      background-color: var(--#{$el-namespace}-color-primary);
      border-radius: 3px;
    }

    &__light {
      background-color: var(--#{$el-namespace}-color-primary-light-5);
      border-radius: 3px;
    }

    &__content {
      background-color: var(--#{$el-namespace}-color-primary-light-8);
      border: 1px dashed var(--#{$el-namespace}-color-primary);
      border-radius: 3px;
    }

    .#{$el-namespace}-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--#{$el-namespace}-color-primary);
      transition: all 0.2s;
    }

    &:hover {
      box-shadow: 0 0 5px 1px var(--#{$el-namespace}-border-color-darker);
    }
  }

  .is-active {
    box-shadow: 0 0 0 2px var(--#{$el-namespace}-color-primary) !important;
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
