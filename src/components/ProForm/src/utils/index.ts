import { isRef, isProxy } from "vue";

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
export const getFormProp = (
  form: { [key: string]: any },
  prop: string,
  valueFormat: "default" | "string" | "number" | "boolean" = "default"
) => {
  let value: any = "";
  if (!prop.includes(".")) value = form[prop] ?? "";
  else {
    prop.split(".").forEach(item => (form = form[item] ?? ""));
    value = form;
  }

  if (valueFormat === "string") return value + "";
  if (valueFormat === "number") return Number(value);
  if (valueFormat === "boolean") {
    if ((value as any) === "1" || (value as any) === 1) return true;
    else return false;
  }
  return value;
};

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 */
export const setFormProp = (form: { [key: string]: any }, prop: string, value: any) => {
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
