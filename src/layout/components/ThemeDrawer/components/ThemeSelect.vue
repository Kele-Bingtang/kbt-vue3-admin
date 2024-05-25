<template>
  <div :class="prefixClass">
    <slot />

    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.theme") }}</span>
      <el-color-picker v-model="settingsStore.primaryTheme" :predefine="colorList" @change="changePrimary" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.darkMode") }}</span>
      <el-switch
        v-model="settingsStore.isDark"
        @change="handleSwitchDark"
        inline-prompt
        :active-icon="Sunny"
        :inactive-icon="Moon"
      />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.greyMode") }}</span>
      <el-switch v-model="settingsStore.isGrey" @change="changeGreyOrWeak($event as boolean, 'grey')" />
    </div>
    <div :class="`${prefixClass}__list`">
      <span>{{ $t("_settings.weakMode") }}</span>
      <el-switch v-model="settingsStore.isWeak" @change="changeGreyOrWeak($event as boolean, 'weak')" />
    </div>
  </div>
</template>

<script setup lang="ts" name="ThemeSelect">
import { useDesign, useTheme } from "@/hooks";
import { useSettingsStore, LayoutThemeType } from "@/stores";
import { Sunny, Moon } from "@element-plus/icons-vue";
import settings from "@/config/settings";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("theme-select");

const { changePrimary, changeGreyOrWeak, switchDark } = useTheme();

const settingsStore = useSettingsStore();

// 预定义主题颜色
const colorList = [
  settings.primaryTheme,
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

const handleSwitchDark = () => {
  const isDark = switchDark();
  const theme = isDark ? LayoutThemeType.Dark : LayoutThemeType.Light;
  settingsStore.$patch({
    menuTheme: theme,
    headerTheme: theme,
  });
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-theme-select;

.#{$prefix-class} {
  &__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 14px 0;

    span {
      font-size: 14px;
    }
  }
}
</style>
