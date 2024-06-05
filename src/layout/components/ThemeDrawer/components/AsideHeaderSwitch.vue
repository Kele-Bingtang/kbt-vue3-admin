<template>
  <div :class="prefixClass">
    <slot />

    <template v-if="useAside || useAll">
      <slot name="aside" />

      <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleAsideTheme(LayoutThemeType.Light)">
            <img src="@/assets/icons/menu-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.menuTheme === LayoutThemeType.Light"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleAsideTheme(LayoutThemeType.Dark)">
            <img src="@/assets/icons/menu-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.menuTheme === LayoutThemeType.Dark"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
    </template>

    <template v-if="useHeader || useAll">
      <slot name="header" />

      <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleHeaderTheme(LayoutThemeType.Light)">
            <img src="@/assets/icons/header-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === LayoutThemeType.Light"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleHeaderTheme(LayoutThemeType.Dark)">
            <img src="@/assets/icons/header-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === LayoutThemeType.Dark"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts" name="MenuSwitch">
import { useDesign } from "@/hooks";
import { useSettingsStore, LayoutThemeType } from "@/stores";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("aside-header-switch");

defineProps<{
  useAll?: boolean;
  useAside?: boolean;
  useHeader?: boolean;
}>();

const settingsStore = useSettingsStore();

const handleAsideTheme = (value: LayoutThemeType) => {
  settingsStore.$patch({
    menuTheme: value,
  });
};

const handleHeaderTheme = (value: LayoutThemeType) => {
  settingsStore.$patch({
    headerTheme: value,
  });
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-aside-header-switch;

.#{$prefix-class} {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;

  .is-dark {
    cursor: no-drop;

    .#{$prefix-class}__item {
      pointer-events: none;
    }
  }

  &__item {
    position: relative;
    height: 100%;
    margin-right: 16px;
    cursor: pointer;
    border-radius: 2px;

    .#{$el-namespace}-icon {
      position: absolute;
      right: 15px;
      bottom: 15px;
      color: var(--#{$el-namespace}-color-primary);
      transition: all 0.2s;
    }
  }
}
</style>
