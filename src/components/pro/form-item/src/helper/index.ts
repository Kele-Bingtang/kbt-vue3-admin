import { isFunction, isObject, isPromise } from "@/utils";
import { isRef, type Reactive } from "vue";

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
