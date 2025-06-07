import { ElMessageBox, ElMessage } from "element-plus";
import { ElCheckboxGroup, ElCheckbox } from "element-plus";
import { exportJsonToExcel, formatJsonToArray } from "@/utils";
import { ref, unref } from "vue";
import type { ExportProps, ProTableNamespace } from "../types";

const defaultFileName = "export-table";
const defaultConfirmTitle = "温馨提示";
const defaultLabelConfirmTitle = "请选择导出列";
const defaultConfirmMessage = "确认导出数据?";

/**
 * 导出为 Excel
 */
export const exportExcel = async (
  columns: ProTableNamespace.Props["columns"],
  data: ProTableNamespace.Props["data"],
  exportProps: ExportProps = {}
) => {
  const { mode = "label" } = exportProps;
  if (mode === "label") return exportExcelByLabel(columns, data, exportProps);
  if (mode === "prop") return exportExcelByProp(columns, data, exportProps);
  if (mode === "dataKey") return exportExcelByDataKey(data, exportProps);

  ElMessage.error("exportKey 格式错误或不能为空");
};

/**
 * 导出为 Excel，表头为 Label
 */
export const exportExcelByLabel = async (
  columns: ProTableNamespace.Props["columns"] = [],
  data: ProTableNamespace.Props["data"] = [],
  exportProps: ExportProps = {}
) => {
  const { fileName = defaultFileName, labelConfirmTitle = defaultLabelConfirmTitle } = exportProps;
  const exportColumns = columns.filter(item => !item.type && item.prop !== "operation");
  const exportLabel = ref(exportColumns.map(item => item.label));

  await ElMessageBox.confirm(
    () => (
      <ElCheckboxGroup v-model={exportLabel.value}>
        {exportColumns.map(item => (
          <ElCheckbox label={item.label} value={item.label} />
        ))}
      </ElCheckboxGroup>
    ),
    { title: labelConfirmTitle }
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  // 扁平化 data，data 可能有 children 属性和 _enum 属性
  const flatData = filterFlatData(data);

  exportColumns.forEach((item: any) => {
    if (exportLabel.value.includes(item.label)) {
      propName.push(item.prop!);
      tHeader.push(item.label!);
    }
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 导出为 Excel，表头为 prop
 */
export const exportExcelByProp = async (
  columns: ProTableNamespace.Props["columns"] = [],
  data: ProTableNamespace.Props["data"] = [],
  exportProps: ExportProps = {}
) => {
  const {
    fileName = defaultFileName,
    confirmMessage = defaultConfirmMessage,
    confirmTitle = defaultConfirmTitle,
  } = exportProps;
  await ElMessageBox.confirm(confirmMessage, confirmTitle, { type: "warning" });

  const tHeader = [] as string[];
  const propName = [] as string[];
  // 扁平化 data，data 可能有 children 属性和 _enum 属性
  const flatData = filterFlatData(data);

  columns.forEach((item: any) => {
    if (!item.type && item.prop !== "operation") {
      propName.push(item.prop!);
      tHeader.push(item.prop!);
    }
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 导出为 Excel，表头为 dataKey
 */
export const exportExcelByDataKey = async (
  data: ProTableNamespace.Props["data"] = [],
  exportProps: ExportProps = {}
) => {
  const { fileName = defaultFileName, confirmMessage = defaultConfirmMessage } = exportProps;
  await ElMessageBox.confirm(confirmMessage, "温馨提示", { type: "warning" });

  const tHeader = [] as string[];
  const propName = [] as string[];
  // 扁平化 data，data 可能有 children 属性和 _enum 属性
  const flatData = filterFlatData(data);

  Object.keys(flatData[0]).forEach((item: any) => {
    propName.push(item);
    tHeader.push(item);
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
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
