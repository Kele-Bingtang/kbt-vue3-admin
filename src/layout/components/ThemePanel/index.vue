<script setup lang="tsx">
import { ref, watch, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";
import { ElButton, ElDivider, ElDrawer, ElMessage } from "element-plus";
import { Notification, Menu, ColdDrink, Setting, Box, Refresh } from "@element-plus/icons-vue";
import { useSettingStore } from "@/stores";
import { mittBus } from "@/utils";
import { useNamespace } from "@/composables";
import { LayoutModeEnum, MenuThemeEnum } from "@/enums/appEnum";
import { mobileMaxWidthMedia, OpenThemePanelKey } from "@/config";
import { LayoutSwitch, AsideHeaderSwitch, ThemeSelect, LayoutSelect, BrowserTitleSwitch } from "./components";

defineOptions({ name: "ThemePanel" });

const ns = useNamespace("theme-drawer");

const { t } = useI18n();
const settingStore = useSettingStore();

const isMobile = useMediaQuery(mobileMaxWidthMedia);

// 重置缓存
const resetSetting = () => {
  let message = t("_setting.resetSetting");
  message = message === "_setting.resetSetting" ? "正在清除设置缓存并刷新，请稍候..." : message;
  ElMessage({
    message: message,
    duration: 1000,
    icon: "Loading",
  });

  settingStore.resetSetting();
  setTimeout(() => window.location.reload(), 1000);
};

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on(OpenThemePanelKey, () => (drawerVisible.value = true));

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => settingStore.layoutMode,
  () => {
    const { layoutMode, headerTheme, isDark } = settingStore;
    const { Subsystem, Transverse, Mixins } = LayoutModeEnum;
    const { Light, Dark } = MenuThemeEnum;

    const body = document.body as HTMLElement;
    body.setAttribute("class", layoutMode);

    if (!isDark) {
      if ([Transverse, Mixins].includes(layoutMode)) {
        if (headerTheme === Light) settingStore.$patch({ menuTheme: Light, isCollapse: false });
        else settingStore.$patch({ menuTheme: Dark, isCollapse: false });
      }
      if (layoutMode === Subsystem) settingStore.$patch({ headerTheme: Light });
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
  <el-drawer
    v-model="drawerVisible"
    :size="300"
    :lock-scroll="false"
    :with-header="false"
    close-on-click-modal
    :class="ns.b()"
    :modal-class="ns.b('modal')"
  >
    <!-- 布局切换 -->
    <Divider>
      <Icon class="icon"><Notification /></Icon>
      {{ $t("_setting.layoutSwitch") }}
    </Divider>
    <template v-if="!isMobile">
      <LayoutSwitch />

      <template v-if="[LayoutModeEnum.Subsystem].includes(settingStore.layoutMode)">
        <!-- 菜单主题切换 -->
        <Divider>
          <Icon class="icon"><Menu /></Icon>
          {{ $t("_setting.menuSwitch") }}
        </Divider>
        <AsideHeaderSwitch useAside />
      </template>

      <template v-if="[LayoutModeEnum.Transverse, LayoutModeEnum.Mixins].includes(settingStore.layoutMode)">
        <!-- 头部主题切换 -->
        <Divider>
          <Icon class="icon"><Menu /></Icon>
          {{ $t("_setting.headerSwitch") }}
        </Divider>
        <AsideHeaderSwitch useHeader />
      </template>

      <template
        v-if="
          [LayoutModeEnum.Vertical, LayoutModeEnum.Classic, LayoutModeEnum.Columns].includes(settingStore.layoutMode)
        "
      >
        <!-- 菜单主题 & 头部主题切换 -->
        <!-- <AsideHeaderSwitch useAll>
          <template #aside>
            <Divider>
              <Icon class="icon"><Menu /></Icon>
              {{ $t("_setting.menuSwitch") }}
            </Divider>
          </template>

          <template #header>
            <Divider>
              <Icon class="icon"><Menu /></Icon>
              {{ $t("_setting.headerSwitch") }}
            </Divider>
          </template>
        </AsideHeaderSwitch> -->
      </template>
    </template>

    <!-- 全局主题 -->
    <Divider>
      <Icon class="icon"><ColdDrink /></Icon>
      {{ $t("_setting.globalTheme") }}
    </Divider>
    <ThemeSelect />

    <!-- 界面设置 -->
    <Divider>
      <Icon class="icon"><Setting /></Icon>
      {{ $t("_setting.baseConfig") }}
    </Divider>
    <LayoutSelect />

    <!-- 标题设置 -->
    <Divider>
      <Icon class="icon"><Box /></Icon>
      {{ $t("_setting.titleSwitch") }}
    </Divider>
    <BrowserTitleSwitch />

    <Divider />

    <el-button plain :icon="Refresh" @click="resetSetting">
      {{ $t("_setting.resetSettingTitle") }}
    </el-button>
  </el-drawer>
</template>

<style lang="scss">
@use "@/styles/mixins/bem" as *;

@include b(theme-drawer-modal) {
  background-color: transparent;
}

@include b(theme-drawer) {
  // 背景滤镜
  background-color: rgb(255 255 255 / 0%);
  box-shadow: 0 0 30px rgb(0 0 0 / 10%);
  backdrop-filter: blur(25px);

  @include e(divider) {
    margin-top: 15px;

    > div {
      width: 100%;
      text-align: center;
      background-color: transparent;
    }

    .icon {
      position: relative;
      top: 2px;
      right: 5px;
      font-size: 15px;
    }
  }

  .#{$el-namespace}-select__wrapper,
  .#{$el-namespace}-input__wrapper {
    background-color: rgb(255 255 255 / 0%);
  }
}
</style>
