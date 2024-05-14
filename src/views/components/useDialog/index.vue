<template>
  <el-card shadow="never">
    <template #header>
      <span>Dialog 组件</span>
    </template>
    <el-button @click="openDialog()">使用函数打开 Dialog 组件</el-button>

    <el-button @Click="visible = true">通过 modelValue 打开 Dialog 组件</el-button>

    <Dialog v-model="visible">我是通过 modelValue 打开的 Dialog 组件</Dialog>
  </el-card>
</template>

<script setup lang="tsx" name="UseDialogDemo">
import { useDialog, Dialog } from "@/components";

const visible = ref(false);

const { open } = useDialog();

const openDialog = () => {
  open({
    title: "useDialog 弹框",
    render: () => <el-button onClick={() => aginOpenDialog()}>使用函数打开 Dialog</el-button>,
  });
  // visible.value = true;
};

const aginOpenDialog = () => {
  open({
    title: "useDialog 弹框",
    top: "20vh",
    render: () => <div>我被函数再次打开</div>,
  });
};
</script>

<style lang="scss" scoped></style>
