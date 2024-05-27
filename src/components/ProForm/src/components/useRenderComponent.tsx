import { WangEditor, Tinymce, type FormSchemaProps } from "@/components";
import { getFormProp, setFormProp } from "../helper";
import type { ModelRef } from "vue";

export const useRenderComponent = (
  model: ModelRef<Record<string, any>, string>,
  componentProps: ComputedRef<Record<string, any>>,
  column: FormSchemaProps
) => {
  const renderComponent = () => {
    let Component = <></>;

    // 在这里注册自定义的组件
    if (column?.el === "tinymce") Component = Tinymce;
    if (column?.el === "wang-editor") Component = WangEditor;

    return (
      <Component
        model-value={getFormProp(model.value, column.prop, column.valueFormat)}
        onUpdate:modelValue={(v: any) => setFormProp(model.value, column.prop, v)}
        {...componentProps.value}
      ></Component>
    );
  };

  return { renderComponent };
};
