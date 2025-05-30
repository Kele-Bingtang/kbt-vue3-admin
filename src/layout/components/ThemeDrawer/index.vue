<script setup lang="tsx">
import { ref, watch, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";
import { ElButton, ElDivider, ElDrawer, ElMessage } from "element-plus";
import { Notification, Menu, ColdDrink, Setting, Box, Refresh } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/stores";
import { mittBus } from "@/utils";
import { useNamespace } from "@/composables";
import { LayoutModeEnum, MenuThemeEnum } from "@/enums/appEnum";
import { mobileMaxWidthMedia } from "@/config";
import { LayoutSwitch, AsideHeaderSwitch, ThemeSelect, LayoutSelect, BrowserTitleSwitch } from "./components";

defineOptions({ name: "ThemeDrawer" });

const ns = useNamespace("theme-drawer");

const { t } = useI18n();
const settingsStore = useSettingsStore();

const isMobile = useMediaQuery(mobileMaxWidthMedia);

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

const Divider = defineComponent({
  setup(_, { slots }) {
    return () => (
      <ElDivider class={ns.e("divider")} content-position="center">
        {slots.default?.()}
      </ElDivider>
    );
  },
});
</script>

<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="300px" :class="ns.b()">
    <!-- 布局切换 -->
    <Divider>
      <Icon class="icon"><Notification /></Icon>
      {{ $t("_settings.layoutSwitch") }}
    </Divider>
    <template v-if="!isMobile">
      <LayoutSwitch />

      <template v-if="[LayoutModeEnum.Subsystem].includes(settingsStore.layoutMode)">
        <!-- 菜单主题切换 -->
        <Divider>
          <Icon class="icon"><Menu /></Icon>
          {{ $t("_settings.menuSwitch") }}
        </Divider>
        <AsideHeaderSwitch useAside />
      </template>

      <template v-if="[LayoutModeEnum.Transverse, LayoutModeEnum.Mixins].includes(settingsStore.layoutMode)">
        <!-- 头部主题切换 -->
        <Divider>
          <Icon class="icon"><Menu /></Icon>
          {{ $t("_settings.headerSwitch") }}
        </Divider>
        <AsideHeaderSwitch useHeader />
      </template>

      <template
        v-if="
          [LayoutModeEnum.Vertical, LayoutModeEnum.Classic, LayoutModeEnum.Columns].includes(settingsStore.layoutMode)
        "
      >
        <!-- 菜单主题 & 头部主题切换 -->
        <AsideHeaderSwitch useAll>
          <template #aside>
            <Divider>
              <Icon class="icon"><Menu /></Icon>
              {{ $t("_settings.menuSwitch") }}
            </Divider>
          </template>

          <template #header>
            <Divider>
              <Icon class="icon"><Menu /></Icon>
              {{ $t("_settings.headerSwitch") }}
            </Divider>
          </template>
        </AsideHeaderSwitch>
      </template>
    </template>

    <!-- 全局主题 -->
    <Divider>
      <Icon class="icon"><ColdDrink /></Icon>
      {{ $t("_settings.globalTheme") }}
    </Divider>
    <ThemeSelect />

    <!-- 界面设置 -->
    <Divider>
      <Icon class="icon"><Setting /></Icon>
      {{ $t("_settings.interfaceSettings") }}
    </Divider>
    <LayoutSelect />

    <!-- 标题设置 -->
    <Divider>
      <Icon class="icon"><Box /></Icon>
      {{ $t("_settings.titleSwitch") }}
    </Divider>
    <BrowserTitleSwitch />

    <Divider />

    <el-button plain :icon="Refresh" @click="resetSettings">
      {{ $t("_settings.resetSettingsTitle") }}
    </el-button>
  </el-drawer>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

@include b(theme-drawer) {
  @include e(divider) {
    margin-top: 15px;

    .icon {
      position: relative;
      top: 2px;
      right: 5px;
      font-size: 15px;
    }
  }
}
</style>
