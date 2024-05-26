<template>
  <div>
    <ProSearch :schema="schema" v-model="model" />
  </div>
</template>

<script setup lang="ts" name="ProSearch">
import { ProSearch, type ProSearchSchemaProps } from "@/components";

const model = ref({});

const schema: ProSearchSchemaProps[] = [
  {
    label: "姓名",
    prop: "name",
    el: "el-input",
  },
  {
    label: "性别",
    prop: "sex",
    el: "el-select",
    enum: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  },
  {
    label: "年龄",
    prop: "age",
    el: "el-input-number",
    defaultValue: 18,
  },
  {
    label: "状态",
    prop: "status",
    el: "el-select",
    enum: [
      { label: "在职", value: "1" },
      { label: "离职", value: "2" },
    ],
  },
];
</script>

<style lang="scss" scoped></style>
