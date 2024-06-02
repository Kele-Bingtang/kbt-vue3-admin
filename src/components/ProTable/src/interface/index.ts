import type { VNode, ComponentPublicInstance, ComputedRef, Ref, ShallowRef, InjectionKey } from "vue";
import type { BreakPoint, Responsive, FormRenderScope, FormType, FormSchemaProps } from "@/components";
import type { TableColumnCtx, PopoverProps } from "element-plus";
import ProTable, { type ProTableProps } from "../index.vue";
import DialogForm, { type DialogFormProps } from "../components/DialogForm.vue";

/**
 * 基本类型
 */
type ValueType = string | number | boolean | any[];

/**
 * 字典数据类型
 */
export interface TableEnumProps {
  label?: string; // 选项框显示的文字
  value?: ValueType; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  tagType?: string; // 当 tag 为 true 时，此选择会指定 tag 显示类型
  children?: TableEnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}

/**
 * 表格列基础配置类型
 */
export type TypeProps = "index" | "selection" | "radio" | "expand" | "sort";

export type SearchType = FormType;

/**
 * ProSearch Props
 */
export type SearchProps = {
  el?: SearchType; // 当前项搜索框的类型
  props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
  key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
  order?: number; // 搜索项排序（从大到小）
  span?: number; // 搜索项所占用的列数，默认为 1 列
  offset?: number; // 搜索字段左侧偏移列数
  defaultValue?:
    | ValueType
    | ((model: any, enumMap: Map<string, Record<string, any>>) => ValueType | any)
    | Ref<ValueType>; // 搜索项默认值
  beforeSearch?: (val: ValueType, searchParams: Record<string, any>, col: TableColumnProps) => any; // 搜索事件前置处理
  render?: (scope: FormRenderScope) => VNode; // 自定义搜索内容渲染（tsx 语法）
} & Partial<Record<BreakPoint, Responsive>>;

/**
 * 自定义字典的 key
 */
export type FieldNamesProps = { label: string; value: string; children?: string };

/**
 * 自定义 render 的参数类型
 */
export type TableRenderScope<T> = { row: T; $index: number; column: TableColumnCtx<T>; [key: string]: any };

export type HeaderRenderScope<T> = { $index: number; column: TableColumnCtx<T>; [key: string]: any };

/**
 * setColumn 函数的参数类型
 */
export interface TableSetProps {
  prop: string;
  field: string;
  value: ValueType;
}

/**
 * 部分查询条件有固定的规则，比如时间范围查询不可能是 lt、gt 之类的，具体规则过滤代码请看 ../helper/index.ts#frontFilter
 */
export type FilterRule =
  | "lt"
  | "gt"
  | "le"
  | "ge"
  | "eq"
  | "ne"
  | "like"
  | "notLike"
  | "between"
  | "notBetween"
  | "in"
  | "notIn"
  | ((model: Record<string, any>, row: any, key: string) => boolean) // 自定义函数查询，返回 boolean、true 符合条件，false 不符合条件
  | undefined;

export interface FilterConfig {
  /**
   * 是否开启筛选功能
   */
  enabled?: boolean;
  /**
   * 筛选器 Popover 宽度
   * @default 230px
   */
  width?: string | number;
  /**
   * 当前端查询时，指定查询的规则
   */
  rule?: FilterRule;
  /**
   * 筛选器触发方式
   *
   * @property click | focus | hover | contextmenu
   * @default click
   */
  trigger?: PopoverProps["trigger"];
  /**
   * 出现位置
   *
   * @property top | top-star | /top-end | bottom | bottom-start | bottom-end | left | left-start | left-end | right | right-start | right-end
   * @default bottom
   */
  placement?: PopoverProps["placement"];
  /**
   * Tooltip 主题
   *
   * @property light | dark
   * @default light
   */
  effect?: PopoverProps["effect"];
  /**
   * 支持 PopoverProps 的其他属性
   * 为什么 filterConfig 不直接继承 PopoverProps 呢？因为继承后 TS 报错：类型实例化过深，且可能无限
   */
  [key: string]: any;
}

