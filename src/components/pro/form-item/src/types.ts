import type {
  FormItemProps,
  InputProps,
  AutocompleteProps,
  CascaderProps,
  ColorPickerProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  RadioButtonProps,
  RadioGroupProps,
  RateProps,
  SwitchProps,
  TransferProps,
  UploadProps,
  SliderProps,
  CheckboxProps,
  CheckboxGroupProps,
  RadioProps,
  TimePickerDefaultProps,
  ElTooltipProps,
} from "element-plus";
import type { VNode, ComputedRef, ComponentPublicInstance, ExtractPropTypes } from "vue";
import type ProFormItem from "./index.vue";
import type { TreeProps as CustomTreeProps } from "./components/tree.vue";
import type { TreeProps } from "element-plus/es/components/tree-v2/src/types";
import type { SelectProps } from "element-plus/es/components/select/src/select";
import type { SelectProps as SelectV2Props } from "element-plus/es/components/select-v2/src/defaults";
import type { TimeSelectProps } from "element-plus/es/components/time-select/src/time-select";
import type { JSX } from "vue/jsx-runtime";
import type { ComponentNameEnum } from "./helper";

export type ElFormItemProps = Partial<FormItemProps>;

/**
 * 表单数据类型
 */
export type FieldBaseValueType =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | string[]
  | number[]
  | boolean[]
  | Date[]
  | [Date, Date]
  | [number, number]
  | [string, string]
  | string[][]
  | number[][]
  | Record<any, any>;

/**
 * el 字面量，为 PascalCase 格式
 */
export type PascalCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}${Capitalize<Lowercase<C>>}`
        : `${Capitalize<Lowercase<A>>}${Capitalize<Lowercase<B>>}`
      : Capitalize<Lowercase<K>>
    : never
  : never;

/**
 * el 字面量，为 HyphenCase 格式
 */
export type HyphenCaseComponentName = keyof typeof ComponentNameEnum extends infer K
  ? K extends string
    ? K extends `${infer A}_${infer B}`
      ? K extends `${infer A}_${infer B}_${infer C}`
        ? `${Lowercase<A>}-${Lowercase<B>}-${Lowercase<C>}`
        : `${Lowercase<A>}-${Lowercase<B>}`
      : Lowercase<K>
    : never
  : never;

/**
 * el 字面量
 */
export type FormType = PascalCaseComponentName | HyphenCaseComponentName;

/**
 * 基本类型
 */
export type BaseValueType = string | number | boolean | any;

/**
 * 渲染函数的返回值的类型
 */
export type RenderTypes = string | VNode | JSX.Element | Component;

/**
 * 字典数据类型
 */
export interface FormOptionProps {
  /**
   * 选项框显示的文字
   */
  label?: string;
  /**
   * 选项框值
   */
  value?: BaseValueType;
  /**
   * 是否禁用此选项
   */
  disabled?: boolean;
  /**
   * 为树形选择时，可以通过 children 属性指定子选项
   */
  children?: FormOptionProps[];
  /**
   * 拓展其他选项
   */
  [key: string]: any;
}

/**
 * 自定义字典的 key
 */
export type FormOptionFieldProps = {
  label?: string;
  value?: string;
  disabled?: string;
  children?: string;
};

/**
 * ProFormItem 的 props
 */
export interface FormItemColumnProps {
  /**
   * ElFormItem 的 props 属性，当表单数据 model 为对象时，prop 也是 model 的 key 传入表单组件里
   */
  prop?: string;
  /**
   * 标签，ElFormItem 的 label 属性
   */
  label?: MaybeRefOrGetter<BaseValueType>;
  /**
   * 是否显示 label
   */
  showLabel?: MaybeRefOrGetter<boolean>;
  /**
   * 表单组件宽度
   */
  width?: MaybeRef<string | number>;
  /**
   * 使用的表单组件名
   *
   * @default 'ElInput'
   */
  el?: MaybeRef<FormType>;
  /**
   * 根据 element plus 官方文档来传递，该属性所有值会透传到表单组件
   */
  elProps?: MaybeRef<
    | InputProps
    | InputNumberProps
    | ExtractPropTypes<typeof SelectProps>
    | ExtractPropTypes<typeof SelectV2Props>
    | TreeProps
    | CustomTreeProps
    | CascaderProps
    | DatePickerProps
    | TimePickerDefaultProps
    | TimeSelectProps
    | SwitchProps
    | SliderProps
    | RadioProps
    | RadioGroupProps
    | RadioButtonProps
    | CheckboxProps
    | CheckboxGroupProps
    | AutocompleteProps
    | RateProps
    | ColorPickerProps
    | TransferProps
    | DividerProps
    | UploadProps
    | { labelSize?: "default" | "small" | "large" }
    | Recordable
  >;
  /**
   * 表单组件的插槽
   */
  elSlots?: {
    [slotName: string]: (data: {
      options: FormOptionProps[];
      optionField: FormOptionFieldProps;
      // 其他的 FormItemColumnProps 类型
      [key: string]: any;
    }) => RenderTypes;
  };
  /**
   * 字典数据，如果 enum 是接口调用，那么可以指定哪个 key 获取 enum 数据，默认返回的数据作为 enum
   */
  options?:
    | FormOptionProps[]
    | ((
        model: Recordable,
        optionsMap: Map<string, Recordable>
      ) => FormOptionProps[] | Promise<FormOptionProps[]> | Promise<unknown>)
    | ComputedRef<FormOptionProps[]>
    | Promise<FormOptionProps[]>;
  /**
   * 字典指定 label && value && children 的 key 值
   *
   * @default { label: "label", value: "value", children: "children", disabled: "disabled" }
   */
  optionField?: FormOptionFieldProps;
  /**
   * ElFormItem props
   */
  formItemProps?: MaybeRef<ElFormItemProps>;
  /**
   * 是否显示清除按钮
   *
   * @default true
   */
  clearable?: boolean;
  /**
   * Label 右侧 ElToolTip 提示
   */
  tooltip?: Partial<ElTooltipProps> & {
    icon?: Component; // ElTooTip 绑定的元素图标
    render?: () => VNode | string; // 自定义 ElTooTip 绑定的元素，将会覆盖图标，传入 ElTooTip 的 default 插槽里
    contentRender?: () => VNode | string; // 自定义 ElTooTip 的内容，传入 ElTooTip 的 content 插槽里
  };
  /**
   * 表单绑定的值格式，场景：select 下拉 value 为 "1"，而 model 值是 1 导致无法匹配，可以设置为 getFormat: "string" 解决
   */
  getFormat?: BaseValueType | ((value: BaseValueType) => BaseValueType);
  /**
   * 自定义 label 标题
   */
  renderLabel?: (label: string, scope: FormItemColumnProps) => RenderTypes;
  /**
   * 自定义渲染 el-form-item 下的表单组件
   */
  renderEl?: (scope: FormItemColumnProps) => RenderTypes;
}

/**
 * ProFormItem 组件实例
 */
export type ProFormItemInstance = Omit<
  InstanceType<typeof ProFormItem>,
  keyof ComponentPublicInstance | keyof FormItemColumnProps
>;
