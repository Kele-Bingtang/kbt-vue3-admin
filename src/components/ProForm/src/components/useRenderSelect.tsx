import { ElOption, ElOptionGroup } from "element-plus";
import type { FormFieldNamesProps } from "../interface";
import { unref } from "vue";

export const useRenderSelect = () => {
  // 渲染 select options
  const renderSelectOptions = (columnEnum: Record<string, any>[], fieldNames: FormFieldNamesProps) => {
    return unref(columnEnum).map(col => {
      if (col?.options?.length) {
        return (
          <ElOptionGroup label={col[fieldNames.label]} key={col[fieldNames.value]}>
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
        label={col[fieldNames.label]}
        value={col[fieldNames.value]}
        disabled={col[fieldNames.disabled!]}
        key={col[fieldNames.value]}
      />
    );
  };

  return {
    renderSelectOptions,
  };
};
