<script setup lang="ts">
import { TableMain, type TableColumnProps } from "@/components/pro/table";
import { tableData } from "@/mock/pro-table";

defineOptions({ name: "Test" });

const data = ref(tableData);

const columns: TableColumnProps[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 80 },
  { prop: "username", label: "用户姓名" },
  {
    prop: "gender",
    label: "性别",
    options: [
      { label: "男", value: 1 },
      { label: "女", value: 2 },
    ],
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
  },
  { prop: "idCard", label: "身份证号" },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
];
</script>

<template>
  <TableMain :columns :data>
    <template #expand="scope">
      {{ scope.row }}
    </template>
  </TableMain>
</template>
