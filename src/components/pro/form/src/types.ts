import type { ColProps, FormInstance, FormItemProp, FormProps, FormValidateCallback, RowProps } from "element-plus";
import type { ComputedRef, ComponentPublicInstance, InjectionKey, Ref } from "vue";
import type { FormItemColumnProps, BaseValueType } from "@/components/pro/form-item";
import type ProForm from "./index.vue";

export type ElFormProps = Partial<FormProps>;
export type ElRowProps = Partial<RowProps>;
export type ElColProps = Partial<ColProps>;

export interface ProFormProps {
  /**
   * 表单配置项
   */
  columns?: RequiredKey<FormColumn, "prop">[];
  /**
   * ElForm props
   */
  elFormProps?: ElFormProps;
  /**
   * 是否使用栅格布局
   *
   * @default true
   */
  useFlexLayout?: boolean;
  /**
   * ElRow Props
   */
  rowProps?: ElRowProps;
  /**
   * ElCol Props
   */
  colProps?: ElColProps;
  /**
   * 动态 model，如果 column 发生变化，则重新渲染 model 表单数据（将不存在 column 的 prop 从 model 中去掉）
   *
   * @default true
   */
  dynamicModel?: boolean;
  /**
   * 搭配 dynamicModel 使用，清除 model 不存在的 prop 时，指定保留 prop
   */
  includeModelKeys?: string[];
  /**
   * 表单提交时，如果校验失败，是否使用 ElMessage 提示错误信息
   *
   * @default true
   */
  showErrorTip?: boolean;
  /**
   * 是否显示 Footer（两个按钮）
   *
   * @default true
   */
  showFooter?: boolean;
  /**
   * 是否显示重置按钮
   *
   * @default true
   */
  showReset?: boolean;
  /**
   * 提交按钮文字
   *
   * @default '提交'
   */
  submitText?: string;
  /**
   * 重置按钮文字
   *
   * @default '重置'
   */
  resetText?: string;
  /**
   * 提交按钮 loading
   *
   * @default false
   */
  submitLoading?: boolean;
  /**
   * 底部对齐方式
   *
   * @default 'right'
   */
  footerAlign?: "left" | "center" | "right";
  /**
   * 是否阻止表单提交时默认的表单提交行为（即自动校验表单）
   *
   * @default false
   */
  preventNativeSubmit?: boolean;
  /**
   * 是否显示 label，优先级低于 FormItemColumnProps["showLabel"]
   *
   * @default true
   */
  showLabel?: FormItemColumnProps["showLabel"];
  /**
   * 是否显示清除按钮，优先级低于 FormItemColumnProps["clearable"]
   *
   * @default true
   */
  clearable?: FormItemColumnProps["clearable"];
  /**
   * 表单组件宽度，优先级低于 FormItemColumnProps["width"]
   *
   * @default '100%'
   */
  width?: FormItemColumnProps["width"];
}

export type ProFormEmits = {
  register: [proFormRef: any, elFormRef: FormInstance | null]; // 注册 ProForm 组件实例和 elForm 实例
  validate: [prop: FormItemProp, isValid: boolean, message: string]; // ElForm 自带的事件
  submit: [model: Recordable]; // 提交按钮事件
  submitError: [invalidFields: Parameters<FormValidateCallback>[1]]; // 表单提交后校验失败事件
  reset: [model: Recordable]; // 重置按钮事件
};

// 转为 onXxx: (xxx) => void
export type ProFormOnEmits = keyOnPrefix<ProFormEmits>;

/**
 * ProForm 表单配置项
 */
export interface FormColumn extends FormItemColumnProps {
  prop: NonNullable<FormItemColumnProps["prop"]>;
  /**
   * ElCol Props
   */
  colProps?: MaybeRef<Partial<ColProps>>;
  /**
   * 表单属性的默认值
   */
  defaultValue?:
    | BaseValueType
    | ((model: Recordable, optionsMap: Map<string, Recordable>) => BaseValueType | Promise<BaseValueType>)
    | ComputedRef<BaseValueType>
    | Promise<BaseValueType>;
  /**
   * 表单排序（从大到小）
   */
  order?: number;
  /**
   * 是否销毁表单，true 销毁，false 不销毁，类似于 v-if
   * @default false
   */
  destroy?: boolean | ((model: Recordable) => boolean);
  /**
   * 是否隐藏表单，true 隐藏，false 不隐藏，类似于 v-show
   * @default false
   */
  hidden?: boolean | ((model: Recordable) => boolean);
  /**
   * 是否禁用表单，true 禁用，false 不禁用
   * @default false
   */
  disabled?: boolean | ((model: Recordable) => boolean);
  /**
   * 指定 Options 的 key，如果设置了则优先从缓存获取对于 key 的 Options 数据
   */
  optionsProp?: string;
  /**
   * 其他拓展
   */
  [key: string]: any;
}

/**
 * ProForm 组件实例
 */
export type ProFormInstance = Omit<InstanceType<typeof ProForm>, keyof ComponentPublicInstance | keyof ProFormProps> & {
  $parent?: ComponentPublicInstance | null;
};

/**
 * provide 类型
 */
export const optionsMapKey: InjectionKey<Ref<Map<string, Recordable[]>>> = Symbol("optionsMap");
