import { ElMessageBox, ElMessage } from "element-plus";
import { ElCheckboxGroup, ElCheckbox } from "element-plus";
import { exportJsonToExcel, formatJsonToArray } from "@/utils";
import { ref, unref } from "vue";
import type { ExportProps, ProTableNamespace } from "../types";

const defaultFileName = "export-table";
const defaultConfirmTitle = "请选择导出列";

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
  const { fileName = defaultFileName, title = defaultConfirmTitle, options, appContext } = exportProps;
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
    title,
    options,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

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
  const { fileName = defaultFileName, title = defaultConfirmTitle, options, appContext } = exportProps;
  const exportColumns = columns.filter(item => !item.type && item.prop !== "operation");
  const exportProp = ref(exportColumns.map(item => item.prop));

  await ElMessageBox.confirm(
    () => (
      <ElCheckboxGroup v-model={exportProp.value}>
        {exportColumns.map(item => (
          <ElCheckbox label={item.prop} value={item.prop} />
        ))}
      </ElCheckboxGroup>
    ),
    title,
    options,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  const flatData = filterFlatData(data);

  exportColumns.forEach((item: any) => {
    if (exportProp.value.includes(item.prop)) {
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
  const { fileName = defaultFileName, title = defaultConfirmTitle, options, appContext } = exportProps;
  const flatData = filterFlatData(data);
  const exportItem = ref(Object.keys(flatData[0]));

  await ElMessageBox.confirm(
    () => (
      <ElCheckboxGroup v-model={exportItem.value}>
        {flatData[0].map((item: any) => (
          <ElCheckbox label={item} value={item} />
        ))}
      </ElCheckboxGroup>
    ),
    title,
    options,
    appContext
  );

  const tHeader = [] as string[];
  const propName = [] as string[];

  Object.keys(flatData[0]).forEach(item => {
    if (exportItem.value.includes(item)) {
      propName.push(item);
      tHeader.push(item);
    }
  });

  const jsonArray = formatJsonToArray(flatData, propName);
  exportJsonToExcel(tHeader, jsonArray, fileName, undefined, undefined, true, "xlsx");
};

/**
 * 扁平化 data，data 可能有 children 属性和 _options 属性
 */
const filterFlatData = (data: any[]) => {
  return data.reduce((pre: any[], current: any) => {
    // 针对枚举类的导出
    if (current._options) {
      Object.keys(current._options).forEach(key => (current[key] = unref(current._options[key])));
      delete current._options;
    }
    let flatArr = [...pre, current];
    if (current.children) flatArr = [...flatArr, ...filterFlatData(current.children)];
    return flatArr;
  }, []);
};
