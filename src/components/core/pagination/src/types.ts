import type { PaginationProps as ElPaginationProps } from "element-plus";

export interface PaginationProps extends Partial<ElPaginationProps> {
  autoScroll?: boolean; // 切换页数，是否自动滚动到最上面
  hidden?: boolean; // 是否隐藏分页
  reset?: boolean; // 切换 pageSize，pageNum 是否重置为 1
  total?: number;
}

export type PaginationEmits = {
  change: [pageInfo: PageInfo];
  currentChange: [pageNum: number];
  sizeChange: [pageSize: number];
};

export interface PageInfo {
  pageNum: number; // 当前页
  pageSizes?: number[]; // 页数数组
  pageSize: number; // 一页显示多少条数据
}
