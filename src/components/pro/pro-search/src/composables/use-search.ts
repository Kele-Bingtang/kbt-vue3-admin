import type { Ref, ShallowRef } from "vue";
import type { FormColumn, FormSetProps } from "@/components/pro/form";
import type { ProSearchOnEmits, ProSearchProps } from "../types";
import type { ProSearchExpose } from "../index.vue";
import { createVNode, getCurrentInstance, isRef, isShallow, nextTick, ref, render, unref } from "vue";
import { ElConfigProvider } from "element-plus";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/stores";
import ProSearch from "../index.vue";

type ProSearchPropsWithModel = ProSearchProps & { modelValue?: Recordable };

export const useProSearch = () => {
  // ProSearch 实例
  const searchInstance = ref<ProSearchExpose | null>(null);

  const ns = useNamespace();

  const layoutSize = computed(() => useLayoutStore().layoutSize);

  const currentInstance = getCurrentInstance();

  /**
   * @param ref Search实例
   * @param elRef ElForm实例
   */
  const register = (ref: ProSearchExpose | null) => {
    searchInstance.value = ref;
  };

  const getProSearch = async () => {
    await nextTick();
    const search = searchInstance.value;
    if (!search) {
      console.error("The Search is not registered. Please use the register method to register");
    }
    return search;
  };

  const methods = {
    /**
     * 切换展开收起
     */
    toggleCollapsed: async (isCollapsed?: boolean) => {
      const search = await getProSearch();
      search?.toggleCollapse(isCollapsed);
    },

    /**
     * 设置 search 组件的 props
     *
     * @param prop FormItem 的 prop
     */
    setProps: async (props: ProSearchPropsWithModel = {}) => {
      const search = await getProSearch();
      search?.setProps(props);
      if (props.modelValue) search?.setValues(props.modelValue);
    },

    /**
     * 设置 model 的值
     *
     * @param model 需要设置的数据
     */
    setValues: async (model: Recordable) => {
      const search = await getProSearch();
      search?.setValues(model);
    },

    /**
     * 设置 column
     *
     * @param columnProps 需要设置的 columnProps
     */
    setColumn: async (columnProps: FormSetProps[]) => {
      const search = await getProSearch();
      search?.setColumn(columnProps);
    },

    /**
     * 新增 column
     *
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (formColumn: FormColumn, prop?: number | string, position: "before" | "after" = "after") => {
      const search = await getProSearch();
      search?.addColumn(formColumn, prop, position);
    },

    /**
     * 删除 column
     *
     * @param prop 删除哪个数据
     */
    delColumn: async (prop: string) => {
      const search = await getProSearch();
      search?.delColumn(prop);
    },

    /**
     * 获取表单数据
     *
     * @returns form model
     */
    getFormModel: async <T = Recordable>(): Promise<T> => {
      const search = await getProSearch();
      return search?.getFormModel() as T;
    },
    /**
     * 获取 ProSearch 组件的实例
     *
     * @returns ProSearch instance
     */
    getProSearchInstance: async () => {
      await getProSearch();
      return searchInstance.value;
    },
    /**
     * 获取 ElForm 组件的实例
     *
     * @returns ElForm instance
     */
    getElFormInstance: async () => {
      const search = await getProSearch();
      return search?.getElFormInstance;
    },
    /**
     * 获取 ProForm 组件的实例
     *
     * @returns ProForm instance
     */
    getProFormInstance: async () => {
      const search = await getProSearch();
      return search?.getProFormInstance();
    },
    /**
     * 获取 ElFormItem 组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns formItem instance
     */
    getElFormItemInstance: async (prop: string) => {
      const search = await getProSearch();
      return search?.getElFormItemInstance(prop);
    },
    /**
     * 获取表单组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getElInstance: async (prop: string) => {
      const search = await getProSearch();
      return search?.getElInstance(prop);
    },
  };

  const createMethods = {
    /**
     * 返回 ProSearch 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createSearchComponent: (
      proSearchProps?: ProSearchPropsWithModel & Partial<ProSearchOnEmits>,
      context: Recordable = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProSearch, { ...attrs, ...proSearchProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建 Search。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createSearch: async (
      el: string | Ref<HTMLElement> | ShallowRef<HTMLElement>,
      proSearchProps?: ProSearchPropsWithModel & Partial<ProSearchOnEmits>,
      slots?: any
    ) => {
      const proSearchInstance = createVNode(ProSearch, { ...proSearchProps, onRegister: register }, { ...slots });
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace, size: layoutSize.value },
        { default: () => proSearchInstance }
      );

      await nextTick();

      if (isRef(el) || isShallow(el)) return render(rootInstance, unref(el as Ref<HTMLElement>));

      const rootEl = currentInstance?.refs[el as string] as HTMLElement;
      rootEl && render(rootInstance, rootEl);
    },
  };

  return {
    searchElState: {
      searchInstance: searchInstance.value,
    },
    searchMethods: methods,
    searchRegister: register,
    createMethods,
  };
};