export interface EditConfig
  extends Omit<
    FormSchemaProps,
    | "prop"
    | "label"
    | "enum"
    | "fieldNames"
    | "width"
    | "destroy"
    | "hidden"
    | "disabled"
    | "labelSize"
    | "useEnumMap"
    | "enumKey"
  > {
  /**
   * 是否开启行内编辑，默认为 true
   */
  enabled?: boolean;
  /**
   * 行内编辑的表单组件，不配置则取 search 的 el，如果 search 的 el 也不配置，则禁用行内编辑
   */
  el?: SearchType;
  /**
   * 当表单 model 的 key 不为 prop 属性时，可指定其他 key
   */
  key?: string;
  /**
   * 编辑时过滤的对象 key 数组
   */
  filterKey?: string[];
  /**
   * 编辑时额外添加到 model 的参数
   */
  carryParams?: Record<string, any>;
}

/**
 * 表字段属性配置
 * 在 Element Plus 的类型基础增强
 **/
export interface TableColumnProps<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader" | "width">> {
  /**
   * 表头宽度
   */
  width?: string | number | ComputedRef<string | number>;
  /**
   * 列类型
   */
  type?: TypeProps;
  /**
   * 是否是标签展示
   */
  tag?: boolean;
  /**
   * 是否显示在表格当中
   */
  isShow?: boolean;
  /**
   * 搜索项配置
   */
  search?: SearchProps;
  /**
   * 表头筛选配置项
   */
  filterConfig?: FilterConfig;
  /**
   * 自定义 render 时候，需要填写 render 里表单组件使用 v-model 绑定的 prop
   */
  renderUseProp?: string[];
  /**
   * 枚举类型（字典）
   */
  enum?:
    | TableEnumProps[]
    | ((enumMap?: Map<string, Record<string, any>>) => Promise<any>)
    | ComputedRef<TableEnumProps[]>;
  /**
   * 如果 enum 是接口调用，那么可以指定哪个 key 获取 enum 数据，默认返回的数据作为 enum
   */
  enumKey?: string;
  /**
   * 从 enumMap 中获取其他的 enum 数据
   */
  useEnumMap?: string | ((enumMap: Map<string, Record<string, any>>) => Record<string, any>);
  /**
   * 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据，不参与内容格式化）
   */
  isFilterEnum?: boolean;
  /**
   * 字典指定 label && value && children 的 key 值
   */
  fieldNames?: FieldNamesProps;
  /**
   * 行内编辑配置项，使用前提：必须指定 ElTable 的 rowKey
   */
  editConfig?: EditConfig;
  /**
   * 自定义表头内容渲染（tsx 语法）
   */
  headerRender?: (scope: HeaderRenderScope<T>) => VNode;
  /**
   * 自定义单元格内容渲染（tsx 语法）
   */
  render?: (scope: TableRenderScope<T>) => VNode | string;
  /**
   * 多级表头
   */
  _children?: TableColumnProps<T>[];
  /**
   * 编辑操作事件，仅限 prop 为 operation 生效
   */
  handleEdit?: (scope: TableRenderScope<any>, expose: any) => void;
  /**
   * 删除操作事件，仅限 prop 为 operation 生效
   */
  handleDelete?: (scope: TableRenderScope<any>, expose: any) => void;
}

export type DialogFormInstance = Omit<
  InstanceType<typeof DialogForm>,
  keyof ComponentPublicInstance | keyof DialogFormProps
>;

export type ProTableInstance = Omit<InstanceType<typeof ProTable>, keyof ComponentPublicInstance | keyof ProTableProps>;

export type ToolButton = "refresh" | "size" | "setting" | "export" | "search";

// 表格大小样式
export enum TableSizeEnum {
  Large = "large",
  Default = "default",
  Small = "small",
  Mini = "mini",
}

/**
 * provide 类型
 */
export const proTablePrefixClassKey: InjectionKey<string> = Symbol("ProTablePrefixClass");
export const enumMapKey: InjectionKey<Ref<Map<string, Record<string, any>[]>>> = Symbol("EnumMap");
export const dialogFormInstanceKey: InjectionKey<ShallowRef<DialogFormInstance | undefined>> =
  Symbol("DialogFormInstance");
export const filterKey: InjectionKey<{
  searchParam: Record<string, any>;
  filter: boolean;
  useFilter: boolean;
  search: (searchParam: Record<string, any>) => void;
  reset: () => void;
}> = Symbol("FilterKey");

export const editKey: InjectionKey<{
  editModelList: Ref<Map<string | number, Record<string, any>>>;
  rowKey: string;
  editRow: number | undefined;
}> = Symbol("EditKey");
