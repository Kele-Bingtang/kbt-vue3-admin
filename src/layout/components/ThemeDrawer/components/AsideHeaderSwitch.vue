<script setup lang="ts" name="MenuSwitch">
import { MenuThemeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const ns = useNamespace("aside-header-switch");

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

<template>
  <div :class="ns.b()">
    <template v-if="useAside || useAll">
      <slot name="aside" />

      <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="ns.e('item')" @click="handleAsideTheme(MenuThemeEnum.Light)">
            <img src="@/assets/icons/menu-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.menuTheme === MenuThemeEnum.Light"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="ns.e('item')" @click="handleAsideTheme(MenuThemeEnum.Dark)">
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
          <div :class="ns.e('item')" @click="handleHeaderTheme(MenuThemeEnum.Light)">
            <img src="@/assets/icons/header-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === MenuThemeEnum.Light"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div :class="{ 'is-dark': settingsStore.isDark }">
          <div :class="ns.e('item')" @click="handleHeaderTheme(MenuThemeEnum.Dark)">
            <img src="@/assets/icons/header-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === MenuThemeEnum.Dark"><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(aside-header-switch) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;

  .is-dark {
    cursor: no-drop;

    @include e(item) {
      pointer-events: none;
    }
  }

  @include e(item) {
    position: relative;
    height: 100%;
    margin-right: 16px;
    cursor: pointer;
    border-radius: 2px;

    .#{$el-namespace}-icon {
      position: absolute;
      right: 15px;
      bottom: 15px;
      color: cssVar(main-color);
      transition: all var(--#{$el-namespace}-transition-duration-fast);
    }
  }
}
</style>
