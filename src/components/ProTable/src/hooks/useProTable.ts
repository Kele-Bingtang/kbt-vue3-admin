import { ElConfigProvider, type TableInstance } from "element-plus";
import type { ProTableInstance, TableColumnProps, TableSetProps } from "../interface";
import ProTable, { type ProTableOnEmits, type ProTableProps } from "../index.vue";
import type { ProSearchInstance } from "@/components/ProSearch";
import type { Paging } from "@/components/Pagination";
import { createVNode, isShallow, render, type ShallowRef } from "vue";
import { useDesign } from "@/hooks";
import { useLayoutStore } from "@/stores";

export const useProTable = () => {
  // ProTable 实例
  const tableRef = ref<ProTableInstance>();

  // ElTable 实例
  const elTableRef = ref<TableInstance>();

  // ElTable 实例
  const searchRef = ref<ProSearchInstance>();

  const { variables } = useDesign();

  const layoutSize = computed(() => useLayoutStore().layoutSize);

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
    editModelList: unref(tableRef)?.editModelList, // 行内编辑 Map
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
     * @description 获取 ProSearch 组件的实例
     * @returns ProSearch instance
     */
    getSearchRef: async () => {
      await getTable();
      return unref(searchRef);
    },

    /**
     * @description 获取行内编辑指定的 model
     * @param key key
     * @returns model
     */
    getEditModel: async (key: string | number) => {
      const table = await getTable();
      return table?.getEditModel(key);
    },

    /**
     * @description 获取行内编辑所有的 model
     * @returns 所有 model
     */
    getEditModelValues: async () => {
      const table = await getTable();
      return table?.getEditModelValues();
    },

    /**
     * @description 获取行内编辑所有 model 对应的 key
     * @returns 所有 key
     */
    getEditModelKeys: async () => {
      const table = await getTable();
      return table?.getEditModelKeys();
    },

    /**
     * @description 设置行内编辑的 model
     * @param key key
     * @param model model
     */
    setEditModel: async (key: string | number, model: Record<string, any>) => {
      const table = await getTable();
      table?.setEditModel(key, model);
    },

    /**
     * @description 清除行内编辑的 model
     */
    clearEditModel: async () => {
      const table = await getTable();
      table?.clearEditModel();
    },

    /**
     * @description 删除行内编辑指定 key 的 model
     * @param key key
     */
    removeEditModel: async (key: string | number | string[] | number[]) => {
      const table = await getTable();
      table?.removeEditModel(key);
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
  };

  const createMethods = {
    /**
     * 返回 ProTable 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createTableComponent: (
      proTableProps?: ProTableProps & Partial<ProTableOnEmits>,
      context: Record<string, any> = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProTable, { ...attrs, ...proTableProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建表格。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createTable: async (
      el: string | Ref<HTMLElement> | ShallowRef<HTMLElement>,
      proTableProps?: ProTableProps & Partial<ProTableOnEmits>,
      slots?: any
    ) => {
      const proTableInstance = createVNode(ProTable, { ...proTableProps, onRegister: register }, { ...slots });
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: variables.elNamespace, size: unref(layoutSize) },
        { default: () => proTableInstance }
      );
      if (isRef(el) || isShallow(el)) return render(rootInstance, unref(el as Ref<HTMLElement>));

      const currentInstance = getCurrentInstance();
      const rootEl = currentInstance?.refs[el as string] as HTMLElement;
      rootEl && render(rootInstance, rootEl);
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
    createMethods,
  };
};
