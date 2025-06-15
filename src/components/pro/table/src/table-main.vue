<script setup lang="ts">
import type { Component } from "vue";
import type { FormValidationResult, TableInstance } from "element-plus";
import { getObjectKeys, type ProFormInstance } from "@/components/pro/form";
import type { ElOption, FormItemColumnProps } from "@/components/pro/form-item";
import type { OperationNamespace, ProTableMainNamespace, TableScope, TableColumn, TableRow } from "./types";
import { ElRadio, ElTableColumn } from "element-plus";
import { useNamespace } from "@/composables";
import Pagination, { defaultPageInfo } from "@/components/pro/pagination";
import { formatValue, getProp, filterOptions, filterOptionsValue, setProp } from "@/components/pro/form-item";
import TableColumnData from "./table-column/table-column-data.vue";
import TableColumnOperation from "./table-column/table-column-operation.vue";
import TableColumnDragSort from "./table-column/table-column-drag-sort.vue";
import { useSelection } from "./composables";
import { isFunction } from "@/utils";
import { TableColumnTypeEnum, filterData, initModel, isServer } from "./helper";

defineOptions({ name: "TableMain" });

const props = withDefaults(defineProps<ProTableMainNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  operationProp: "operation",
  operationProps: () => ({}),
  pageInfo: () => defaultPageInfo,
  pageScope: false,
  paginationProps: () => ({}),
  radioProps: () => ({}),
  filterScope: false,
  headerCellStyle: () => ({}),
  editable: false,
  rowKey: "id",
  emptyText: "暂无数据",
});

const emits = defineEmits<ProTableMainNamespace.Emits>();

const columnTypes = ["selection", "radio", "index", "expand", "sort"];

const ns = useNamespace("table-main");
const radio = ref("");
const filterTableData = ref<Recordable[]>();
const elTableInstance = useTemplateRef<TableInstance>("elTableInstance");
// 定义 optionsMap 存储枚举值
const optionsMap = ref(new Map<string, MaybeRef<ElOption[]>>());

const visibleColumns = computed(() => props.columns.filter(column => !toValue(column.hide)));

const toValueColumn = (column: Partial<TableColumn>) => {
  return {
    width: toValue(column.width),
    label: toValue(column.label),
  };
};

const pageInfo = ref({ ...defaultPageInfo, ...props.pageInfo });

watch(
  () => props.pageInfo,
  val => (pageInfo.value = { ...defaultPageInfo, ...val }),
  { deep: true }
);

// 表格多选
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

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

// 数据发生改变，则清除过滤的数据
watch(tableData, () => (filterTableData.value = undefined));

/**
 * 初始化枚举字典数据
 */
const initOptionsMap = async ({ options, prop = "" }: TableColumn) => {
  if (!options) return;

  const optionsMapConst = optionsMap.value;

  // 如果当前 enumMap 存在相同的值则 return
  if (optionsMap.value.has(prop) && (isFunction(options) || optionsMap.value.get(prop) === options)) return;

  // 为了防止接口执行慢，导致页面下拉等枚举数据无法填充，所以预先存储为 [] 方便获取，接口返回后再二次存储
  optionsMapConst.set(prop, []);

  // 处理 options 并存储到 optionsMap
  const value = await formatValue<FormItemColumnProps["options"]>(options, [optionsMapConst, prop], false);

  optionsMapConst.set(prop, (value as any)?.data || value);
};

// 每一个 column 配置 _options 字典信息（如果配置了 options）
const initOptionsInData = (data: Recordable[]) => {
  let newData = [...data];

  // 如果 columns 发生改变，则重新初始化 _options
  visibleColumns.value.forEach(async column => {
    const { prop = "", isFilterOptions = true, optionField, transformOption } = column;

    const options = unref(optionsMap.value.get(prop));
    // 如果字段有配置枚举信息，则存放到 _options[col.prop] 里
    if (options && toValue(isFilterOptions)) {
      newData = newData?.map(row => {
        const option = transformOption
          ? transformOption(getProp(row, prop), options, row)
          : filterOptions(getProp(row, prop), options, optionField);

        const formatLabel = filterOptionsValue(option, optionField?.label ?? "label");

        if (!row._option) row._option = {};
        if (!row._label) row._label = {};

        row._option[prop] = option;
        row._label[prop] = formatLabel;
        return row;
      });
    }
  });
  return newData;
};

