import type { VNode, ComponentPublicInstance } from "vue";
import type { BreakPoint } from "@/components/Grid/index.vue";
import type { Responsive } from "@/components/Grid/components/GridItem.vue";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import type { ProTableProps } from "@/components/ProTable/index.vue";
import type ProTable from "@/components/ProTable/index.vue";
import type { ColumnsProps } from "@/components/ProForm/interface";

type ValueType = string | number | boolean | any[];

export interface EnumProps {
  label?: string; // 选项框显示的文字
  value?: ValueType; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  tagType?: string; // 当 tag 为 true 时，此选择会指定 tag 显示类型
  children?: EnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}

export type TypeProps = "index" | "selection" | "expand";

export type SearchType =
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
  | "select-user";

export type SearchRenderScope = {
  searchParam: { [key: string]: any }; // 搜索参数
  placeholder: string;
  clearable: boolean;
  options: EnumProps[]; // cascader、select-v 2 的选项
  data: EnumProps[]; // el-tree-select 的数据
};

export type SearchProps = {
  el?: SearchType; // 当前项搜索框的类型
  props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
  key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
  order?: number; // 搜索项排序（从大到小）
  span?: number; // 搜索项所占用的列数，默认为 1 列
  offset?: number; // 搜索字段左侧偏移列数
  defaultValue?: ValueType; // 搜索项默认值
  beforeSearch?: (val: ValueType, searchParams: { [key: string]: any }, col: ColumnProps) => any; // 自定义搜索内容渲染（tsx 语法）
  type?: string; // el-select 有 el-select-group
  render?: (scope: SearchRenderScope) => VNode; // 自定义搜索内容渲染（tsx 语法）
} & Partial<Record<BreakPoint, Responsive>>;

export type FieldNamesProps = { label: string; value: string; children?: string };

export type RenderScope<T> = { row: T; $index: number; column: TableColumnCtx<T>; [key: string]: any };

export type HeaderRenderScope<T> = { $index: number; column: TableColumnCtx<T>; [key: string]: any };

/**
 * 表字段属性配置
 * 在 Element Plus 的类型基础增强
 **/
export interface ColumnProps<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader">> {
  tag?: boolean; // 是否是标签展示
  isShow?: boolean; // 是否显示在表格当中
  search?: SearchProps | undefined; // 搜索项配置
  enum?: EnumProps[] | ((params?: any) => Promise<any>); // 枚举类型（字典）
  isFilterEnum?: boolean; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据，不参与内容格式化）
  fieldNames?: FieldNamesProps; // 字典指定 label && value && children 的 key 值
  headerRender?: (scope: HeaderRenderScope<T>) => VNode; // 自定义表头内容渲染（tsx 语法）
  render?: (scope: RenderScope<T>) => VNode | string; // 自定义单元格内容渲染（tsx 语法）
  _children?: ColumnProps<T>[]; // 多级表头
  form?: PartialKey<ColumnsProps, "formItem">;
}

export type ProTableInstance = Omit<InstanceType<typeof ProTable>, keyof ComponentPublicInstance | keyof ProTableProps>;
