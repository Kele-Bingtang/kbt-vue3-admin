<script setup lang="ts">
import type { CSSProperties } from "vue";
import type { ProTableHeaderNamespace } from "./types";
import { Coin, Operation, Download } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { TableColumnTypeEnum, TableSizeEnum, ToolButtonEnum } from "./helper";
import TableHeaderColumnSetting from "./plugins/table-header-column-setting.vue";
import { exportExcel } from "./helper/export";

defineOptions({ name: "TableHeader" });

const props = withDefaults(defineProps<ProTableHeaderNamespace.Props>(), {
  data: () => [],
  columns: () => [],
  button: () => ["size", "setting", "export"],
  disabledButton: () => [],
  size: () => TableSizeEnum.Default,
  title: "",
  exportFile: undefined,
  exportKey: "label",
  tooltipProps: () => ({ placement: "top", effect: "light" }),
});

const emits = defineEmits<ProTableHeaderNamespace.Emits>();

const ns = useNamespace("pro-table-header");

const columnSettingVisible = ref(false);
const tableSize = ref<TableSizeEnum>(TableSizeEnum.Default);
const tableStyle = reactive<Record<string, CSSProperties>>({
  rowStyle: {},
  cellStyle: {},
  headerCellStyle: {},
});

const tableSizeStyleMap: Record<TableSizeEnum, Record<"cellStyle" | "rowStyle" | "headerCellStyle", CSSProperties>> = {
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
  const { button } = props;

  if (!button) return false;
  return button.includes(key);
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
      column.isHide = column.isHide ?? false;
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
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('left')">
      <slot name="header-left">{{ title }}</slot>
    </div>

    <div v-if="button" :class="ns.e('right')">
      <slot name="header-right">
        <slot name="header-right-before"></slot>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Size)" content="密度" v-bind="tooltipProps">
          <el-dropdown style="margin: 0 15px" @command="handleSizeCommand">
            <el-button :disabled="disabledButton.includes(ToolButtonEnum.Size)" :icon="Coin" circle />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(value, key) in TableSizeEnum" :key :disabled="tableSize === value">
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
            :disabled="disabledButton.includes(ToolButtonEnum.Setting)"
            :icon="Operation"
            circle
            @click="columnSettingVisible = true"
          />
        </el-tooltip>

        <el-tooltip v-if="showToolButton(ToolButtonEnum.Export)" content="导出" v-bind="tooltipProps">
          <el-button
            :disabled="disabledButton.includes(ToolButtonEnum.Export)"
            :icon="Download"
            circle
            @click="handleExport"
          />
        </el-tooltip>

        <slot name="header-right-after"></slot>
      </slot>
    </div>

    <TableHeaderColumnSetting v-model="columnSettingVisible" :columns="settingColumns" />
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins/bem" as *;

@include b(pro-table-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;

  @include e(right) {
    display: flex;
    align-items: center;
  }
}
</style>
