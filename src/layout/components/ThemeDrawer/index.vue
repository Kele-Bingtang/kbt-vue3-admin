<script setup lang="ts" name="ThemeDrawer">
import { ref, computed, watch } from "vue";
import { ElButton, ElDivider, ElDrawer, ElIcon } from "element-plus";
import { useSettingsStore, useLayoutStore } from "@/stores";
import { mittBus } from "@/utils";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { Notification, Menu, ColdDrink, Setting, Box, Refresh } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import {
  LayoutSwitch,
  AsideHeaderSwitch,
  TabsNavSwitch,
  ThemeSelect,
  LayoutSelect,
  BrowserTitleSwitch,
} from "./components";
import { DeviceEnum, LayoutModeEnum, MenuThemeEnum } from "@/enums/appEnum";

const ns = useNamespace("theme-drawer");

const layoutStore = useLayoutStore();

const { t } = useI18n();
const settingsStore = useSettingsStore();

const isMobile = computed(() => layoutStore.device === DeviceEnum.Mobile);

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
    const { Subsystem, Transverse, Mixins } = LayoutModeEnum;
    const { Light, Dark } = MenuThemeEnum;

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
</script>

<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="300px" :class="ns.b()">
    <!-- 布局切换 -->
    <template v-if="!isMobile">
      <LayoutSwitch>
        <el-divider :class="ns.e('divider')" content-position="center">
          <el-icon><Notification /></el-icon>
          {{ $t("_settings.layoutSwitch") }}
        </el-divider>
      </LayoutSwitch>

      <template v-if="[LayoutModeEnum.Subsystem].includes(settingsStore.layoutMode)">
        <!-- 菜单主题切换 -->
        <AsideHeaderSwitch useAside>
          <el-divider :class="ns.e('divider')" content-position="center">
            <el-icon><Menu /></el-icon>
            {{ $t("_settings.menuSwitch") }}
          </el-divider>
        </AsideHeaderSwitch>
      </template>

      <template v-if="[LayoutModeEnum.Transverse, LayoutModeEnum.Mixins].includes(settingsStore.layoutMode)">
        <!-- 头部主题切换 -->
        <AsideHeaderSwitch useHeader>
          <el-divider :class="ns.e('divider')" content-position="center">
            <el-icon><Menu /></el-icon>
            {{ $t("_settings.headerSwitch") }}
          </el-divider>
        </AsideHeaderSwitch>
      </template>

      <template
        v-if="
          [LayoutModeEnum.Vertical, LayoutModeEnum.Classic, LayoutModeEnum.Columns].includes(settingsStore.layoutMode)
        "
      >
        <!-- 菜单主题 & 头部主题切换 -->
        <AsideHeaderSwitch useAll>
          <template #aside>
            <el-divider :class="ns.e('divider')" content-position="center">
              <el-icon><Menu /></el-icon>
              {{ $t("_settings.menuSwitch") }}
            </el-divider>
          </template>
          <template #header>
            <el-divider :class="ns.e('divider')" content-position="center">
              <el-icon><Menu /></el-icon>
              {{ $t("_settings.headerSwitch") }}
            </el-divider>
          </template>
        </AsideHeaderSwitch>
      </template>
    </template>

    <!-- 标签页切换 -->
    <TabsNavSwitch>
      <el-divider :class="ns.e('divider')" content-position="center">
        <el-icon><Menu /></el-icon>
        {{ $t("_settings.tabsNavSwitch") }}
      </el-divider>
    </TabsNavSwitch>

    <!-- 全局主题 -->
    <ThemeSelect>
      <el-divider :class="ns.e('divider')" content-position="center">
        <el-icon><ColdDrink /></el-icon>
        {{ $t("_settings.globalTheme") }}
      </el-divider>
    </ThemeSelect>

    <!-- 界面设置 -->
    <LayoutSelect>
      <el-divider :class="ns.e('divider')" content-position="center">
        <el-icon><Setting /></el-icon>
        {{ $t("_settings.interfaceSettings") }}
      </el-divider>
    </LayoutSelect>

    <BrowserTitleSwitch>
      <el-divider :class="ns.e('divider')" content-position="center">
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

<style lang="scss" scoped>
@include b(theme-drawer) {
  @include e(divider) {
    margin-top: 15px;

    .#{$el-namespace}-icon {
      position: relative;
      top: 2px;
      right: 5px;
      font-size: 15px;
    }
  }
}
</style>
