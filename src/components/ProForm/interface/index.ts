import type { FormProps } from "element-plus/es/components/form/src/form";
import type { FormItemProps } from "element-plus/es/components/form/src/form-item";

type BaseType = string | number | boolean;

export interface OptionsProps {
  form?: Partial<FormProps> & { fixWidth?: boolean; width?: number | string };
  columns: ColumnsProps[];
}

export interface EnumProps {
  label?: string; // 选项框显示的文字
  value?: BaseType | any[]; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  children?: EnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}
type FormItem = Partial<Omit<FormItemProps, "prop">> & { prop: string; class?: string } & { br?: boolean };

export type FormType =
  | "el-input"
  | "el-input-number"
  | "el-select"
  | "el-select-v 2"
  | "el-tree-select"
  | "el-cascader"
  | "el-date-picker"
  | "el-time-picker"
  | "el-time-select"
  | "el-switch"
  | "el-slider"
  | "wang-editor";

export type FieldNamesProps = { label: string; value: string; children?: string };

export type FormRenderScope = {
  scope: {
    form: { [key: string]: any };
    data: BaseType;
  };
  placeholder: string;
  clearable: boolean;
  options: EnumProps[];
  data: EnumProps[];
};

export interface ColumnsProps {
  formItem: FormItem;
  attrs: {
    el?: FormType;
    enum?: EnumProps[] | ((params?: any) => Promise<any>);
    // 枚举类型（字典）
    fieldNames?: FieldNamesProps; // 字典指定 label && value && children 的 key 值
    props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
    order?: number; // 表单排序（从大到小）
    defaultValue?: BaseType | (() => BaseType | any) | any[]; // 默认值
    width?: string | number;
    subProp?: string; // 级联表单的 prop
    render?: (scope: FormRenderScope) => VNode; // 自定义搜索内容渲染（tsx 语法）
    [key: string]: any;
  };
}
