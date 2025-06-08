import type { FilterRule } from "../types";
import { isArray, isFunction } from "@/utils";

export * from "./enums";

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

export const initModel = (prop: string | string[], model: Recordable, value: unknown) => {
  const init = (propArr: string[]) => {
    let currentLevel = { ...model };
    propArr.forEach((prop, index) => {
      if (index === propArr.length - 1) currentLevel[prop] = value;
      else {
        // 如果不存在，则创建空对象
        if (!currentLevel[prop]) currentLevel[prop] = {};
        currentLevel = currentLevel[prop];
      }
    });

    return currentLevel;
  };

  if (isArray(prop)) return init(prop);
  if (prop?.includes(".")) return init(prop.split("."));
  model[prop] = value;

  return model;
};

/**
 * 将 data 转换为日期，如果转换失败，则返回 undefined
 */
export const strToDate = (data: string | number) => {
  if (isNaN(data as number) && !isNaN(Date.parse(data as string))) return new Date(data);
};

/**
 * 过滤数据
 *
 * @param data 数据
 * @param model 过滤条件
 * @param filterRule 过滤规则
 */
export const filterData = (data: Recordable[], model: Recordable, filterRule: Record<string, FilterRule>) => {
  return data.filter(item => {
    return Object.keys(model).every(key => {
      // 输入的值
      const value = model[key];
      // 表格的值
      const rowValue = item[key];
      // 匹配规则
      const rule = filterRule[key] || "eq";
      // 自定义规则函数
      if (isFunction(rule)) return rule(model, item, key);

      // 空值默认不查询
      if (value === undefined || value === null || value === "" || value?.length === 0) return true;

      const rowDate = strToDate(rowValue);
      // 日期类型
      if (rowDate) {
        // 日期范围查询，仅支持 between、notBetween 规则
        if (Array.isArray(value)) {
          if (value.length === 2) {
            const startDate = strToDate(value[0]);
            const endDate = strToDate(value[1]);

            if (startDate && endDate && rowDate) {
              if (rule === "between") return startDate <= rowDate && rowDate <= endDate;
              if (rule === "notBetween") return startDate > rowDate || endDate < rowDate;
              // 默认 between 规则
              return startDate <= rowDate && rowDate <= endDate;
            }
          }
        } else {
          // 单个日期查询，仅支持 lt、le、gt、ge 规则
          const date = strToDate(value);
          if (date) {
            if (rule === "lt") return date < strToDate(rowValue)!;
            if (rule === "le") return date <= strToDate(rowValue)!;
            if (rule === "gt") return date > strToDate(rowValue)!;
            if (rule === "ge") return date >= strToDate(rowValue)!;
            // 默认 gt 规则
            return date >= strToDate(rowValue)!;
          }
        }
      }

      // 数组类型，仅支持 in、between、notBetween 规则
      if (Array.isArray(value)) {
        if (value.length === 2 && !rowDate) {
          if (rule === "between") return value[0] <= rowValue && rowValue <= value[1];
          if (rule === "notBetween") return value[0] > rowValue || value[1] < rowValue;
        }
        if (rule === "in") return value.includes(rowValue);
        if (rule === "notIn") return !value.includes(rowValue);
        // 默认 in 规则
        return value.includes(rowValue);
      }

      // 基础类型：Number、String、Boolean，仅支持 eq、ne、lt、le、gt、ge、like、noLike 规则
      if (rule === "eq") return value === rowValue;
      if (rule === "ne") return value !== rowValue;
      if (rule === "lt") return value < rowValue;
      if (rule === "le") return value <= rowValue;
      if (rule === "gt") return value > rowValue;
      if (rule === "ge") return value >= rowValue;
      if (rule === "like") return rowValue.indexOf(value) !== -1;
      if (rule === "notLike") return rowValue.indexOf(value) !== -1;

      // 默认 eq
      return rowValue === value;
    });
  });
};
