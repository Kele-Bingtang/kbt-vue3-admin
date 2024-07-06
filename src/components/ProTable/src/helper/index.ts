import type { FieldNamesProps, FilterRule } from "../interface";
export * from "./export";

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param prop 当前 prop
 * @returns 返回最后一级 prop
 * */
export function lastProp(prop: string) {
  const propArr = prop.split(".");
  if (propArr.length === 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 value 的 key 值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps) {
  const value = fieldNames?.value ?? "value";
  const children = fieldNames?.children ?? "children";
  const filterDataArray: Record<string, any>[] = [];
  let filterData: Record<string, any> = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) {
    if (Array.isArray(callValue)) {
      callValue.forEach(item => {
        const data = findItemNested(enumData, item, value, children);
        data && filterDataArray.push(data);
      });
    } else filterData = findItemNested(enumData, callValue, value, children);
  }
  return filterDataArray.length ? filterDataArray : filterData || "";
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 的 key 值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnumLabel(enumData: any, fieldNames?: FieldNamesProps) {
  const label = fieldNames?.label ?? "label";

  if (Array.isArray(enumData)) {
    const filterDataArray: any[] = [];
    enumData.forEach((item: any) => filterDataArray.push(item[label]));
    return filterDataArray;
  }

  return enumData ? enumData[label] : "--";
}

/**
 * @description 处理值无数据情况
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (Array.isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: Record<string, any>, prop: string) {
  if (!prop.includes(".")) return row[prop] ?? "--";
  prop.split(".").forEach(item => (row = row[item] ?? "--"));
  return row;
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    // 兼容数字和字符串数字匹配，如值为数字 0，字典是 '0'，依然满足条件
    if (current[value] === callValue || current[value] === callValue + "") return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}

export const visibleButton = (api: any, flag: boolean | undefined) => {
  // flag 为 undefined 时，判断 api 是否存在
  if (flag === undefined) return api;
  return flag;
};

/**
 * @description 将 data 转换为日期，如果转换失败，则返回 undefined
 */
export const strToDate = (data: string | number) => {
  if (isNaN(data as number) && !isNaN(Date.parse(data as string))) return new Date(data);
};

/**
 * 前端过滤表格数据
 * @param searchParam 查询参数
 * @param tableData 表格数据
 * @returns 过滤后的表格数据
 */
export const frontFilter = (
  filterParam: Record<string, any>,
  tableData: Record<string, any>,
  filterRule: Record<string, FilterRule>
) => {
  return tableData.filter((item: any) => {
    return Object.keys(filterParam).every(key => {
      // 输入的值
      const value = filterParam[key];
      // 表格的值
      const rowValue = item[key];
      // 匹配规则
      const rule = filterRule[key];
      // 自定义规则函数
      if (typeof rule === "function") return rule(filterParam, item, key);

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
