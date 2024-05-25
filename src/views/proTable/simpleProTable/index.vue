<template>
  <div class="simple-pro-table-container">
    <ProTable ref="proTable" :data="data" :columns="columns">
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus">新增用户</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain>批量添加用户</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">
          导出用户数据
        </el-button>
        <el-button type="primary" plain>To 子集详情页面</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除用户
        </el-button>
      </template>

      <template #expand="scope">
        {{ scope.row }}
      </template>

      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>

      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View">查看</el-button>
        <el-button type="primary" link :icon="EditPen">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="SimpleProTable">
import { ProTable, type TableColumnProps, type ProTableInstance } from "@/components";
import { useHandleData, usePermission } from "@/hooks";
import { ElButton, ElInput, ElMessage, ElMessageBox, ElSwitch, ElTag } from "element-plus";
import { tableData } from "@/mock/pro-table";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import { exportJsonToExcel, formatJsonToArray } from "@/utils";

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

const { hasAuth } = usePermission();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
const data = ref(tableData);

const columns: TableColumnProps<ResUserList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 80 },
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
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <ElInput vModel_trim={searchParam.minAge} placeholder="最小年龄" />
            <span style="margin: 0 10px">-</span>
            <ElInput vModel_trim={searchParam.maxAge} placeholder="最大年龄" />
          </div>
        );
      },
    },
  },
  { prop: "idCard", label: "身份证号", search: { el: "el-input" } },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    enum: [
      { userLabel: "启用", userStatus: 1 },
      { userLabel: "禁用", userStatus: 0 },
    ],
    search: { el: "el-tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <>
          {hasAuth("edit") ? (
            <ElSwitch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <ElTag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</ElTag>
          )}
        </>
      );
    },
  },
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
  { prop: "operation", label: "操作", fixed: "right", width: 330 },
];

// 删除用户信息
const deleteAccount = async (params: ResUserList) => {
  await useHandleData(() => {
    data.value = data.value.filter(item => item.id !== params.id);
  }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(() => {
    data.value = data.value.filter(item => !id.includes(item.id));
  }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: ResUserList) => {
  await useHandleData(() => {}, `重置【${params.username}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: ResUserList) => {
  await useHandleData(() => {
    row.status === 0 ? (row.status = 1) : (row.status = 0);
  }, `切换【${row.username}】用户状态`);
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() => {
    const tHeader = [] as string[];
    columns.forEach(item => {
      if (!item.type && item.prop !== "operation") tHeader.push(item.prop!);
    });
    const filterVal = tHeader;
    const d = formatJsonToArray(data.value, filterVal);
    exportJsonToExcel(tHeader, d, "proTable", undefined, undefined, true, "xlsx");
  });
};
</script>

<style lang="scss" scoped>
.simple-pro-table-container {
  padding: 10px;
}
</style>
