<template>
  <el-breadcrumb :class="prefixClass" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbList" :key="breadcrumb.path">
        <span
          v-if="breadcrumb.meta.notClickBread || index === breadcrumbList.length - 1"
          :class="`${prefixClass}__no-click`"
        >
          <Icon
            v-if="breadcrumb.meta.icon && settingsStore.showBreadcrumbIcon"
            :icon="breadcrumb.meta.icon"
            :class="`${prefixClass}__icon`"
          />
          <span>{{ getTitle(breadcrumb) }}</span>
        </span>
        <a v-else @click.prevent="handleBreadcrumbClick(breadcrumb)" :class="`${prefixClass}__link`">
          <template v-if="breadcrumb.meta && breadcrumb.meta.icon">
            <Icon
              v-if="breadcrumb.meta.icon && settingsStore.showBreadcrumbIcon"
              :icon="breadcrumb.meta.icon"
              :class="`${prefixClass}__icon`"
            />
          </template>
          <span>{{ breadcrumb.meta.title }}</span>
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import { ref, watch } from "vue";
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import { useLayout } from "@/hooks";
import { ArrowRight } from "@element-plus/icons-vue";
import { compile } from "path-to-regexp";
import { useSettingsStore } from "@/stores";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("breadcrumb");

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const { getBreadcrumbs, getTitle } = useLayout();

const breadcrumbList = ref<RouteConfig[]>([]);
watch(
  () => route.fullPath,
  () => (breadcrumbList.value = getBreadcrumbs(route)),
  { immediate: true }
);

const pathCompile = (path: string) => {
  const toPath = compile(path);
  return toPath(route.params);
};

const handleBreadcrumbClick = (item: RouteConfig) => {
  const { redirect, fullPath } = item;
  // 如果是 redirect
  if (route.fullPath !== redirect) {
    if (redirect) {
      router.push(redirect).catch(err => {
        console.warn(err);
      });
      return;
    }
    if (fullPath.indexOf("?") === -1) {
      // 这里的面包屑地址以 fullPath 跳转（fullPath 已经保存在面包屑里），你也可以和通过 name 跳转
      router.push(pathCompile(fullPath)).catch(err => {
        console.warn(err);
      });
    } else {
      // 如果路由 url 是 /user/:id/:name，参数 data 为 {id: 10001, name: 'bob'}，则解析成 /user/10001/bob，格式：compile(url)(data)
      // compile 处理 URL 会把 ? 会被去掉，所以主动加上
      const f = fullPath.split("?");
      router.push(compile(f[0])(item.params) + "?" + f[1]).catch(err => {
        console.warn(err);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-breadcrumb;

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
  }

  &__icon {
    margin-right: 6px;
    font-size: 16px;

    &.svg-icon {
      font-size: 12px;
    }
  }

  &__no-click {
    display: inline-flex;
    align-items: center;
    color: #97a8be;
    cursor: text;
  }
}
</style>
