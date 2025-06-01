<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useNamespace, useTheme } from "@/composables";
import { SystemThemeEnum } from "@/enums/appEnum";
import { useSettingStore } from "@/stores";
import lightTheme from "@/assets/images/system-theme/light.png";
import darkTheme from "@/assets/images/system-theme/dark.png";
import systemTheme from "@/assets/images/system-theme/system.png";

defineOptions({ name: "SystemThemeSwitch" });

const ns = useNamespace("system-theme-switch");
const settingStore = useSettingStore();
const { t } = useI18n();

const { changeSystemTheme } = useTheme();

const { systemThemeMode } = storeToRefs(settingStore);

const systemThemeModeList = [
  { name: t("_setting.systemThemeModeSelect.light"), theme: SystemThemeEnum.Light, img: lightTheme },
  { name: t("_setting.systemThemeModeSelect.dark"), theme: SystemThemeEnum.Dark, img: darkTheme },
  { name: t("_setting.systemThemeModeSelect.system"), theme: SystemThemeEnum.System, img: systemTheme },
];
</script>

<template>
  <div :class="[ns.b(), 'flx', 'flx-wrap', 'gap-15']">
    <div
      v-for="item in systemThemeModeList"
      :key="item.theme"
      :class="ns.e('item')"
      @click="changeSystemTheme(item.theme)"
    >
      <div :class="[ns.e('box'), ns.is('active', item.theme === systemThemeMode)]">
        <img :src="item.img" />
      </div>
      <Icon :class="ns.m('icon')" v-show="item.theme === systemThemeMode"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(system-theme-switch) {
  @include e(item) {
    position: relative;
    width: calc(100% / 3 - 10px);
    cursor: pointer;
  }

  @include e(box) {
    height: 55px;
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 cssVar(gray-400);
    transition: box-shadow var(--#{$el-namespace}-transition-duration-fast);

    &:hover {
      box-shadow: 0 2px 8px 0 cssVar(gray-600);
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    @include is(active) {
      box-shadow: 0 0 0 2px cssVar(main-color) !important;
    }
  }

  @include m(icon) {
    position: absolute;
    top: 30px;
    right: 10px;
    color: cssVar(main-color);
    transition: all var(--#{$el-namespace}-transition-duration-fast);
  }

  @include m(name) {
    margin: 10px 0;
    font-size: 14px;
    text-align: center;
  }
}
</style>
