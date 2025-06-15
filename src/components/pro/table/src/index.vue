<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { PageInfo } from "@/components/pro/pagination";
import type {
  OperationNamespace,
  ProTableHeadInstance,
  ProTableMainInstance,
  ProTableNamespace,
  TableColumn,
  SizeStyle,
  TableCellParams,
  TableRow,
} from "./types";
import { defaultPageInfo } from "@/components/pro/pagination";
import { useNamespace } from "@/composables";
import { useTableApi, useTableState, type UseSelectState } from "./composables";
import { Environment, TableSizeEnum } from "./helper";
import TableMain from "./table-main.vue";
import TableHead from "./table-head.vue";

import "./styles/index.scss";

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
  hideHead: false,
  card: false,
  rowStyle: () => ({}),
  cellStyle: () => ({}),
  headerCellStyle: () => ({}),
  border: undefined,
  stripe: undefined,

  // TableHead 组件的 props（透传下去）
  toolButton: () => ["size", "export", "columnSetting", "baseSetting"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportProps: undefined,
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  sizeStyle: () => ({}),
  columnSetting: () => ({}),
  baseSetting: () => ({}),

  // TableMain 组件的 props（透传下去）
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  radioProps: () => ({}),
  filterScope: false,
  editable: false,
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableNamespace.Emits>();

const ns = useNamespace("pro-table");
const tableHeadInstance = useTemplateRef<ProTableHeadInstance>("tableHeadInstance");
const tableMainInstance = useTemplateRef<ProTableMainInstance>("tableMainInstance");

// 表格密度
const tableSize = ref<TableSizeEnum>((props.size as TableSizeEnum) || TableSizeEnum.Default);
// 表格密度样式
const sizeStyle = ref<SizeStyle>();
// 表格全局设置
const baseSetting = reactive({
  border: props.border ?? false,
  stripe: props.stripe ?? false,
  headerBackground: true,
  highlightCurrentRow: true,
  ...props.baseSetting,
});
// options 枚举缓存
const optionsMap = ref(new Map<string, Recordable[]>());

// 最终的 props
const finalProps = computed(() => {
  const propsObj = {
    ...props,
    columns:
      isRef(props.columns) || isReactive(props.columns)
        ? props.columns
        : (reactive(unref(props.columns)) as TableColumn[]),
  };
  Object.assign(propsObj, mergeProps.value);
  return propsObj;
});

const { mergeProps, setProps, setColumn, addColumn, delColumn } = useTableApi(finalProps);

// 是否为服务器（后端）分页
const isServerPage = computed(() => {
  const { pageScope } = finalProps.value;

  // 如果传入 true，则为前端分页，返回 false
  if (!pageScope || pageScope === true) return false;
  return pageScope === Environment.Server;
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

// 最终的 sizeStyle，即将 ProTable 内置的 sizeStyle 和传入的 sizeStyle 合并
const finalSizeStyle = computed(() => {
  const { rowStyle, cellStyle, headerCellStyle } = finalProps.value;
  return {
    rowStyle: { ...rowStyle, ...sizeStyle.value?.rowStyle },
    cellStyle: { ...cellStyle, ...sizeStyle.value?.cellStyle },
    headerCellStyle: {
      ...headerCellStyle,
      ...sizeStyle.value?.headerCellStyle,
      ...(!baseSetting.headerBackground && { backgroundColor: undefined }),
    },
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

const handleSizeChange = (size: TableSizeEnum, style: SizeStyle) => {
  tableSize.value = size === TableSizeEnum.Mini ? TableSizeEnum.Default : size;
  sizeStyle.value = style;
  emits("sizeChange", size, style);
};

const handlePaginationChange = (pageInfo: PageInfo) => {
  handlePagination(pageInfo);
  emits("paginationChange", pageInfo);
};

const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  emits("dragSortEnd", newIndex, oldIndex);
};

/**
 * 执行过滤搜索
 */
const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string | undefined) => {
  emits("filter", filterModel, filterValue, prop);
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
  emits("filterReset");
};

const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableCellParams) => {
  emits("formChange", fromValue, prop || "", scope);
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

const handleLeaveCellEdit = (row: TableRow, column: TableColumn) => {
  emits("leaveCellEdit", row, column);
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
  tableHeadInstance,
  tableMainInstance,
};

defineExpose(expose);
</script>

<template>
  <div :class="[ns.b(), { card }]">
    <!-- 表格头部 -->
    <TableHead
      v-if="!hideHead"
      ref="tableHeadInstance"
      :columns="finalProps.columns"
      :data="finalTableData"
      :tool-button
      :disabled-tool-button
      :size
      :title
      :export-props
      :tooltip-props
      :size-style
      :column-setting
      :base-setting
      @size-change="handleSizeChange"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableHead>

    <!-- 表格主体 -->
    <TableMain
      ref="tableMainInstance"
      v-bind="{ ...baseSetting, headerBackground: undefined, ...$attrs, ...finalSizeStyle }"
      :columns="finalProps.columns"
      :data="finalTableData"
      :operation-prop
      :operation-props
      :page-info
      :page-scope
      :pagination-props
      :radio-props
      :filter-scope
      :editable
      :row-key
      :size="tableSize"
      :empty-text
      @button-click="handleButtonClick"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @selection-change="handleSelectionChange"
      @pagination-change="handlePaginationChange"
      @drag-sort-end="handleDragSortEnd"
      @form-change="handleFormChange"
      @filter="handleFilter"
      @filter-clear="handleFilterClear"
      @filter-reset="handleFilterReset"
      @leave-cell-edit="handleLeaveCellEdit"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </TableMain>
  </div>
</template>
