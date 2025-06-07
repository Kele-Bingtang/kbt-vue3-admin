<script setup lang="ts">
import type { ProTableNamespace, TableColumn, TableStyle } from "./types";
import type { PageInfo } from "@/components/core/pagination";
import { useNamespace } from "@/composables";
import { useTableApi, useTableState } from "./composables";
import { PageMode, TableSizeEnum } from "./helper";
import TableMain from "./table-main.vue";
import TableHeader from "./table-header.vue";

defineOptions({ name: "ProTable" });

const props = withDefaults(defineProps<ProTableNamespace.Props>(), {
  columns: () => [],
  data: () => [],
  requestApi: undefined,
  defaultRequestParams: () => ({}),
  requestImmediate: true,
  beforeSearch: undefined,
  requestError: undefined,
  dataCallback: undefined,
  cardStyle: false,
  exportProps: () => ({}),
  pageInfo: undefined,
  pagination: false,
  paginationProps: undefined,
  title: undefined,
  headerButton: undefined,
  disabledHeaderButton: undefined,
  size: undefined,
  headerTooltipProps: undefined,
});

const emits = defineEmits<ProTableNamespace.Emits>();

const ns = useNamespace("pro-table");

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
  const { pagination } = finalProps.value;
  const paginationValue = toValue(pagination);

  // 如果传入 true，则为前端分页，返回 false
  if (!paginationValue || paginationValue === true) return false;
  return paginationValue.pageMode === PageMode.Server;
});

const { tableData, pageInfo, searchParams, searchInitParams, getTableList, search, reset, handlePagination } =
  useTableState(
    finalProps.value.requestApi,
    finalProps.value.defaultRequestParams,
    finalProps.value.pageInfo,
    isServerPage,
    finalProps.value.beforeSearch,
    data => {
      if (!data) return;
      // 配置 _options 字典信息
      data = initOptions(data) || data;
      const { dataCallback } = finalProps.value;
      dataCallback && (data = dataCallback(data) || data);

      return data;
    },
    finalProps.value.requestError
  );

// 表格数据，传来的 data 大于 api 获取的数据
const finalTableData = computed(() => {
  const { data } = finalProps.value;
  if (data?.length) return data;
  return tableData.value;
});

onMounted(() => {
  // 初始化请求
  mergeProps.value.requestImmediate && getTableList();
});

// 每一个 column 配置 _options 字典信息（如果配置了 options）
const initOptions = (data: Recordable[]) => {
  let newData = [...data];

  // 如果 columns 发生改变，则重新初始化 _options
  finalProps.value.columns.forEach(async col => {
    const optionsCache = optionsMap.value.get(col.prop!);

    // 如果字段有配置枚举信息，则存放到 _options[col.prop] 里
    if (optionsCache && col.isFilterOptions) {
      newData = newData?.map(row => {
        // TODO 支持枚举获取和对于的 label 获取
        const options = {};
        const formatValue = {};

        if (!row._options) row._options = {};
        if (!row._formatValue) row._options = {};
        row._options[col.prop!] = options;
        row._formatValue[col.prop!] = formatValue;
        return row;
      });
    }
  });
  return newData;
};

watch(
  () => finalProps.value.columns,
  () => initOptions(tableData.value),
  { deep: true }
);

const handleSizeChange = (size: TableSizeEnum, tableStyle: TableStyle) => {
  emits("sizeChange", size, tableStyle);
};

const handlePaginationChange = (pageInfo: PageInfo) => {
  handlePagination(pageInfo);
  emits("paginationChange", pageInfo);
};

const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  emits("dragSortEnd", newIndex, oldIndex);
};

const expose = {
  tableData,
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
};

defineExpose(expose);
</script>

<template>
  <div :class="[ns.b(), { card: cardStyle }]">
    <!-- 表格头部 -->
    <TableHeader
      :columns="finalProps.columns"
      :title
      :headerButton
      :disabledHeaderButton
      :size
      :exportProps
      @size-change="handleSizeChange"
    />

    <!-- 表格主体 -->
    <TableMain
      :columns="finalProps.columns"
      :data="finalTableData"
      :pagination
      :paginationProps
      :pageInfo
      @paginationChange="handlePaginationChange"
      @drag-sort-end="handleDragSortEnd"
    />
  </div>
</template>
