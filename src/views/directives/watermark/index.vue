<script setup lang="ts" name="Watermark"></script>

<template>
  <el-space fill>
    <el-card
      shadow="never"
      header="自定义水印指令"
      v-waterMarker="{ text: 'Kbt Admin', font: '16px', textColor: 'rgba(180, 180, 180, 0.6)' }"
    >
      <p>在标签上加 v-waterMarker="{ text: 'Kbt Admin', font: '16px', textColor: 'rgba(180, 180, 180, 0.6)' }"</p>
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="text">水印文字</el-descriptions-item>
        <el-descriptions-item label="font">水印大写，支持添加字体</el-descriptions-item>
        <el-descriptions-item label="textColor">水印文字颜色</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>
