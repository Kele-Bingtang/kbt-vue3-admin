import { isFunction, isPlainObject, isPromise } from "@/utils";
import { isRef, isProxy } from "vue";
import type { FieldValueType } from "../types";

export const isResponsive = (obj: any) => {
  return isRef(obj) || isProxy(obj);
};
/**
 * @description 处理 ProForm 多级 prop，将多级 prop 转为对象
 * 如 prop 为 meta.title，则转为 { meta: { title: "" } }
 */
export const handleNestProp = (obj: Record<string, any>, delimiter = ".") => {
  const transformed: Record<string, any> = {};

  for (const key in obj) {
    const keys = key.split(delimiter);
    let current = transformed;

    for (const [i, subKey] of keys.entries()) {
      if (i === keys.length - 1) {
        current[subKey] = obj[key];
        break;
      }

      current[subKey] = current[subKey] || {};
      current = current[subKey];
    }
  }

  return transformed;
};

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const getProp = (
  form: FieldValueType,
  prop: string,
  valueFormat: "default" | "string" | "number" | "boolean" = "default"
) => {
  if (!isPlainObject(form)) return form;

  let value: any;
  if (!prop.includes(".")) value = (form as any)[prop];
  else {
    prop.split(".").forEach(item => (form = (form as any)[item] ?? ""));
    // 如果是 ElInputNumber，则需要返回数字类型，因此这里 form 如果为 ""，则返回 undefined，这样字符串和数字类型的组件都支持
    value = form || undefined;
  }

  if (valueFormat === "string" && (value || value === 0 || value === false)) return value + "";
  if (valueFormat === "number" && (value || value === 0 || value === false)) return Number(value);
  if (valueFormat === "boolean" && (value || value === 0 || value === false)) {
    if ((value as any) === "1" || (value as any) === 1) return true;
    else return false;
  }
  return value;
};

/**
 * @description 对 form 对象的 pro 赋值
 */
export const setProp = (form: Record<string, any>, prop: string, value: any) => {
  if (!form) return;
  const props = prop.split(".");
  let current = form;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];
    if (!current[prop]) current[prop] = {};
    current = current[prop];
  }
  current[props[props.length - 1]] = value;
};

/**
 * @description 将连字符转换为大驼峰格式
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
 *
 * @param slots 插槽属性
 */
export const setComponentSlots = (slots: Record<string, any> = {}) => {
  const slotObj: Record<string, any> = {};
  for (const key in slots) {
    if (slots[key]) {
      const newKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      if (typeof slots[key] === "function") {
        slotObj[newKey] = (...args: any[]) => slots[key]?.(...args);
      } else {
        slotObj[newKey] = () => slots[key];
      }
    }
  }
  return slotObj;
};

/**
 * 删除对象中的属性，包括嵌套属性
 * @param obj 对象
 * @param prop 对象的key
 */
export const deleteObjProperty = (obj: Record<string, any>, prop: string) => {
  const keys = prop.split(".");
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      if (current[keys[i]] !== undefined) {
        delete current[keys[i]];
        return true; // 属性存在并已删除
      } else return false; // 目标属性不存在
    }
    if (current[keys[i]] === undefined) return false; // 路径中的某个部分不存在
    current = current[keys[i]];
  }
  return false; // 不应该到达这里，除非路径为空
};

export const formatValue = async <T = any>(
  value: T | Promise<T> | ComputedRef<T> | ((...arg: any) => Promise<T>),
  params: any[]
): Promise<any> => {
  if (isRef(value)) return value.value;
  if (isPromise(value)) return await value;
  if (isFunction(value)) return await (value as any)(...params);
  if (isPlainObject(value)) return { ...value };

  return value;
};