watch(
  () => visibleColumns.value,
  async () => {
    await Promise.all(visibleColumns.value.map(async column => await initOptionsMap(column)));
    initOptionsInData(props.data);
  },
  { deep: true, immediate: true, flush: "post" }
);

const getRowKey = (row: Recordable) => {
  const { rowKey } = props;
  if (isFunction(rowKey)) return rowKey(row);
  return rowKey;
};

/**
 * 获取操作列的配置项
 */
const getOperationColumn = (column: TableColumn, index: number) => {
  const { operationProps, operationProp } = props;
  if (column.prop === operationProp) {
    return {
      ...column,
      ...operationProps,
      ...toValueColumn({
        width: column.width || operationProps.width,
        label: column.label || operationProps.label,
      }),
    };
  }

  if (operationProps && index === visibleColumns.value.length - 1) {
    return {
      ...operationProps,
      ...toValueColumn({
        width: operationProps.width,
        label: operationProps.label,
      }),
    };
  }

  return {};
};

/**
 * 单元格点击编辑
 */
const handleClickCell = (row: TableRow, column: TableColumn, cell: HTMLTableCellElement, event: Event) => {
  handleCellEdit(row, column, "click");
  emits("cellClick", row, column, cell, event);
};

/**
 * 单元格双击编辑
 */
const handleDoubleClickCell = (row: TableRow, column: TableColumn, cell: HTMLTableCellElement, event: Event) => {
  handleCellEdit(row, column, "dblclick");
  emits("cellDblClick", row, column, cell, event);
};

// 缓存关闭当前单元格的编辑态方法
let stopCurrentEditCell: (() => void) | null = null;
// 缓存当前单元格的校验方法
let validateCellEdit: (() => FormValidationResult | undefined) | null = () => Promise.resolve(true);
// 缓存当前的 stopCurrentEditCell 函数
let currentStopEditHandler: ((e: MouseEvent) => void) | null = null;

/**
 * 点击单元格进入编辑态
 */
const handleCellEdit = async (row: TableRow, column: TableColumn, type: "click" | "dblclick") => {
  const columnIndex = column.getColumnIndex!();
  const currentColumn = visibleColumns.value[columnIndex];

  // 不是可编辑行，如功能列，操作列
  if (!currentColumn || currentColumn.type || currentColumn.prop === props.operationProp) return;

  // 没有开启点击编辑功能
  if (props.editable !== type) return;

  // 原先的单元格校验失败
  if (!(await validateCellEdit?.())) return;

  // 清理之前的监听器
  if (currentStopEditHandler) document.removeEventListener("click", currentStopEditHandler);

  // 定义停止编辑的函数
  currentStopEditHandler = (e: MouseEvent) => {
    handleStopEditClick(e, row, { ...column, ...currentColumn });
  };

  // 添加退出单元格编辑事件监听
  document.addEventListener("click", currentStopEditHandler);

  // 停止上一个单元格的编辑状态
  stopCurrentEditCell?.();
  // 缓存当前单元格的退出编辑状态函数和校验函数
  stopCurrentEditCell = () => row._closeCellEdit(currentColumn.prop);
  validateCellEdit = () => row._validateCellEdit(undefined, currentColumn.prop);

  // 开启当前点击的单元格的编辑
  row._openCellEdit(currentColumn.prop);
};

/**
 * 点击非表格的区域，停止当前单元格的编辑
 */
