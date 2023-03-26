<template>
  <div class="clipboard-container">
    <p>点击按钮即可复制内容</p>
    <el-input v-model="content" placeholder="Please input" style="width: 400px; max-width: 100%" />
    <el-button type="primary" icon="Document" @click="doClipboard()">复制</el-button>
  </div>
</template>

<script setup lang="ts" name="Clipboard">
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";

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
