<template>
  <div class="pro-table-container">
    <!-- 查询表单 card -->
    <SearchForm
      v-show="isShowSearchProp"
      :search="search"
      :reset="reset"
      :columns="searchColumns"
      :search-param="searchParam"
      :search-cols="searchCols"
    />
    <div class="card table-main">
      <!-- 表格头部 操作按钮 -->
      <div class="table-header">
        <div class="header-button-lf">
          <slot
            name="tableHeader"
            :selected-list-ids="selectedListIds"
            :selected-list="selectedList"
            :is-selected="isSelected"
          >
            <el-button
              v-if="visibleButton(detailForm?.addApi, detailForm?.useAdd)"
              type="primary"
              :icon="Plus"
              @click="dialogOperateRef?.handleAdd"
              :disabled="detailForm?.disableAdd"
            >
              新增
            </el-button>
            <el-button
              v-if="
                visibleButton(detailForm?.deleteBatchApi, detailForm?.useDeleteBatch) &&
                columns[0]?.type === 'selection'
              "
              type="danger"
              :icon="Delete"
              plain
              @click="handleDeleteBatch"
              :disabled="detailForm?.disableDeleteBatch || !isSelected"
            >
              删除
            </el-button>
            <slot name="tableHeaderExtra"></slot>
          </slot>
        </div>
        <div v-if="toolButton" class="header-button-ri">
          <slot name="toolButton">
            <el-tooltip effect="light" content="刷新" placement="top">
              <el-button :icon="Refresh" circle @click="getTableList" />
            </el-tooltip>
            <el-tooltip effect="light" content="密度" placement="top">
              <el-dropdown style="margin: 0 15px" @command="handleSizeCommand">
                <el-button :icon="Coin" circle />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="large" :disabled="customTableSize === 'large'">Large</el-dropdown-item>
                    <el-dropdown-item command="default" :disabled="customTableSize === 'default'">
                      Default
                    </el-dropdown-item>
                    <el-dropdown-item command="small" :disabled="customTableSize === 'small'">Small</el-dropdown-item>
                    <el-dropdown-item command="mini" :disabled="customTableSize === 'mini'">Mini</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
            <el-tooltip v-if="columns.length" effect="light" content="列配置" placement="top">
              <el-button :icon="Operation" circle @click="openColSetting" />
            </el-tooltip>
            <el-tooltip v-if="useExport" effect="light" content="导出" placement="top">
              <el-button
                :icon="Download"
                circle
                @click="() => downloadFile(columns, tableData, 'export', '确认导出数据?', exportKey)"
              />
            </el-tooltip>
            <el-tooltip v-if="searchColumns.length" effect="light" content="隐藏搜索" placement="top">
              <el-button :icon="Search" circle @click="isShowSearchProp = !isShowSearchProp" />
            </el-tooltip>
          </slot>
        </div>
      </div>
      <!-- 表格主体 -->
      <el-table
        ref="tableRef"
        :size="elTableSize"
        v-bind="$attrs"
        :data="tablePageData ?? tableData"
        :border="border"
        :row-key="rowKey"
        @selection-change="selectionChange"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :header-cell-style="headerCellStyle"
      >
        <!-- 默认插槽 -->
        <slot></slot>

        <template v-for="item in tableColumns" :key="item">
          <!-- selection || index || expand -->
          <el-table-column
            v-if="item.type && ['selection', 'index', 'expand'].includes(item.type)"
            v-bind="item"
            :align="item.align ?? 'center'"
            :reserve-selection="item.type == 'selection'"
          >
            <template #header="scope">
              <component v-if="item.headerRender" :is="item.headerRender" v-bind="scope"></component>
              <slot v-else :name="`${item.type}Header`" v-bind="scope">{{ scope.column.label }}</slot>
            </template>

            <template v-if="item.type == 'expand'" #default="scope">
              <component v-if="item.render" :is="item.render" v-bind="scope"></component>
              <slot v-else :name="item.type" v-bind="scope"></slot>
            </template>
          </el-table-column>

          <!-- other -->
          <TableColumn v-if="!item.type && item.prop && item.isShow && item.prop !== 'operation'" :column="item">
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </TableColumn>

          <TableColumn v-else-if="item.prop === 'operation'" :column="item">
            <template #operation="scope">
              <slot name="operation" v-bind="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="dialogOperateRef?.handleEdit(scope)"
                  :disabled="scope.row.disableEdit || detailForm?.disableEdit"
                  v-if="visibleButton(detailForm?.editApi, detailForm?.useEdit)"
                >
                  编辑
                </el-button>
                <el-popconfirm
                  title="你确定删除吗?"
                  @confirm="dialogOperateRef?.handleDelete(scope)"
                  v-if="visibleButton(detailForm?.deleteApi, detailForm?.useDelete)"
                >
                  <template #reference>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      :icon="Delete"
                      :disabled="scope.row.disableDelete && !detailForm?.disableDelete"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
                <slot name="operationExtra" v-bind="scope"></slot>
              </slot>
            </template>
          </TableColumn>
        </template>

        <!-- 插入表格最后一行之后的插槽 -->
        <template #append><slot name="append"></slot></template>

        <!-- 无数据 -->
        <template #empty>
          <div class="table-empty">
            <slot name="empty">
              <img src="@/assets/images/notData.png" alt="notData" />
              <div>暂无数据</div>
            </slot>
          </div>
        </template>
      </el-table>

      <DialogOperate
        ref="dialogOperateRef"
        v-if="detailForm"
        v-bind="{ ...detailForm, afterConfirm: () => getTableList() }"
      >
        <template #form>
          <slot name="form" />
        </template>

        <template #formFooter>
          <slot name="formFooter" />
        </template>

        <template #dialogHeader>
          <slot name="dialogHeader" />
        </template>

        <!-- 修复 dialog footer 插槽为空元素却占位问题 -->
        <template #dialogFooter v-if="$slots.dialogFooter">
          <slot name="dialogFooter" />
        </template>
      </DialogOperate>

      <!-- 分页组件 -->
      <slot name="pagination">
        <Pagination v-if="isOpenPage(pagination) && pageTotal" :total="pageTotal" @pagination="handlePagination" />
      </slot>
    </div>
    <!-- 列设置 -->
    <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
  </div>
