import { type FormSchemaProps } from "@/components";
import { getFormProp, hyphenToCamelCase, setFormProp } from "../helper";
import type { ModelRef } from "vue";
import { componentMap } from "../helper/componentMap";
import { type PascalCaseComponentName } from "../interface";

export const useRenderComponent = (
  model: ModelRef<Record<string, any>, string>,
  componentProps: ComputedRef<Record<string, any>>,
  column: FormSchemaProps
) => {
  const renderComponent = () => {
    // 注册自定义的组件
    const Component = componentMap[hyphenToCamelCase(column.el) as PascalCaseComponentName] as ReturnType<
      typeof defineComponent
    >;

    return (
      <Component
        modelValue={getFormProp(model.value, column.prop, column.valueFormat)}
        onUpdate:modelValue={(v: any) => setFormProp(model.value, column.prop, v)}
        {...componentProps.value}
      ></Component>
    );
  };

  return { renderComponent };
};
