import type {
  ButtonProps,
  ElTooltipProps,
  PaginationProps,
  PopoverProps,
  RadioProps,
  TableColumnCtx,
  TableInstance,
  TableProps,
} from "element-plus";
import type { FormItemColumnProps, PageInfo } from "@/components";
import type { CSSProperties, UnwrapRef } from "vue";
import type { UseSelectState } from "./composables/use-selection";
import type ProTable from "./index.vue";
import type ProTableMain from "./table-main.vue";
import type ProTableHead from "./table-head.vue";
import { TableSizeEnum, TableColumnTypeEnum, ExportKey, ToolButtonEnum, Environment } from "./helper";

/**
 * 自定义 render 的参数类型
 */
export type TableDefaultRenderScope<T = Recordable> = {
  row: T;
  $index: number;
  column: TableColumn<T>;
  [key: string]: any;
};
export type TableHeadRenderScope<T = Recordable> = { $index: number; column: TableColumn<T>; [key: string]: any };

export type TableStyle = { rowStyle: CSSProperties; cellStyle: CSSProperties; headerCellStyle: CSSProperties };

/**
 * 部分查询条件有固定的规则，比如时间范围查询不可能是 lt、gt 之类的
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
  | ((model: Record<string, any>, row: any, key: string) => boolean) // 自定义函数查询，返回 boolean：true 符合条件，false 不符合条件
  | undefined;

export interface TableFilterProps {
  /**
   * 是否开启筛选功能
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 使用的表单组件名
   *
   * @default 'ElInput'
   */
  el?: FormItemColumnProps["el"];
  /**
   * ElFormItem 的 prop 属性，当表单数据 model 为对象时，prop 也是 model 的 key
   */
  prop?: FormItemColumnProps["prop"];
  /**
   * 当前端查询时，指定查询的规则
   *
   * @default 'eq'
   */
  rule?: FilterRule;
  /**
   * ProFormItem props
   */
  formColumn?: FormItemColumnProps;
  /**
   * PopoverProps props
   */
  popoverProps?: Partial<PopoverProps>;
}

/**
 * 表格导出类型
 */
export interface ExportProps {
  /**
   * 导出时的表头配置
   *
   * @default 'label'
   */
  mode?: ExportKey | `${ExportKey}`;
  /**
   *导出文件名
   */
  fileName?: string;
  /**
   * 导出时确认提示语
   *
   * @default '确认导出数据?'
   */
  confirmMessage?: string;
  /**
   *  导出时确认标题（ElMessageBox.confirm 标题）
   *
   * @default '温馨提示'
   */
  confirmTitle?: string;
  /**
   * 导出时确认标题（ElMessageBox.confirm 标题）
   *
   * @default '请选择导出列'
   */
  labelConfirmTitle?: string;
  /**
   * 自定义导出为文件
   *
   * @param data 表格数据
   */
  exportFile?: (data: Recordable[]) => void;
}

/**
 * 操作栏的类型
 */
export interface OperationProps {
  /**
   * 操作栏名称  默认值为 `'操作栏'`
   * @version v0.1.0 类型新增ComputedRef<string>
   */
  label?: string | ComputedRef<string>;
  /**
   * 操作栏固定   默认值为 `'right'`
   */
  fixed?: string;
  /**
   * 显示出来的按钮个数  默认值为 `3`
   * @version 0.1.23 新增函数类型
   * @default 3
   */
  showNumber?: number | ((row: Recordable, index: number) => number);
  /**
   * 更多按钮显示策略
   * @version 0.1.20
   * @default false
   */
  showLimitIncludeMore?: boolean;
  /**
   * 操作按钮的类型   默认值为 `'link'`
   */
  type?: "icon" | "button" | "link";
  /**
   * 操作按钮集合   默认值为 `[]`
   */
  buttons?: any[];
  /**
   * 表格操作栏 el-table-column 的其width   默认值为 `200`
   */
  width?: string | number;
  /**
   * 表格操作栏 el-table-column 的其他props   默认值为 `{}`
   */
  actionBarTableColumn?: Partial<TableColumnCtx<Recordable>>;
  /**
   * 表格操作栏 需要二次确认的类型，默认是 messageBox
   * @version v0.1.17
   */
  confirmType?: "messageBox" | "popconfirm";
}

