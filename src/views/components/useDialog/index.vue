<template>
  <el-card shadow="never">
    <template #header>
      <span>UseDialog 组件</span>
    </template>
    <el-button @click="openDialog()">使用函数打开 Dialog</el-button>
  </el-card>
</template>

<script setup lang="tsx" name="UseDialogDemo">
import { useDialog } from "@/components/useDialog";

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
    top: "30%",
    render: () => <div>我被函数再次打开</div>,
  });
};
</script>

<style lang="scss" scoped></style>
