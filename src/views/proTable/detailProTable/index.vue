<template>
  <div class="common-ticket-container">
    <ProTable
      ref="proTableRef"
      :columns="columns"
      :requestApi="getTicketList"
      :initRequestParam="initRequestParam"
      :default-expand-all="expandAll"
      :expand-row-keys="expandKeys"
      rowKey="id"
      :detailForm="detailForm"
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

      <template #operation>
        <el-button link type="info" size="small" :icon="Document" class="btn-info">附件</el-button>
        <el-button link type="primary" size="small" :icon="Edit" class="btn-primary">编辑</el-button>
        <el-button link type="danger" size="small" :icon="Delete" class="btn-primary">删除</el-button>
      </template>
      <template #form>
        <ProForm :options="options" v-model="form"></ProForm>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="tsx" name="CommonTicket">
import ProTable from "@/components/ProTable/index.vue";
import type { ColumnProps } from "@/components/ProTable/interface";
import Grid from "@/components/Grid/index.vue";
import ProForm from "@/components/ProForm/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";
import { ArrowUp, ArrowDown, Document, Edit, Delete } from "@element-plus/icons-vue";
import { options } from "@/views/proForm/detailProForm/options";

interface ProblemData {
  Id: string;
  TicketNo: string;
  TicketDesc: string;
  PriorityName: string;
  StatusName: string;
  EventTimeStr: string;
  DueDateStr: string;
  OwnerName: string;
  ActionList: any[];
}

const getTicketList = () => {
  return new Promise(resolve => {
    resolve([
      {
        id: "100338",
        ticketNo: "k100338",
        ticketDesc: "这是一封测试信",
        priority: "低",
        status: "Open",
        eventStartTime: "2023-09-28 08:00:00",
        eventEndTime: "2023-10-07 18:00:00",
        dueDate: "2023-10-07",
        ownerName: "Kobe Liu",
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
        ownerName: "Jessany Liu",
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
    ]);
  });
};

const initRequestParam = { serviceName: "ETS_MIT_iWork_problem" };

const columns: ColumnProps[] = [
  { type: "expand", label: "Expand", width: 50 },
  { prop: "ticketNo", label: "TicketNo", width: 100 },
  { prop: "ticketDesc", label: "TicketDesc" },
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
  { prop: "dueDate", label: "DueDate", width: 110 },
  { prop: "ownerName", label: "Owner", width: 110 },
  { prop: "operation", label: "操作", fixed: "right", width: 200 },
];

const detailForm = {
  dialog: { title: "测试", width: "90%", top: "2vh", closeOnClickModal: false },
};

const proTableRef = shallowRef();
const form = ref({});
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
