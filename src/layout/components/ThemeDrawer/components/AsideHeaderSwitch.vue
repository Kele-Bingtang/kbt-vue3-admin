<template>
  <div :class="prefixClass">
    <slot />

    <template v-if="useAside || useAll">
      <slot name="aside" />

      <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleAsideTheme(MenuThemeEnum.Light)">
            <img src="@/assets/icons/menu-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.menuTheme === LayoutThemeType.Light"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleAsideTheme(MenuThemeEnum.Dark)">
            <img src="@/assets/icons/menu-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.menuTheme === MenuThemeEnum.Dark"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
    </template>

    <template v-if="useHeader || useAll">
      <slot name="header" />

      <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleHeaderTheme(MenuThemeEnum.Light)">
            <img src="@/assets/icons/header-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === MenuThemeEnum.Light"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="`${prefixClass}__item`" @click="handleHeaderTheme(MenuThemeEnum.Dark)">
            <img src="@/assets/icons/header-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === MenuThemeEnum.Dark"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts" name="MenuSwitch">
import { MenuThemeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const ns = useNamespace("aside-header-switch");
const prefixClass = ns.b();

defineProps<{
  useAll?: boolean;
  useAside?: boolean;
  useHeader?: boolean;
}>();

const settingsStore = useSettingsStore();

const handleAsideTheme = (value: MenuThemeEnum) => {
  settingsStore.$patch({
    menuTheme: value,
  });
};

const handleHeaderTheme = (value: MenuThemeEnum) => {
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
