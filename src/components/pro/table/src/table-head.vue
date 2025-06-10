<script setup lang="ts">
import type { CSSProperties } from "vue";
import type { ProTableHeadNamespace, TableStyle } from "./types";
import { Coin, Operation, Download } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { TableColumnTypeEnum, TableSizeEnum, ToolButtonEnum } from "./helper";
import TableHeadColumnSetting from "./plugins/table-head-column-setting.vue";
import { exportExcel } from "./helper/export";

defineOptions({ name: "TableHead" });

const props = withDefaults(defineProps<ProTableHeadNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  toolButton: () => ["size", "setting", "export"],
  disabledToolButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportFile: undefined,
  exportKey: "label",
  tooltipProps: () => ({ placement: "top", effect: "light" }),
});

const emits = defineEmits<ProTableHeadNamespace.Emits>();

const ns = useNamespace("pro-table-head");

const columnSettingVisible = ref(false);
const tableSize = ref<TableSizeEnum>(TableSizeEnum.Default);
const tableStyle = reactive<Record<string, CSSProperties>>({
  rowStyle: {},
  cellStyle: {},
  headerCellStyle: {},
});

const tableSizeStyleMap: Record<TableSizeEnum, TableStyle> = {
  [TableSizeEnum.Default]: {
    cellStyle: {},
    rowStyle: {},
    headerCellStyle: {},
  },
  [TableSizeEnum.Large]: {
    cellStyle: {},
    rowStyle: {},
    headerCellStyle: {},
  },
  [TableSizeEnum.Small]: {
    cellStyle: {},
    rowStyle: { height: "40px" },
    headerCellStyle: { height: "40px" },
  },
  [TableSizeEnum.Mini]: {
    cellStyle: { padding: "0" },
    rowStyle: { height: "24px", fontSize: "12px" },
    headerCellStyle: { height: "24px", fontSize: "12px", padding: "0" },
  },
};

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
  const tableSizeStyle = tableSizeStyleMap[command];
  tableStyle.rowStyle = tableSizeStyle.rowStyle;
  tableStyle.cellStyle = tableSizeStyle.cellStyle;
  tableStyle.headerCellStyle = tableSizeStyle.headerCellStyle;

  emits("sizeChange", tableSize.value, tableSizeStyle);
};

const settingColumns = computed(() => {
  return props.columns
    .filter(column => ![TableColumnTypeEnum.Selection].includes(column.type as TableColumnTypeEnum))
    .map(column => {
      column.isHide ??= false;
      column.filterProps = { ...column.filterProps };
      return column;
    });
});

/**
 * 表格导出
 */
const handleExport = () => {
  const { data, columns, exportProps } = props;

  if (exportProps?.exportFile) return exportProps.exportFile(data);
  exportExcel(columns, data, exportProps);
};

const toggleColumnSetting = (show = !columnSettingVisible.value) => (columnSettingVisible.value = show);

const expose = { sizeCommand: handleSizeCommand, exportFile: handleExport, toggleColumnSetting };
defineExpose(expose);
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('left')">
      <slot name="header-left">{{ title }}</slot>
    </div>

    <div v-if="toolButton" :class="ns.e('right')">
      <slot name="header-right">
        <slot name="header-right-before"></slot>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Size)" content="密度" v-bind="tooltipProps">
          <el-dropdown style="margin: 0 15px" @command="handleSizeCommand">
            <el-button :disabled="disabledToolButton.includes(ToolButtonEnum.Size)" :icon="Coin" circle />
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

        <el-tooltip
          v-if="showToolButton(ToolButtonEnum.Setting) && columns.length"
          content="列配置"
          v-bind="tooltipProps"
        >
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.Setting)"
            :icon="Operation"
            circle
            @click="columnSettingVisible = true"
          />
        </el-tooltip>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Export)" content="导出" v-bind="tooltipProps">
          <el-button
            :disabled="disabledToolButton.includes(ToolButtonEnum.Export)"
            :icon="Download"
            circle
            @click="handleExport"
          />
        </el-tooltip>

        <slot name="header-right-after"></slot>
      </slot>
    </div>

    <TableHeadColumnSetting v-model="columnSettingVisible" :columns="settingColumns" />
  </div>
</template>

<style lang="scss" scoped>
@use "./table-head";
</style>
