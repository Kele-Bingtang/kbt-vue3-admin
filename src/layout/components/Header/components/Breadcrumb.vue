<template>
  <el-breadcrumb :class="prefixClass" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <template v-for="(breadcrumb, index) in breadcrumbList" :key="breadcrumb.path">
        <el-breadcrumb-item>
          <div
            v-if="breadcrumb.meta.notClickBread || index === breadcrumbList.length - 1"
            :class="`${prefixClass}__link no-click`"
          >
            <Icon
              v-if="breadcrumb.meta?.icon && settingsStore.showBreadcrumbIcon"
              :icon="breadcrumb.meta.icon"
              :class="`${prefixClass}__icon`"
            />
            <span>{{ breadcrumb.meta.title }}</span>
          </div>
          <router-link
            v-else
            :to="{ path: breadcrumb.meta._fullPath || breadcrumb.path }"
            :class="`${prefixClass}__link`"
          >
            <Icon
              v-if="breadcrumb.meta?.icon && settingsStore.showBreadcrumbIcon"
              :icon="breadcrumb.meta.icon"
              :class="`${prefixClass}__icon`"
            />
            <span>{{ breadcrumb.meta.title }}</span>
          </router-link>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import { ref, watch } from "vue";
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { useLayout } from "@/composables";
import { ArrowRight } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/stores";
import { useNamespace } from "@/composables";
import { useRoute, type RouteLocationNormalizedLoaded } from "vue-router";

const ns = useNamespace("breadcrumb");
const prefixClass = ns.b();

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

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-breadcrumb;

.#{$prefix-class} {
  display: flex;
  align-items: center;
  padding-right: 50px;
  overflow: hidden;
  white-space: nowrap;
  mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);

  &__link {
    display: inline-flex;
    align-items: center;

    &.no-click {
      display: inline-flex;
      align-items: center;
      color: #97a8be;
      cursor: text;
    }
  }

  &__icon {
    margin-right: 6px;
    font-size: 16px;

    &.svg-icon {
      font-size: 12px;
    }
  }
}
</style>
