<template>
  <el-card shadow="never">
    <template #header>
      <span>图片预览组件</span>
    </template>
    <el-button @click="open()">打开图片预览</el-button>
  </el-card>
</template>

<script setup lang="ts" name="ImageViewerDemo">
import { createImageViewer } from "@/components";

const open = () => {
  createImageViewer({
    urlList: [
      "https://i.imgtg.com/2023/01/16/QRBHS.jpg",
      "https://i.imgtg.com/2023/01/16/QRqMK.jpg",
      "https://i.imgtg.com/2023/01/16/QR57a.jpg",
    ],
  });
};
</script>
