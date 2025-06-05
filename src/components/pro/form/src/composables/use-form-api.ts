import type { FormColumn, FormSetProps, ProFormProps } from "../types";
import { isString } from "@/utils";
import { setProp } from "@/components";

export const useFormApi = (model: Ref<Recordable>, finalProps: ComputedRef<ProFormProps>) => {
  const mergeProps = ref<ProFormProps>({});

  /**
   * 设置 model 的值
   *
   * @param modelValue 设置的值
   */
  const setValues = (modelValue: Recordable = {}) => {
    model.value = Object.assign(model.value, modelValue);
  };

  /**
   * 设置 ProForm 组件的 props
   *
   * @param props 要添加的 ProForm props
   */
  const setProps = (props: ProFormProps = {}) => {
    mergeProps.value = Object.assign(unref(mergeProps), props);
  };

  /**
   * 设置 column
   *
   * @param columnSet 设置内容
   */
  const setColumn = (columnSet: FormSetProps[]) => {
    const { columns = [] } = finalProps.value;
    for (const v of columns) {
      for (const item of columnSet) {
        if (v.prop === item.prop) {
          setProp(v, item.field, item.value);
        }
      }
    }
  };

  /**
   * 添加 column
   *
   * @param column 添加的 column
   * @param propOrIndex 参考对象，prop 或者 index
   * @param position 添加的位置，before 或者 after
   */
  const addColumn = (
    column: FormColumn,
    propOrIndex?: FormColumn["prop"] | number,
    position: "before" | "after" = "after"
  ) => {
    const { columns = [] } = finalProps.value;

    if (isString(propOrIndex)) {
      return columns.forEach((s, i) => {
        if (s.prop === propOrIndex) position === "after" ? column.splice(i + 1, 0, s) : column.splice(i, 0, s);
      });
    }
    if (propOrIndex !== undefined) return columns.splice(propOrIndex, 0, column);
    return columns.push(column);
  };

  /**
   * 删除 column
   *
   * @param prop prop
   */
  const delColumn = (prop: FormColumn["prop"]) => {
    const { columns = [] } = finalProps.value;

    const index = columns.findIndex(item => item.prop === prop);
    if (index > -1) columns.splice(index, 1);
  };

  return {
    mergeProps,
    setValues,
    setProps,
    setColumn,
    addColumn,
    delColumn,
  };
};
