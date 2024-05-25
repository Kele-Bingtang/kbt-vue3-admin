<template>
  <div :class="prefixClass">
    <!-- 查询表单 card -->
    <SearchForm
      v-show="isShowSearchProp"
      :search="_search"
      :reset="_reset"
      :columns="searchColumns"
      :search-param="searchParam"
      :search-cols="searchCols"
    />

    <div :class="`card ${prefixClass}__main`">
      <!-- 表格头部 操作按钮 -->
      <TableMainHeader
        :columns="tableColumns"
        :data="data ?? tableData"
        :toolButton="toolButton"
        :size="size"
        :exportKey="exportKey"
        :showSearch="searchColumns ? searchColumns.length > 0 : false"
        :selectedList="selectedList"
        :selectedListIds="selectedListIds"
        :isSelected="isSelected"
        :dialogForm="dialogForm"
        @add="dialogFormRef?.handleAdd"
        @deleteBatch="handleDeleteBatch"
        @refresh="getTableList"
        @size="handleSizeCommand"
        @colSetting="openColSetting"
        @search="isShowSearchProp = !isShowSearchProp"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </TableMainHeader>

      <!-- 表格主体 -->
      <TableMain
        ref="tableMainRef"
        :size="elTableSize"
        v-bind="$attrs"
        :data="processTableData ?? tableData"
        :border="border"
        :row-key="rowKey"
        @selection-change="selectionChange"
        :row-style="getRowStyle"
        :cell-style="getCellStyle"
        :header-cell-style="getHeaderCellStyle"
        :columns="tableColumns"
        :columnTypes="columnTypes"
        :dialogForm="dialogForm"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </TableMain>

      <DialogFormComponent
        ref="dialogFormRef"
        v-if="dialogForm"
        v-bind="{ ...dialogForm, afterConfirm: () => getTableList() }"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </DialogFormComponent>

      <!-- 分页组件 -->
      <slot name="pagination" :total="pageTotal">
        <Pagination
          v-if="isOpenPage(pagination) && pageTotal"
          v-model="paging"
          :total="pageTotal"
          @pagination="handlePagination"
        />
      </slot>
    </div>
    <!-- 列设置 -->
    <ColSetting v-if="toolButton" ref="colSettingRef" v-model:col-setting="colSetting" />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  provide,
  onMounted,
  computed,
  useAttrs,
  shallowRef,
  defineOptions,
  unref,
  type CSSProperties,
} from "vue";
import { useTable, type Table } from "./hooks/useTable";
import { useSelection } from "./hooks/useSelection";
import { SearchForm, Pagination, type BreakPoint } from "@/components";
import {
  type TableColumnProps,
  type DialogFormInstance,
  type TypeProps,
  TableSizeEnum,
  type ToolButton,
} from "./interface";
import { lastProp, filterEnum, filterEnumLabel, handleRowAccordingToProp } from "./utils";
import ColSetting from "./components/ColSetting.vue";
import TableMain from "./components/TableMain.vue";
import TableMainHeader, { type CustomTableSize, type ElTableSize } from "./components/TableMainHeader.vue";
import DialogFormComponent, { type DialogFormProps } from "./components/DialogForm.vue";
import Sortable from "sortablejs";
import { useDesign } from "@/hooks";

defineOptions({ name: "ProTable" });

const { getPrefixClass, variables } = useDesign();
const prefixClass = getPrefixClass("pro-table");

provide("proTablePrefixClass", prefixClass);

export type DialogFormT = DialogFormProps;