/**
 * TableHead 组件的类型命名空间
 */
export namespace ProTableHeadNamespace {
  export interface Props {
    /**
     * table 数据
     *
     * @default '[]'
     */
    data?: ProTableNamespace.Props["data"];
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: TableColumn[];
    /**
     * 按钮显示数组
     *
     * @default '["size", "setting", "export"]'
     */
    button?: false | (ToolButtonEnum | `${ToolButtonEnum}`)[];
    /**
     * 按钮禁用数组
     *
     * @default '[]'
     */
    disabledButton?: (ToolButtonEnum | `${ToolButtonEnum}`)[];
    /**
     * 表格密度
     *
     * @default 'default'
     */
    size?: TableSizeEnum | `${TableSizeEnum}`;
    /**
     * 表格标题
     */
    title?: string;
    /**
     * 表格导出配置
     */
    exportProps?: ExportProps;
    /**
     * ElTable Props
     */
    tooltipProps?: Partial<ElTooltipProps>;
  }

  export interface Emits {
    sizeChange: [size: TableSizeEnum, tableStyle: TableStyle];
  }
}

/**
 * TableMain 组件的类型命名空间
 */
export namespace ProTableMainNamespace {
  /**
   * TableMain 组件 Props
   */
  export interface Props {
    /**
     * 表格数据
     *
     * @default '[]'
     */
    data?: Recordable[];
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: TableColumn[];
    /**
     * 字段类型
     *
     * @default '["selection", "radio", "index", "expand", "sort"]'
     */
    columnTypes?: (TableColumnTypeEnum | `${TableColumnTypeEnum}`)[];
    /**
     * 行主键
     *
     * @default 'id'
     */
    rowKey?: TableProps<Recordable>["rowKey"];
    /**
     * 操作列 props
     *
     * @param false
     */
    operation?: false | Partial<OperationProps>;
    /**
     * 分页信息
     */
    pageInfo?: Partial<PageInfo>;
    /**
     * 是否开启分页功能，可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
     *
     * @default false
     */
    pageScope?: boolean | Environment | `${Environment}`;
    /**
     * 分页组件 props
     *
     * @param false
     */
    paginationProps?: MaybeRef<Partial<PaginationProps>>;
    /**
     * 单选框 props
     */
    radioProps?: MaybeRef<Partial<RadioProps>>;
    /**
     * 过滤规则，可以指定客户端（前端）过滤还是服务端（后端）过滤，当为 true 时，默认为客户端（前端）过滤
     */
    filterScope?: boolean | Environment | `${Environment}`;
    /**
     * 表格无数据时显示的文字
     *
     * @default '暂无数据'
     */
    emptyText?: string;
  }

  export interface Emits {
    /**
     * 多选框勾选事件
     */
    selectionChange: [useSelectReturn: UnwrapRef<UseSelectState>, index?: number];
    /**
     * 分页触发事件
     */
    paginationChange: [pageInfo: PageInfo];
    /**
     * 拖拽排序结束事件
     */
    dragSortEnd: [newIndex: number, oldIndex: number];
    filter: [model: Recordable];
    filterClear: [model: Recordable];
    filterReset: [];
  }
}

/**
 * ProTable 组件的类型命名空间
 */
