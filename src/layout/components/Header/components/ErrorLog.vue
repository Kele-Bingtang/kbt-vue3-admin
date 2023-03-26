<template>
  <el-badge :value="props.errorCount" :max="99" :hidden="props.errorCount === 0">
    <svg-icon name="bug" width="20px" height="20px" @click.stop="openErrorLogger" />
  </el-badge>
</template>

<script setup lang="ts" name="ErrorLog">
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
.badge {
  width: 18px;
  margin-top: -5px;

  :deep(.el-badge__content.is-fixed) {
    top: 11px;
    right: 7px;
  }
}
</style>
