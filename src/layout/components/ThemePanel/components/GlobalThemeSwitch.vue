<script setup lang="ts">
import { useNamespace, useTheme } from "@/composables";
import { useLayoutStore, useSettingStore } from "@/stores";
import SystemConfig from "@/config";

defineOptions({ name: "GlobalThemeSwitch" });

const ns = useNamespace("global-theme-select");

const { changePrimary, changeGreyOrWeak } = useTheme();

const settingStore = useSettingStore();
const layoutStore = useLayoutStore();

// 预定义主题颜色
const colorList = [
  SystemConfig.themeConfig.primaryColor,
  "#DAA96E",
  "#0C819F",
  "#409EFF",
  "#27ae60",
  "#ff5c93",
  "#e74c3c",
  "#fd726d",
  "#f39c12",
  "#9b59b6",
];

const sizeOptions = [
  { label: "Large", value: "large" },
  { label: "Default", value: "default" },
  { label: "Small", value: "small" },
];
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme") }}</span>
      <el-color-picker v-model="settingStore.primaryColor" :predefine="colorList" @change="changePrimary" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.greyMode") }}</span>
      <el-switch v-model="settingStore.isGrey" @change="changeGreyOrWeak($event as boolean, 'grey')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.weakMode") }}</span>
      <el-switch v-model="settingStore.isWeak" @change="changeGreyOrWeak($event as boolean, 'weak')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.epSize") }}</span>
      <el-select v-model="layoutStore.layoutSize" placeholder="Select">
        <el-option v-for="item in sizeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

@include b(global-theme-select) {
  @include e(item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 14px 0;

    span {
      font-size: 14px;
    }

    .#{$el-namespace}-select {
      width: 40%;
    }
  }
}
</style>
