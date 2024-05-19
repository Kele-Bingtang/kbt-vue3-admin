<template>
  <el-card shadow="never" header="useDrawer 组件">
    <el-button @click="openDialog()">使用函数打开 Drawer</el-button>

    <el-button @Click="visible = true">通过 modelValue 打开 Dialog 组件</el-button>

    <WorkDrawer v-model="visible">我是通过 modelValue 打开的 Dialog 组件</WorkDrawer>
  </el-card>
</template>

<script setup lang="tsx" name="UseDrawerDemo">
import { useDrawer, WorkDrawer } from "@/components";

const visible = ref(false);

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
