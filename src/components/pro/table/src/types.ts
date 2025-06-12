import type {
  ButtonProps,
  ElMessageBoxOptions,
  ElTooltipProps,
  IconProps,
  LinkProps,
  PaginationProps,
  PopconfirmProps,
  PopoverProps,
  RadioProps,
  TableColumnCtx,
  TableInstance,
  TableProps,
} from "element-plus";
import type { FormItemColumnProps, PageInfo } from "@/components";
import type { AppContext, CSSProperties, UnwrapRef } from "vue";
import type { UseSelectState } from "./composables/use-selection";
import type ProTable from "./index.vue";
import type ProTableMain from "./table-main.vue";
import type ProTableHead from "./table-head.vue";
import { TableSizeEnum, TableColumnTypeEnum, ExportKey, ToolButtonEnum, Environment, OperationEl } from "./helper";

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

/**
 * 表格样式属性
 */
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
  /**
   * 筛选按钮文字
   *
   * @default '筛选'
   */
  filterText?: string;
  /**
   * 清空按钮文字
   *
   * @default '清空'
   */
  clearText?: string;
  /**
   * 重置按钮文字
   *
   * @default '重置'
   */
  resetText?: string;
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

export namespace OperationNamespace {
  /**
   * 操作按钮属性的类型
   */
  export type ButtonRowProps = Partial<ButtonProps & LinkProps & IconProps & Recordable>;

  /**
   * 操作按钮组件
   */
  export type ButtonEl = "el-icon" | "el-link" | "el-button" | `${OperationEl}`;

  export interface Props extends TableColumn {
    /**
     * 操作按钮集合
     */
    buttons?: ButtonRaw[];
    /**
     * 操作按钮类型
     *
     * @default 'ElLink'
     */
    el?: ButtonEl;
    /**
     * 显示出来的按钮个数
     *
     * @default 3
     */
    showNumber?: number | ((row: Recordable, index: number) => number);
    /**
     * 二次确认配置
     */
    confirm?: boolean | Confirm<"ElPopconfirm"> | Confirm<"ElMessageBox">;
  }

  export interface Emits {
    /**
     * 操作按钮点击时触发
     */
    buttonClick: [params: OperationNamespace.ButtonsCallBackParams];
    /**
     * 二次确认的确定按钮点击时触发
     */
    confirm: [params: OperationNamespace.ButtonsCallBackParams];
    /**
     * 二次确认的取消按钮点击时触发
     */
    cancel: [params: OperationNamespace.ButtonsCallBackParams];
  }

  export type Confirm<T extends keyof ConfirmProps> = {
    el: T;
    props?: ConfirmProps[T];
  };

  export type ConfirmProps = {
    ElPopconfirm: Partial<PopconfirmProps>;
    ElMessageBox: {
      /**
       * ElMessageBox.confirm 的 title
       *
       * @default '提示'
       */
      title?: string | ((data: ButtonsCallBackParams) => string);
      /**
       * ElMessageBox.confirm 的 message
       *
       * @default '确定执行本次操作'
       */
      message?: string | ((data: ButtonsCallBackParams) => string);
      /**
       * ElMessageBox.confirm 的 options
       */
      options?: ElMessageBoxOptions;
      /**
       * ElMessageBox.confirm 的 appContext
       */
      appContext?: AppContext | null;
    };
  };

