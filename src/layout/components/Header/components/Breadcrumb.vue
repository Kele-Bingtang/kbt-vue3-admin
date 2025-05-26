<script setup lang="ts" name="Breadcrumb">
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useLayout, useNamespace } from "@/composables";
import { useSettingsStore } from "@/stores";

const ns = useNamespace("breadcrumb");

const route = useRoute();
const settingsStore = useSettingsStore();
const { getBreadcrumbs } = useLayout();

const breadcrumbList = ref<RouteLocationNormalizedLoaded[]>([]);
watch(
  () => route.fullPath,
  () => (breadcrumbList.value = getBreadcrumbs(route)),
  { immediate: true }
);
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
@include b(breadcrumb) {
  margin-left: 10px;
  overflow: hidden;

  @include e(link) {
    display: inline-flex;
    align-items: center;
    color: getCssVar(layout-header-breadcrumb-link-color);

    &:not(.no-click):hover {
      color: getCssVar(main-color);
    }

    @include no(click) {
      color: getCssVar(layout-header-breadcrumb-text-color);
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
