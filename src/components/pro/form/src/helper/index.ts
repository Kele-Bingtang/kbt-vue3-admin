import type { FieldBaseValueType } from "@/components/pro/form-item";
import { isObject } from "@/utils";

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const getProp = (
  model: FieldBaseValueType,
  prop: string,
  valueFormat: "default" | "string" | "number" | "boolean" = "default"
) => {
  if (!isObject(model)) return model;

  let value: any;
  if (!prop.includes(".")) value = (model as any)[prop];
  else {
    prop.split(".").forEach(item => (model = (model as any)[item] ?? ""));
    // 如果是 ElInputNumber，则需要返回数字类型，因此这里 form 如果为 ""，则返回 undefined，这样字符串和数字类型的组件都支持
    value = model || undefined;
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
