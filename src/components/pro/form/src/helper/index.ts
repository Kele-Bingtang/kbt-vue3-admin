import { isEmpty, isObject } from "@/utils";

/**
 * 删除对象中的属性，包括嵌套属性
 *
 * @param obj 对象
 * @param prop 对象的key
 */
export const deleteProp = (obj: Recordable, prop: string) => {
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

/**
 * 获取对象中所有叶子节点的路径（多级路径用 . 拼接）
 *
 * 假设 假设 model 为 { user: { age: {name: ""} }, menu: "" }，如果获取为 ["user.age.name", "menu"]
 *
 * @param model 要遍历的对象
 * @param prefix 当前路径前缀
 */
export const getObjectKeys = (model: Recordable, prefix = ""): string[] => {
  return Object.keys(model).reduce((acc: string[], key: string) => {
    const value = model[key];
    const path = prefix ? `${prefix}.${key}` : key;

    // 如果是对象，继续递归
    if (isObject(value)) acc.push(...getObjectKeys(value, path));
    else acc.push(path); // 如果是基本类型或数组，视为叶子节点

    return acc;
  }, []);
};

/**
 * 过滤对象中为空值的属性
 * @param obj 需要处理的对象
 */
export const filterEmpty = <T extends Recordable>(obj: T) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!isEmpty(value)) {
      if (isObject(value)) {
        // 如果是嵌套对象，递归处理
        const nestedFiltered = filterEmpty(value as Recordable);
        if (Object.keys(nestedFiltered).length) acc[key as keyof T] = nestedFiltered as T[keyof T];
      } else acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
};
