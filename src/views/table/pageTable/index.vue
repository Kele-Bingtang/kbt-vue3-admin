<template>
  <div class="page-table-container">
    <el-table :data="tablePageData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="tableStatusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template #default="{ row }">
          <Icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="tableData.length > 0"
      :total="tableData.length"
      :paging="paging"
      @pagination="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts" name="pageTable">
import Pagination, { pageSetting, type Paging } from "@/components/Pagination/index.vue";
import { largeData } from "@/mock/table";
import { tableStatusFilter } from "@/config/constant";

const tableData = ref(largeData);
const paging = reactive(pageSetting);

const tablePageData = computed(() =>
  tableData.value.slice((paging.currentPage - 1) * paging.pageSize, paging.currentPage * paging.pageSize)
);

const handleSizeChange = (pagingParam: Paging) => {
  paging.currentPage = pagingParam.currentPage;
  paging.pageSize = pagingParam.pageSize;
};
</script>

<style lang="scss" scoped>
.page-table-container {
  padding: 20px;
  background-color: #ffffff;
}
</style>
