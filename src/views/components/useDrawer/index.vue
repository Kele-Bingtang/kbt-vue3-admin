<template>
  <el-card shadow="never">
    <template #header>
      <span>useDrawer 组件</span>
    </template>
    <el-button @click="openDialog()">使用函数打开 Drawer</el-button>
  </el-card>
</template>

<script setup lang="tsx" name="UseDrawerDemo">
import { useDrawer } from "@/components";

const { open } = useDrawer();

const openDialog = () => {
  open({
    title: "useDrawer 弹框",
    render: () => <el-button onClick={() => aginOpenDialog()}>使用函数打开 Drawer</el-button>,
  });
};

const aginOpenDialog = () => {
  open({
    title: "useDrawer 弹框",
    size: "60%",
    render: () => <div>我被函数再次打开</div>,
  });
};
</script>

<style lang="scss" scoped></style>
