<template>
  <div class="detail-pro-table-container">
    <ProTable
      ref="proTableRef"
      :columns="columns"
      :requestApi="getTicketList"
      :initRequestParam="initRequestParam"
      :default-expand-all="expandAll"
      :expand-row-keys="expandKeys"
      rowKey="id"
      :dialogForm="dialogForm"
    >
      <template #expandHeader>
        <el-button link :icon="expandAll ? ArrowUp : ArrowDown" @click="handleExpandAll" />
      </template>

      <template #expand="{ row }">
        <div style="margin-left: 70px">
          <el-descriptions title="描述类信息" :column="2" border>
            <el-descriptions-item label="Description" label-class-name="description-label" width="120" :span="2">
              {{ row.description }}
            </el-descriptions-item>
            <el-descriptions-item label="Root Cause" :span="2">{{ row.rootCause }}</el-descriptions-item>
          </el-descriptions>

          <el-descriptions title="基础类信息" :column="4" style="margin-top: 20px" border>
            <el-descriptions-item label="Create User">{{ row.createUser }}</el-descriptions-item>
            <el-descriptions-item label="Create Time">{{ row.createTime }}</el-descriptions-item>
          </el-descriptions>

          <div style="margin: 16px 0; font-size: 16px; font-weight: 700">Actions</div>

          <el-collapse v-model="collapseActive" v-for="item in row.actionList" :key="item.actionId">
            <el-collapse-item :name="item.actionId">
              <template #title>
                <Grid :gap="[5, 0]">
                  <GridItem>{{ item.actionId }}</GridItem>
                  <GridItem :span="2">{{ item.actionUpdateUser }}</GridItem>
                  <GridItem>{{ item.actionUpdateTime }}</GridItem>
                </Grid>
              </template>
              <span v-html="item.actionDesc"></span>
            </el-collapse-item>
          </el-collapse>
        </div>
      </template>

      <!-- <template #operation>
        <el-button link type="info" size="small" :icon="Document" class="btn-info">附件</el-button>
        <el-button link type="primary" size="small" :icon="Edit" class="btn-primary">编辑</el-button>
        <el-button link type="danger" size="small" :icon="Delete" class="btn-primary">删除</el-button>
      </template> -->

      <!-- <template #form>
        <ProForm :options="options" v-model="form"></ProForm>
      </template> -->
    </ProTable>
  </div>
</template>
<script setup lang="tsx" name="CommonTicket">
import { ProTable, Grid, GridItem, type TableColumnProps } from "@/components";
// import ProForm from "@/components";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import { schema, elFormProps } from "@/views/proComponents/proForm/detailProForm/options";

interface ProblemData {
  id: string;
  ticketNo: string;
  ticketDesc: string;
  priority: string;
  status: string;
  eventStartTime: string;
  eventEndTime: string;
  dueDate: string;
  owner: string;
  description: string;
  rootCause: string;
  createUser: string;
  createTime: string;
  actionList: any[];
}

const getTicketList = () => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      status: "success",
      data: {
        list: [
          {
            id: "100338",
            ticketNo: "k100338",
            ticketDesc: "这是一封测试信",
            priority: "低",
            status: "Open",
            eventStartTime: "2023-09-28 08:00:00",
            eventEndTime: "2023-10-07 18:00:00",
            dueDate: "2023-10-07",
            owner: "k100338",
            description: "这是一封测试信",
            rootCause: "根因分析",
            createUser: "Kobe Liu",
            createTime: "2023-10-08 24:00:00",
            actionList: [
              {
                actionId: 1,
                actionDesc: "这是一封测试信 Action 记录 1",
                actionUpdateUser: "Kobe Liu",
                actionUpdateTime: "2023-10-08 24:00:00",
              },
              {
                actionId: 2,
                actionDesc: "这是一封测试信 Action 记录 2",
                actionUpdateUser: "Kobe Liu",
                actionUpdateTime: "2023-10-09 15:00:00",
              },
              {
                actionId: 3,
                actionDesc: "这是一封测试信 Action 记录 3",
                actionUpdateUser: "Kobe Liu",
                actionUpdateTime: "2023-10-09 16:00:00",
              },
            ],
          },
          {
            id: "100378",
            ticketNo: "j100378",
            ticketDesc: "这是一封偏爱信",
            priority: "高",
            status: "Open",
            eventStartTime: "2023-09-28 08:00:00",
            eventEndTime: "2023-10-07 18:00:00",
            dueDate: "2072-01-16",
            owner: "j100378",
            description: "这是一封偏爱信",
            rootCause: "根因分析",
            createUser: "Jessany Liu",
            createTime: "2023-10-08 20:00:00",
            actionList: [
              {
                actionId: 1,
                actionDesc: "这是一封偏爱信 Action 记录 1",
                actionUpdateUserName: "Jessany Liu",
                actionUpdateTime: "2023-10-08 20:00:00",
              },
              {
                actionId: 2,
                actionDesc: "这是一封偏爱信 Action 记录 2",
                actionUpdateUserName: "Jessany Liu",
                actionUpdateTime: "2023-10-10 12:00:00",
              },
              {
                actionId: 3,
                actionDesc: "这是一封偏爱信 Action 记录 3",
                actionUpdateUserName: "Jessany Liu",
                actionUpdateTime: "2023-10-11 18:00:00",
              },
            ],
          },
        ],
        pageNum: 1,
        total: 2,
        pageSize: 20,
      },
    });
  });
};

const initRequestParam = { serviceName: "ETS_MIT_iWork_problem" };

const columns: TableColumnProps<ProblemData>[] = [
  { type: "expand", label: "Expand", width: 50 },
  { prop: "ticketNo", label: "TicketNo", width: 100, search: { el: "el-input" } },
  { prop: "ticketDesc", label: "TicketDesc", search: { el: "el-input" } },
  { prop: "priority", label: "Priority", width: 80 },
  { prop: "status", label: "Status", width: 70 },
  {
    prop: "eventTime",
    label: "EventTime",
    width: 160,
    render: ({ row }) => {
      return (
        <>
          <span>{row.eventStartTime}</span> {row.eventEndTime && <div>~</div>} <span>{row.eventEndTime}</span>
        </>
      );
    },
  },
  { prop: "dueDate", label: "DueDate", width: 110, search: { el: "el-date-picker" } },
  { prop: "owner", label: "Owner", width: 110 },
  { prop: "operation", label: "操作", fixed: "right", width: 140 },
];

const dialogForm = {
  formProps: {
    schema,
    elFormProps,
  },
  useAdd: true,
  useEdit: true,
  useDelete: true,
  dialog: { title: "测试", width: "90%", top: "2vh", closeOnClickModal: false, height: 700 },
};

const proTableRef = shallowRef();
// const form = ref({});
const expandAll = ref(true);
const expandKeys = ref<string[]>([]);
const collapseActive = ref([]);

const tableData = computed(() => proTableRef.value?.tableData as ProblemData[]);

const handleExpandAll = () => {
  expandAll.value = !expandAll.value;
  if (expandAll.value) expandKeys.value = tableData.value?.map(item => item.id);
  else expandKeys.value = [];
};
</script>

<style lang="scss" scoped>
.detail-pro-table-container {
  padding: 10px;
}
</style>
