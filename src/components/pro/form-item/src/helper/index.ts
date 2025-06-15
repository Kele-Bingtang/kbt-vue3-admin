import type { Reactive } from "vue";
import type { ModelBaseValueType, FormItemColumnProps } from "../types";
import { isRef } from "vue";
import { isArray, isEmpty, isFunction, isObject, isPromise } from "@/utils";

export * from "./component";

/**
 * 将连字符转换为大驼峰格式
 */
export const hyphenToCamelCase = (val?: string) => {
  // 如果字符串中不包含连字符，直接返回
  if (!val || val.indexOf("-") === -1) return val || "";

  // 使用 split 方法按连字符分割字符串
  const parts = val.split("-");
  // 使用 map 对每个部分进行转换，首字母大写，其余部分小写
  const pascalCasedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());

  // 使用 join 方法将转换后的部分合并成新的字符串
  return pascalCasedParts.join("");
};

/**
 * 格式化值
 */
export const formatValue = async <T = any>(
  value: T | Promise<T> | Ref<T> | Reactive<T> | ComputedRef<T> | ((...arg: any) => Promise<T>),
  params: any[] = [],
  processRef: boolean = true
): Promise<any> => {
  if (value === undefined) return value;

  if (isRef(value)) {
    if (processRef) return unref(value);
    return value;
  }
  if (isProxy(value)) {
    if (processRef) return { ...value };
    return value;
  }
  if (isObject(value)) return { ...value };
  if (isFunction(value)) return await (value as any)(...params);
  if (isPromise(value)) return await value;

  return value;
};

/**
 * 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const getProp = (
  model: ModelBaseValueType,
  prop: NonNullable<FormItemColumnProps["prop"]>,
  valueFormat?: FormItemColumnProps["getFormat"]
) => {
  if (!isObject(model)) return model;

  let value: any;
  if (!prop.includes(".")) value = (model as any)[prop];
  else {
    prop.split(".").forEach(item => (model = (model as any)[item] ?? ""));
    // 如果是 ElInputNumber，则需要返回数字类型，因此这里 form 如果为 ""，则返回 undefined，这样字符串和数字类型的组件都支持
    value = model || undefined;
  }

  // 格式化 value 值
  if (!valueFormat) return value;
  if (isFunction(valueFormat)) return valueFormat(value);
  if (valueFormat === "string" && !isEmpty(value)) return value + "";
  if (valueFormat === "number" && !isEmpty(value)) return Number(value);
  if (valueFormat === "boolean" && !isEmpty(value)) {
    if ((value as string) === "0" || (value as number) === 0) return false;
    else return false;
  }
  return value;
};

/**
 * 对 model 对象的 pro 赋值
 */
export const setProp = (model: ModelBaseValueType, prop: NonNullable<FormItemColumnProps["prop"]>, value: unknown) => {
  if (!model) return;

  const props = prop.split(".");
  let current = model as any;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];
    if (!current[prop]) current[prop] = {};
    current = current[prop];
  }
  current[props[props.length - 1]] = value;
};

/**
 * 根据枚举列表查询当需要的数据（如果指定了 value 的 key 值，会自动识别格式化）
 */
export const filterOptions = (
  modelValue: unknown,
  options: Recordable[],
  optionField?: FormItemColumnProps["optionField"]
) => {
  const value = optionField?.value ?? "value";
  const children = optionField?.children ?? "children";
  const filterOptions: Recordable[] = [];
  let filterOption: Recordable = {};

  // 判断 options 是否为数组
  if (isArray(modelValue)) {
    modelValue.forEach(item => {
      const data = findItemNested(item, options, value, children);
      data && filterOptions.push(data);
    });
  } else filterOption = findItemNested(modelValue, options, value, children) || {};

  return filterOptions.length ? filterOptions : filterOption || "";
};

/**
 * 递归查找 callValue 对应的 options 值
 */
export const findItemNested = (
  modelValue: unknown,
  options: Recordable[],
  value: string,
  children: string
): Recordable | null => {
  return options.reduce<Recordable | null>((accumulator, current) => {
    if (accumulator) return accumulator;
    // 兼容数字和字符串数字匹配，如值为数字 0，字典是 '0'，依然满足条件
    if (current[value] === modelValue || current[value] === modelValue + "") return current;
    if (current[children]) return findItemNested(modelValue, current[children], value, children);
    return null;
  }, null);
};

/**
 * 根据枚举列表查询当需要的 label 数据
 */
export function filterOptionsValue(options: Recordable | Recordable[], keyName = "label", defaultValue = "--") {
  if (!isArray(options)) return options ? options[keyName] : defaultValue;

  const filterDataArray: string[] = [];
  options.forEach(item => filterDataArray.push(item[keyName]));
  return filterDataArray;
}
