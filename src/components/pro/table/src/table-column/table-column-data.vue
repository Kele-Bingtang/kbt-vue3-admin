<script setup lang="ts">
import type { TableColumn } from "../types";
import { ElTableColumn, type TableColumnCtx } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { getProp } from "@/components";
import { formatCellValue, lastProp } from "../helper";

defineOptions({ name: "TableColumnData" });

defineProps<{ column: TableColumn }>();

const formatTableColumnType = (item: TableColumn) => {
  return item as unknown as TableColumnCtx<any>;
};
</script>

<template>
  <el-table-column v-bind="formatTableColumnType(column)" :align="column.align || 'center'">
    <!-- 表头插槽 - 表头内容 -->
    <template #header="scope">
      <slot name="header-before" />
      <slot v-if="column.prop" :name="`${lastProp(column.prop)}-header-before`" />

      <!-- 自定义表头 | 自定义插槽 -->
      <component v-if="column.headerRender" :is="column.headerRender(scope)" />
      <slot v-else :name="`${lastProp(column.prop!)}-header`" v-bind="scope">
        {{ scope.column.label }}
      </slot>

      <el-tooltip v-if="column.tooltip" placement="top" effect="dark" v-bind="column.tooltip">
        <!-- ElToolTip 默认插槽 -->
        <component v-if="column.tooltip.render" :is="column.tooltip.render()" />
        <!-- ElToolTip content 插槽 -->
        <template v-if="column.tooltip.contentRender" #content>
          <component v-if="column.tooltip.contentRender" :is="column.tooltip.contentRender()" />
        </template>
        <!-- ElToolTip icon -->
        <slot name="tooltip-icon">
          <el-icon :size="16"><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>

      <slot v-if="column.prop" :name="`${lastProp(column.prop)}-header-after`" />
      <slot name="header-after" />
    </template>

    <!-- 默认插槽 - 单元格内容 -->
    <template #default="scope">
      <!-- 合并表头 -->
      <template v-if="column.children">
        <TableColumnData v-for="child in column.children" :key="child.prop" :column="child" />
      </template>

      <template v-else-if="column.render">
        <component :is="column.render(scope)" />
      </template>

      <template v-else-if="$slots[lastProp(column.prop!)]">
        <slot :name="lastProp(column.prop!)" v-bind="scope" />
      </template>

      <template v-else>{{ formatCellValue(getProp(scope.row, column.prop!)) }}</template>
    </template>
  </el-table-column>
</template>