</template>

<script setup lang="ts" name="ProTable">
import { ref, watch, provide, onMounted } from "vue";
import { ElTable } from "element-plus";
import { useTable, type Table } from "./hooks/useTable";
import { useSelection } from "./hooks/useSelection";
import type { BreakPoint } from "@/components/Grid/index.vue";
import type { TableColumnProps } from "@/components/ProTable/interface";
import { Refresh, Plus, Operation, Search, Edit, Delete, Coin } from "@element-plus/icons-vue";
import { lastProp, filterEnum, filterEnumLabel, handleRowAccordingToProp } from "./utils";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import DialogOperate from "./components/DialogOperate.vue";
import type { DialogFormProps } from "./components/DialogOperate.vue";
import { exportJsonToExcel, formatJsonToArray } from "@/utils/excel";

export type DialogForm = DialogFormProps;

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
  toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为 true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  size?: CustomTableSize; // 表格密度
  searchCols?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  isShowSearch?: boolean; // 初始化时是否显示搜索模块
  useExport?: boolean; // 是否显示导出按钮
  exportKey?: "props" | "label" | "dataKey"; // 导出时的表头配置（prop 为使用  columns 的 props，label 为使用 columns 的 label，dataKey 为使用 data 的 key），默认为 dataKey
  detailForm?: DialogFormProps; // 新增、编辑、删除表单配置
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
  useExport: true,
  exportKey: "dataKey",
  searchCols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
});

