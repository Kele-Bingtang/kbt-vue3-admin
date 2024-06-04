<template>
  <div :class="`${prefixClass}__main__header`">
    <div :class="`${prefixClass}__main__header--button-lf`">
      <slot
        name="tableHeader"
        :selected-list-ids="selectedListIds"
        :selected-list="selectedList"
        :is-selected="isSelected"
        :operate="dialogFormRef"
      >
        <el-button
          v-if="visibleButton(dialogForm?.addApi, dialogForm?.useAdd)"
          type="primary"
          :icon="Plus"
          @click="emits('add')"
          :disabled="dialogForm?.disableAdd"
        >
          新增
        </el-button>
        <el-button
          v-if="visibleButton(dialogForm?.removeBatchApi, dialogForm?.useRemoveBatch) && showDeleteBatchBtn"
          type="danger"
          :icon="Delete"
          plain
          @click="emits('removeBatch')"
          :disabled="dialogForm?.disableRemoveBatch || !isSelected"
        >
          删除
        </el-button>
        <slot
          name="tableHeaderExtra"
          :selected-list-ids="selectedListIds"
          :selected-list="selectedList"
          :is-selected="isSelected"
          :operate="dialogFormRef"
        ></slot>
      </slot>
    </div>

    <div v-if="toolButton" :class="`${prefixClass}__main__header--button-ri`">
      <slot name="toolButton">
        <el-tooltip v-if="showToolButton('refresh')" effect="light" content="刷新" placement="top">
          <el-button :icon="Refresh" circle @click="emits('refresh')" />
        </el-tooltip>

        <el-tooltip v-if="showToolButton('size')" effect="light" content="密度" placement="top">
          <el-dropdown style="margin: 0 15px" @command="handleSizeCommand">
            <el-button :icon="Coin" circle />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="large" :disabled="customTableSize === 'large'">Large</el-dropdown-item>
                <el-dropdown-item command="default" :disabled="customTableSize === 'default'">Default</el-dropdown-item>
                <el-dropdown-item command="small" :disabled="customTableSize === 'small'">Small</el-dropdown-item>
                <el-dropdown-item command="mini" :disabled="customTableSize === 'mini'">Mini</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-tooltip v-if="showToolButton('setting') && columns.length" effect="light" content="列配置" placement="top">
          <el-button :icon="Operation" circle @click="emits('colSetting')" />
        </el-tooltip>

        <el-tooltip v-if="showToolButton('export')" effect="light" content="导出" placement="top">
          <el-button
            :icon="Download"
            circle
            @click="() => downloadFile(columns, data, 'export', '确认导出数据?', exportKey)"
          />
        </el-tooltip>

        <el-tooltip v-if="showToolButton('search') && showSearch" effect="light" content="隐藏搜索" placement="top">
          <el-button :icon="Search" circle @click="emits('search')" />
        </el-tooltip>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, watch, type CSSProperties } from "vue";
import { ElTooltip, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, type ComponentSize } from "element-plus";
import { Refresh, Plus, Operation, Search, Delete, Coin, Download } from "@element-plus/icons-vue";
import { downloadFile, visibleButton } from "../helper";
import type { DialogFormProps } from "./DialogForm.vue";
import {
  TableSizeEnum,
  dialogFormInstanceKey,
  proTablePrefixClassKey,
  type TableColumnProps,
  type ToolButton,
} from "../interface";

defineOptions({ name: "ProTableMainHeader" });

const prefixClass = inject(proTablePrefixClassKey) as string;

export interface ProTableProps {
  columns: TableColumnProps[]; // 列配置项 ==> 必传
  data: any[]; // 数据
  toolButton: ToolButton[] | boolean; // 按钮显示数组
  selectedList: Record<string, any>[]; // 选择的数据
  selectedListIds: string[]; // 选择的数据 ID
  isSelected: boolean; // 是否选中过数据
  size: CustomTableSize; // 表格大小
  exportKey: "props" | "label" | "dataKey"; // 导出时的表头配置（prop 为使用  columns 的 props，label 为使用 columns 的 label，dataKey 为使用 data 的 key），默认为 dataKey
  showSearch: boolean; // 是否展示搜索按钮
  dialogForm?: DialogFormProps; // 新增、编辑、删除表单配置
}

// 接受父组件参数，配置默认值
const props = defineProps<ProTableProps>();

const dialogFormRef = inject(dialogFormInstanceKey);

const showDeleteBatchBtn = computed(() => {
  return props.columns?.filter(item => item.type === "selection");
});

// 控制 ToolButton 显示
const showToolButton = (key: ToolButton) => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
};

type TableMainHeaderEmits = {
  add: [];
  removeBatch: [];
  refresh: [];
  size: [size: ElTableSize, rowStyle: CSSProperties, cellStyle: CSSProperties, headerCellStyle: CSSProperties];
  colSetting: [];
  search: [];
};

const emits = defineEmits<TableMainHeaderEmits>();

// 表格大小样式
export type ElTableSize = ComponentSize;
export type CustomTableSize = ComponentSize | "mini";

// 如果是 mini，则取 ElTableSize 为 default，反之默认
let elTableSize: ElTableSize = TableSizeEnum.Default;
let customTableSize: CustomTableSize = TableSizeEnum.Default;
let rowStyle: CSSProperties = {};
let cellStyle: CSSProperties = {};
let headerCellStyle: CSSProperties = {};

watch(
  () => props.size,
  () => nextTick(() => handleSizeCommand(props.size)),
  { immediate: true }
);

const tableSizeMap = { small: { height: "40px" }, mini: { height: "24px", fontSize: "12px", padding: "0" } };

const handleSizeCommand = (command: CustomTableSize) => {
  if (command === TableSizeEnum.Large) {
    changeTableSize(TableSizeEnum.Large);
    changeStyle({});
  } else if (command === TableSizeEnum.Default) {
    changeTableSize(TableSizeEnum.Default);
    changeStyle({});
  } else if (command === TableSizeEnum.Small) {
    changeTableSize(TableSizeEnum.Small);
    cellStyle = {};
    headerCellStyle = rowStyle = { height: tableSizeMap.small.height };
  } else if (command === TableSizeEnum.Mini) {
    elTableSize = TableSizeEnum.Default;
    customTableSize = TableSizeEnum.Mini;
    rowStyle = { height: tableSizeMap.mini.height, fontSize: tableSizeMap.mini.fontSize };
    headerCellStyle = {
      height: tableSizeMap.mini.height,
      fontSize: tableSizeMap.mini.fontSize,
      padding: tableSizeMap.mini.padding,
    };
    cellStyle = { padding: tableSizeMap.mini.padding };
  }

  emits("size", elTableSize, rowStyle, cellStyle, headerCellStyle);
};

const changeTableSize = (size: ElTableSize) => {
  elTableSize = size;
  customTableSize = size;
};

const changeStyle = (style: CSSProperties) => {
  rowStyle = style;
  cellStyle = style;
  headerCellStyle = style;
};
</script>
