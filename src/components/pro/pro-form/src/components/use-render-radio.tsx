import { ElRadio, ElRadioButton } from "element-plus";
import { ComponentNameEnum, type FormFieldNamesProps, type FormColumnProps } from "../interface";
import { hyphenToCamelCase } from "../helper";

export const useRenderRadio = () => {
  const renderRadioOptions = (
    columnEnum: Record<string, any>[],
    fieldNames: FormFieldNamesProps,
    column: FormColumnProps
  ) => {
    const Component = hyphenToCamelCase(column.el) === ComponentNameEnum.EL_RADIO_BUTTON ? ElRadioButton : ElRadio;

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
