<template>
  <el-space fill>
    <el-card shadow="never" header="高亮组件">
      <Highlight :keys="['高亮', '点击我']" @click="handleClick">我是 高亮 组件，点击我 试试看</Highlight>
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="HighlightDemo">
import { Highlight } from "@/components";
import { message } from "@/utils";

const handleClick = (key: string) => {
  message.info(key);
};
</script>
