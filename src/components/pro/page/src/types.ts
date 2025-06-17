import type { ProTableInstance, ProTableNamespace, TableColumn } from "@/components/pro/table";
import type { ProSearchColumnProps, ProSearchEmits, ProSearchExpose, ProSearchProps } from "@/components/pro/search";
import type { BreakPoint, Responsive } from "@/components/pro/grid";
import type { TableInstance } from "element-plus";
import type ProPage from "./index.vue";

export interface PageColumn<T = any> extends TableColumn<T> {
  search?: {
    /**
     * 搜索事件前置处理
     */
    beforeSearch?: (value: unknown, searchParams: Recordable, column: TableColumn) => Recordable | false | undefined;
    /**
     * 搜索项所占用的列数，默认为 1 列
     */
    span?: number;
    /**
     * 搜索字段左侧偏移列数
     */
    offset?: number;
  } & Partial<ProSearchColumnProps> &
    Partial<Record<BreakPoint, Responsive>>;
}

export interface ProPageProps extends ProTableNamespace.Props {
  /**
   * 页面列配置
   */
  columns?: PageColumn[];
  /**
   * 搜索项配置
   */
  searchProps?: Omit<ProSearchProps, "columns">;
  /**
   * 初始化时是否显示搜索模块
   */
  initShowSearch?: boolean;
}

export interface ProPageEmits extends Omit<ProTableNamespace.Emits, "register">, Omit<ProSearchEmits, "register"> {
  searchRegister: [proFormRef?: ProSearchExpose];
  tableRegister: [proTableInstance: ProTableInstance, elTableInstance: TableInstance | null];
}

/**
 * ProTable 组件实例
 */
export type ProPageInstance = InstanceType<typeof ProPage>;
