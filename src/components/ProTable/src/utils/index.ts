import { ElMessageBox } from "element-plus";
import type { FieldNamesProps } from "../interface";
import { exportJsonToExcel, formatJsonToArray } from "@/utils";
import { unref } from "vue";

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
  const filterDataArray: { [key: string]: any }[] = [];
  let filterData: { [key: string]: any } = {};
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
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
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

// 导出
export const downloadFile = async (
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

/**
 * @description 深拷贝函数
 */
export const deepCloneTableRow = (obj: any, hash = new WeakMap()): Record<string, any> => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(item => deepCloneTableRow(item));

  if (hash.has(obj)) return hash.get(obj);

  const Constructor = obj.constructor;

  if (Constructor === Date) return new Date(obj);
  if (Constructor === RegExp) return new RegExp(obj);

  const newObj = new Constructor();
  hash.set(obj, newObj);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCloneTableRow(obj[key], hash);
    }
  }

  return newObj;
};

export const visibleButton = (api: any, flag: boolean | undefined) => {
  // flag 为 undefined 时，判断 api 是否存在
  if (flag === undefined) return api;
  return flag;
};
