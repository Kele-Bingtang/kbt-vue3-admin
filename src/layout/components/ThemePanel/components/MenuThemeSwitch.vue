<script setup lang="ts">
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { LayoutModeEnum, MenuThemeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/stores";
import lightTheme from "@/assets/images/menu-theme/light.png";
import darkTheme from "@/assets/images/menu-theme/dark.png";
import { useI18n } from "vue-i18n";

defineOptions({ name: "MenuThemeSwitch" });

const ns = useNamespace("menu-theme-switch");
const settingStore = useSettingStore();
const { t } = useI18n();

const { menuTheme, layoutMode } = storeToRefs(settingStore);

const menuThemeModeList = [
  { name: t("_setting.menuThemeSelect.light"), theme: MenuThemeEnum.Light, img: lightTheme },
  { name: t("_setting.menuThemeSelect.dark"), theme: MenuThemeEnum.Dark, img: darkTheme },
];

const isDisable = computed(() => [LayoutModeEnum.Horizontal, LayoutModeEnum.Columns].includes(layoutMode.value));

const switchMenuTheme = (menuTheme: MenuThemeEnum) => {
  if (isDisable.value) return;
  settingStore.$patch({ menuTheme });
};
</script>

<template>
  <div :class="[ns.b(), 'flx', 'flx-wrap', 'gap-15']">
    <div v-for="item in menuThemeModeList" :key="item.theme" :class="ns.e('item')">
      <div
        :class="[ns.e('box'), ns.is('active', item.theme === menuTheme)]"
        @click="switchMenuTheme(item.theme)"
        :style="{ cursor: isDisable ? 'not-allowed' : 'pointer' }"
      >
        <img :src="item.img" />
      </div>
      <Icon :class="ns.m('icon')" v-show="item.theme === menuTheme"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(menu-theme-switch) {
  @include e(item) {
    position: relative;
    width: calc(100% / 3 - 10px);
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
