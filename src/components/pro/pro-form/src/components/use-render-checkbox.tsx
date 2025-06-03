import { ElCheckbox, ElCheckboxButton } from "element-plus";
import { ComponentNameEnum, type FormFieldNamesProps, type FormColumnProps } from "../interface";
import { hyphenToCamelCase } from "../helper";

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (
    columnEnum: Record<string, any>[],
    fieldNames: FormFieldNamesProps,
    column: FormColumnProps
  ) => {
    const Component =
      hyphenToCamelCase(column.el) === ComponentNameEnum.EL_CHECKBOX_BUTTON ? ElCheckboxButton : ElCheckbox;
    return columnEnum.map((col: any) => {
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
