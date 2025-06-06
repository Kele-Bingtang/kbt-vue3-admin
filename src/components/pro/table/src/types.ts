import type { FormItemColumnProps } from "@/components";
import type { ButtonProps, TableColumnCtx } from "element-plus";

/**
 * 自定义 render 的参数类型
 */
export type TableRenderScope<T> = { row: T; $index: number; column: TableColumnCtx<T>; [key: string]: any };
export type HeaderRenderScope<T> = { $index: number; column: TableColumnCtx<T>; [key: string]: any };

/**
 * 表格列基础配置类型
 */
export type TypeProps = "index" | "selection" | "radio" | "expand" | "sort";

/**
 * 操作栏的整体类型
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
  actionBarTableColumnProps?: Partial<TableColumnCtx<Recordable>>;
  /**
   * 表格操作栏 需要二次确认的类型，默认是 messageBox
   * @version v0.1.17
   */
  confirmType?: "messageBox" | "popconfirm";
}

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
   * @default false
   */
  tag?: boolean;
  /**
   * 是否隐藏在表格当中
   * @default false
   */
  isHide?: boolean;
  /**
   * 字典数据
   */
  options?: FormItemColumnProps["options"];
  /**
   * 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据，不参与内容格式化）
   * @default true
   */
  isFilterOptions?: boolean;
  /**
   * 字典指定 label && value && children 的 key 值
   */
  optionField?: FormItemColumnProps["optionField"];
  /**
   * 是否使用 ElButton link 属性来渲染单元格
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
  _children?: TableColumnProps<T>[];
  /**
   * 表头右侧 ElToolTip 提示
   */
  tooltip?: FormItemColumnProps["tooltip"];
}
