import { ElOption, ElOptionGroup } from "element-plus";
import type { FormFieldNamesProps } from "../interface";

export const useRenderSelect = () => {
  // 渲染 select options
  const renderSelectOptions = (columnEnum: Record<string, any>, fieldNames: FormFieldNamesProps) => {
    return columnEnum.value.map(col => {
      if (col?.options?.length) {
        return (
          <ElOptionGroup label={col[unref(fieldNames).label]} key={col[unref(fieldNames).value]}>
            {{
              default: () => col.options.map(option => renderSelectOptionItem(option, fieldNames)),
            }}
          </ElOptionGroup>
        );
      }

      return renderSelectOptionItem(col, fieldNames);
    });
  };

  const renderSelectOptionItem = (col: Record<string, any>, fieldNames: FormFieldNamesProps) => {
    return (
      <ElOption
        label={col[unref(fieldNames).label]}
        value={col[unref(fieldNames).value]}
        key={col[unref(fieldNames).value]}
      />
    );
  };

  return {
    renderSelectOptions,
  };
};
