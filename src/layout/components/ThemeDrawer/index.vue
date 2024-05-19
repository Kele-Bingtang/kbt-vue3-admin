<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="300px" :class="prefixClass">
    <!-- 布局切换 -->
    <template v-if="!isMobile">
      <LayoutSwitch>
        <el-divider :class="`${prefixClass}__divider`" content-position="center">
          <el-icon><Notification /></el-icon>
          {{ $t("_settings.layoutSwitch") }}
        </el-divider>
      </LayoutSwitch>

      <template v-if="[LayoutModeType.Subsystem].includes(settingsStore.layoutMode)">
        <!-- 菜单主题切换 -->
        <AsideHeaderSwitch useAside>
          <el-divider :class="`${prefixClass}__divider`" content-position="center">
            <el-icon><Menu /></el-icon>
            {{ $t("_settings.menuSwitch") }}
          </el-divider>
        </AsideHeaderSwitch>
      </template>

      <template v-if="[LayoutModeType.Transverse, LayoutModeType.Mixins].includes(settingsStore.layoutMode)">
        <!-- 头部主题切换 -->
        <AsideHeaderSwitch useHeader>
          <el-divider :class="`${prefixClass}__divider`" content-position="center">
            <el-icon><Menu /></el-icon>
            {{ $t("_settings.headerSwitch") }}
          </el-divider>
        </AsideHeaderSwitch>
      </template>

      <template
        v-if="
          [LayoutModeType.Vertical, LayoutModeType.Classic, LayoutModeType.Columns].includes(settingsStore.layoutMode)
        "
      >
        <!-- 菜单主题 & 头部主题切换 -->
        <AsideHeaderSwitch useAll>
          <template #aside>
            <el-divider :class="`${prefixClass}__divider`" content-position="center">
              <el-icon><Menu /></el-icon>
              {{ $t("_settings.menuSwitch") }}
            </el-divider>
          </template>
          <template #header>
            <el-divider :class="`${prefixClass}__divider`" content-position="center">
              <el-icon><Menu /></el-icon>
              {{ $t("_settings.headerSwitch") }}
            </el-divider>
          </template>
        </AsideHeaderSwitch>
      </template>
    </template>

    <!-- 标签页切换 -->
    <TabsNavSwitch>
      <el-divider :class="`${prefixClass}__divider`" content-position="center">
        <el-icon><Menu /></el-icon>
        {{ $t("_settings.tabsNavSwitch") }}
      </el-divider>
    </TabsNavSwitch>

    <!-- 全局主题 -->
    <ThemeSelect>
      <el-divider :class="`${prefixClass}__divider`" content-position="center">
        <el-icon><ColdDrink /></el-icon>
        {{ $t("_settings.globalTheme") }}
      </el-divider>
    </ThemeSelect>

    <!-- 界面设置 -->
    <LayoutSelect>
      <el-divider :class="`${prefixClass}__divider`" content-position="center">
        <el-icon><Setting /></el-icon>
        {{ $t("_settings.interfaceSettings") }}
      </el-divider>
    </LayoutSelect>

    <BrowserTitleSwitch>
      <el-divider :class="`${prefixClass}__divider`" content-position="center">
        <el-icon><Box /></el-icon>
        {{ $t("_settings.titleSwitch") }}
      </el-divider>
    </BrowserTitleSwitch>

    <el-divider />

    <el-button plain :icon="Refresh" @click="resetSettings">
      {{ $t("_settings.resetSettingsTitle") }}
    </el-button>
  </el-drawer>
</template>

<script setup lang="ts" name="ThemeDrawer">
import { ref, computed, watch, watchEffect } from "vue";
import { ElButton, ElDivider, ElDrawer, ElIcon } from "element-plus";
import { useSettingsStore, useLayoutStore, LayoutModeType, LayoutThemeType, DeviceType } from "@/stores";
import { mittBus, setStyleVar } from "@/utils";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import variables from "@/styles/module/variables.module.scss";
import { Notification, Menu, ColdDrink, Setting, Box, Refresh } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";
import {
  LayoutSwitch,
  AsideHeaderSwitch,
  TabsNavSwitch,
  ThemeSelect,
  LayoutSelect,
  BrowserTitleSwitch,
} from "./components";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("theme-drawer");

const layoutStore = useLayoutStore();

const { t } = useI18n();
const settingsStore = useSettingsStore();

const isMobile = computed(() => layoutStore.device === DeviceType.Mobile);

