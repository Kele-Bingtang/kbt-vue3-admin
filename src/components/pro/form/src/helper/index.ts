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
