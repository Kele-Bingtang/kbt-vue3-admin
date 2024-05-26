<template>
  <div style="padding: 10px">
    <el-card shadow="never" style="padding: 20px">
      <template #header>
        <div>超级表单详情页</div>
      </template>
      <ProForm :formProps="formProps" :rowProps="{ col: { span: 12 } }" :schema="schema" v-model="model"></ProForm>
    </el-card>

    {{ model }}
  </div>
</template>

<script setup lang="ts" name="DetailProForm">
import { ProForm } from "@/components";
import { schema, formProps } from "./options";

const model = ref({});
</script>
