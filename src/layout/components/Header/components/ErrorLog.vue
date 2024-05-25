<template>
  <el-badge :class="prefixClass" :value="props.errorCount" :max="99" :hidden="props.errorCount === 0">
    <Icon name="bug" width="20px" height="20px" @click.stop="openErrorLogger" />
  </el-badge>
</template>

<script setup lang="ts" name="ErrorLog">
import { ElBadge } from "element-plus";
import { useDesign } from "@/hooks";
import { useRoute, useRouter } from "vue-router";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("error-badge");

const route = useRoute();
const router = useRouter();
const props = defineProps<{ errorCount: number }>();

// 打开错误日志页面
const openErrorLogger = () => {
  if (route.path !== "/error-log") {
    router.push("/error-log");
  }
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$admin-namespace}-error-badge;

.#{$prefix-class} {
  :deep(.#{$el-namespace}-badge__content.is-fixed) {
    top: 11px;
    right: 7px;
  }
}
</style>
