import type { TableColumnCtx } from "element-plus";
import type { TableColumnProps } from "../types";

/**
 * 处理 prop，当 prop 为多级嵌套时，返回最后一级 prop
 *
 * @param prop 当前 prop
 */
export const lastProp = (prop: string) => {
  const propArr = prop.split(".");
  if (propArr.length === 1) return prop;
  return propArr[propArr.length - 1];
};

/**
 * 处理值无数据情况
 *
 * @param callValue 需要处理的值
 */
export const formatCellValue = (callValue: any) => {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (Array.isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
};

export const formatTableColumnType = (item: TableColumnProps) => {
  return item as unknown as TableColumnCtx<any>;
};
