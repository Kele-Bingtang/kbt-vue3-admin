<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type {
  OperationNamespace,
  ProTableHeadInstance,
  ProTableMainInstance,
  ProTableNamespace,
  TableColumn,
  TableStyle,
} from "./types";
import { defaultPageInfo, type PageInfo } from "@/components/core/pagination";
import { useNamespace } from "@/composables";
import { useTableApi, useTableState, type UseSelectState } from "./composables";
import { Environment, TableSizeEnum } from "./helper";
import TableMain from "./table-main.vue";
import TableHead from "./table-head.vue";

import "./index.scss";

defineOptions({ name: "ProTable" });

const props = withDefaults(defineProps<ProTableNamespace.Props>(), {
  columns: () => [],
  data: () => [],
  requestApi: undefined,
  defaultParams: () => ({}),
  requestImmediate: true,
  beforeSearch: undefined,
  requestError: undefined,
  dataCallback: undefined,
  hideHeader: false,
  card: false,
  rowStyle: () => ({}),
  cellStyle: () => ({}),
  headerCellStyle: () => ({}),

  // TableHead 组件的 props（透传下去）
  toolButton: () => ["size", "setting", "export"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportProps: undefined,
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  tableSizeStyle: () => ({}),

  // TableMain 组件的 props（透传下去）
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  radioProps: () => ({}),
  filterScope: false,
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableNamespace.Emits>();

const ns = useNamespace("pro-table");
const tableHeadInstance = useTemplateRef<ProTableHeadInstance>("tableHeadInstance");
const tableMainInstance = useTemplateRef<ProTableMainInstance>("tableMainInstance");

const tableSize = ref<TableSizeEnum>((props.size as TableSizeEnum) || TableSizeEnum.Default);
const tableStyle = ref<TableStyle>();
const optionsMap = ref(new Map<string, Recordable[]>());

// 最终的 props
const finalProps = computed(() => {
  const propsObj = {
    ...props,
    columns:
      isRef(props.columns) || isReactive(props.columns)
        ? props.columns
        : (reactive(toValue(props.columns)) as TableColumn[]),
  };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const { mergeProps, setProps, setColumn, addColumn, delColumn } = useTableApi(finalProps);

// 是否为服务器（后端）分页
const isServerPage = computed(() => {
  const { pageScope } = finalProps.value;
  const pageScopeValue = toValue(pageScope);

  // 如果传入 true，则为前端分页，返回 false
  if (!pageScopeValue || pageScopeValue === true) return false;
  return pageScopeValue === Environment.Server;
});

const { tableData, pageInfo, searchParams, searchInitParams, getTableList, search, reset, handlePagination } =
  useTableState(
    finalProps.value.requestApi,
    computed(() => finalProps.value.defaultParams),
    finalProps.value.pageInfo,
    isServerPage,
    finalProps.value.beforeSearch,
    finalProps.value.dataCallback,
    finalProps.value.requestError
  );

// 表格数据，传来的 data 大于 api 获取的数据
const finalTableData = computed(() => {
  const { data } = finalProps.value;
  if (data?.length) return data;
  return tableData.value;
});

// 最终的 tableStyle，即将 ProTable 内置的 tableStyle 和传入的 tableStyle 合并
const finalTableStyle = computed(() => {
  const { rowStyle, cellStyle, headerCellStyle } = finalProps.value;
  return {
    rowStyle: { ...rowStyle, ...tableStyle.value?.rowStyle },
    cellStyle: { ...cellStyle, ...tableStyle.value?.cellStyle },
    headerCellStyle: { ...headerCellStyle, ...tableStyle.value?.headerCellStyle },
  };
});

onMounted(() => {
  // 初始化请求
  mergeProps.value.requestImmediate && getTableList();
  // 注册实例
  emits("register", tableMainInstance.value?.$parent || null, tableMainInstance.value?.elTableInstance || null);
});

const handleSelectionChange = (useSelectReturn: UnwrapRef<UseSelectState>, index?: number) => {
  emits("selectionChange", useSelectReturn, index);
};

const handleSizeChange = (size: TableSizeEnum, style: TableStyle) => {
  tableSize.value = size === TableSizeEnum.Mini ? TableSizeEnum.Default : size;
  tableStyle.value = style;
  emits("sizeChange", size, style);
};

const handlePaginationChange = (pageInfo: PageInfo) => {
  handlePagination(pageInfo);
  emits("paginationChange", pageInfo);
};

const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  emits("dragSortEnd", newIndex, oldIndex);
};

const handleButtonClick = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("buttonClick", params);
};

const handleConfirm = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("confirm", params);
};

const handleCancel = (params: OperationNamespace.ButtonsCallBackParams) => {
  emits("cancel", params);
};

const expose = {
  tableData,
  optionsMap,
  pageInfo,
  searchParams,
  searchInitParams,
  getTableList,
  search,
  reset,
  handlePagination,
  setProps,
  setColumn,
  addColumn,
  delColumn,
  ...tableHeadInstance.value!,
  ...tableMainInstance.value!,
};

defineExpose(expose);
</script>

<template>
  <div :class="[ns.b(), { card }]">
    <!-- 表格头部 -->
    <TableHead
      v-if="!hideHeader"
      ref="tableHeadInstance"
      :columns="finalProps.columns"
      :tool-button
      :disabled-tool-button
      :size
      :title
      :export-props
      :tooltip-props
      :table-size-style
      @size-change="handleSizeChange"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableHead>

    <!-- 表格主体 -->
    <TableMain
      ref="tableMainInstance"
      v-bind="{ ...$attrs, ...finalTableStyle }"
      :columns="finalProps.columns"
      :data="finalTableData"
      :operation-prop
      :operation-props
      :page-info
      :page-scope
      :pagination-props
      :radio-props
      :filter-scope
      :row-key
      :size="tableSize"
      :empty-text
      @button-click="handleButtonClick"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @selection-change="handleSelectionChange"
      @pagination-change="handlePaginationChange"
      @drag-sort-end="handleDragSortEnd"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableMain>
  </div>
</template>