// 重置缓存
const resetSettings = () => {
  let message = t("_settings.resetSettings");
  message = message === "_settings.resetSettings" ? "正在清除设置缓存并刷新，请稍候..." : message;
  ElMessage({
    message: message,
    duration: 1000,
    icon: "Loading",
  });
  settingsStore.resetSettings();
  setTimeout(() => window.location.reload(), 1000);
};

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on("openThemeDrawer", () => (drawerVisible.value = true));

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => settingsStore.layoutMode,
  () => {
    const { layoutMode, headerTheme, isDark } = settingsStore;
    const { Subsystem, Transverse, Mixins } = LayoutModeType;
    const { Light, Dark } = LayoutThemeType;

    const body = document.body as HTMLElement;
    body.setAttribute("class", layoutMode);

    if (!isDark) {
      if ([Transverse, Mixins].includes(layoutMode)) {
        if (headerTheme === Light) settingsStore.$patch({ menuTheme: Light, isCollapse: false });
        else settingsStore.$patch({ menuTheme: Dark, isCollapse: false });
      }
      if (layoutMode === Subsystem) settingsStore.$patch({ headerTheme: Light });
    }
  },
  { immediate: true }
);

// 监听头部主题的切换
watch(
  () => settingsStore.headerTheme,
  () => {
    if ([LayoutModeType.Transverse, LayoutModeType.Mixins].includes(settingsStore.layoutMode)) {
      settingsStore.$patch({ menuTheme: settingsStore.headerTheme });
    }
    // TODO：制作强大的颜色系统，在 store 添加多个变量存储用户选择的颜色，而不是写死颜色
    if (settingsStore.headerTheme === LayoutThemeType.Dark) {
      setStyleVar("--header-bg-color", variables.headerBgDark);
      setStyleVar("--header-text-color", variables.headerTextDark);
      setStyleVar("--header-line-color", variables.headerLineDark);
      setStyleVar("--header-logo-title-color", variables.headerLogoTitleDark);
    } else if (settingsStore.headerTheme === LayoutThemeType.Light) {
      setStyleVar("--header-bg-color", variables.headerBgLight);
      setStyleVar("--header-text-color", variables.headerTextLight);
      setStyleVar("--header-line-color", variables.headerLineLight);
      setStyleVar("--header-logo-title-color", variables.headerLogoTitleLight);
    }
  },
  { immediate: true }
);

// 监听亮、暗色主题的切换
watchEffect(() => {
  if (settingsStore.menuTheme === LayoutThemeType.Dark) {
    // TODO：制作强大的颜色系统，在 store 添加多个变量存储用户选择的颜色，而不是写死颜色
    setStyleVar("--menu-bg-color", variables.menuBgDark);
    setStyleVar("--menu-text-color", variables.menuTextDark);
    setStyleVar("--menu-hover-bg-color", variables.menuHoverBgDark);
    setStyleVar("--menu-active-bg-color", variables.menuActiveBgDark);
    setStyleVar("--sub-menu-bg-color", variables.subMenuBgDark);
    setStyleVar("--sub-menu-hover-bg-color", variables.subMenuHoverBgDark);
    setStyleVar("--sub-menu-active-bg-color", variables.subMenuActiveBgDark);
    setStyleVar("--menu-icon-color", variables.iconDark);
    setStyleVar("--menu-logo-line-color", variables.logoLineDark);
    setStyleVar("--menu-logo-title-color", variables.logoTitleDark);
    setStyleVar("--split-menu-active-bg-color", variables.splitMenuActiveBgDark);
  } else if (settingsStore.menuTheme === LayoutThemeType.Light) {
    setStyleVar("--menu-bg-color", variables.menuBgLight);
    setStyleVar("--menu-text-color", variables.menuTextLight);
    setStyleVar("--menu-hover-bg-color", variables.menuHoverBgLight);
    setStyleVar("--menu-active-bg-color", variables.menuActiveBgLight);
    setStyleVar("--sub-menu-bg-color", variables.subMenuBgLight);
    setStyleVar("--sub-menu-hover-bg-color", variables.subMenuHoverBgLight);
    setStyleVar("--sub-menu-active-bg-color", variables.subMenuActiveBgLight);
    setStyleVar("--menu-icon-color", variables.iconLight);
    setStyleVar("--menu-logo-line-color", variables.logoLineLight);
    setStyleVar("--menu-logo-title-color", variables.logoTitleLight);
    setStyleVar("--split-menu-active-bg-color", variables.splitMenuActiveBgLight);
  }
});
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-theme-drawer;

.#{$prefix-class} {
  &__divider {
    margin-top: 15px;

    .#{$el-namespace}-icon {
      position: relative;
      top: 2px;
      right: 5px;
      font-size: 15px;
    }
  }

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
