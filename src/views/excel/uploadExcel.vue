<template>
  <div class="upload-excel-container">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script setup lang="ts" name="UploadExcel">
import { UploadExcel } from "@/components";
import type { ExcelData } from "@/components/ExcelUpload/src/index.vue";
import { ElMessage } from "element-plus";

const tableData = ref([]);
const tableHeader = ref<string[]>([]);

const beforeUpload = (file: File) => {
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (isLt1M) {
    return true;
  }
  ElMessage.warning("Please do not upload files larger than 1m in size.");
  return false;
};
const handleSuccess = ({ results, header }: ExcelData) => {
  tableData.value = results;
  tableHeader.value = header;
};
</script>

<style lang="scss" scoped>
.upload-excel-container {
  padding: 20px;
  background-color: #ffffff;
}
</style>
