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
import ProFormItem, { type ProFormItemProps } from "./index.vue";
import type { TreeProps as CustomTreeProps } from "./components/tree.vue";
import type { TreeProps } from "element-plus/es/components/tree-v2/src/types";
import type { SelectProps } from "element-plus/es/components/select/src/select";
import type { SelectProps as SelectV2Props } from "element-plus/es/components/select-v2/src/defaults";
import type { TimeSelectProps } from "element-plus/es/components/time-select/src/time-select";
import type { JSX } from "vue/jsx-runtime";

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
 * 组件内置导入需要
 */
export enum ComponentNameEnum {
  EL_INPUT = "ElInput",
  EL_INPUT_NUMBER = "ElInputNumber",
  EL_SELECT = "ElSelect",
  EL_SELECT_V2 = "ElSelectV2",
  EL_TREE = "ElTree",
  EL_TREE_SELECT = "ElTreeSelect",
  EL_CASCADER = "ElCascader",
  EL_DATE_PICKER = "ElDatePicker",
  EL_TIME_PICKER = "ElTimePicker",
  EL_TIME_SELECT = "ElTimeSelect",
  EL_SWITCH = "ElSwitch",
  EL_SLIDER = "ElSlider",
  EL_RADIO = "ElRadio",
  EL_RADIO_GROUP = "ElRadioGroup",
  EL_RADIO_BUTTON = "ElRadioButton",
  EL_CHECKBOX = "ElCheckbox",
  EL_CHECKBOX_GROUP = "ElCheckboxGroup",
  EL_CHECKBOX_BUTTON = "ElCheckboxButton",
  EL_AUTOCOMPLETE = "ElAutocomplete",
  EL_RATE = "ElRate",
  EL_COLOR_PICKER = "ElColorPicker",
  EL_TRANSFER = "ElTransfer",
  EL_DIVIDER = "ElDivider",
  EL_UPLOAD = "ElUpload",
  CHECK_BOX_SELECT = "CheckBoxSelect",
  WANG_EDITOR = "WangEditor",
  TINYMCE = "Tinymce",
  ICON_PICKER = "IconPicker",
}

/**
 * el 字面量
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
 * el 字面量
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
export interface FormItemColumn {
  /**
   * 表单组件 Props
   */
  prop: string;
  /**
   * ElFormItem 的 label 属性
   */
  label: MaybeRefOrGetter<BaseValueType>;
  /**
   * 是否显示 label
   */
  hasLabel?: MaybeRefOrGetter<boolean>;
  /**
   * 表单组件宽度
   */
  width?: MaybeRef<string | number>;
  /**
   * 使用的表单组件名
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
      // 其他的 FormItemColumn 类型
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
   * @default Object { label: "label", value: "value", children: "children" }
   */
  optionField?: FormOptionFieldProps;
  /**
   * ElFormItem props
   */
  formItemProps?: MaybeRef<Partial<FormItemProps>>;
  /**
   * Label 使用 ElToolTip 提示的配置
   */
  tooltip?: Partial<ElTooltipProps> & {
    icon?: Component; // ElTooTip 绑定的元素图标
    render?: () => VNode | string; // 自定义 ElTooTip 绑定的元素，将会覆盖图标，传入 ElTooTip 的 default 插槽里
    contentRender?: () => VNode | string; // 自定义 ElTooTip 的内容，传入 ElTooTip 的 content 插槽里
  };
  /**
   * 自定义 label 标题
   */
  renderLabel?: (label: string, scope: FormItemColumn) => RenderTypes;
  /**
   * 自定义渲染 el-form-item 下的表单组件
   */
  renderEl?: (scope: FormItemColumn) => RenderTypes;

  /**
   * 其他拓展
   */
  [key: string]: any;
}

export type ProFormItemInstance = Omit<
  InstanceType<typeof ProFormItem>,
  keyof ComponentPublicInstance | keyof ProFormItemProps
>;
