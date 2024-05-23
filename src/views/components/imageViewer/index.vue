<template>
  <el-space fill>
    <el-card shadow="never" header="图片预览组件">
      <el-button @click="open()">打开图片预览</el-button>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="urlList">图片链接数组。`string[]` 类型，默认为 `[]`</el-descriptions-item>
        <el-descriptions-item label="zIndex">图片预览组件 z-index 样式。`string` 类型，默认 `200`</el-descriptions-item>
        <el-descriptions-item label="initialIndex">第一次加载图片的下标。`number` 类型，默认 `0`</el-descriptions-item>
        <el-descriptions-item label="infinite">是否开启循环预览功能。`boolean` 类型，默认 `true`</el-descriptions-item>
        <el-descriptions-item label="hideOnClickModal">
          是否点击遮罩层后关闭图片预览组件。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="teleported">
          是否插入到 boyd 元素。`boolean` 类型，默认 `false`
        </el-descriptions-item>
        <el-descriptions-item label="show">是否打开图片预览。`boolean` 类型，默认 `true`</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
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
