<template>
  <div class="common-ticket-container">
    <ProTable
      ref="proTableRef"
      :columns="columns"
      :requestApi="getTicketList"
      :initRequestParam="initRequestParam"
      :default-expand-all="expandAll"
      :expand-row-keys="expandKeys"
      rowKey="Id"
      :dialog="dialogConfig"
    >
      <template #expandHeader>
        <el-button link style="" :icon="expandAll ? ArrowUp : ArrowDown" @click="handleExpandAll" />
      </template>
      <template #expand="{ row }">
        <div style="margin-left: 70px">
          <el-descriptions title="描述类信息" :column="2" border>
            <el-descriptions-item label="Description" label-class-name="description-label" width="120" :span="2">
              {{ row.Description }}
            </el-descriptions-item>
            <el-descriptions-item label="Root Cause" :span="2">{{ row.RootCause }}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="基础类信息" :column="4" style="margin-top: 20px" border>
            <el-descriptions-item label="Create User">{{ row.CreateUser }}</el-descriptions-item>
            <el-descriptions-item label="Create Time">{{ row.CreateTime }}</el-descriptions-item>
          </el-descriptions>
          <div style="margin: 16px 0; font-size: 16px; font-weight: 700">Actions</div>
          <el-collapse v-model="collapseActive" v-for="(item, index) in row.ActionList" :key="item.ActionId">
            <el-collapse-item :name="item.ActionId">
              <template #title>
                <Grid :gap="[5, 0]">
                  <GridItem>{{ index + 1 }}</GridItem>
                  <GridItem :span="2">{{ item.ActionUpdateUserName }}</GridItem>
                  <GridItem>{{ item.ActionUpdateTime }}</GridItem>
                </Grid>
              </template>
              <span v-html="item.ActionDesc"></span>
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
    resolve([]);
  });
};

const initRequestParam = { serviceName: "ETS_MIT_iwork_problem" };

const columns: ColumnProps[] = [
  { type: "expand", label: "Expand", width: 50 },
  { prop: "TicketNo", label: "TicketNo", width: 100 },
  { prop: "TicketDesc", label: "TicketDesc" },
  { prop: "PriorityName", label: "Priority", width: 80 },
  { prop: "StatusName", label: "Status", width: 70 },
  {
    prop: "EventTimeStr",
    label: "EventTime",
    width: 140,
    render: ({ row }) => {
      return (
        <>
          <span>{row.EventStartTimeStr}</span> {row.EventEndTimeStr && <div>~</div>} <span>{row.EventEndTimeStr}</span>
        </>
      );
    },
  },
  { prop: "DueDateStr", label: "DueDate", width: 90 },
  { prop: "OwnerName", label: "Onwer", width: 150 },
  { prop: "operation", label: "操作", fixed: "right", width: 200 },
];

const dialogConfig = { title: "测试", width: "90%", top: "2vh", closeOnClickModal: false };

const proTableRef = shallowRef();
const form = ref({});
const expandAll = ref(true);
const expandKeys = ref<string[]>([]);
const collapseActive = ref([]);

const tableData = computed(() => proTableRef.value?.tableData as ProblemData[]);

const handleExpandAll = () => {
  expandAll.value = !expandAll.value;
  if (expandAll.value) expandKeys.value = tableData.value?.map(item => item.Id);
  else expandKeys.value = [];
};
</script>
