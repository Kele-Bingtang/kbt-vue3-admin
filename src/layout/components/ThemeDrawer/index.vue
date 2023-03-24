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
          :class="[
            'layout-item layout-vertical',
            settingsStore.layoutMode == LayoutModeType.Vertical ? 'is-active' : '',
          ]"
          @click="changeLayout(LayoutModeType.Vertical)"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Vertical"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div
          :class="[
            'layout-item layout-classic',
            settingsStore.layoutMode === LayoutModeType.Classic ? 'is-active' : '',
          ]"
          @click="changeLayout(LayoutModeType.Classic)"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Classic"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div
          :class="[
            'layout-item layout-transverse',
            settingsStore.layoutMode === LayoutModeType.Transverse ? 'is-active' : '',
          ]"
          @click="changeLayout(LayoutModeType.Transverse)"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Transverse"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div
          :class="[
            'layout-item layout-columns',
            settingsStore.layoutMode === LayoutModeType.Columns ? 'is-active' : '',
          ]"
          @click="changeLayout(LayoutModeType.Columns)"
        >
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <el-icon v-if="settingsStore.layoutMode === LayoutModeType.Columns"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="混合" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-mixins', settingsStore.layoutMode == LayoutModeType.Mixins ? 'is-active' : '']"
          @click="changeLayout(LayoutModeType.Mixins)"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-dark"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="settingsStore.layoutMode == LayoutModeType.Mixins"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="子系统" placement="top" :show-after="200">
        <div
          :class="[
            'layout-item layout-subsystem',
            settingsStore.layoutMode === LayoutModeType.Subsystem ? 'is-active' : '',
          ]"
          @click="changeLayout(LayoutModeType.Subsystem)"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="settingsStore.layoutMode === LayoutModeType.Subsystem"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
    </div>
    <template
      v-if="
        settingsStore.layoutMode === LayoutModeType.Vertical ||
        settingsStore.layoutMode === LayoutModeType.Columns ||
        settingsStore.layoutMode === LayoutModeType.Mixins ||
        settingsStore.layoutMode === LayoutModeType.Subsystem
      "
    >
      <el-divider class="divider" content-position="center">
        <el-icon><Menu /></el-icon>
        {{ $t("_settings.menuSwitch") }}
      </el-divider>
      <div class="menu-box">
        <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
          <div :class="{ 'is-dark': settingsStore.isDark }">
            <div class="menu-box-item" @click="handleMenuTheme(LayoutThemeType.Light)">
              <img src="@/assets/icons/menu-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
              <el-icon v-if="settingsStore.menuTheme === LayoutThemeType.Light"><CircleCheckFilled /></el-icon>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
          <div :class="{ 'is-dark': settingsStore.isDark }">
            <div class="menu-box-item" @click="handleMenuTheme(LayoutThemeType.Dark)">
              <img src="@/assets/icons/menu-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
              <el-icon v-if="settingsStore.menuTheme === LayoutThemeType.Dark"><CircleCheckFilled /></el-icon>
            </div>
          </div>
        </el-tooltip>
      </div>
    </template>
    <template
      v-if="
        settingsStore.layoutMode === LayoutModeType.Classic ||
        settingsStore.layoutMode === LayoutModeType.Transverse ||
        settingsStore.layoutMode === LayoutModeType.Mixins
      "
    >
      <el-divider class="divider" content-position="center">
        <el-icon><Menu /></el-icon>
        {{ $t("_settings.headerSwitch") }}
      </el-divider>
      <div class="menu-box">
        <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
          <div :class="{ 'is-dark': settingsStore.isDark }">
            <div class="menu-box-item" @click="handleHeaderTheme(LayoutThemeType.Light)">
              <img src="@/assets/icons/header-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
              <el-icon v-if="settingsStore.headerTheme === LayoutThemeType.Light"><CircleCheckFilled /></el-icon>
            </div>
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
          <div :class="{ 'is-dark': settingsStore.isDark }">
            <div class="menu-box-item" @click="handleHeaderTheme(LayoutThemeType.Dark)">
              <img src="@/assets/icons/header-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
              <el-icon v-if="settingsStore.headerTheme === LayoutThemeType.Dark"><CircleCheckFilled /></el-icon>
            </div>
          </div>
        </el-tooltip>
      </div>
    </template>
    <el-divider class="divider" content-position="center">
      <el-icon><Menu /></el-icon>
      {{ $t("_settings.tabsNavSwitch") }}
    </el-divider>
    <div class="tab-box">
      <div class="tab-item">
        <el-tooltip effect="dark" content="经典" placement="left" :show-after="200">
          <div class="tabs-nav-theme" @click="handleTabsNav(TabsNavModeType.Classic)">
            <div class="tas-nav-classic-item">
              <div class="dot"></div>
              <span class="title">首页</span>
              <el-icon><Close /></el-icon>
            </div>
            <div class="tas-nav-classic-item active">
              <div class="dot"></div>
              <span class="title">其他</span>
              <el-icon><Close /></el-icon>
            </div>
          </div>
        </el-tooltip>
        <el-icon class="check-icon" v-if="settingsStore.tabsNavMode === 'classic'"><CircleCheckFilled /></el-icon>
      </div>
      <div class="tab-item">
        <el-tooltip effect="dark" content="流行" placement="left" :show-after="200">
          <div class="tabs-nav-theme" @click="handleTabsNav(TabsNavModeType.Popular)">
            <div class="tas-nav-el-item active">
              <el-icon><HomeFilled /></el-icon>
              <span class="title">首页</span>
            </div>
            <div class="tas-nav-el-item">
              <el-icon><Menu /></el-icon>
              <span class="title">其他</span>
            </div>
          </div>
        </el-tooltip>
        <el-icon class="check-icon" v-if="settingsStore.tabsNavMode === TabsNavModeType.Popular">
          <CircleCheckFilled />
        </el-icon>
      </div>
    </div>
    <!-- 全局主题 -->
    <el-divider class="divider" content-position="center">
      <el-icon><ColdDrink /></el-icon>
      {{ $t("_settings.globalTheme") }}
    </el-divider>
    <div class="drawer-item">
      <span>{{ $t("_settings.theme") }}</span>
      <el-color-picker v-model="settingsStore.primaryTheme" :predefine="colorList" @change="changePrimary" />
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
      <el-switch v-model="settingsStore.recordTabsNav" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_settings.showLayoutLogo") }}</span>
      <el-switch v-model="settingsStore.showLayoutLogo" />
    </div>
    <div class="drawer-item">
      <span>{{ $t("_tabsNav.maximize") }}</span>
      <el-switch v-model="settingsStore.maximize" />
    </div>
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
<script setup lang="ts" name="ThemeDrawer">
import { useTheme } from "@/hooks/useTheme";
import settings from "@/config/settings";
import { useSettingsStore } from "@/stores/settings";
import { LayoutModeType, LayoutThemeType, TabsNavModeType } from "@/stores/index.d";
import mittBus from "@/utils/layout/mittBus";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useLayout } from "@/hooks/useLayout";
import { ElMessage } from "element-plus";
import variables from "@/styles/variables.module.scss";
const { changePrimary, changeGreyOrWeak, switchDark } = useTheme();
// 预定义主题颜色
const colorList = [
  settings.primaryTheme,
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
const { setBrowserTitle } = useLayout();
const handleMenuTheme = (value: LayoutThemeType) => {
  settingsStore.$patch({
    menuTheme: value,
  });
};
const handleHeaderTheme = (value: LayoutThemeType) => {
  settingsStore.$patch({
    headerTheme: value,
  });
};
const handleTabsNav = (value: TabsNavModeType) => {
  settingsStore.$patch({
    tabsNavMode: value,
  });
  if (value === TabsNavModeType.Classic) {
    settingsStore.$patch({
      showTabsNavIcon: false,
    });
  } else if (value === TabsNavModeType.Popular) {
    settingsStore.$patch({
      showTabsNavIcon: true,
    });
  }
};
// 切换布局方式
const changeLayout = (value: LayoutModeType) => {
  settingsStore.$patch({
    layoutMode: value,
  });
};
const handleSwitchDark = () => {
  const isDark = switchDark();
  const theme = isDark ? LayoutThemeType.Dark : LayoutThemeType.Light;
  handleMenuTheme(theme);
  handleHeaderTheme(theme);
};
const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  setBrowserTitle(route);
};
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
    const body = document.body as HTMLElement;
    const { layoutMode, headerTheme, isDark } = settingsStore;
    const { Vertical, Columns, Subsystem, Classic, Transverse, Mixins } = LayoutModeType;
    const { Light, Dark } = LayoutThemeType;
    body.setAttribute("class", layoutMode);
    if (!isDark) {
      if (layoutMode === Vertical || layoutMode === Columns || layoutMode === Subsystem) {
        settingsStore.$patch({ headerTheme: Light });
      }
      if (layoutMode === Classic) settingsStore.$patch({ menuTheme: Light });
      if (layoutMode === Transverse) {
        if (headerTheme === Light) settingsStore.$patch({ menuTheme: Light, isCollapse: false });
        else settingsStore.$patch({ menuTheme: Dark, isCollapse: false });
      }
      // 进入 Mixins 布局，则默认全改成暗色主题
      if (layoutMode === Mixins) settingsStore.$patch({ headerTheme: Light, menuTheme: Light });
    }
  },
  { immediate: true }
);
// 监听头部主题的切换
watch(
  () => settingsStore.headerTheme,
  () => {
    if (settingsStore.layoutMode === LayoutModeType.Transverse) {
      settingsStore.$patch({ menuTheme: settingsStore.headerTheme }); // 菜单栏亮色
    }
    // TODO：制作强大的颜色系统，在 store 添加多个变量存储用户选择的颜色，而不是写死颜色
    if (settingsStore.headerTheme === LayoutThemeType.Dark) {
      document.documentElement.style.setProperty("--header-bg-color", "#191a20");
      document.documentElement.style.setProperty("--header-text-color", "#cfd3d4");
      document.documentElement.style.setProperty("--header-line-color", "#f1f1f1");
      document.documentElement.style.setProperty("--header-logo-title-color", "#dadada");
    } else if (settingsStore.headerTheme === LayoutThemeType.Light) {
      document.documentElement.style.setProperty("--header-bg-color", "#fff");
      document.documentElement.style.setProperty("--header-text-color", "#303133");
      document.documentElement.style.setProperty("--header-line-color", "#3c3c3c1f");
      document.documentElement.style.setProperty("--header-logo-title-color", "#423e3e");
    }
  },
  {
    immediate: true,
  }
);
// 监听亮、暗色主题的切换
watchEffect(() => {
  if (settingsStore.menuTheme === LayoutThemeType.Dark) {
    // TODO：制作强大的颜色系统，在 store 添加多个变量存储用户选择的颜色，而不是写死颜色
    document.documentElement.style.setProperty("--menu-bg-color", variables.menuBgDark);
    document.documentElement.style.setProperty("--menu-text-color", variables.menuTextDark);
    document.documentElement.style.setProperty("--menu-hover-bg-color", variables.menuHoverBgDark);
    document.documentElement.style.setProperty("--menu-active-bg-color", variables.menuActiveBgDark);
    document.documentElement.style.setProperty("--sub-menu-bg-color", variables.subMenuBgDark);
    document.documentElement.style.setProperty("--sub-menu-hover-bg-color", variables.subMenuHoverBgDark);
    document.documentElement.style.setProperty("--sub-menu-active-bg-color", variables.subMenuActiveBgDark);
    document.documentElement.style.setProperty("--menu-icon-color", variables.iconDark);
    document.documentElement.style.setProperty("--menu-logo-line-color", variables.logoLineDark);
    document.documentElement.style.setProperty("--menu-logo-title-color", variables.logoTitleDark);
    document.documentElement.style.setProperty("--split-menu-active-bg-color", variables.splitMenuActiveBgDark);
  } else if (settingsStore.menuTheme === LayoutThemeType.Light) {
    document.documentElement.style.setProperty("--menu-bg-color", variables.menuBgLight);
    document.documentElement.style.setProperty("--menu-text-color", variables.menuTextLight);
    document.documentElement.style.setProperty("--menu-hover-bg-color", variables.menuHoverBgLight);
    document.documentElement.style.setProperty("--menu-active-bg-color", variables.menuActiveBgLight);
    document.documentElement.style.setProperty("--sub-menu-bg-color", variables.subMenuBgLight);
    document.documentElement.style.setProperty("--sub-menu-hover-bg-color", variables.subMenuHoverBgLight);
    document.documentElement.style.setProperty("--sub-menu-active-bg-color", variables.subMenuActiveBgLight);
    document.documentElement.style.setProperty("--menu-icon-color", variables.iconLight);
    document.documentElement.style.setProperty("--menu-logo-line-color", variables.logoLineLight);
    document.documentElement.style.setProperty("--menu-logo-title-color", variables.logoTitleLight);
    document.documentElement.style.setProperty("--split-menu-active-bg-color", variables.splitMenuActiveBgLight);
  }
});
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
