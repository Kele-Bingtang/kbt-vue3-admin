import type { Ref, ShallowRef } from "vue";
import type { FormInstance } from "element-plus";
import type { FormColumn, FormSetProps, ProFormInstance } from "../types";
import type { ProFormOnEmits, ProFormProps } from "../index.vue";
import { ElConfigProvider } from "element-plus";
import { createVNode, getCurrentInstance, isRef, isShallow, nextTick, ref, render, unref } from "vue";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/stores";
import { isObject } from "@/utils";
import ProForm from "../index.vue";

type ProFormPropsWithModel = ProFormProps & { modelValue?: Recordable };

export const useProForm = () => {
  // ProFrom 实例
  const formRef = ref<ProFormInstance | null>();

  // ElForm 实例
  const elFormRef = ref<FormInstance | null>();

  const ns = useNamespace();

  const layoutSize = computed(() => useLayoutStore().layoutSize);

  const currentInstance = getCurrentInstance();

  /**
   * @param ref ProForm 实例
   * @param elRef ElForm 实例
   */
  const register = (ref: ProFormInstance | null, elRef: FormInstance | null) => {
    formRef.value = ref;
    elFormRef.value = elRef;
  };

  const getForm = async () => {
    await nextTick();
    const form = formRef.value;
    if (!form) console.error("The form is not registered. Please use the register method to register");

    return form;
  };

  // 一些内置的方法
  const methods = {
    /**
     * 设置 ProForm 组件的 props
     * @param props ProForm 组件的 props
     */
    setProps: async (props: ProFormPropsWithModel = {}) => {
      const form = await getForm();
      form?.setProps(props);

      if (props.modelValue) form?.setValues(props.modelValue);
    },

    /**
     * 设置 form 的值
     * @param data 需要设置的数据
     */
    setValues: async (data: Record<string, any>) => {
      const form = await getForm();
      form?.setValues(data);
    },

    /**
     * 设置 column
     * @param columnProps 需要设置的 columnProps
     */
    setColumn: async (columnProps: FormSetProps[]) => {
      const form = await getForm();
      form?.setColumn(columnProps);
    },

    /**
     * 新增 column
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (formColumn: FormColumn, prop?: number | string, position: "before" | "after" = "after") => {
      const form = await getForm();
      form?.addColumn(formColumn, prop, position);
    },

    /**
     * 删除 column
     * @param field 删除哪个数据
     */
    delColumn: async (prop: string) => {
      const form = await getForm();
      form?.delColumn(prop);
    },

    /**
     * 获取表单数据
     * @returns form data
     */
    getFormData: async <T = Record<string, any>>(filterEmptyVal = true): Promise<T> => {
      const form = await getForm();
      const model = form?.model || {};

      if (filterEmptyVal) {
        // 使用 reduce 过滤空值，并返回一个新对象
        return Object.keys(model).reduce((prev: Recordable, next) => {
          const value = model[next];
          if (value !== "" && value !== null && value !== undefined) {
            if (isObject(value)) {
              if (Object.keys(value).length > 0) prev[next] = value;
            } else prev[next] = value;
          }
          return prev;
        }, {}) as T;
      } else return model as T;
    },

    /**
     * 获取表单组件的实例
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getComponentExpose: async (prop: string) => {
      const form = await getForm();
      return form?.getComponentExpose(prop);
    },

    /**
     * 获取 ElFormItem 组件的实例
     * @param prop 表单项唯一标识
     * @returns formItem instance
     */
    getFormItemExpose: async (prop: string) => {
      const form = await getForm();
      return form?.getFormItemExpose(prop);
    },

    /**
     * 获取 ElForm 组件的实例
     * @returns ElForm instance
     */
    getElFormExpose: async () => {
      await getForm();
      return elFormRef.value;
    },

    /**
     * 获取 ProForm 组件的实例
     * @returns ProForm instance
     */
    getFormExpose: async () => {
      await getForm();
      return formRef.value;
    },
  };

  const createMethods = {
    /**
     * 返回 ProForm 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createFormComponent: (
      proFormProps?: ProFormPropsWithModel & Partial<ProFormOnEmits>,
      context: Record<string, any> = {}
    ) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProForm, { ...attrs, ...proFormProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建表单。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createForm: async (
      el: string | Ref<HTMLElement> | ShallowRef<HTMLElement>,
      proFormProps?: ProFormPropsWithModel & Partial<ProFormOnEmits>,
      slots?: any
    ) => {
      const proFormInstance = createVNode(ProForm, { ...proFormProps, onRegister: register }, { ...slots });
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: ns.elNamespace, size: layoutSize.value },
        { default: () => proFormInstance }
      );
      await nextTick();

      if (isRef(el) || isShallow(el)) return render(rootInstance, unref(el as Ref<HTMLElement>));

      const rootEl = currentInstance?.refs[el as string] as HTMLElement;
      rootEl && render(rootInstance, rootEl);
    },
  };

  return {
    formElState: {
      formRef: formRef.value,
      elFormRef: elFormRef.value,
    },
    formMethods: methods,
    formRegister: register,
    createMethods,
  };
};
