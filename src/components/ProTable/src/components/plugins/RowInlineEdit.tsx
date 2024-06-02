import { ProForm } from "@/components";
import { type TableColumnProps, editKey, type TableRenderScope } from "../../interface";
import { getColumnProp, lastProp, setColumnProp } from "../../helper";
import { ElMessage } from "element-plus";

export const useRowInlineEdit = (column: TableColumnProps) => {
  const { editConfig = {} } = column;

  // ProTable 通过 provide 传过来
  const { editModelList, rowKey, editRow } = inject(editKey, {
    editModelList: ref(new Map<string | number, Record<string, any>>()),
    rowKey: "id",
    editRow: undefined,
  });

  // 是否开启行内编辑
  const useEdit = computed(() => editConfig?.enabled !== false && (editConfig?.el || column.search?.el));

  /**
   * 渲染行内编辑表单
   */
  const renderRowInlineEdit = ({ row }: TableRenderScope<any>) => {
    const { editConfig = {} } = column;

    const editModelListConst = unref(editModelList);

    // 存在多级 prop 时，要么自定义 key，要么取 prop 的最有一级（表单不使用多级 prop 当 key）
    const prop = editConfig?.key || column.search?.key || lastProp(column.prop!);

    const schema = {
      ...editConfig,
      el: editConfig?.el || column.search?.el,
      formItem: { style: { margin: 0 }, ...editConfig.formItem },
      label: editConfig.formItem?.required ? " " : "",
      prop: prop,
      enum: column.enum as any,
      useEnumMap: column.useEnumMap,
      enumKey: column.enumKey,
      fieldNames: column.fieldNames,
    };

    const model = computed(() => {
      // 可编辑的最大行数判断
      if (editRow && unref(editModelList).size > editRow) {
        row._edit = false;
        const key = Array.from(editModelList.value.keys()).pop();
        key && editModelListConst.delete(key);

        nextTick(() => {
          ElMessage.warning({
            message: `编辑不能超过 ${editRow} 行，请先完成正在编辑的行`,
            plain: true,
          });
        });
        return {};
      }

      const key = row[rowKey!];
      // 从 Map 获取 model，如果不存在在初始化，存入 Map，方便下次可以直接获取
      let editModel = editModelListConst?.get(key);
      if (!editModel) {
        // 初始化编辑已存在的的值 & 自定义携带参数
        editModel = { ...row, ...editConfig.carryParams };
        editModelListConst?.set(key, editModel!);

        // 删除关键词 & 自定义过滤 Keys
        delete editModel!._edit;
        if (editConfig.filterKey?.length) editConfig.filterKey.forEach(key => delete editModel![key]);
      }

      // 如果存在多级 prop，则删除，然后用 key 替换 prop
      if (column.prop?.indexOf(".") !== -1 || editConfig?.key || column.search?.key) {
        if (column.prop?.indexOf(".") !== -1) delete editModel![column.prop!.split(".")[0]];
        else delete editModel![column.prop!];
        setColumnProp(editModel!, prop, getColumnProp(row, column.prop!));
        editModelListConst?.set(key, editModel!);
      }

      return editModel;
    });

    return (
      <ProForm
        v-model={model.value}
        elFormProps={{ style: "margin: 0" }}
        dynamicModel={false}
        useCol={false}
        schema={[schema]}
      ></ProForm>
    );
  };

  return {
    renderRowInlineEdit,
    useEdit,
    editModelList: unref(editModelList),
    editRow,
  };
};