// 配置 _enum 字典信息
const enumCallback = (data: Record<string, any>[]) => {
  tableColumns.value.forEach(async col => {
    const enumObj = enumMap.value.get(col.prop!);
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

// 是否显示搜索模块
const isShowSearchProp = ref(props.isShowSearch);
// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable>>();

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
const clearSelection = () => tableRef.value!.clearSelection();

// 静态数据分页
const tablePageData = computed(() => {
  let data;
  if (props.data?.length) data = props.data;
  if (isFrontPage(props.pagination)) data = tableData.value;
  return data?.slice((paging.value.pageNum - 1) * paging.value.pageSize, paging.value.pageNum * paging.value.pageSize);
});

const pageTotal = computed(() => {
  if (props.data?.length) return props.data?.length;
  if (isFrontPage(props.pagination)) return props.data?.length || tableData.value.length;
  if (isBackPage(props.pagination)) return paging.value?.total || tableData.value?.length;
  return 0;
});

// 初始化请求
onMounted(() => props.requestAuto && getTableList());

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
provide("enumMap", enumMap);

const setEnumMap = async (col: TableColumnProps) => {
  if (!col.enum) return;
  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (isRef(col.enum)) return enumMap.value.set(col.prop!, (col.enum as ComputedRef).value!);
  if (typeof col.enum !== "function") return enumMap.value.set(col.prop!, col.enum!);
  const { data } = await col.enum(enumMap);
  enumMap.value.set(col.prop!, data);
};

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
flatColumns.value = flatColumnsFunc(tableColumns.value);

// 过滤需要搜索的配置项
const searchColumns = flatColumns.value.filter(item => item.search?.el || item.search?.render);

// 设置搜索表单排序默认值 && 设置搜索表单项的默认值
searchColumns.forEach((column, index) => {
  column.search!.order = column.search!.order ?? index + 2;
  if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
    searchInitParam.value[column.search.key ?? lastProp(column.prop!)] = column.search?.defaultValue;
    searchParam.value[column.search.key ?? lastProp(column.prop!)] = column.search?.defaultValue;
  }
});

// 排序搜索表单项
searchColumns.sort((a, b) => a.search!.order! - b.search!.order!);

// 列设置 ==> 过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns.value!.filter(
  item => !["selection", "index", "expand"].includes(item.type!) && item.prop !== "operation" && item.isShow
);

const openColSetting = () => colRef.value.openColSetting();

// 操作框
const dialogOperateRef = ref();
// 表格大小样式
type ElTableSize = "" | "default" | "small" | "large";
type CustomTableSize = "" | "default" | "small" | "large" | "mini";
enum TableSizeEnum {
  Large = "large",
  Default = "default",
  Small = "small",
  Mini = "mini",
}

const tableSizeValueMap = { small: { height: "40px" }, mini: { height: "24px", fontSize: "12px", padding: "0" } };

// 如果是 mini，则取 ElTableSize 为 default，反之默认
const elTableSize = ref<ElTableSize>(TableSizeEnum.Default);
const customTableSize = ref<CustomTableSize>(TableSizeEnum.Default);

// 表格样式
const rowStyle = ref({});
const cellStyle = ref({});
const headerCellStyle = ref({});

watch(
  () => props.size,
  () => nextTick(() => handleSizeCommand(props.size)),
  { immediate: true }
);

const handleSizeCommand = (command: CustomTableSize) => {
  if (command === TableSizeEnum.Large) {
    changeTableSize(TableSizeEnum.Large);
    changeStyle({});
  } else if (command === TableSizeEnum.Default) {
    changeTableSize(TableSizeEnum.Default);
    changeStyle({});
  } else if (command === TableSizeEnum.Small) {
    changeTableSize(TableSizeEnum.Small);
    cellStyle.value = {};
    headerCellStyle.value = rowStyle.value = { height: tableSizeValueMap.small.height };
  } else if (command === TableSizeEnum.Mini) {
    elTableSize.value = TableSizeEnum.Default;
    customTableSize.value = TableSizeEnum.Mini;
    rowStyle.value = { height: tableSizeValueMap.mini.height, fontSize: tableSizeValueMap.mini.fontSize };
    headerCellStyle.value = {
      height: tableSizeValueMap.mini.height,
      fontSize: tableSizeValueMap.mini.fontSize,
      padding: tableSizeValueMap.mini.padding,
    };
    cellStyle.value = { padding: tableSizeValueMap.mini.padding };
  }
};

const changeTableSize = (size: ElTableSize) => {
  elTableSize.value = size;
  customTableSize.value = size;
};

const changeStyle = (style: Object) => {
  rowStyle.value = style;
  cellStyle.value = style;
  headerCellStyle.value = style;
};

const visibleButton = (api: any, flag: boolean | undefined) => {
  // flag为 undefined 时，判断 api 是否存在
  if (flag) return true;
  if (flag === false) return false;
  return api;
};

const handleDeleteBatch = () => {
  dialogOperateRef.value?.handleDeleteBatch(selectedListIds.value, () => {
    clearSelection();
    getTableList();
  });
};

// 导出
const downloadFile = async (
  columns: any,
  data: any[],
  fileName: string,
  msg: string,
  exportKey: "props" | "label" | "dataKey"
) => {
  ElMessageBox.confirm(msg, "温馨提示", { type: "warning" }).then(() => {
    const tHeader = [] as string[];
    const propName = [] as string[];

    const flatData = filterFlatData(data);
    if (exportKey === "dataKey") {
      Object.keys(flatData[0]).forEach((item: any) => {
        propName.push(item);
        tHeader.push(item);
      });
    } else {
      columns.forEach((item: any) => {
        if (!item.type && item.prop !== "operation") {
          propName.push(item.prop!);
          if (exportKey === "props") tHeader.push(item.prop!);
          else tHeader.push(item.label!);
        }
      });
    }

    const filterVal = propName;
    // filterFlatData：扁平化 data，data 可能有 children 属性和 _enum 属性
    const d = formatJsonToArray(flatData, filterVal);
    exportJsonToExcel(tHeader, d, fileName, undefined, undefined, true, "xlsx");
  });
};

/**
 * @description 扁平化 data，data 可能有 children 属性和 _enum 属性
 */
const filterFlatData = (data: any[]) => {
  return data.reduce((pre: any[], current: any) => {
    // 针对枚举类的导出
    if (current._enum) {
      Object.keys(current._enum).forEach(key => (current[key] = unref(current._enum[key])));
      delete current._enum;
    }
    let flatArr = [...pre, current];
    if (current.children) flatArr = [...flatArr, ...filterFlatData(current.children)];
    return flatArr;
  }, []);
};
// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  dialogOperateRef,
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
});
</script>

<style lang="scss">
@import "./index";
</style>
