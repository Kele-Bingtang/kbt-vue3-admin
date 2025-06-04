<script setup lang="ts" name="DetailProForm">
import { ProForm } from "@/components";
import { column, elFormProps } from "./options";

const model = ref({});
</script>

<template>
  <div style="padding: 10px">
    <el-card shadow="never" style="padding: 20px">
      <template #header>
        <div>超级表单详情页</div>
      </template>
      <ProForm :elFormProps="elFormProps" :colProps="{ span: 12 }" :column="column" v-model="model"></ProForm>
    </el-card>

    {{ model }}
  </div>
</template>
