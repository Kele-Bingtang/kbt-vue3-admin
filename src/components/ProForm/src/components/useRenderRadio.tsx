import { ElRadio, ElRadioButton } from "element-plus";
import type { FormFieldNamesProps, FormSchemaProps } from "../interface";

export const useRenderRadio = () => {
  const renderRadioOptions = (
    columnEnum: Record<string, any>,
    fieldNames: FormFieldNamesProps,
    column: FormSchemaProps
  ) => {
    const Component = column.type === "el-radio-button" ? ElRadioButton : ElRadio;
    columnEnum.value.map(col => {
      return (
        <Component
          disabled={col[unref(fieldNames).disabled || "disabled"]}
          label={col[unref(fieldNames).label]}
          value={col[unref(fieldNames).value]}
          key={col[unref(fieldNames).value]}
        ></Component>
      );
    });
  };

  return {
    renderRadioOptions,
  };
};
