<script setup lang="ts">
import type { Component } from "vue";
import type { TableInstance } from "element-plus";
import type { ProTableMainNamespace } from "./types";
import { ElTableColumn } from "element-plus";
import { defaultPageInfo, Pagination } from "@/components";
import { useNamespace } from "@/composables";
import TableColumnData from "./table-column/table-column-data.vue";
import TableColumnOperation from "./table-column/table-column-operation.vue";
import TableColumnDragSort from "./table-column/table-column-drag-sort.vue";
import { useSelection } from "./composables";
import { isObject } from "@/utils";
import { PageMode, TableColumnTypeEnum } from "./helper";

defineOptions({ name: "TableMain" });

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableMainNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  columnTypes: () => ["selection", "radio", "index", "expand", "sort"],
  operation: false,
  pageInfo: () => defaultPageInfo,
  pagination: false,
  paginationProps: () => ({}),
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableMainNamespace.Emits>();

const ns = useNamespace("table-main");
// 表格多选
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");
const pageInfo = ref(Object.assign(defaultPageInfo, props.pageInfo));

watch(
  () => props.pageInfo,
  val => (pageInfo.value = { ...defaultPageInfo, ...val }),
  { deep: true }
);

// 表格实际渲染的数据
const tableData = computed(() => {
  const { data = [], pagination = {} } = props;
  const { pageNum, pageSize } = pageInfo.value;
  const paginationValue = toValue(pagination);

  // 服务端（后端）分页，需要自行实现 @paginationChange 事件传入分页的 data
  if (isObject(paginationValue) && paginationValue.pageMode === PageMode.Server) return data;

  // 客户端（前端）分页
  return data.slice((pageNum - 1) * pageSize, pageNum * pageSize);
});

/**
 * 多择触发事件
 */
const handleSelectionChange = (newSelection: Recordable[]) => {
  selectionChange(newSelection);
  emits("selectionChange", { isSelected, selectedList, selectedListIds });
};

/**
 * 拖拽排序结束事件
 */
const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  const [removedItem] = tableData.value.splice(oldIndex, 1);
  tableData.value.splice(newIndex, 0, removedItem);
  emits("dragSortEnd", newIndex, oldIndex);
};

/**
 * 分页改变事件
 */
const handlePaginationChange = () => {
  emits("paginationChange", pageInfo.value);
};

// 功能列
const tableColumnType: Record<TableColumnTypeEnum, { el: Component; props?: Recordable; slots?: Recordable }> = {
  [TableColumnTypeEnum.Selection]: { el: ElTableColumn, props: { reserveSelection: true } },
  [TableColumnTypeEnum.Radio]: { el: ElTableColumn },
  [TableColumnTypeEnum.Index]: { el: ElTableColumn },
  [TableColumnTypeEnum.Expand]: { el: ElTableColumn },
  [TableColumnTypeEnum.Sort]: {
    el: TableColumnDragSort,
    props: { tableInstance: elTableInstance, dragSortEnd: handleDragSortEnd },
    slots: ["drag-sort-icon"],
  },
};

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
const expose = {
  elTableInstance,
  isSelected,
  selectedList,
  selectedListIds,
};

defineExpose(expose);
</script>

<template>
  <el-table
    ref="elTableInstance"
    border
    highlight-current-row
    scrollbar-always-on
    :header-cell-style="{ 'background-color': ns.cssVar('gray-200') }"
    v-bind="$attrs"
    :data="tableData"
    :row-key
    @selection-change="handleSelectionChange"
    :class="ns.b()"
  >
    <!-- 默认插槽 -->
    <slot>
      <template v-for="column in columns.filter(c => !c.isHide)" :key="column">
        <!-- 功能列 -->
        <template v-if="column.type && columnTypes.includes(column.type)">
          <component
            :is="tableColumnType[column.type].el"
            v-bind="{ ...column, ...tableColumnType[column.type].props }"
            :align="column.align ?? 'center'"
          >
            <!-- 功能列 - 表头插槽 -->
            <template #header="scope">
              <component v-if="column.headerRender" :is="column.headerRender" v-bind="scope"></component>
              <slot v-else :name="`${column.type}-header`" v-bind="scope">{{ scope.column.label }}</slot>
            </template>

            <!-- 功能列 - 默认插槽 -->
            <template #default="scope" v-if="column.render || $slots[column.type]">
              <component v-if="column.render" :is="column.render" v-bind="scope" />
              <slot v-else :name="column.type" v-bind="scope" />
            </template>

            <!-- 功能列 - 自定义插槽 -->
            <template v-for="slot in tableColumnType[column.type].slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </component>
        </template>

        <!-- 数据列 -->
        <TableColumnData :column v-else>
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumnData>

        <!-- 操作列 -->
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
          <div>{{ emptyText }}</div>
        </slot>
      </div>
    </template>
  </el-table>

  <!-- 表格分页 -->
  <slot name="pagination">
    <Pagination
      v-if="paginationProps"
      v-model="pageInfo"
      @change="handlePaginationChange"
      :total="data.length"
      v-bind="{ ...(isObject(paginationProps) ? paginationProps : {}) }"
    />
  </slot>
</template>
