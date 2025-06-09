<script setup lang="ts">
import type { Component } from "vue";
import type { TableInstance } from "element-plus";
import type { ProTableMainNamespace, TableDefaultRenderScope } from "./types";
import { ElRadio, ElTableColumn } from "element-plus";
import { defaultPageInfo, Pagination } from "@/components";
import { useNamespace } from "@/composables";
import TableColumnData from "./table-column/table-column-data.vue";
import TableColumnOperation from "./table-column/table-column-operation.vue";
import TableColumnDragSort from "./table-column/table-column-drag-sort.vue";
import { useSelection } from "./composables";
import { isFunction, isObject } from "@/utils";
import { Environment, TableColumnTypeEnum, filterData, getObjLeafKeys, initModel } from "./helper";
import TableFilter from "./plugins/table-filter.vue";

defineOptions({ name: "TableMain" });

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableMainNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  columnTypes: () => ["selection", "radio", "index", "expand", "sort"],
  operation: false,
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  radioProps: () => ({}),
  filterScope: false,
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableMainNamespace.Emits>();

const ns = useNamespace("table-main");
const radio = ref("");
const filterModel = ref<Recordable>({});
const filterTableData = ref<Recordable[]>();
const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");

const pageInfo = ref({ ...defaultPageInfo, ...props.pageInfo });

watch(
  () => props.pageInfo,
  val => (pageInfo.value = { ...defaultPageInfo, ...val }),
  { deep: true }
);

// 表格多选
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

const isServer = (value: unknown) => {
  // 如果传入 true，则为客户端
  if (!value || value === true) return false;
  return value === Environment.Server;
};

/**
 * 执行分页操作
 */
const tryPagination = (data: Recordable[] = []) => {
  if (!data.length) return [];

  // 如果服务端（后端）分页，则不执行分页，需要后端返回已分页的 data
  if (isServer(toValue(props.pageScope))) return data;

  // 客户端（前端）分页
  const { pageNum, pageSize } = pageInfo.value;
  return data.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

// 表格实际渲染的数据
const tableData = computed(() => tryPagination(props.data));

// 数据发生改变，则清除过滤数据
watch(tableData, () => (filterTableData.value = undefined));

const getRowKey = (row: Recordable) => {
  const { rowKey } = props;
  if (isFunction(rowKey)) return rowKey(row);
  return rowKey;
};

/**
 * 多选触发事件
 */
const handleSelectionChange = (newSelection: Recordable[]) => {
  selectionChange(newSelection);
  emits("selectionChange", {
    isSelected: isSelected.value,
    selectedList: selectedList.value,
    selectedListIds: selectedListIds.value,
  });
};

/**
 * 单选触发事件
 */
const handleRadioChange = (row: Recordable, index: number) => {
  radio.value = row[getRowKey(row)];
  selectionChange([row]);
  emits(
    "selectionChange",
    {
      isSelected: isSelected.value,
      selectedList: selectedList.value,
      selectedListIds: selectedListIds.value,
    },
    index
  );
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
  emits("paginationChange", Object.assign(defaultPageInfo, props.pageInfo));
};

/**
 * 执行过滤搜索
 */
const handleFilter = (filterValue: unknown, prop: string | undefined) => {
  // 后端过滤
  if (isServer(toValue(props.filterScope))) return emits("filter", filterModel.value, filterValue, prop);

  const keys = getObjLeafKeys(filterModel.value);

  const filterRule: Recordable = {};
  keys.forEach(key => {
    const column = props.columns.find(item => item.prop === key);
    initModel(filterRule, key, column?.filterProps?.rule || "eq");
  });

  // 前端过滤
  const finalFilterData = filterData(tableData.value, filterModel.value, filterRule);
  filterTableData.value = tryPagination(finalFilterData);

  emits("filter", filterModel.value, filterValue, prop);
};
/**
 * 执行过滤清除
 */
const handleFilterClear = (prop: string | undefined) => {
  emits("filterClear", prop);
};
/**
 * 执行过滤重置
 */
const handleFilterReset = () => {
  filterTableData.value = undefined;
  emits("filterReset");
};

// 功能列
const tableColumnType: Record<
  TableColumnTypeEnum,
  { el: Component; props?: Recordable; slots?: Recordable; render?: (scope: TableDefaultRenderScope) => VNode }
> = {
  [TableColumnTypeEnum.Selection]: { el: ElTableColumn, props: { reserveSelection: true } },
  [TableColumnTypeEnum.Radio]: {
    el: ElTableColumn,
    render: ({ row, $index }) =>
      h(ElRadio, {
        modelValue: radio.value,
        value: row[getRowKey(row)],
        onChange: () => handleRadioChange(row, $index),
        ...toValue(props.radioProps),
      }),
  },
  [TableColumnTypeEnum.Index]: { el: ElTableColumn },
  [TableColumnTypeEnum.Expand]: { el: ElTableColumn },
  [TableColumnTypeEnum.Sort]: {
    el: TableColumnDragSort,
    props: { tableInstance: elTableInstance, onDragSortEnd: handleDragSortEnd },
    slots: ["drag-sort-icon"],
  },
};

// 清空选中数据列表
const clearSelection = () => elTableInstance.value?.clearSelection();

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
const expose = {
  elTableInstance,
  isSelected,
  selectedList,
  selectedListIds,
  clearSelection,
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
    :data="filterTableData ? filterTableData : tableData"
    :row-key
    @selection-change="handleSelectionChange"
    :class="ns.b()"
  >
    <!-- 默认插槽 -->
    <slot>
      <template v-for="column in columns.filter(c => !c.isHide)" :key="column">
        <!-- 功能列 -->
        <component
          v-if="column.type && columnTypes.includes(column.type)"
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
          <template #default="scope">
            <component v-if="tableColumnType[column.type].render" :is="tableColumnType[column.type].render?.(scope)" />
            <component v-else-if="column.render" :is="column.render" v-bind="scope" />
            <slot v-else-if="$slots[column.type]" :name="column.type" v-bind="scope" />
          </template>

          <!-- 功能列 - 自定义插槽 -->
          <template v-for="slot in tableColumnType[column.type].slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>

        <!-- 数据列 -->
        <TableColumnData v-else :column>
          <template #header-after>
            <TableFilter
              v-model="filterModel"
              v-bind="column.filterProps"
              :prop="column.filterProps?.prop || column.prop"
              @filter="handleFilter"
              @clear="handleFilterClear"
              @reset="handleFilterReset"
            >
              <template v-if="$slots['filter-icon']" #filter-icon>
                <slot name="filter-icon" />
              </template>
              <template v-if="$slots['filter-button']" #filter-button>
                <slot name="filter-button" />
              </template>
            </TableFilter>
            <slot name="header-after" />
          </template>

          <template
            v-for="slot in Object.keys($slots).filter(item => !['header-after'].includes(item))"
            #[slot]="scope"
          >
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
