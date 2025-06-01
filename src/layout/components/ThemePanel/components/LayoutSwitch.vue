<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { LayoutModeEnum } from "@/enums/appEnum";
import { useNamespace } from "@/composables";
import { useSettingStore } from "@/stores";

defineOptions({ name: "LayoutSwitch" });

const ns = useNamespace("layout-switch");
const settingStore = useSettingStore();
const { t } = useI18n();

const { layoutMode } = storeToRefs(settingStore);

const layoutModeList = [
  {
    name: t("_setting.layoutSwitchSelect.vertical"),
    mode: LayoutModeEnum.Vertical,
    content: `<div class="dark"></div> <div class="container"> <div class="light"></div><div class="content"></div> </div>`,
  },
  {
    name: t("_setting.layoutSwitchSelect.classic"),
    mode: LayoutModeEnum.Classic,
    content: `<div class="dark"></div> <div class="container"> <div class="light"></div><div class="content"></div> </div>`,
  },
  {
    name: t("_setting.layoutSwitchSelect.horizontal"),
    mode: LayoutModeEnum.Horizontal,
    content: `<div class="dark"></div> <div class="content"></div>`,
  },
  {
    name: t("_setting.layoutSwitchSelect.columns"),
    mode: LayoutModeEnum.Columns,
    content: `<div class="dark"></div> <div class="light"></div> <div class="content"></div>`,
  },
  {
    name: t("_setting.layoutSwitchSelect.mixins"),
    mode: LayoutModeEnum.Mixins,
    content: `<div class="dark"></div> <div class="container"> <div class="dark"></div><div class="content"></div> </div>`,
  },
  {
    name: t("_setting.layoutSwitchSelect.iframe"),
    mode: LayoutModeEnum.IFrame,
    content: `<div class="dark"></div> <div class="content"></div>`,
  },
];

const switchLayoutMode = (layoutMode: LayoutModeEnum) => {
  settingStore.$patch({ layoutMode });
};
</script>

<template>
  <div :class="[ns.b(), 'flx', 'flx-wrap', 'gap-15']">
    <div v-for="item in layoutModeList" :key="item.mode" :class="ns.e('item')" @click="switchLayoutMode(item.mode)">
      <div
        :class="[ns.e('box'), ns.join(item.mode), ns.is('active', item.mode === layoutMode)]"
        v-html="item.content"
      ></div>
      <Icon :class="ns.m('icon')" v-show="item.mode === layoutMode"><CircleCheckFilled /></Icon>
      <p :class="ns.m('name')">{{ item.name }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(layout-switch) {
  @include e(item) {
    position: relative;
    width: calc(100% / 3 - 10px);
    cursor: pointer;

    @include e(box) {
      height: 55px;
      padding: 6px;
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 cssVar(gray-400);
      transition: box-shadow var(--#{$el-namespace}-transition-duration-fast);

      &:hover {
        box-shadow: 0 2px 8px 0 cssVar(gray-600);
      }

      @include is(active) {
        box-shadow: 0 0 0 2px cssVar(main-color) !important;
      }

      .dark {
        background-color: cssVar(main-color);
        border-radius: 3px;
      }

      .light {
        background-color: var(--#{$el-namespace}-color-primary-light-5);
        border-radius: 3px;
      }

      .content {
        background-color: var(--#{$el-namespace}-color-primary-light-8);
        border: 1px dashed cssVar(main-color);
        border-radius: 3px;
      }
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

  @include joins(vertical) {
    display: flex;
    justify-content: space-between;

    .dark {
      width: 20%;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 72%;

      .light {
        height: 20%;
      }

      .content {
        height: 67%;
      }
    }
  }

  @include joins(classic) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dark {
      height: 22%;
    }

    .container {
      display: flex;
      justify-content: space-between;
      height: 70%;

      .light {
        width: 20%;
      }

      .content {
        width: 70%;
      }
    }
  }

  @include joins(horizontal) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dark {
      height: 20%;
    }

    .content {
      height: 67%;
    }
  }

  @include joins(columns) {
    display: flex;
    justify-content: space-between;

    .dark {
      width: 14%;
    }

    .light {
      width: 17%;
    }

    .content {
      width: 55%;
    }
  }

  @include joins(mixins) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .dark {
      height: 22%;
    }

    .container {
      display: flex;
      justify-content: space-between;
      height: 70%;

      .dark {
        width: 20%;
        height: 100%;
      }

      .content {
        width: 70%;
      }
    }
  }

  @include joins(iframe) {
    display: flex;
    justify-content: space-between;

    .dark {
      width: 22%;
    }

    .content {
      width: 70%;
    }
  }
}
</style>
