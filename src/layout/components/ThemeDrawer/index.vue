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
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
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
      </el-tooltip>
      <el-tooltip effect="dark" content="Portal" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-portal', settingsStore.layoutMode === 'portal' ? 'is-active' : '']"
          @click="changeLayout('portal')"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="settingsStore.layoutMode === 'portal'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
    </div>
    <br />

    <template
      v-if="
        settingsStore.layoutMode === 'vertical' ||
        settingsStore.layoutMode === 'columns' ||
        settingsStore.layoutMode === 'portal'
      "
    >
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
    </template>

    <template v-if="settingsStore.layoutMode === 'classic' || settingsStore.layoutMode === 'transverse'">
      <el-divider class="divider" content-position="center">
        <el-icon><Menu /></el-icon>
        {{ $t("_settings.headerSwitch") }}
      </el-divider>

      <div class="menu-box">
        <el-tooltip effect="dark" content="亮色" placement="top" :show-after="200">
          <div class="menu-box-item" @click="handleHeaderTheme('light')">
            <img src="@/assets/icons/header-light.svg" alt="亮色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === 'light'"><CircleCheckFilled /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="暗色" placement="top" :show-after="200">
          <div class="menu-box-item" @click="handleHeaderTheme('dark')">
            <img src="@/assets/icons/header-dark.svg" alt="暗色主题" style="width: 95px; height: 67px" />
            <el-icon v-if="settingsStore.headerTheme === 'dark'"><CircleCheckFilled /></el-icon>
          </div>
        </el-tooltip>
      </div>
      <br />
    </template>

    <el-divider class="divider" content-position="center">
      <el-icon><Menu /></el-icon>
      {{ $t("_settings.tabsNavSwitch") }}
    </el-divider>

    <div class="tab-box">
      <div class="tab-item">
        <el-tooltip effect="dark" content="经典" placement="left" :show-after="200">
          <div class="tabs-nav-theme" @click="handleTabsNav('classic')">
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
          <div class="tabs-nav-theme" @click="handleTabsNav('popular')">
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
        <el-icon class="check-icon" v-if="settingsStore.tabsNavMode === 'popular'"><CircleCheckFilled /></el-icon>
      </div>
    </div>

    <br />
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
      <el-switch v-model="settingsStore.recordTabsNav" />
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
import { useTheme } from "@/hooks/useTheme";
import settings from "@/config/settings";
import { useSettingsStore } from "@/stores/settings";
import type { LayoutModeType, LayoutThemeType, TabsNavModeType } from "@/stores";
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
const { setTitle } = useLayout();

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
  if (value === "classic") {
    settingsStore.$patch({
      showTabsNavIcon: false,
    });
  } else if (value === "popular") {
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
  switchDark();
  handleMenuTheme("dark");
};

const handleTitleModeSelect = () => {
  // 根据选择的标题模式，重新渲染浏览器标题
  setTitle(route as RouteConfig);
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
    body.setAttribute("class", settingsStore.layoutMode);
    if (settingsStore.layoutMode === "classic" && settingsStore.menuTheme !== "light") {
      settingsStore.$patch({ menuTheme: "light" }); // 菜单栏暗色
    }
    if (settingsStore.layoutMode === "transverse") {
      settingsStore.$patch({ menuTheme: settingsStore.headerTheme, isCollapse: false }); // 菜单栏亮色
    }
  },
  { immediate: true }
);

// 监听布局的切换
watch(
  () => settingsStore.headerTheme,
  () => {
    if (settingsStore.layoutMode === "transverse") {
      settingsStore.$patch({ menuTheme: settingsStore.headerTheme }); // 菜单栏亮色
    }
    if (settingsStore.headerTheme === "dark") {
      document.documentElement.style.setProperty("--header-bg-color", "#191a20");
      document.documentElement.style.setProperty("--header-text-color", "#cfd3d4");
      document.documentElement.style.setProperty("--header-line-color", "#f1f1f1");
      document.documentElement.style.setProperty("--header-logo-title-color", "#dadada");
    } else if (settingsStore.headerTheme === "light") {
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
  if (settingsStore.menuTheme === "dark") {
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
  } else if (settingsStore.menuTheme === "light") {
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
