<template>
  <el-space fill>
    <el-card shadow="never" header="UseTable 操作">
      <el-space wrap>
        <el-button @click="showSearch(false)">隐藏搜索</el-button>
        <el-button @click="showSearch(true)">显示搜索</el-button>
        <el-button @click="showTableButton(false)">隐藏表格头部按钮</el-button>
        <el-button @click="showTableButton(true)">显示表格头部按钮</el-button>
        <el-button @click="showSelections(false)">隐藏多选</el-button>
        <el-button @click="showSelections(true)">显示多选</el-button>
        <el-button @click="showPagination(false)">隐藏分页</el-button>
        <el-button @click="showPagination(true)">显示分页</el-button>
        <el-button @click="pagination({ pageNum: 2 })">切换到第二个页</el-button>
        <el-button @click="changeUsername">修改用户姓名</el-button>
        <el-button @click="showExpandedRows(false)">隐藏展开行</el-button>
        <el-button @click="showExpandedRows(true)">显示展开行</el-button>
        <el-button @click="selectAllNone">全选/全不选</el-button>
        <el-button @click="clearSelection">清空选择</el-button>
        <el-button @click="delOrAddAction">删除/添加操作列</el-button>
        <el-button @click="showOrHiddenStripe">删除/隐藏斑马纹</el-button>
        <el-button @click="fixedHeaderOrAuto">固定表头/自动</el-button>
      </el-space>
    </el-card>

    <ProTable
      :requestApi="getTicketList"
      :pagination="{ enabled: true, fake: true }"
      :columns="columns"
      @register="tableRegister"
    ></ProTable>
  </el-space>
</template>

<script setup lang="tsx" name="useProTable">
import { useProTable, ProTable, type TableColumnProps } from "@/components";
import { tableData } from "@/mock/pro-table";
import { ElButton, ElInput, ElMessage } from "element-plus";

const { tableRegister, tableMethods } = useProTable();
const { setProps, setColumn, getElTableExpose, addColumn, delColumn, clearSelection, pagination } = tableMethods;

const getTicketList = () => {
  return new Promise(resolve => {
    resolve({
      data: tableData,
    });
  });
};

const showSearch = (show: boolean) => {
  setProps({ initShowSearch: show });
};

const showTableButton = (show: boolean) => {
  setProps({ toolButton: show });
};

const showSelections = (show: boolean) => {
  setColumn([
    {
      prop: "selection",
      field: "isShow",
      value: show,
    },
  ]);
};

const showPagination = (show: boolean) => {
  setProps({ pagination: show });
};

const index = ref(1);

const changeUsername = () => {
  setColumn([
    {
      prop: "username",
      field: "label",
      value: `用户姓名 ${unref(index)}`,
    },
  ]);
  index.value++;
};

const showExpandedRows = (show: boolean) => {
  setColumn([
    {
      prop: "expand",
      field: "isShow",
      value: show,
    },
  ]);
};

const selectAllNone = async () => {
  const elTableRef = await getElTableExpose();
  elTableRef?.toggleAllSelection();
};

const showAction = ref(true);

const delOrAddAction = () => {
  if (unref(showAction)) {
    delColumn("operation");
    showAction.value = false;
  } else {
    addColumn({
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
    });
    showAction.value = true;
  }
};

const showStripe = ref(false);
const showOrHiddenStripe = () => {
  setProps({
    stripe: !unref(showStripe),
  });
  showStripe.value = !unref(showStripe);
};

const height = ref<string | number>("auto");
const fixedHeaderOrAuto = () => {
  if (unref(height) === "auto") {
    setProps({
      height: 300,
    });
    height.value = 300;
  } else {
    setProps({
      height: "auto",
    });
    height.value = "auto";
  }
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
