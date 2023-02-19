<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="300px">
    <!-- 布局切换 -->
    <el-divider class="divider" content-position="center">
      <el-icon><Notification /></el-icon>
      {{ $t("_settings.layoutSwitch") }}
    </el-divider>
    <div class="layout-box">
      <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-vertical', settingsStore.layoutMode == 'vertical' ? 'is-active' : '']"
          @click="changeLayout('vertical')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="settingsStore.layoutMode == 'vertical'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-classic', settingsStore.layoutMode === 'classic' ? 'is-active' : '']"
          @click="changeLayout('classic')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="settingsStore.layoutMode == 'classic'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <!-- <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-transverse', settingsStore.layoutMode === 'transverse' ? 'is-active' : '']"
          @click="changeLayout('transverse')"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="settingsStore.layoutMode == 'transverse'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-columns', settingsStore.layoutMode === 'columns' ? 'is-active' : '']"
          @click="changeLayout('columns')"
        >
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <el-icon v-if="settingsStore.layoutMode === 'columns'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip> -->
    </div>
    <br />

    <el-divider class="divider" content-position="center">
      <el-icon><Menu /></el-icon>
      {{ $t("_settings.menuSwitch") }}
    </el-divider>

    <div class="menu-box">
      <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
        <div class="menu-box-item" @click="handleMenuTheme('light')">
          <img src="@/assets/icons/menu-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
          <el-icon v-if="settingsStore.menuTheme === 'light'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
        <div class="menu-box-item" @click="handleMenuTheme('dark')">
          <img src="@/assets/icons/menu-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
          <el-icon v-if="settingsStore.menuTheme === 'dark'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
    </div>

    <br />
    <!-- 全局主题 -->
    <el-divider class="divider" content-position="center">
      <el-icon><ColdDrink /></el-icon>
      {{ $t("_settings.globalTheme") }}
    </el-divider>
    <div class="drawer-item">
      <span>{{ $t("_settings.theme") }}</span>
      <el-color-picker v-model="settingsStore.theme" :predefine="colorList" @change="changePrimary" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.darkMode") }}</span>
      <el-switch
        v-model="settingsStore.isDark"
        @change="handleSwitchDark"
        inline-prompt
        :active-icon="Sunny"
        :inactive-icon="Moon"
      />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.greyMode") }}</span>
      <el-switch v-model="settingsStore.isGrey" @change="changeGreyOrWeak($event as boolean, 'grey')" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.weakMode") }}</span>
      <el-switch v-model="settingsStore.isWeak" @change="changeGreyOrWeak($event as boolean, 'weak')" />
    </div>
    <br />

    <!-- 界面设置 -->
    <el-divider class="divider" content-position="center">
      <el-icon><Setting /></el-icon>
      {{ $t("_settings.interfaceSettings") }}
    </el-divider>
    <div class="drawer-item">
      <span>{{ $t("_settings.collapseMenu") }}</span>
      <el-switch v-model="settingsStore.isCollapse" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.showBreadcrumb") }}</span>
      <el-switch v-model="settingsStore.showBreadcrumb" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.showBreadcrumbIcon") }}</span>
      <el-switch v-model="settingsStore.showBreadcrumbIcon" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.showTagsNav") }}</span>
      <el-switch v-model="settingsStore.showTabsNav" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.showTabsNavIcon") }}</span>
      <el-switch v-model="settingsStore.showTabsNavIcon" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.recordTagsNav") }}</span>
      <el-switch v-model="settingsStore.recordTabsNav" @change="changeRecordTagsNav($event as boolean)" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.showLayoutLogo") }}</span>
      <el-switch v-model="settingsStore.showLayoutLogo" />
    </div>
    <br />

    <el-divider class="divider" content-position="center">
      <el-icon><Box /></el-icon>
      {{ $t("_settings.titleSwitch") }}
    </el-divider>
    <div class="drawer-item">
      <el-select
        v-model="settingsStore.titleMode"
        :placeholder="$t('_settings.titlePlaceholder')"
        @change="handleTitleModeSelect"
      >
        <el-option
          v-for="item in titleModeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.value === settingsStore.titleMode"
        ></el-option>
      </el-select>
    </div>
    <el-divider />

    <el-button plain icon="Refresh" @click="resetSettings">
      {{ $t("_settings.resetSettingsTitle") }}
    </el-button>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "@/hooks/useTheme";
import settings from "@/config/settings";
import { useSettingsStore } from "@/stores/settings";
import type { LayoutModeType, menuThemeType } from "@/stores";
import mittBus from "@/utils/mittBus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useLayout } from "@/hooks/useLayout";
import { ElMessage } from "element-plus";
import { removeCacheTabNavList } from "@/utils/cache";

const { changePrimary, changeGreyOrWeak, switchDark } = useTheme();

// 预定义主题颜色
const colorList = [
  settings.theme,
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

const { t } = useI18n();
const titleModeOptions = [
  {
    value: "0",
    label: t("_settings.titleModeOne"),
  },
  {
    value: "1",
    label: t("_settings.titleModeTwo"),
  },
  {
    value: "2",
    label: t("_settings.titleModeThree"),
  },
  {
    value: "3",
    label: t("_settings.titleModeFour"),
  },
];

const route = useRoute();
const settingsStore = useSettingsStore();
const { setTitle } = useLayout();

const handleMenuTheme = (value: menuThemeType) => {
  settingsStore.$patch({
    menuTheme: value,
  });
};

// 切换布局方式
const changeLayout = (value: LayoutModeType) => {
  settingsStore.$patch({
    layoutMode: value,
  });
};
const handleSwitchDark = () => {
  switchDark();
  handleMenuTheme("dark");
};

const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  setTitle(route as RouteConfig);
};

const changeRecordTagsNav = (value: boolean) => {
  if (!value) {
    removeCacheTabNavList();
  }
};

const resetSettings = () => {
  let message = t("_settings.resetSettings");
  message = message === "_settings.resetSettings" ? "正在清除设置缓存并刷新，请稍候..." : message;
  ElMessage({
    message: message,
    duration: 1000,
    icon: "Loading",
  });
  settingsStore.resetSettings();
  setTimeout("window.location.reload()", 1000);
};

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on("openThemeDrawer", () => (drawerVisible.value = true));

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => settingsStore.layoutMode,
  () => {
    const body = document.body as HTMLElement;
    body.setAttribute("class", settingsStore.layoutMode);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
.el-drawer {
  .el-drawer__header {
    padding: 15px 20px 14px;
    margin-bottom: 0;
  }
}
</style>
