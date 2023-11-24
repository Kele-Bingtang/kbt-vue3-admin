<template>
  <div style="padding: 10px">
    <el-card shadow="never" style="padding: 20px">
      <template #header>
        <div>超级表单详情页</div>
      </template>
      <ProForm :options="options" v-model="form"></ProForm>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="DetailProForm">
import ProForm from "@/components/ProForm/index.vue";
import { options } from "./options";

const form = ref({});
</script>