export interface ProTableProps {
  columns: TableColumnProps[]; // 列配置项 ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为 true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  beforeSearch?: (data: any) => any; // 查询数据前的回调函数，可以对查询参数进行处理或禁止查询 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  initRequestParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean | Table.PaginationProps; // 是否需要分页组件 ==> 非必传（默认为 true）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为 true）
  toolButton?: ToolButton[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为 true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  size?: CustomTableSize; // 表格密度
  searchCols?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  isShowSearch?: boolean; // 初始化时是否显示搜索模块
  exportKey?: "props" | "label" | "dataKey"; // 导出时的表头配置（prop 为使用  columns 的 props，label 为使用 columns 的 label，dataKey 为使用 data 的 key），默认为 dataKey
  dialogForm?: DialogFormProps; // 新增、编辑、删除表单配置
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initRequestParam: {},
  border: true,
  toolButton: true,
  rowKey: "id",
  size: "default",
  isShowSearch: true,
  exportKey: "dataKey",
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
});

// 配置 _enum 字典信息
const enumCallback = (data: Record<string, any>[]) => {
  unref(tableColumns).forEach(async col => {
    const enumObj = unref(enumMap).get(col.prop!);
    // 如果字段有配置枚举信息，则存放到 _enum[col.prop] 里
    if (enumObj && col.isFilterEnum) {
      data = data.map(row => {
        const d = filterEnumLabel(
          filterEnum(handleRowAccordingToProp(row, col.prop!), enumObj, col.fieldNames),
          col.fieldNames
        );
        if (!row._enum) row._enum = {};
        row._enum[col.prop!] = d;
        return row;
      });
    }
  });
  return data;
};

// 表格 DOM 元素
const tableMainRef = ref<InstanceType<typeof TableMain>>();

// 是否显示搜索模块
const isShowSearchProp = ref(props.isShowSearch);

// column 列类型
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);
// 表格操作 Hooks
const {
  tableData,
  paging,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handlePagination,
  isOpenPage,
  isBackPage,
  isFrontPage,
} = useTable(
  props.requestApi,
  props.initRequestParam,
  props.pagination,
  props.beforeSearch,
  data => {
    if (!data) return;
    // 配置 _enum 字典信息
    if (isBackPage()) data.list = enumCallback(data.list) || data.list;
    else data = enumCallback(data) || data;

    props.dataCallback && (data = props.dataCallback(data) || data);
    return data;
  },
  props.requestError,
  props.columns
);

// 清空选中数据列表
const clearSelection = () => unref(tableMainRef.value?.table)?.clearSelection();

// 静态数据分页
const processTableData = computed(() => {
  let data = unref(tableData);
  if (props.data?.length) data = props.data;
  if (!isFrontPage(props.pagination)) return data;
  return data?.slice(
    (unref(paging).pageNum - 1) * unref(paging).pageSize,
    unref(paging).pageNum * unref(paging).pageSize
  );
});

const pageTotal = computed(() => {
  if (props.data?.length) return props.data?.length;
  if (isFrontPage(props.pagination)) return props.data?.length || unref(tableData)?.length;
  if (isBackPage(props.pagination)) return unref(paging)?.total || unref(tableData)?.length;
  return 0;
});

// 初始化请求
onMounted(() => {
  dragSort();
  props.requestAuto && getTableList();
});

// 监听页面 initRequestParam 改化，重新获取表格数据
watch(
  () => props.initRequestParam,
  () => getTableList(props.initRequestParam),
  { deep: true }
);

// 接收 columns 并设置为响应式
const tableColumns = ref<TableColumnProps[]>(props.columns);

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
const setEnumMap = async ({ enum: enumValue, prop }: TableColumnProps) => {
  if (!enumValue) return;

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (typeof enumValue !== "function") return unref(enumMap).set(prop!, unref(enumValue!));

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  const { data } = await enumValue(enumMap);
  unref(enumMap).set(prop!, data);
};
provide("enumMap", enumMap);

// 扁平化 columns，为了过滤需要搜索的配置项
const flatColumnsFunc = (columns: TableColumnProps[], flatArr: TableColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // 给每一项 column 添加 isShow && isFilterEnum 默认属性
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

const flatColumns = ref<TableColumnProps[]>();
flatColumns.value = flatColumnsFunc(unref(tableColumns));

// 过滤需要搜索的配置项
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!);
});

