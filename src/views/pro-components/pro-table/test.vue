<script setup lang="ts">
import { ProTable, type OperationNamespace, type TableColumn } from "@/components/pro/table";
import { tableData } from "@/mock/pro-table";
import { View, Edit, Delete, DocumentCopy } from "@element-plus/icons-vue";

defineOptions({ name: "Test" });

const data = ref(tableData);

const columns: TableColumn[] = [
  { type: "selection", fixed: "left", width: 60 },
  // { type: "radio", label: "单选", fixed: "left", width: 60 },
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
    filterProps: { enabled: true, formColumn: { elProps: { modelModifiers: { number: true } } } },
  },
  {
    prop: "idCard",
    label: "身份证号",
    filterProps: { enabled: true, rule: "like" },
  },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
];

const el = ref<OperationNamespace.Props["el"]>("ElIcon");
const buttons = ref<OperationNamespace.ButtonRaw[]>();

buttons.value = [
  {
    // v0.0.8开始支持 text支持函数类型
    text: row => (row.status === "1" ? "开启" : "关闭"),
    code: "status",
    icon: View,
    elProps: {
      type: "primary",
    },
  },
  {
    // 查看
    text: "查看",
    code: "view",
    elProps: (row: any) => ({
      type: "info",
      disabled: row.status === "1",
    }),
    show: (row: any) => row.status === "1",
    icon: View,
  },
  {
    // 修改
    text: "修改",
    code: "edit",
    elProps: (row: any) => ({
      type: "primary",
      disabled: row.status === "1",
    }),
    show: computed(() => true),
    confirm: {
      el: "ElPopconfirm",
    },
    icon: Edit,
  },
  {
    // 删除
    text: "删除",
    code: "delete",
    elProps: computed(() => ({ type: "danger" })),
    confirm: {
      el: "ElMessageBox",
      props: { options: { draggable: true } },
    },
    icon: Delete,
  },
  {
    text: "复制",
    code: "copy",
    elProps: {
      type: "success",
    },
    icon: DocumentCopy,
  },
];

const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("buttonClick", params);
};

const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("confirm", params);
};

const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
  console.log("cancel", params);
};
</script>

<template>
  <ProTable
    :columns
    :data
    :border="false"
    pagination
    :operation-props="{
      buttons: buttons,
      el,
      width: el === 'ElButton' ? 260 : el === 'ElIcon' ? 160 : 200,
    }"
    @button-click="handleButtonClick"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #expand="scope">
      {{ scope.row }}
    </template>
  </ProTable>
</template>
