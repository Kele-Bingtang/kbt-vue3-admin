<template>
  <div class="checkbox-container">
    <el-checkbox-group v-model="formThead">
      <el-checkbox label="date">date</el-checkbox>
      <el-checkbox label="address">address</el-checkbox>
      <el-checkbox label="status">status</el-checkbox>
      <el-checkbox label="title">title</el-checkbox>
    </el-checkbox-group>
  </div>

  <el-table :data="tableData" border highlight-current-row style="width: 100%">
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column v-for="col in formThead" :key="col" :label="col">
      <template #default="{ row }">
        {{ row[col] }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" name="UnFixedHeaderTable">
import { simpleData } from "@/mock/table";

const tableData = ref(simpleData);
const formThead = ref(["date", "address"]);
</script>

<style lang="scss" scoped></style>
