import type {
  ButtonProps,
  ElTooltipProps,
  PaginationProps,
  TableColumnCtx,
  TableInstance,
  TableProps,
} from "element-plus";
import type { FormItemColumnProps, PageInfo } from "@/components";
import type { CSSProperties } from "vue";
import type { UseSelectState } from "./composables/use-selection";
import type ProTable from "./index.vue";
import type ProTableMain from "./table-main.vue";
import type ProTableHeader from "./table-header.vue";
import { TableSizeEnum, TableColumnTypeEnum, ExportKey, ToolButtonEnum, PageMode } from "./helper";

/**
 * 自定义 render 的参数类型
 */
export type TableRenderScope<T> = { row: T; $index: number; column: TableColumnCtx<T>; [key: string]: any };
export type HeaderRenderScope<T> = { $index: number; column: TableColumnCtx<T>; [key: string]: any };

export type TableStyle = { rowStyle: CSSProperties; cellStyle: CSSProperties; headerCellStyle: CSSProperties };

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
 * TableHeader 组件的类型命名空间
 */
export namespace ProTableHeaderNamespace {
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
     * 是否开启分页功能，pageMode 可以指定客户端（前端）分页还是服务端（后端）分页，当为 true 时，默认为客户端（前端）分页
     *
     * @default false
     */
    pagination?: boolean | { pageMode?: PageMode | `${PageMode}` };
    /**
     * 分页组件 props
     *
     * @param false
     */
    paginationProps?: MaybeRef<Partial<PaginationProps>>;
    /**
     * 行主键
     *
     * @default 'id'
     */
    rowKey?: string;
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
    selectionChange: [useSelectReturn: UseSelectState];
    /**
     * 分页触发事件
     */
    paginationChange: [pageInfo: PageInfo];
    /**
     * 拖拽排序结束事件
     */
    dragSortEnd: [newIndex: number, oldIndex: number];
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
    defaultRequestParams?: Recordable;
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
     * 是否使用卡片样式
     *
     * @default false
     */
    cardStyle?: boolean;
    /**
     * 导出配置
     */
    exportProps?: ExportProps;
    pageInfo?: ProTableMainNamespace.Props["pageInfo"];
    pagination?: ProTableMainNamespace.Props["pagination"];
    paginationProps?: ProTableMainNamespace.Props["paginationProps"];
    title?: ProTableHeaderNamespace.Props["title"];
    headerButton?: ProTableHeaderNamespace.Props["button"];
    disabledHeaderButton?: ProTableHeaderNamespace.Props["disabledButton"];
    size?: ProTableHeaderNamespace.Props["size"];
    headerTooltipProps?: ProTableHeaderNamespace.Props["tooltipProps"];
  }

  export interface Emits extends ProTableMainNamespace.Emits, ProTableHeaderNamespace.Emits {
    /**
     * 注册组件实例
     */
    register: [proTableRef: any, elTableRef: TableInstance | undefined];
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
  linkProps?: Partial<ButtonProps & { onClick: (scope: TableRenderScope<any>) => void }>;
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
  children?: TableColumn<T>[];
  /**
   * 表头右侧 ElToolTip 提示
   */
  tooltip?: FormItemColumnProps["tooltip"];
}

/**
 * ProTable 组件实例
 */
export type ProTableInstance = Omit<
  InstanceType<typeof ProTable>,
  keyof ComponentPublicInstance | keyof ProTableNamespace.Props
>;
/**
 * ProTableMain 组件实例
 */
export type ProTableMainInstance = Omit<
  InstanceType<typeof ProTableMain>,
  keyof ComponentPublicInstance | keyof ProTableMainNamespace.Props
>;
/**
 * ProTableHeader 组件实例
 */
export type ProTableHeaderInstance = Omit<
  InstanceType<typeof ProTableHeader>,
  keyof ComponentPublicInstance | keyof ProTableHeaderNamespace.Props
>;
