<script setup lang="ts">
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { LayoutModeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/stores";

defineOptions({ name: "LayoutSwitch" });

const ns = useNamespace("layout-switch");

const settingStore = useSettingStore();

const changeLayout = (value: LayoutModeEnum) => {
  settingStore.$patch({
    layoutMode: value,
  });
};
</script>

<template>
  <div :class="ns.b()">
    <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
      <div
        :class="[
          ns.e('item'),
          ns.join('vertical'),
          ns.is('active', settingStore.layoutMode === LayoutModeEnum.Vertical),
        ]"
        @click="changeLayout(LayoutModeEnum.Vertical)"
      >
        <div class="dark"></div>
        <div class="container">
          <div class="light"></div>
          <div class="content"></div>
        </div>
        <Icon class="icon" v-if="settingStore.layoutMode == LayoutModeEnum.Vertical"><CircleCheckFilled /></Icon>
      </div>
    </el-tooltip>

    <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
      <div
        :class="[ns.e('item'), ns.join('classic'), ns.is('active', settingStore.layoutMode === LayoutModeEnum.Classic)]"
        @click="changeLayout(LayoutModeEnum.Classic)"
      >
        <div class="dark"></div>
        <div class="container">
          <div class="light"></div>
          <div class="content"></div>
        </div>
        <Icon class="icon" v-if="settingStore.layoutMode == LayoutModeEnum.Classic"><CircleCheckFilled /></Icon>
      </div>
    </el-tooltip>

    <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
      <div
        :class="[
          ns.e('item'),
          ns.join('transverse'),
          ns.is('active', settingStore.layoutMode === LayoutModeEnum.Transverse),
        ]"
        @click="changeLayout(LayoutModeEnum.Transverse)"
      >
        <div class="dark"></div>
        <div class="content"></div>
        <Icon class="icon" v-if="settingStore.layoutMode == LayoutModeEnum.Transverse"><CircleCheckFilled /></Icon>
      </div>
    </el-tooltip>

    <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
      <div
        :class="[ns.e('item'), ns.join('columns'), ns.is('active', settingStore.layoutMode === LayoutModeEnum.Columns)]"
        @click="changeLayout(LayoutModeEnum.Columns)"
      >
        <div class="dark"></div>
        <div class="light"></div>
        <div class="content"></div>
        <Icon class="icon" v-if="settingStore.layoutMode === LayoutModeEnum.Columns"><CircleCheckFilled /></Icon>
      </div>
    </el-tooltip>

    <el-tooltip effect="dark" content="混合" placement="top" :show-after="200">
      <div
        :class="[ns.e('item'), ns.join('mixins'), ns.is('active', settingStore.layoutMode === LayoutModeEnum.Mixins)]"
        @click="changeLayout(LayoutModeEnum.Mixins)"
      >
        <div class="dark"></div>
        <div class="container">
          <div class="dark"></div>
          <div class="content"></div>
        </div>
        <Icon class="icon" v-if="settingStore.layoutMode == LayoutModeEnum.Mixins"><CircleCheckFilled /></Icon>
      </div>
    </el-tooltip>

    <el-tooltip effect="dark" content="子系统" placement="top" :show-after="200">
      <div
        :class="[
          ns.e('item'),
          ns.join('subsystem'),
          ns.is('active', settingStore.layoutMode === LayoutModeEnum.Subsystem),
        ]"
        @click="changeLayout(LayoutModeEnum.Subsystem)"
      >
        <div class="dark"></div>
        <div class="content"></div>
        <Icon class="icon" v-if="settingStore.layoutMode === LayoutModeEnum.Subsystem"><CircleCheckFilled /></Icon>
      </div>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(layout-switch) {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .is-active {
    box-shadow: 0 0 0 2px cssVar(main-color) !important;
  }

  @include e(item) {
    position: relative;
    box-sizing: border-box;
    width: 95px;
    height: 67px;
    padding: 6px;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--#{$el-namespace}-border-color-lighter);
    transition: all var(--#{$el-namespace}-transition-duration-fast);

    .dark {
      background-color: cssVar(main-color);
      border-radius: 3px;
    }

    .light {
      background-color: var(--#{$el-namespace}-color-primary-light-5);
      border-radius: 3px;
    }

    .content {
      background-color: var(--#{$el-namespace}-color-primary-light-8);
      border: 1px dashed cssVar(main-color);
      border-radius: 3px;
    }

    .icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: cssVar(main-color);
      transition: all var(--#{$el-namespace}-transition-duration-fast);
    }

    &:hover {
      box-shadow: 0 0 5px 1px var(--#{$el-namespace}-border-color-darker);
    }
  }

  @include joins(vertical) {
    display: flex;
    justify-content: space-between;

    .dark {
      width: 20%;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 72%;

      .light {
        height: 20%;
      }

      .content {
        height: 67%;
      }
    }
  }

  @include joins(classic) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dark {
      height: 22%;
    }

    .container {
      display: flex;
      justify-content: space-between;
      height: 70%;

      .light {
        width: 20%;
      }

      .content {
        width: 70%;
      }
    }
  }

  @include joins(transverse) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dark {
      height: 20%;
    }

    .content {
      height: 67%;
    }
  }

  @include joins(columns) {
    display: flex;
    justify-content: space-between;

    .dark {
      width: 14%;
    }

    .light {
      width: 17%;
    }

    .content {
      width: 55%;
    }
  }

  @include joins(mixins) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dark {
      height: 22%;
    }

    .container {
      display: flex;
      justify-content: space-between;
      height: 70%;

      .dark {
        width: 20%;
        height: 100%;
      }

      .content {
        width: 70%;
      }
    }
  }

  @include joins(subsystem) {
    display: flex;
    justify-content: space-between;

    .dark {
      width: 22%;
    }

    .content {
      width: 70%;
    }
  }
}
</style>
