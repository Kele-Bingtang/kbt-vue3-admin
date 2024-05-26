import type { FormItemProps, ColProps, FormProps } from "element-plus";
import type { VNode, ComputedRef, ComponentPublicInstance } from "vue";
import ProForm, { type ProFormProps } from "../index.vue";

export type ValueType = string | number | boolean | any[];

export interface FormEnumProps {
  label?: string; // 选项框显示的文字
  value?: ValueType; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  children?: FormEnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}

export interface ProElFormProps extends Partial<FormProps> {
  fixWidth?: boolean;
  width?: number | string;
}

export type FormType =
  | "divider"
  | "el-input"
  | "el-input-number"
  | "el-select"
  | "el-select-v2"
  | "el-tree"
  | "el-tree-select"
  | "el-cascader"
  | "el-date-picker"
  | "el-time-picker"
  | "el-time-select"
  | "el-switch"
  | "el-slider"
  | "el-radio-group"
  | "el-checkbox"
  | "el-checkbox-group"
  | "tinymce"
  | "wang-editor"
  | "user-select";

export type FormFieldNamesProps = {
  label: string;
  value: string;
  disabled?: string;
  children?: string;
};

export type FormRenderScope = {
  model: Record<string, any>;
  data: ValueType;
  enumData: Record<string, any>;
};

export interface FormSchemaProps<T = Record<string, any>> {
  col?: Partial<ColProps>;
  formItem?: Partial<FormItemProps>;
  prop: string;
  label: ValueType | ((model: T) => any);
  el?: FormType;
  enum?:
    | FormEnumProps[]
    | ((model: T, enumMap: Map<string, Record<string, any>>) => Promise<any>)
    | ComputedRef<FormEnumProps[]>;
  enumKey?: string; // 如果 enum 是接口调用，那么可以指定哪个 key 获取 enum 数据，默认返回的数据作为 enum
  useEnumMap?: string | ((enumMap: Map<string, Record<string, any>>) => Record<string, any>); // 从 enumMap 中获取其他的 enum 数据
  // 枚举类型（字典）
  fieldNames?: FormFieldNamesProps; // 字典指定 label && value && children 的 key 值
  props?: any; // 根据 element plus 官方文档来传递，该属性所有值会透传到组件
  order?: number; // 表单排序（从大到小）
  defaultValue?:
    | ValueType
    | ((model: T, enumMap: Map<string, Record<string, any>>) => ValueType | any)
    | ComputedRef<ValueType>; // 默认值
  width?: string | number;
  subProp?: string; // 级联表单的 prop
  subEnum?: FormEnumProps[] | ((params?: any, enumData?: any) => Promise<any> | FormEnumProps[]); // 级联表单的 enum
  render?: (scope: FormRenderScope) => VNode; // 自定义搜索内容渲染（tsx 语法）
  isDestroy?: boolean | ((model: T) => boolean); // 是否销毁表单，true 销毁，false 不销毁
  isHidden?: boolean | ((model: T) => boolean); // 是否隐藏表单，true 隐藏，false 不隐藏（isDestroy 是销毁元素，而 isHidden 是隐藏，也就是有 defaultValue 时，isDestroy 不会传给后台，isHidden 会）
  isDisabled?: boolean | ((model: T) => boolean); // 是否禁用表单，true 禁用，false 不禁用
  destroy?: Array<"add" | "edit">; // 是否销毁表单，给 ProTable 的 DialogOperate.vue 使用
  hidden?: Array<"add" | "edit">; // 是否隐藏表单，给 ProTable 的 DialogOperate.vue 使用
  disabled?: Array<"add" | "edit">; // 是否禁用表单，给 ProTable 的 DialogOperate.vue 使用
  valueFormat?: "default" | "string" | "number" | "boolean"; // 表单绑定的值格式，默认 default（针对 Enum Value 是 string "1"，而值是 number 1 导致编辑时无法匹配问题）
  labelSize?: "default" | "small" | "large"; // label 标题大小，默认 default。仅 el 为 divider 生效
  [key: string]: any;
}

export type ProFormInstance = Omit<InstanceType<typeof ProForm>, keyof ComponentPublicInstance | keyof ProFormProps>;
