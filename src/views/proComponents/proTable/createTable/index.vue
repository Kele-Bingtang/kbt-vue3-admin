<template>
  <RenderProTable>
    <template #tableHeader="scope">
      <el-button type="primary">新增用户</el-button>
      <el-button type="primary" plain>批量添加用户</el-button>
      <el-button type="primary" plain>导出用户数据</el-button>
      <el-button type="primary" plain>To 子集详情页面</el-button>
      <el-button type="danger" plain :disabled="!scope.isSelected">批量删除用户</el-button>
    </template>
  </RenderProTable>
</template>

<script setup lang="tsx" name="CreateTable">
import { useProTable, type TableColumnProps } from "@/components";
import { tableData } from "@/mock/pro-table";
import { ElButton, ElInput, ElMessage } from "element-plus";

const { createTable } = useProTable();

const RenderProTable = (_, context) => {
  return createTable(
    {
      pagination: { enabled: true, fake: true },
      columns: columns,
      requestApi: getTicketList,
    },
    context
  );
};

const getTicketList = () => {
  return new Promise(resolve => {
    resolve({
      data: tableData,
    });
  });
};

export interface ResUserList {
  id: string;
  username: string;
  gender: number;
  user: { detail: { age: number } };
  idCard: string;
  email: string;
  address: string;
  createTime: string;
  status: number;
  avatar: string;
  photo: any[];
  children?: ResUserList[];
}

const columns: TableColumnProps<ResUserList>[] = reactive([
  { type: "selection", prop: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", prop: "expand", label: "Expand", width: 80 },
  {
    prop: "username",
    label: "用户姓名",
    search: { el: "el-input" },
    render: scope => {
      return (
        <ElButton type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
          {scope.row.username}
        </ElButton>
      );
    },
  },
  {
    prop: "gender",
    label: "性别",
    enum: [
      { genderLabel: "男", genderValue: 1 },
      { genderLabel: "女", genderValue: 2 },
    ],
    fieldNames: { label: "genderLabel", value: "genderValue" },
    search: { el: "el-select", props: { filterable: true } },
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    search: {
      // 自定义 search 显示内容
      render: ({ model }) => {
        return (
          <div class="flx-center">
            <ElInput vModel_trim={model.minAge} placeholder="最小年龄" />
            <span style="margin: 0 10px">-</span>
            <ElInput vModel_trim={model.maxAge} placeholder="最大年龄" />
          </div>
        );
      },
    },
  },
  { prop: "idCard", label: "身份证号", search: { el: "el-input" } },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "createTime",
    label: "创建时间",
    headerRender: scope => {
      return (
        <ElButton type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
          {scope.column.label}
        </ElButton>
      );
    },
    width: 180,
    search: {
      el: "el-date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"],
    },
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 180,
    render: () => {
      return (
        <>
          <el-button plain type="primary">
            编辑
          </el-button>
          <el-button plain type="danger">
            删除
          </el-button>
        </>
      );
    },
  },
]);
</script>

<style lang="scss" scoped></style>
