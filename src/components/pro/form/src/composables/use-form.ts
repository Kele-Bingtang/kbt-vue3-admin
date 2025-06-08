import type { FormInstance } from "element-plus";
import type { FormColumn, ProFormInstance, ProFormOnEmits, ProFormProps } from "../types";
import type { FormSetProps } from "./use-form-api";
import { ElConfigProvider } from "element-plus";
import { createVNode, getCurrentInstance, nextTick, ref, render } from "vue";
import { useNamespace } from "@/composables";
import { useLayoutStore } from "@/stores";
import { isEmpty, isObject, isString } from "@/utils";
import ProForm from "../index.vue";

type ProFormPropsWithModel = ProFormProps & { modelValue?: Recordable };

export const useProForm = () => {
  // ProFrom 实例
  const proFormInstance = ref<ProFormInstance | null>();

  // ElForm 实例
  const elFormInstance = ref<FormInstance | null>();

  const ns = useNamespace();

  const layoutSize = computed(() => useLayoutStore().layoutSize);

  const currentInstance = getCurrentInstance();

  /**
   * @param proForm ProForm 实例
   * @param elForm ElForm 实例
   */
  const register = (proForm: ProFormInstance | null, elForm: FormInstance | null) => {
    proFormInstance.value = proForm;
    elFormInstance.value = elForm;
  };

  const getPropForm = async () => {
    await nextTick();
    const form = proFormInstance.value;
    if (!form) console.error("The form is not registered. Please use the register method to register");

    return form;
  };

  // 一些内置的方法
  const methods = {
    /**
     * 设置 ProForm 组件的 props
     *
     * @param props ProForm 组件的 props
     */
    setProps: async (props: ProFormPropsWithModel = {}) => {
      const form = await getPropForm();
      form?.setProps(props);

      if (props.modelValue) form?.setValues(props.modelValue);
    },

    /**
     * 设置 model 的值
     *
     * @param model 需要设置的数据
     */
    setValues: async (model: Recordable) => {
      const form = await getPropForm();
      form?.setValues(model);
    },

    /**
     * 设置 column
     *
     * @param columnProps 需要设置的 columnProps
     */
    setColumn: async (columnProps: FormSetProps[]) => {
      const form = await getPropForm();
      form?.setColumn(columnProps);
    },

    /**
     * 新增 column
     *
     * @param prop 在哪里新增，number 为下标，字符串为指定的 prop
     * @param position 如果 prop 为字符串，则指定新增到 prop 前还是后
     */
    addColumn: async (
      column: FormColumn,
      propOrIndex?: FormColumn["prop"] | number,
      position: "before" | "after" = "after"
    ) => {
      const form = await getPropForm();
      form?.addColumn(column, propOrIndex, position);
    },

    /**
     * 删除 column
     *
     * @param field 删除哪个数据
     */
    delColumn: async (prop: FormColumn["prop"]) => {
      const form = await getPropForm();
      form?.delColumn(prop);
    },

    /**
     * 获取表单数据
     *
     * @returns form model
     */
    getFormModel: async <T = Recordable>(filterEmptyVal = true): Promise<T> => {
      const form = await getPropForm();
      const model = form?.model || {};

      if (filterEmptyVal) {
        // 使用 reduce 过滤空值，并返回一个新对象
        return Object.keys(model).reduce((prev: Recordable, next) => {
          const value = model[next];
          if (isEmpty(value)) {
            if (isObject(value)) prev[next] = value;
            else prev[next] = value;
          }
          return prev;
        }, {}) as T;
      } else return model as T;
    },
    /**
     * 提交表单
     *
     * @returns submit 结果：true | false
     */
    submitForm: async () => {
      const form = await getPropForm();
      return form?.submitForm();
    },
    /**
     * 重置表单
     */
    resetForm: async () => {
      const form = await getPropForm();
      return form?.resetForm();
    },
    /**
     * 获取 ElForm 组件的实例
     *
     * @returns ElForm instance
     */
    getElFormInstance: async () => {
      await getPropForm();
      return elFormInstance.value;
    },
    /**
     * 获取 ProForm 组件的实例
     *
     * @returns ProForm instance
     */
    getProFormInstance: async () => {
      await getPropForm();
      return proFormInstance.value;
    },
    /**
     * 获取 ElFormItem 组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns formItem instance
     */
    getElFormItemInstance: async (prop: string) => {
      const form = await getPropForm();
      return form?.getElFormItemInstance(prop);
    },
    /**
     * 获取表单组件的实例
     *
     * @param prop 表单项唯一标识
     * @returns ElForm instance
     */
    getElInstance: async (prop: string) => {
      const form = await getPropForm();
      return form?.getElInstance(prop);
    },
  };

  const createMethods = {
    /**
     * 返回 ProForm 组件的虚拟 DOM，直接在页面中渲染该虚拟 DOM 即可。可以理解为返回一个 Vue 组件
     */
    createFormComponent: (proFormProps?: ProFormPropsWithModel & Partial<ProFormOnEmits>, context: Recordable = {}) => {
      const { attrs, slots } = context;
      const instance = createVNode(ProForm, { ...attrs, ...proFormProps, onRegister: register }, { ...slots });
      return instance;
    },

    /**
     * 动态创建表单。使用该函数，控制台会有 warning： Slot "XXX" invoked outside of the render function，可以忽略
     */
    createForm: async (
      el: MaybeRef<HTMLElement> | string,
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

      if (isString(el)) {
        const rootEl = currentInstance?.refs[el as string] as HTMLElement;
        rootEl && render(rootInstance, rootEl);
      } else return render(rootInstance, toValue(el));
    },
  };

  return {
    formElState: {
      proFormInstance: proFormInstance.value,
      elFormInstance: elFormInstance.value,
    },
    formMethods: methods,
    formRegister: register,
    createMethods,
  };
};
