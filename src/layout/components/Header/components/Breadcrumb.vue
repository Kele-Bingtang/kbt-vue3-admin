<script setup lang="ts" name="">
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useBreadcrumbs, useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";

defineOptions({ name: "Breadcrumb" });

const ns = useNamespace("breadcrumb");

const settingsStore = useSettingsStore();
const { breadcrumbList } = useBreadcrumbs();
</script>

<template>
  <el-breadcrumb :class="[ns.b(), 'flx-align-center']" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <template v-for="(breadcrumb, index) in breadcrumbList" :key="breadcrumb.path">
        <el-breadcrumb-item>
          <div
            v-if="breadcrumb.meta.notClickBread || index === breadcrumbList.length - 1"
            :class="[ns.e('link'), ns.no('click')]"
          >
            <Icon
              v-if="breadcrumb.meta?.icon && settingsStore.showBreadcrumbIcon"
              :icon="breadcrumb.meta.icon"
              :class="ns.e('icon')"
            />
            <span>{{ breadcrumb.meta.title }}</span>
          </div>

          <router-link v-else :to="{ path: breadcrumb.meta._fullPath || breadcrumb.path }" :class="ns.e('link')">
            <Icon
              v-if="breadcrumb.meta?.icon && settingsStore.showBreadcrumbIcon"
              :icon="breadcrumb.meta.icon"
              :class="ns.e('icon')"
            />
            <span>{{ breadcrumb.meta.title }}</span>
          </router-link>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;
@use "@/styles/mixins/function" as *;

@include b(breadcrumb) {
  margin-left: 10px;
  overflow: hidden;

  @include e(link) {
    display: inline-flex;
    align-items: center;
    color: cssVar(layout-header-breadcrumb-link-color);

    &:not(.no-click):hover {
      color: cssVar(main-color);
    }

    @include no(click) {
      color: cssVar(layout-header-breadcrumb-text-color);
    }
  }

  @include e(icon) {
    margin-right: 6px;
    font-size: 16px;

    &.svg-icon {
      font-size: 12px;
    }
  }
}
</style>
