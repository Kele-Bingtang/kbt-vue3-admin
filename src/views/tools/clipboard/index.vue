<template>
  <div class="clipboard-container">
    <p>vue-clipboard3 插件：点击按钮即可复制内容</p>
    <el-input v-model="content" placeholder="请输入" style="width: 400px; max-width: 100%" />
    <el-button type="primary" :icon="Document" @click="doClipboard()">复制</el-button>

    <el-divider />

    <p>@vueuse/core 插件：点击按钮即可复制内容</p>
    <div v-if="isSupported">
      <el-input v-model="source" placeholder="请输入" style="width: 400px; max-width: 100%" />
      <el-button type="primary" :icon="Document" @click="copy(source)">复制</el-button>

      <p>
        <span v-if="copied">复制成功！</span>
        当前值:
        <code>{{ text || "none" }}</code>
      </p>
    </div>
    <p v-else>你的浏览器不支持 Clipboard API</p>
  </div>
</template>

<script setup lang="ts" name="Clipboard">
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import { Document } from "@element-plus/icons-vue";
import { useClipboard as vueuseClipboard } from "@vueuse/core";

const source = ref("https://github.com/Kele-Bingtang/kbt-vue3-admin");
const { text, copy, copied, isSupported } = vueuseClipboard({ source });

const { toClipboard } = useClipboard();
const content = ref("https://github.com/Kele-Bingtang/kbt-vue3-admin");

const doClipboard = () => {
  toClipboard(content.value) // 复制该内容前，你可以添加以前额外的信息，如个人版权声明
    .then(() => {
      clipboardSuccess();
    })
    .catch(() => {
      clipboardFailed();
    });
};

const clipboardSuccess = () => {
  ElMessage({
    message: "Copy successfully",
    type: "success",
    duration: 1500,
  });
};
const clipboardFailed = () => {
  ElMessage({
    message: "Copy failed",
    type: "error",
    duration: 1500,
  });
};
</script>

<style lang="scss" scoped>
.clipboard-container {
  padding: 20px;
  background-color: #ffffff;
}
</style>
