import { ElRadio, ElRadioButton } from "element-plus";
import type { FormFieldNamesProps, FormSchemaProps } from "../interface";

export const useRenderRadio = () => {
  const renderRadioOptions = (
    columnEnum: Record<string, any>,
    fieldNames: FormFieldNamesProps,
    column: FormSchemaProps
  ) => {
    const Component = column.el === "el-radio-button" ? ElRadioButton : ElRadio;

    return columnEnum.map(col => {
      return (
        <Component
          disabled={col[fieldNames.disabled || "disabled"]}
          label={col[fieldNames.label]}
          value={col[fieldNames.value]}
          key={col[fieldNames.value]}
        ></Component>
      );
    });
  };

  return {
    renderRadioOptions,
  };
};
