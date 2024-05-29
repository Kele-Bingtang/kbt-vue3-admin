import { ElCheckbox, ElCheckboxButton } from "element-plus";
import type { FormFieldNamesProps, FormSchemaProps } from "../interface";

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (
    columnEnum: Record<string, any>,
    fieldNames: FormFieldNamesProps,
    column: FormSchemaProps
  ) => {
    const Component = column.el === "el-checkbox-button" ? ElCheckboxButton : ElCheckbox;
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
    renderCheckboxOptions,
  };
};