// 设置搜索表单排序默认值 && 设置搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
  column.search!.order = column.search!.order ?? index + 2;
  const key = column.search?.key ?? lastProp(column.prop!);
  const defaultValue = column.search?.defaultValue;

  if (defaultValue !== undefined && defaultValue !== null) {
    unref(searchInitParam)[key] = defaultValue;
    unref(searchParam)[key] = defaultValue;
  }
});

// 列设置 ==> 过滤掉不需要设置的列
const colSettingRef = ref();
const colSetting = unref(tableColumns)?.filter(
  item => !columnTypes.includes(item.type!) && item.prop !== "operation" && item.isShow
);

const openColSetting = () => unref(colSettingRef).openColSetting();

// 操作框
const dialogFormRef = shallowRef<DialogFormInstance>();
provide("dialogFormRef", dialogFormRef);

// 编辑回调
const handleEdit = (scope: any, item: TableColumnProps) => {
  if (item.handleEdit) item.handleEdit(scope, expose);
  else unref(dialogFormRef)?.handleEdit(scope);
};

// 删除回调
const handleDelete = (scope: any, item: TableColumnProps) => {
  if (item.handleDelete) item.handleDelete(scope, expose);
  unref(dialogFormRef)?.handleDelete(scope);
};

// ------- 表格样式 Start -------

// 如果是 mini，则取 ElTableSize 为 default，反之默认
const elTableSize = ref<ElTableSize>(TableSizeEnum.Default);
const rowStyle = ref<CSSProperties>({});
const cellStyle = ref<CSSProperties>({});
const headerCellStyle = ref<CSSProperties>({});
const attrs = useAttrs();

const handleSizeCommand = (size: ElTableSize, row: CSSProperties, cell: CSSProperties, headerCell: CSSProperties) => {
  elTableSize.value = size;
  rowStyle.value = row;
  cellStyle.value = cell;
  headerCellStyle.value = headerCell;
};

const getStyle = (tableInfo: any, styleName: string, styleRef: any) => {
  const style = attrs[styleName] as any;

  if (!style) return styleRef;
  if (typeof style === "function") {
    return { ...styleRef, ...style(tableInfo) };
  } else return { ...style, ...styleRef };
};

const getRowStyle = (tableInfo: any) => {
  return getStyle(tableInfo, "rowStyle", unref(rowStyle));
};

const getCellStyle = (tableInfo: any) => {
  return getStyle(tableInfo, "cellStyle", unref(cellStyle));
};

const getHeaderCellStyle = (tableInfo: any) => {
  return getStyle(tableInfo, "headerCellStyle", unref(headerCellStyle));
};

// ------- 表格样式 End -------

const handleDeleteBatch = () => {
  dialogFormRef.value?.handleDeleteBatch(unref(selectedListIds), unref(selectedList), () => {
    clearSelection();
    getTableList();
  });
};

// 定义 emit 事件
const emits = defineEmits<{
  search: [];
  reset: [];
  dargSort: [{ newIndex?: number; oldIndex?: number }];
}>();

const _search = () => {
  search();
  emits("search");
};

const _reset = () => {
  reset();
  emits("reset");
};

// 拖拽排序
const dragSort = () => {
  const tbody = document.querySelector(`.${variables.elNamespace}-table__body-wrapper tbody`) as HTMLElement;
  tbody &&
    Sortable.create(tbody, {
      handle: ".move",
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        if (typeof oldIndex !== "undefined" && typeof newIndex !== "undefined") {
          const [removedItem] = processTableData.value.splice(oldIndex!, 1);
          processTableData.value.splice(newIndex!, 0, removedItem);
          emits("dargSort", { newIndex, oldIndex });
        }
      },
    });
};

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
const expose = {
  element: tableMainRef.value?.table,
  dialogFormRef,
  tableData,
  paging,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handlePagination,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds,
};

defineExpose(expose);
</script>

<style lang="scss">
@import "./index";
</style>
