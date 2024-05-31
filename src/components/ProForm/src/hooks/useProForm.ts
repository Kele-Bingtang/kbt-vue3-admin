import { ElConfigProvider, type FormInstance } from "element-plus";
import type { FormSchemaProps, FormSetProps, ProFormInstance } from "../interface";
import type { ProFormOnEmits, ProFormProps } from "../index.vue";
import { isObject } from "../helper";
import { createVNode, render } from "vue";
import ProForm from "../index.vue";
import { useDesign } from "@/hooks";
import { useLayoutStore } from "@/stores";

export const useProForm = () => {
  // ProFrom 实例
  const formRef = ref<ProFormInstance>();

  // ElForm 实例
  const elFormRef = ref<FormInstance>();

  const { variables } = useDesign();

  const layoutSize = computed(() => useLayoutStore().layoutSize);

  /**
   * @param ref ProForm 实例
   * @param elRef ElForm 实例
   */
  const register = (ref?: ProFormInstance, elRef?: FormInstance) => {
    formRef.value = ref;
    elFormRef.value = elRef;
  };

  const getForm = async () => {
    await nextTick();
    const form = unref(formRef);
    if (!form) {
      console.error("The form is not registered. Please use the register method to register");
    }
    return form;
  };

  // 一些内置的方法
  const methods = {
    /**
     * @description 设置 ProForm 组件的 props
     * @param props ProForm 组件的 props
     */
    setProps: async (props: ProFormProps = {}) => {
      const form = await getForm();
      form?.setProps(props);
      if (props.modelValue) form?.setValues(props.modelValue);
    },

    /**
     * @description 设置 form 的值
     * @param data 需要设置的数据
     */
    setValues: async (data: Record<string, any>) => {
      const form = await getForm();
      form?.setValues(data);
    },

    /**
     * @description 设置 schema
     * @param schemaProps 需要设置的 schemaProps
     */
    setSchema: async (schemaProps: FormSetProps[]) => {
      const form = await getForm();
      form?.setSchema(schemaProps);
    },

    /**
     * @description 新增 schema
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addSchema: async (formSchema: FormSchemaProps, prop?: number | string, position: "before" | "after" = "after") => {
      const form = await getForm();
      form?.addSchema(formSchema, prop, position);
    },

    /**
     * @description 删除 schema
     * @param field 删除哪个数据
     */
    delSchema: async (prop: string) => {
      const form = await getForm();
      form?.delSchema(prop);
    },

    /**
     * @description 获取表单数据
     * @returns form data
     */
    getFormData: async <T = Record<string, any>>(filterEmptyVal = true): Promise<T> => {
      const form = await getForm();
      const model = form?.model as any;

      if (filterEmptyVal) {
        // 使用 reduce 过滤空值，并返回一个新对象
        return Object.keys(model).reduce((prev, next) => {
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
     * @description 获取表单组件的实例
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getComponentExpose: async (prop: string) => {
      const form = await getForm();
      return form?.getComponentExpose(prop);
    },

    /**
     * @description 获取 ElFormItem 组件的实例
     * @param prop 表单项唯一标识
     * @returns formItem instance
     */
    getFormItemExpose: async (prop: string) => {
      const form = await getForm();
      return form?.getFormItemExpose(prop);
    },

    /**
     * @description 获取 ElForm 组件的实例
     * @returns ElForm instance
     */
    getElFormExpose: async () => {
      await getForm();
      return unref(elFormRef);
    },

    /**
     * @description 获取 ProForm 组件的实例
     * @returns ProForm instance
     */
    getFormExpose: async () => {
      await getForm();
      return unref(formRef);
    },
  };

  const createMethods = {
    /**
     * 返回 ProForm 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createFormComponent: (proFormProps?: ProFormProps & Partial<ProFormOnEmits>, context: Record<string, any> = {}) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProForm, { ...attrs, ...proFormProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建表单。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createForm: async (el: string, proFormProps?: ProFormProps & Partial<ProFormOnEmits>, slots?: any) => {
      const proFormInstance = createVNode(ProForm, { ...proFormProps, onRegister: register }, { ...slots });
      const rootInstance = createVNode(
        ElConfigProvider,
        { namespace: variables.elNamespace, size: unref(layoutSize) },
        { default: () => proFormInstance }
      );
      const currentInstance = getCurrentInstance();
      const rootEl = currentInstance?.refs[el] as HTMLElement;
      rootEl && render(rootInstance, rootEl);
    },
  };

  return {
    formElState: {
      formRef: unref(formRef),
      elFormRef: unref(elFormRef),
    },
    formMethods: methods,
    formRegister: register,
    createMethods,
  };
};
