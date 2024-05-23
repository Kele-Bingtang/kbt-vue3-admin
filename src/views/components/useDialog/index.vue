<template>
  <el-space fill>
    <el-card shadow="never" header="useDialog 组件">
      <el-button @click="openDialog()">使用函数打开 Dialog 组件</el-button>

      <el-button @Click="visible = true">通过 modelValue 打开 Dialog 组件</el-button>

      <WorkDialog v-model="visible">我是通过 modelValue 打开的 Dialog 组件</WorkDialog>
    </el-card>
  </el-space>
</template>

<script setup lang="tsx" name="UseDialogDemo">
import { useDialog, WorkDialog } from "@/components";

const visible = ref(false);

const { open } = useDialog();

const openDialog = () => {
  open({
    title: "useDialog 弹框",
    render: () => <el-button onClick={() => aginOpenDialog()}>使用函数打开 Dialog</el-button>,
  });
};

const aginOpenDialog = () => {
  open({
    title: "useDialog 弹框",
    top: "20vh",
    render: () => <div>我被函数再次打开</div>,
  });
};
</script>
