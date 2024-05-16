<template>
  <el-card>
    <h2>长按指令</h2>
    <p>在标签上加 v-longPress="longPress"，其中 longPress 为长按的事件</p>
    <el-button type="primary" v-longPress="longPress">长按 2 秒触发事件</el-button>
  </el-card>
</template>

<script setup lang="ts" name="LongPress">
import { ElMessage } from "element-plus";
const longPress = () => {
  ElMessage.success("长按事件触发成功 🎉🎉🎉");
};
</script>
