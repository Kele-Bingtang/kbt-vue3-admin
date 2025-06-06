<script setup lang="ts">
import type { OperationProps, TableColumnProps, TypeProps } from "./types";
import { useNamespace } from "@/composables";
import TableColumn from "./table-column.vue";
import TableColumnOperation from "./table-column-operation.vue";
import TableColumnDragSort from "./plugins/table-column-drag-sort.vue";
import { formatTableColumnType } from "./helper";
import type { TableInstance } from "element-plus";

defineOptions({ name: "TableMain" });

interface TableMainProps {
  columns?: TableColumnProps[]; // 列配置项
  columnTypes?: TypeProps[]; // 字段类型
  operation?: false | Partial<OperationProps>;
}

// 接受父组件参数，配置默认值
withDefaults(defineProps<TableMainProps>(), {
  columns: () => [],
  columnTypes: () => ["selection", "radio", "index", "expand", "sort"],
});

const ns = useNamespace("table-main");

const tableInstance = useTemplateRef<TableInstance>("tableInstance");

defineExpose({ tableInstance });
</script>

<template>
  <el-table ref="tableInstance" v-bind="$attrs" :class="ns.b()">
    <!-- 默认插槽 -->
    <slot>
      <template v-for="column in columns.filter(c => !c.isHide)" :key="column">
        <el-table-column
          v-if="column.type && columnTypes.includes(column.type)"
          v-bind="formatTableColumnType(column)"
          :align="column.align ?? 'center'"
          :reserve-selection="column.type == 'selection'"
        >
          <!-- 表头插槽 -->
          <template #header="scope">
            <component v-if="column.headerRender" :is="column.headerRender" v-bind="scope"></component>
            <slot v-else :name="`${column.type}-header`" v-bind="scope">{{ scope.column.label }}</slot>
          </template>

          <!-- 默认插槽 -->
          <template #default="scope">
            <!-- 展开行 -->
            <template v-if="column.type === 'expand'">
              <component v-if="column.render" :is="column.render" v-bind="scope" />
              <slot v-else :name="column.type" v-bind="scope" />
            </template>

            <!-- 拖拽行 -->
            <TableColumnDragSort v-if="column.type == 'sort'" class="move">
              <template v-if="$slots['drag-sort-icon']" #drag-sort-icon>
                <slot name="drag-sort-icon" />
              </template>
            </TableColumnDragSort>
          </template>
        </el-table-column>

        <!-- 数据列 -->
        <TableColumn :column v-else>
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>

        <TableColumnOperation v-if="operation" v-bind="operation">
          <template v-if="$slots['operation-more-icon']" #action-bar-more-icon>
            <slot name="operation-more-icon" />
          </template>
        </TableColumnOperation>
      </template>
    </slot>

    <!-- 插入表格最后一行之后的插槽 -->
    <template #append><slot name="append"></slot></template>

    <!-- 无数据 -->
    <template #empty>
      <div :class="ns.e('empty')">
        <slot name="empty">
          <img src="@/assets/images/notData.png" alt="notData" />
          <div>暂无数据</div>
        </slot>
      </div>
    </template>
  </el-table>
</template>
