import type { FormSchemaProps, FormSetProps } from "@/components";
import type { ProSearchExpose, ProSearchProps } from "../index.vue";

export const useProSearch = () => {
  // ProSearch 实例
  const searchRef = ref<ProSearchExpose>();

  /**
   * @param ref Search实例
   * @param elRef ElForm实例
   */
  const register = (ref: ProSearchExpose) => {
    searchRef.value = ref;
  };

  const getSearch = async () => {
    await nextTick();
    const search = unref(searchRef);
    if (!search) {
      console.error("The Search is not registered. Please use the register method to register");
    }
    return search;
  };

  const methods = {
    /**
     * @description 切换展开收起
     */
    toggleCollapsed: async (isCollapsed?: boolean) => {
      const search = await getSearch();
      search?.toggleCollapsed(isCollapsed);
    },

    /**
     * @description 设置 search 组件的 props
     * @param prop FormItem 的 prop
     */
    setProps: async (props: ProSearchProps = {}) => {
      const search = await getSearch();
      search?.setProps(props);
      if (props.modeValue) search?.setValues(props.modeValue);
    },

    /**
     * @description 设置 form 的值
     * @param data 需要设置的数据
     */
    setValues: async (data: Record<string, any>) => {
      const search = await getSearch();
      search?.setValues(data);
    },

    /**
     * @description 设置 schema
     * @param schemaProps 需要设置的 schemaProps
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const search = await getSearch();
      search?.setSchema(schemaProps);
    },

    /**
     * @description 新增 schema
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addSchema: async (formSchema: FormSchemaProps, prop?: number | string, position: "before" | "after" = "after") => {
      const search = await getSearch();
      search?.addSchema(formSchema, prop, position);
    },

    /**
     * @description 删除 schema
     * @param prop 删除哪个数据
     */
    delSchema: async (prop: string) => {
      const search = await getSearch();
      search?.delSchema(prop);
    },

    /**
     * @description 获取表单数据
     * @returns form data
     */
    getFormData: async <T = Record<string, any>>(): Promise<T> => {
      const search = await getSearch();
      return search?.getFormData() as T;
    },
  };

  return {
    searchElState: {
      searchRef: unref(searchRef),
    },
    searchMethods: methods,
    searchRegister: register,
  };
};
