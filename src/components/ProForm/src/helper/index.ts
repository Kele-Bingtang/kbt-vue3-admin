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
  form: Record<string, any>,
  prop: string,
  valueFormat: "default" | "string" | "number" | "boolean" = "default"
) => {
  let value: any;
  if (!prop.includes(".")) value = form[prop] ?? undefined;
  else {
    prop.split(".").forEach(item => (form = form[item] ?? ""));
    // 如果是 ElInputNumber，则需要返回数字类型，因此这里 form 如果为 ""，则返回 undefined，这样字符串和数字类型的组件都支持
    value = form || undefined;
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
 * @description 对 form 对象的 pro 赋值
 */
export const setFormProp = (form: Record<string, any>, prop: string, value: any) => {
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
 * @description 是否是有效的数字（包含正负整数，0以及正负浮点数）
 */
export const isNumber = (val: string) => {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description 是否为字符串
 */
export function isString(val: unknown): val is string {
  return Object.prototype.toString.call(val) === "[object String]";
}

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && Object.prototype.toString.call(val) === "[object Object]";
};

/**
 * @description 补 px 单位
 * @param val 值
 * @returns 补 px 单位的 string
 */
export const getPx = (val: number | string | undefined) => {
  if (!val) return "";
  if (isString(val)) {
    if (val.endsWith("%")) return val;
    if (isNumber(val)) return `${val}px`;
    return val;
  }
  return `${val}px`;
};

/**
 * @description 是否为空值项
 */
export const isEmptyVal = (val: any): boolean => {
  return val === "" || val === null || val === undefined;
};

/**
 * @description 将连字符转换为大驼峰格式
 */
export const hyphenToCamelCase = (val?: string) => {
  // 如果字符串中不包含连字符，直接返回
  if (!val || val.indexOf("-") === -1) return val;

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
