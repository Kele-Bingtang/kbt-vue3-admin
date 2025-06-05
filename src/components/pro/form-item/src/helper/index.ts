import type { Reactive } from "vue";
import type { FieldBaseValueType, FormItemColumnProps } from "../types";
import { isRef } from "vue";
import { isEmpty, isFunction, isObject, isPromise } from "@/utils";

export * from "./component-map";

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
  params: any[] = []
): Promise<any> => {
  if (value === undefined) return value;

  if (isRef(value)) return unref(value);
  if (isFunction(value)) return await (value as any)(...params);
  if (isObject(value)) return { ...value };
  if (isPromise(value)) return await value;

  return value;
};

/**
 * 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const getProp = (
  model: FieldBaseValueType,
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
export const setProp = (model: FieldBaseValueType, prop: NonNullable<FormItemColumnProps["prop"]>, value: any) => {
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
