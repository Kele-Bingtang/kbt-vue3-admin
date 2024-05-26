import { ElCheckbox, ElCheckboxButton } from "element-plus";
import type { FormFieldNamesProps, FormSchemaProps } from "../interface";

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (
    columnEnum: Record<string, any>,
    fieldNames: FormFieldNamesProps,
    column: FormSchemaProps
  ) => {
    const Component = column.type === "el-checkbox-button" ? ElCheckboxButton : ElCheckbox;
    return columnEnum.value.map(col => {
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
    renderCheckboxOptions,
  };
};
