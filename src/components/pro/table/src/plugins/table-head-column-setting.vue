<script setup lang="ts">
import type { TableColumn } from "../types";
import { useNamespace } from "@/composables";

defineOptions({ name: "TableHeadColumnSetting" });

const ns = useNamespace("pro-table-head-column-setting");

export interface TableHeadColumnSettingProps {
  columns?: TableColumn[];
  emptyText?: string;
}

withDefaults(defineProps<TableHeadColumnSettingProps>(), {
  columns: () => [],
  emptyText: "暂无可配置列",
});

const visible = defineModel({ default: false });

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

defineExpose({ open, close });
</script>

<template>
  <el-drawer v-model="visible" title="列设置" :size="450" :class="ns.b()">
    <el-table :data="columns" :border="true" row-key="prop" default-expand-all>
      <el-table-column prop="label" align="center" label="列名" />

      <el-table-column v-slot="{ row }" prop="hide" align="center" label="显示">
        <el-switch v-model="row.hide" :active-value="false" :inactive-value="true" :disabled="row.disabledHide" />
      </el-table-column>

      <el-table-column v-slot="{ row }" prop="sortable" align="center" label="排序">
        <el-switch v-model="row.sortable" :disabled="row.disabledSortable" />
      </el-table-column>

      <el-table-column v-slot="{ row }" prop="filter" align="center" label="筛选">
        <el-switch v-model="row.filter" :disabled="row.disabledFilter" />
      </el-table-column>

      <template #empty>
        <div :class="ns.e('empty')">
          <img src="@/assets/images/notData.png" alt="notData" />
          <div>{{ emptyText }}</div>
        </div>
      </template>
    </el-table>
  </el-drawer>
</template>
