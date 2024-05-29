import type { TableInstance } from "element-plus";
import type { ProTableInstance, TableColumnProps, TableSetProps } from "../interface";
import type { ProTableProps } from "../index.vue";
import type { Paging, ProSearchInstance } from "@/components";

export const useProTable = () => {
  // ProTable 实例
  const tableRef = ref<ProTableInstance>();

  // ElTable 实例
  const elTableRef = ref<TableInstance>();

  // ElTable 实例
  const searchRef = ref<ProSearchInstance>();

  /**
   * @param ref ProTable 实例
   * @param elRef ElTable 实例
   */
  const register = (ref?: ProTableInstance, elRef?: TableInstance, proSearch?: ProSearchInstance) => {
    tableRef.value = ref;
    elTableRef.value = elRef;
    searchRef.value = proSearch;
  };

  const tableState = {
    tableData: unref(tableRef)?.tableData, // 表格数据
    paging: unref(tableRef)?.paging, // 分页信息
    enumMap: unref(tableRef)?.enumMap, // 字典枚举
  };

  const searchState = {
    searchParam: unref(tableRef)?.searchParam, // 搜索参数
    searchInitParam: unref(tableRef)?.searchInitParam, // 搜索参数初始值
  };

  const selectState = {
    isSelected: unref(tableRef)?.isSelected, // 是否选中至少一行表格数据
    selectedList: unref(tableRef)?.selectedList, // 选中的表格数据
    selectedListIds: unref(tableRef)?.selectedListIds, // 选中的表格数据 ID 列表
  };

  const getTable = async () => {
    await nextTick();
    const table = unref(tableRef);
    if (!table) console.error("The proTable is not registered. Please use the register method to register");
    return table;
  };

  const methods = {
    /**
     * @description 设置 proTable 组件的 props
     * @param props table组件的props
     */
    setProps: async (props: ProTableProps = {}) => {
      const table = await getTable();
      table?.setProps(props);
    },

    /**
     * @description 设置 column
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: TableSetProps[]) => {
      const table = await getTable();
      table?.setColumn(columnProps);
    },

    /**
     * @description 新增 column
     * @param column 需要新增数据
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (column: TableColumnProps, prop?: number | string, position: "before" | "after" = "after") => {
      const table = await getTable();
      table?.addColumn(column, prop, position);
    },

    /**
     * @description 删除 column
     * @param prop 删除哪个数据
     */
    delColumn: async (prop: string) => {
      const table = await getTable();
      table?.delColumn(prop);
    },

    /**
     * @description 获取表格数据（调用接口）
     */
    getTableList: async () => {
      const table = await getTable();
      return table?.getTableList();
    },

    /**
     * @description 更新表格分页信息，从而更新表格数据
     */
    pagination: async (paging: Partial<Paging>) => {
      const table = await getTable();
      return table?.handlePagination(paging);
    },

    /**
     * @description 执行查询（调用接口）
     */
    search: async () => {
      const table = await getTable();
      table?.search();
    },

    /**
     * @description 重置查询条件
     */
    reset: async () => {
      const table = await getTable();
      table?.reset();
    },

    /**
     * @description 打开/隐藏列设置
     */
    toggleColSetting: async () => {
      const table = await getTable();
      table?.toggleColSetting();
    },

    /**
     * @description 清除所有选择项
     */
    clearSelection: async () => {
      const table = await getTable();
      return table?.clearSelection();
    },

    /**
     * @description 获取 ElTable 组件的实例
     * @returns ElTable instance
     */
    getElTableExpose: async () => {
      await getTable();
      return unref(elTableRef);
    },

    /**
     * @description 获取 ProTable 组件的实例
     * @returns ProTable instance
     */
    getTableExpose: async () => {
      await getTable();
      return unref(tableRef);
    },

    /**
     * @description 获取 ProSearch 组件的实例
     * @returns ProSearch instance
     */
    getSearchRef: async () => {
      await getTable();
      return unref(searchRef);
    },
  };

  return {
    tableRegister: register,
    tableRefState: {
      tableRef: unref(tableRef),
      elTableRef: unref(elTableRef),
      searchRef: unref(searchRef),
    },
    tableState,
    searchState,
    selectState,
    tableMethods: methods,
  };
};