  export interface ButtonRaw {
    /**
     * 操作文本
     */
    text: MaybeRef<string> | ((row: Recordable, index: number, button: ButtonRowProps) => MaybeRef<string>);
    /**
     * 操作按钮唯一 code，可用来判断按钮类型
     */
    code?: string | number;
    /**
     * 操作按钮类型
     *
     * @default 'ElLink'
     */
    el?: ButtonEl;
    /**
     * `@element-plus/icons-vue` 的图标名称，对 ElButton、ElLink、ElIcon 组件同时生效
     */
    icon?: Component;
    /**
     * ElButton、ElLink、ElIcon 组件对应的 props
     */
    elProps?: MaybeRef<ButtonRowProps> | ((row: any, index: number, button: ButtonRaw) => ButtonRowProps);
    /**
     * ElTooltip 组件的 props， type 为 icon 时生效
     */
    tooltipProps?: Partial<ElTooltipProps>;
    /**
     * 按钮显示的逻辑 默认 true 显示，不需要显示给 false
     */
    show?: MaybeRef<boolean> | ((row: Recordable, index: number, button: ButtonRaw) => MaybeRef<boolean>);
    /**
     * 二次确认配置
     */
    confirm?: Props["confirm"];
    /**
     * 点击当前按钮时触发，可与PlusTable的事件 `clickAction` 同时触发； * 操作需要二次确认时：PlusTable的事件 `clickAction`会在确认时触发，而当前的onClick是在点击时触发
     */
    onClick?: (params: ButtonsCallBackParams) => void;
    /**
     * 操作需要二次确认时，点击确认时触发
     */
    onConfirm?: (params: ButtonsCallBackParams) => void;
    /**
     * 操作需要二次确认时，点击取消时触发， 可与PlusTable的事件 `clickActionConfirmCancel` 同时触发
     */
    onCancel?: (params: ButtonsCallBackParams) => void;
  }

  /**
   * 点击按钮回调的参数的类型
   */
  export interface ButtonsCallBackParams {
    /**
     * 点击按钮数据
     */
    buttonRaw: ButtonRaw;
    /**
     * 解析后的按钮数据中的 text
     */
    text: string;
    /**
     * 按钮点击事件数据
     */
    event: MouseEvent;
    /**
     * 表格行数据
     */
    row: Recordable;
    /**
     * 表格列数据
     */
    column: Recordable;
    /**
     * 表格行索引 同 index
     */
    rowIndex: number;
    /**
     * 表格列索引
     */
    cellIndex: number;
    /**
     * 表格 store
     */
    store: Recordable;
    /**
     * 表格 expanded
     */
    expanded: boolean;
    /**
     * 表格 _self
     */
    _self: Recordable;
  }
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
    toolButton?: false | (ToolButtonEnum | `${ToolButtonEnum}`)[];
    /**
     * 按钮禁用数组
     *
     * @default '[]'
     */
    disabledToolButton?: (ToolButtonEnum | `${ToolButtonEnum}`)[];
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
    /**
     * 自定义不同尺寸的 rowStyle、cellStyle、headerCellStyle
     */
    tableSizeStyle?: Partial<Record<TableSizeEnum, TableStyle>>;
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
     * 行主键
     *
     * @default 'id'
     */
    rowKey?: TableProps<Recordable>["rowKey"];
    /**
     * 操作列的 prop
     *
     * @default 'operation'
     */
    operationProp?: string;
    /**
     * 操作列 props
     */
    operationProps?: Partial<OperationNamespace.Props>;
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

  export interface Emits extends OperationNamespace.Emits {
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
    /**
     * 过滤事件，返回输入的值以及 prop
     */
    filter: [filterModel: Recordable, filterValue: unknown, prop: string | undefined];
    /**
     * 清空事件，返回输入的 prop
     */
    filterClear: [prop: string | undefined];
    /**
     * 重置所有表单事件
     */
    filterReset: [];
  }
}

/**
 * ProTable 组件的类型命名空间
 */
export namespace ProTableNamespace {
  export interface Props extends ProTableMainNamespace.Props, ProTableHeadNamespace.Props {
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
    /**
     * 操作列 props
     */
    operationProps?: ProTableMainNamespace.Props["operationProps"];
    /**
     * ElTable 的 rowStyle
     */
    rowStyle?: TableProps<Recordable>["rowStyle"];
    /**
     * ElTable 的 cellStyle
     */
    cellStyle?: TableProps<Recordable>["cellStyle"];
    /**
     * ElTable 的 headerCellStyle
     */
    headerCellStyle?: TableProps<Recordable>["headerCellStyle"];
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
  extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader" | "width" | "label">> {
  /**
   * 表头宽度
   */
  width?: MaybeRefOrGetter<string | number>;
  /**
   * 列名称
   */
  label?: MaybeRefOrGetter<string>;
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
  /**
   * 其他扩展
   */
  [key: string]: any;
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
