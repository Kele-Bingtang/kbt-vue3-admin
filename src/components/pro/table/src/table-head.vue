<script setup lang="ts">
import type { ProTableHeadNamespace, SizeStyle, TableColumn } from "./types";
import { Coin, Operation, Download, Setting } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { TableColumnTypeEnum, TableSizeEnum, ToolButtonEnum } from "./helper";
import { exportExcel } from "./plugins/export";
import TableHeadColumnSetting from "./plugins/table-head-column-setting.vue";

defineOptions({ name: "TableHead" });

const props = withDefaults(defineProps<ProTableHeadNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  toolButton: () => ["size", "export", "columnSetting", "baseSetting"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportProps: () => ({}),
  tooltipProps: () => ({ placement: "top", effect: "light" }),
  sizeStyle: () => ({}),
  columnSetting: () => ({}),
  baseSetting: () => ({}),
});

const emits = defineEmits<ProTableHeadNamespace.Emits>();

const ns = useNamespace("pro-table-head");

const columnSettingVisible = ref(false);
// 密度值
const tableSize = ref<TableSizeEnum>((props.size as TableSizeEnum) || TableSizeEnum.Default);

// 密度样式 Map
const sizeStyleMap = computed<Record<TableSizeEnum, SizeStyle>>(() => {
  return {
    [TableSizeEnum.Default]: {
      cellStyle: {},
      rowStyle: {},
      headerCellStyle: {},
      ...props.sizeStyle[TableSizeEnum.Default],
    },
    [TableSizeEnum.Large]: {
      cellStyle: {},
      rowStyle: {},
      headerCellStyle: {},
      ...props.sizeStyle[TableSizeEnum.Large],
    },
    [TableSizeEnum.Small]: {
      cellStyle: {},
      rowStyle: { height: "40px" },
      headerCellStyle: { height: "40px" },
      ...props.sizeStyle[TableSizeEnum.Small],
    },
    [TableSizeEnum.Mini]: {
      cellStyle: { padding: "0" },
      rowStyle: { height: "24px", fontSize: "12px" },
      headerCellStyle: { height: "24px", fontSize: "12px", padding: "0" },
      ...props.sizeStyle[TableSizeEnum.Mini],
    },
  };
});

// 列配置需要的列
const settingColumns = computed(() => {
  return props.columns
    .filter(column => !hasSpecialColumn(column))
    .map(column => {
      column.hide ??= false;
      column.filterProps = { ...column.filterProps };
      return column;
    });
});

onMounted(() => {
  // 初始化尺寸
  handleSizeCommand(tableSize.value);
});

/**
 * 控制 ToolButton 显示
 */
const showToolButton = (key: ToolButtonEnum) => {
  const { toolButton } = props;

  if (!toolButton) return false;
  return toolButton.includes(key);
};

/**
 * 表格密度修改
 */
const handleSizeCommand = (command: TableSizeEnum) => {
  tableSize.value = command;
  const tableSizeStyle = sizeStyleMap.value[command];

  emits("sizeChange", tableSize.value, tableSizeStyle);
};

/**
 * 表格导出
 */
const handleExport = () => {
  const { data, columns, exportProps } = props;

  if (exportProps.exportFile) return exportProps.exportFile(data);
  exportExcel(columns, data, exportProps);
};

/**
 * 是否含有特殊列（多选列、单选列）
 */
const hasSpecialColumn = (column: TableColumn) =>
  [TableColumnTypeEnum.Selection, TableColumnTypeEnum.Radio].includes(column.type as TableColumnTypeEnum);

/**
 * 切换列配置抽屉的显示状态
 */
const toggleColumnSetting = (show = !columnSettingVisible.value) => (columnSettingVisible.value = show);

/**
 * 列配置拖拽事件
 */
const handleDragSortEnd = (newIndex: number, oldIndex: number) => {
  const { columns } = props;

  const partColumns = columns.slice(0, newIndex);
  const specialColumnsLength = partColumns.filter(column => hasSpecialColumn(column)).length;

  if (specialColumnsLength) {
    const [removedItem] = columns.splice(oldIndex + specialColumnsLength, 1);
    props.columns.splice(newIndex + specialColumnsLength, 0, removedItem);
  } else {
    const [removedItem] = columns.splice(oldIndex, 1);
    props.columns.splice(newIndex, 0, removedItem);
  }
};

const expose = { sizeCommand: handleSizeCommand, exportFile: handleExport, toggleColumnSetting };
defineExpose(expose);
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('left')">
      <slot name="head-left">{{ title }}</slot>
    </div>

    <div v-if="toolButton" :class="ns.e('right')">
      <slot name="head-right">
        <slot name="head-right-before"></slot>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Size)" content="密度" v-bind="tooltipProps">
          <el-dropdown @command="handleSizeCommand">
            <el-button :disabled="disabledToolButton.includes(ToolButtonEnum.Size)" :icon="Coin" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(value, key) in TableSizeEnum"
                  :key
                  :command="value"
                  :disabled="tableSize === value"
                >
                  {{ key }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Export)" content="导出" v-bind="tooltipProps">
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.Export)"
            :icon="Download"
            @click="handleExport"
          />
        </el-tooltip>

        <el-tooltip
          v-if="showToolButton(ToolButtonEnum.ColumnSetting) && columns.length"
          content="列配置"
          v-bind="tooltipProps"
        >
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.ColumnSetting)"
            :icon="Operation"
            @click="columnSettingVisible = true"
          />
        </el-tooltip>

        <ElPopover placement="bottom" trigger="click">
          <template #reference>
            <div>
              <el-tooltip v-if="showToolButton(ToolButtonEnum.BaseSetting)" content="基础配置" v-bind="tooltipProps">
                <el-button :disabled="disabledToolButton.includes(ToolButtonEnum.BaseSetting)" :icon="Setting" />
              </el-tooltip>
            </div>
          </template>
          <div>
            <ElCheckbox v-model="baseSetting.border" :value="true" :disabled="baseSetting.disabledBorder">
              边框
            </ElCheckbox>
            <ElCheckbox v-model="baseSetting.stripe" :value="true" :disabled="baseSetting.disabledStripe">
              斑马纹
            </ElCheckbox>
            <ElCheckbox
              v-model="baseSetting.headerBackground"
              :value="true"
              :disabled="baseSetting.disabledHeaderBackground"
            >
              表头背景
            </ElCheckbox>
            <ElCheckbox
              v-model="baseSetting.highlightCurrentRow"
              :value="true"
              :disabled="baseSetting.disabledHighlightCurrentRow"
            >
              单击行高亮
            </ElCheckbox>
          </div>
        </ElPopover>

        <slot name="head-right-after"></slot>
      </slot>
    </div>

    <TableHeadColumnSetting
      v-model="columnSettingVisible"
      :columns="settingColumns"
      :column-setting
      @drag-sort-end="handleDragSortEnd"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "./table-head";
</style>
