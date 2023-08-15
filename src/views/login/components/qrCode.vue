<template>
  <div class="qrCode-container">
    <QrCode text="模拟登录" />
    <el-divider>
      <span>扫码后点击"确认"，即可完成登录</span>
    </el-divider>
    <el-button :icon="CircleClose" round @click="switchFormMode('login')" size="large" style="">返回</el-button>
  </div>
</template>

<script setup lang="ts" name="QrCode">
import QrCode from "@/components/QrCode/index.vue";
import { CircleClose } from "@element-plus/icons-vue";

const switchFormMode = inject("switchFormMode") as (mode: string) => {};
</script>

<style lang="scss" scoped>
.qrCode-container {
  text-align: center;
}
</style>
