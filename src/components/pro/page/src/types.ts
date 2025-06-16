import type { ProTableNamespace, TableColumn } from "@/components/pro/table";
import type { ProSearchColumnProps, ProSearchEmits, ProSearchExpose, ProSearchProps } from "@/components/pro/search";

export interface PageColumn extends TableColumn {
  search: ProSearchColumnProps & {
    /**
     * 搜索事件前置处理
     */
    beforeSearch?: (value: unknown, searchParams: Recordable, column: TableColumn) => Recordable | false | undefined;
  };
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
}
