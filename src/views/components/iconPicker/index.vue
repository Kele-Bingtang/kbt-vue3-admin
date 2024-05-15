<template>
  <el-card shadow="never" header="图片选择器">
    <div style="width: 600px">
      <IconPicker v-model="currentIcon" />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="IconPickerDemo">
import { IconPicker } from "@/components/IconPicker";

const currentIcon = ref("");
</script>
