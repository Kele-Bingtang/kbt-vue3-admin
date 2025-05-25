<template>
  <el-space fill>
    <el-card shadow="never">
      <template #header>
        <span>使用 useIcon 函数</span>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item
          label="在线 Icon 图标，传入字符串：<component :is='useIcon('ep:add-location')'></component>'></component>"
          width="300"
        >
          <component :is="useIcon('ep:add-location')"></component>
        </el-descriptions-item>
        <el-descriptions-item
          label="本地 Icon 图标，需引入 UpOutlined 再传入：<component :is='useIcon(UpOutlined)'></component>"
          width="300"
        >
          <component :is="useIcon(UpOutlined)"></component>
        </el-descriptions-item>
        <el-descriptions-item
          label="本地 FontIcon 图标：<component :is='useIcon('IF-icon-dagouyouquan')'></component>'>"
          width="300"
        >
          <component :is="useIcon('IF-icon-dagouyouquan')"></component>
        </el-descriptions-item>
        <el-descriptions-item label="本地 SVG 图标：<component :is='useIcon('SVG-bug')'></component>" width="300">
          <component :is="useIcon('SVG-bug')"></component>
        </el-descriptions-item>
        <el-descriptions-item
          label="本地 SVG 图标：<component :is='useIcon('', { name: 'bug' })'></component>"
          width="300"
        >
          <component :is="useIcon('', { name: 'bug' })"></component>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>使用 Icon 组件</span>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="在线 Icon 图标，传入字符串：<Icon icon='ep:add-location'></Icon>" width="300">
          <Icon icon="ep:add-location"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 Icon 图标，需引入 Upload 再传入：<Icon :icon='Upload'></Icon>" width="300">
          <Icon :icon="Upload"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 FontIcon 图标：<Icon icon='IF-icon-dagouyouquan'></Icon>" width="300">
          <Icon hover-color="red" icon="IF-icon-dagouyouquan"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 SVG 图标：<Icon icon='SVG-bug'></Icon>" width="300">
          <Icon icon="SVG-bug"></Icon>
        </el-descriptions-item>
        <el-descriptions-item label="本地 SVG 图标：<Icon icon='bug'></Icon>" width="300">
          <Icon icon="bug"></Icon>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>图标选择器</span>
      </template>
      <div style="width: 600px">
        <IconPicker v-model="currentIcon" tip />
      </div>
    </el-card>

    <el-card shadow="never">
      <el-descriptions title="图标选择器 配置项 📚" :column="1" border>
        <el-descriptions-item label="v-model/modelValue">接收图标名字的响应式</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="IconDemo">
import { useIcon, IconPicker } from "@/components";
import UpOutlined from "@iconify-icons/ant-design/up-outlined";
import Upload from "@iconify-icons/ant-design/upload";

import "@/assets/iconfont/iconfont.js";
import "@/assets/iconfont/iconfont.css";

const currentIcon = ref("");
</script>
