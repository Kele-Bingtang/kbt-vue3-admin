import ProForm from "@/components/ProForm";
import { ElConfigProvider, ElPopover, ElIcon, ElButton } from "element-plus";
import { filterKey, type TableColumnProps } from "../../interface";
import { Filter } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";

const { variables } = useDesign();

/**
 * 渲染表头自定义过滤器
 */
export const headerFilter = (column: TableColumnProps) => {
  const filterProps = inject(filterKey);

  const { searchParam = {}, search, reset } = filterProps || {};

  const commonSchema = {
    label: "",
    prop: column.prop || "",
    enum: column.enum as any,
    useEnumMap: column.useEnumMap,
    enumKey: column.enumKey,
    fieldNames: column.fieldNames,
    props: {
      teleported: false, // 解决 ElSelect 的 Option 选中后，自动关闭 Popover 问题
    },
  };

  const schema = column.search
    ? { ...column.search, ...commonSchema, props: { ...column.search.props, ...commonSchema.props } }
    : { el: "ElInput", ...commonSchema };

  const handleSearch = () => {
    search && search(searchParam);
  };

  const handleClear = async () => {
    // 如果配置了 renderUseProp，代表自定义 render，则清空对应的 prop
    if (column.renderUseProp?.length) column.renderUseProp.forEach(prop => delete searchParam[prop]);
    else delete searchParam[column.prop!];
    // 清除后重新搜索
    handleSearch();
  };

  const handleReset = async () => {
    reset && reset();
  };

  const { filterConfig = {} } = column;
  const { width, trigger } = filterConfig;

  return (
    <ElConfigProvider namespace={variables.elNamespace}>
      <ElPopover {...filterConfig} width={width || 230} trigger={trigger || "click"}>
        {{
          reference: () => (
            <ElIcon style="vertical-align: -2px; margin-left: 2px; cursor: pointer;" class="hover-theme-color">
              <Filter />
            </ElIcon>
          ),
          default: () => (
            <>
              <ProForm v-model={searchParam} dynamicModel={false} onlyRenderComponent schema={[schema]}></ProForm>
              <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <ElButton onClick={handleReset}>重置</ElButton>
                <div>
                  <ElButton onClick={handleClear}>清除</ElButton>
                  <ElButton onClick={handleSearch}>筛选</ElButton>
                </div>
              </div>
            </>
          ),
        }}
      </ElPopover>
    </ElConfigProvider>
  );
};
