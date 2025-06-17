<script setup lang="ts">
import type { TableInstance } from "element-plus";
import type { ProSearchColumnProps, ProSearchExpose } from "@/components/pro/search";
import type {
  ProTableInstance,
  OperationNamespace,
  SizeStyle,
  TableColumn,
  TableRow,
  TableScope,
  TableSizeEnum,
  UseSelectState,
} from "@/components/pro/table";
import type { PageColumn, ProPageEmits, ProPageProps } from "./types";
import type { UnwrapRef } from "vue";
import type { PageInfo } from "../../pagination";
import { useNamespace } from "@/composables";
import { ProSearch } from "@/components/pro/search";
import { ProTable, lastProp } from "@/components/pro/table";
import { isEmpty, isFunction } from "@/utils";

defineOptions({ name: "ProPage" });

const props = withDefaults(defineProps<ProPageProps>(), {
  columns: () => [],
  searchProps: () => ({}),
  initShowSearch: true,
});

const emits = defineEmits<ProPageEmits>();

const ns = useNamespace("pro-page");

const searchParams = ref<Recordable>({});
const searchDefaultParams = ref<Recordable>({});

// 获取 ProTable 配置项
const proTableProps = computed(() => {
  const { columns, ...rest } = props;

  const proTableColumns: TableColumn[] = [];

  // 去掉 ProSearch 相关配置
  columns.forEach(column => {
    proTableColumns.push({ ...column, search: undefined });
  });

  return {
    columns: proTableColumns,
    ...rest,
    searchProps: undefined,
    initShowSearch: undefined,
  };
});

const flatColumns = computed<PageColumn[]>(() => flatColumnsFn(props.columns));

// 组装 ProSearch 配置项
const searchColumns = computed(() => {
  const column = flatColumns.value?.filter(item => item.search?.el || item.search?.render);
  const searchColumns: ProSearchColumnProps[] = [];

  column.forEach(async item => {
    // Table 默认查询参数初始化
    const key = lastProp(item.search?.prop ?? item.prop!);
    const defaultValue = unref(item.search?.defaultValue);

    if (!isEmpty(defaultValue)) {
      if (!isFunction(defaultValue)) searchDefaultParams.value[key] = defaultValue;
      else searchDefaultParams.value[key] = await defaultValue(searchParams.value);
    }

    // 组装搜索表单配置项
    const searchColumn = {
      grid: {
        offset: item.search?.offset,
        span: item.search?.span,
        xs: item.search?.xs,
        sm: item.search?.sm,
        md: item.search?.md,
        lg: item.search?.lg,
        xl: item.search?.xl,
      },
      ...item.search,
      beforeSearch: undefined,
      options: item.options,
      optionField: item.optionField,
      optionsProp: item.optionsProp,
    };
    searchColumns.push(searchColumn);
  });

  return searchColumns;
});

// 扁平化 columns，为了过滤搜索配置项
const flatColumnsFn = (columns: PageColumn[], flatArr: PageColumn[] = []) => {
  columns.forEach(col => {
    if (col._children?.length) flatArr.push(...flatColumnsFn(col._children));
    flatArr.push(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// ---------- ProSearch 事件监听 ----------
const handleSearch = (model: Recordable) => {
  emits("search", model);
};
const handleReset = (model: Recordable) => {
  emits("reset", model);
};

const searchRegister = (proSearchInstance?: ProSearchExpose) => {
  emits("searchRegister", proSearchInstance);
};

// ---------- ProTable 事件监听 ----------

const tableRegister = (proTableInstance: ProTableInstance, elTableInstance: TableInstance | null) => {
  emits("tableRegister", proTableInstance, elTableInstance);
};

const handleSelectionChange = (useSelectReturn: UnwrapRef<UseSelectState>, index?: number) => {
  emits("selectionChange", useSelectReturn, index);
};

const handleSizeChange = (size: TableSizeEnum, style: SizeStyle) => {
  emits("sizeChange", size, style);
};

const handlePaginationChange = (pageInfo: PageInfo) => {
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

const handleFormChange = (fromValue: unknown, prop: TableColumn["prop"], scope: TableScope) => {
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

const proSearchInstance = useTemplateRef<ProSearchExpose>("proSearchInstance");
const proTableInstance = useTemplateRef<ProTableInstance>("proTableInstance");

const expose = {
  searchParams,
  searchDefaultParams,
  proSearchInstance,
  proTableInstance,
};

defineExpose(expose);
</script>

<template>
  <div :class="ns.b()">
    <ProSearch
      ref="proSearchInstance"
      v-show="initShowSearch"
      v-model="searchParams"
      :columns="searchColumns"
      v-bind="searchProps"
      @search="handleSearch"
      @reset="handleReset"
      @register="searchRegister"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProSearch>

    <ProTable
      ref="proTableInstance"
      v-bind="{ ...$attrs, ...proTableProps }"
      @selectionChange="handleSelectionChange"
      @sizeChange="handleSizeChange"
      @paginationChange="handlePaginationChange"
      @dragSortEnd="handleDragSortEnd"
      @filter="handleFilter"
      @filterClear="handleFilterClear"
      @filterReset="handleFilterReset"
      @formChange="handleFormChange"
      @buttonClick="handleButtonClick"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @leaveCellEdit="handleLeaveCellEdit"
      @register="tableRegister"
    >
      <template v-for="slot in Object.keys($slots)" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </ProTable>
  </div>
</template>