export namespace ProTableNamespace {
  export interface Props extends Partial<Omit<TableProps<any>, "data" | "size">> {
    /**
     * 列配置项
     *
     * @default '[]'
     */
    columns?: TableColumn[];
    /**
     * table 数据
     *
     * @default '[]'
     */
    data?: Recordable[];
    /**
     * 请求表格数据的请求
     *
     * @param params 请求参数
     */
    requestApi?: (params: Recordable) => Promise<any>;
    /**
     * 默认请求参数
     */
    defaultParams?: Recordable;
    /**
     * 是否立即执行请求
     *
     * @default true
     */
    requestImmediate?: boolean;
    /**
     * 查询数据前的回调函数，可以对查询参数进行处理或禁止查询
     */
    beforeSearch?: (searchParams: Recordable) => boolean | Recordable;
    /**
     * 请求失败回调
     *
     * @param error 错误信息
     */
    requestError?: (error: unknown) => void;
    /**
     * 请求成功回调
     *
     * @param data 请求返回的数据
     */
    dataCallback?: (data: Recordable) => any;
    /**
     * 是否隐藏表格头部
     *
     * @default false
     */
    hideHeader?: boolean;
    /**
     * 是否使用卡片样式
     *
     * @default false
     */
    card?: boolean;
    /**
     * 分页信息
     */
    pageInfo?: ProTableMainNamespace.Props["pageInfo"];
    /**
     * 是否开启分页功能，pageMode 可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
     *
     * @default false
     */
    pageScope?: ProTableMainNamespace.Props["pageScope"];
  }

  export interface Emits extends ProTableMainNamespace.Emits, ProTableHeadNamespace.Emits {
    /**
     * 注册组件实例
     */
    register: [proTableInstance: any, elTableInstance: TableInstance | null];
  }
}

/**
 * 表格列配置
 */
export interface TableColumn<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader" | "width">> {
  /**
   * 表头宽度
   */
  width?: string | number | ComputedRef<string | number>;
  /**
   * 列类型
   */
  type?: TableColumnTypeEnum | `${TableColumnTypeEnum}`;
  /**
   * 是否是标签展示
   *
   * @default false
   */
  tag?: boolean;
  /**
   * 是否隐藏在表格当中
   *
   * @default false
   */
  isHide?: boolean;
  /**
   * 字典数据
   */
  options?: FormItemColumnProps["options"];
  /**
   * 当前单元格值是否根据 options 格式化（根据 value 找 label）
   *
   * @default true
   */
  isFilterOptions?: boolean;
  /**
   * 字典指定 label && value && children 的 key 值
   *
   * @default { label: "label", value: "value", children: "children", disabled: "disabled" }
   */
  optionField?: FormItemColumnProps["optionField"];
  /**
   * 是否使用 ElButton link 属性来渲染单元格
   *
   * @default false
   */
  link?: boolean;
  /**
   * ElButton Props
   */
  linkProps?: Partial<ButtonProps & { onClick: (scope: TableDefaultRenderScope<any>) => void }>;
  /**
   * 自定义表头内容渲染（tsx 语法）
   */
  headerRender?: (scope: TableHeadRenderScope<T>) => VNode;
  /**
   * 自定义单元格内容渲染（tsx 语法）
   */
  render?: (scope: TableDefaultRenderScope<T>) => VNode | string;
  /**
   * 多级表头
   */
  children?: TableColumn<T>[];
  /**
   * 表头右侧 ElToolTip 提示
   */
  tooltip?: FormItemColumnProps["tooltip"];
  /**
   * 表头筛选配置项
   */
  filterProps?: TableFilterProps;
}

/**
 * ProTable 组件实例
 */
export type ProTableInstance = Omit<
  InstanceType<typeof ProTable>,
  keyof ComponentPublicInstance | keyof ProTableNamespace.Props
> & { $parent?: ComponentPublicInstance | null; pageInfo: ProTableNamespace.Props["pageInfo"] };
/**
 * ProTableMain 组件实例
 */
export type ProTableMainInstance = Omit<
  InstanceType<typeof ProTableMain>,
  keyof ComponentPublicInstance | keyof ProTableMainNamespace.Props
> & { $parent?: ComponentPublicInstance | null };
/**
 * ProTableHead 组件实例
 */
export type ProTableHeadInstance = Omit<
  InstanceType<typeof ProTableHead>,
  keyof ComponentPublicInstance | keyof ProTableHeadNamespace.Props
> & { $parent?: ComponentPublicInstance | null };