const handleStopEditClick = async (e: MouseEvent, row: TableRow, column: TableColumn) => {
  if (!(await row._validateCellEdit(undefined, column.prop))) return;

  if (stopCurrentEditCell && elTableInstance.value) {
    const target = e?.target as HTMLElement;

    if (target.classList.contains("el-icon")) return;

    const contains = elTableInstance.value.$el?.contains(target);

    if (!contains) {
      stopCurrentEditCell();
      emits("leaveCellEdit", row, column);
      if (currentStopEditHandler) document.removeEventListener("click", currentStopEditHandler);
    }
  }
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
 * 行拖拽排序结束事件
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

/**
 * 执行过滤搜索
 */
const handleFilter = (filterModel: Recordable, filterValue: unknown, prop: string | undefined) => {
  // 后端过滤
  if (isServer(toValue(props.filterScope))) return emits("filter", filterModel, filterValue, prop);

  const keys = getObjectKeys(filterModel);

  const filterRule: Recordable = {};
  keys.forEach(key => {
    const column = visibleColumns.value.find(item => item.prop === key);
    initModel(filterRule, key, column?.filterProps?.rule || "eq");
  });

  // 前端过滤
  const finalFilterData = filterData(tableData.value, filterModel, filterRule);
  filterTableData.value = tryPagination(finalFilterData);

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
  filterTableData.value = undefined;
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

// 功能列
const tableColumnType: Record<
  TableColumnTypeEnum,
  { el: Component; props?: Recordable; slots?: Recordable; render?: (scope: TableScope) => VNode }
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

const proFormItemInstances = ref<Record<string, ProFormInstance>[]>([]);

const registerProFormInstance = (index: number, prop: string, instance: ProFormInstance | null) => {
  proFormItemInstances.value[index] ??= {};
  setProp(proFormItemInstances.value[index], prop, instance);
};

// 获取指定行的指定 prop 的 ElForm 实例
const getElFormInstance = (index: number, prop?: TableColumn["prop"]) => {
  const proFormItemInstance = proFormItemInstances.value?.[index];
  return proFormItemInstance?.[prop!].elFormInstance;
};

// 获取指定行的指定 prop 的 ElFormItem 实例
const getElFormItemInstance = (index: number, prop?: TableColumn["prop"]) => {
  const proFormItemInstance = proFormItemInstances.value?.[index];
  return proFormItemInstance?.[prop!].getElFormItemInstance(prop!);
};

// 获取指定行的指定 prop 的表单组件实例
const getElInstance = (index: number, prop: TableColumn["prop"]) => {
  const proFormItemInstance = proFormItemInstances.value?.[index];
  return proFormItemInstance?.[prop!].getElInstance(prop!);
};

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
const expose = {
  elTableInstance,
  isSelected,
  selectedList,
  selectedListIds,
  clearSelection,
  getElFormInstance,
  getElFormItemInstance,
  getElInstance,
};

defineExpose(expose);
</script>

<template>
  <el-table
    ref="elTableInstance"
    highlight-current-row
    scrollbar-always-on
    v-bind="$attrs"
    :header-cell-style="{ 'background-color': ns.cssVar('gray-200'), ...headerCellStyle }"
    :data="filterTableData ? filterTableData : tableData"
    :row-key
    :class="ns.b()"
    @selection-change="handleSelectionChange"
    @cell-click="handleClickCell"
    @cell-dblclick="handleDoubleClickCell"
  >
    <!-- 默认插槽 -->
    <slot name="default">
      <template v-for="(column, index) in visibleColumns" :key="column">
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
        <TableColumnData
          v-else-if="column.prop !== operationProp"
          :column
          v-bind="toValueColumn(column)"
          :align="column.align || 'center'"
          :editable
          @register-pro-form-instance="registerProFormInstance"
          @form-change="handleFormChange"
          @filter="handleFilter"
          @filter-clear="handleFilterClear"
          @filter-reset="handleFilterReset"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumnData>

        <!-- 操作列 -->
        <TableColumnOperation
          v-if="column.prop === operationProp || (operationProps && index === columns.length - 1)"
          v-bind="getOperationColumn(column, index)"
          :align="column.align || 'center'"
          :prop="operationProp"
          @button-click="handleButtonClick"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        >
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
      v-if="pageScope"
      v-model="pageInfo"
      @change="handlePaginationChange"
      :total="data.length"
      v-bind="paginationProps"
    >
      <template v-if="$slots['pagination-left']" #pagination-left>
        <slot name="pagination-left" />
      </template>
      <template v-if="$slots['pagination-right']" #pagination-right>
        <slot name="pagination-right" />
      </template>
    </Pagination>
  </slot>
</template>
