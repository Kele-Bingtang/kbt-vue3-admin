import type { Paging } from "@/components/Pagination/index.vue";
import type { TableColumnProps } from "../interface";
import { reactive, computed, toRefs } from "vue";

export namespace Table {
  export interface Paging {
    pageNum: number;
    pageSize: number;
    total: number;
  }

  export interface PaginationProps {
    enabled: boolean; // 是否开启分页
    fake: boolean; // 是否前端分页
  }

  export interface StateProps {
    tableData: any[];
    paging: Paging;
    searchParam: { [key: string]: any };
    searchInitParam: { [key: string]: any };
    totalParam: { [key: string]: any };
    icon?: { [key: string]: any };
  }
}

export namespace HandleData {
  export type MessageType = "" | "success" | "warning" | "info" | "error";
}

export namespace Theme {
  export type GreyOrWeakType = "grey" | "weak";
}

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initRequestParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} openPage 是否有分页 (非必传，默认为true)
 * @param {Function} beforeSearch 查询前的回调函数
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * @param {Function} requestError 请求出错后的回调函数
 * @param {Object[]} columns 表格的列配置项
 * @param {Function} enumCallBack 字典设置的回调函数，ProTable 内置函数
 * */
export const useTable = (
  api?: (params: any) => Promise<any>,
  initRequestParam: object = {},
  openPage: boolean | Table.PaginationProps = true,
  beforeSearch?: (searchParam: any) => any,
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void,
  columns?: TableColumnProps[]
) => {
  const state = reactive<Table.StateProps>({
    // 表格数据
    tableData: [],
    // 分页数据
    paging: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 20,
      // 总条数
      total: 0,
    },
    // 查询参数（只包括查询）
    searchParam: {},
    // 初始化默认的查询参数，重置时候用到
    searchInitParam: {},
    // 总参数（包含分页和查询参数)
    totalParam: {},
  });

  /**
   * @description 分页查询参数（只包括分页和表格字段排序，其他排序方式可自行配置）
   * */
  const pageParam = computed({
    get: () => {
      return { pageNum: state.paging.pageNum, pageSize: state.paging.pageSize };
    },
    set: (newVal: any) => {
      console.log("我是分页更新之后的值", newVal);
    },
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async (requestParam: object = initRequestParam) => {
    if (!api) return;
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, requestParam, isBackPage(openPage) ? pageParam.value : {});
      let searchParam = { ...state.searchInitParam, ...state.totalParam };
      beforeSearch && (searchParam = beforeSearch(searchParam) ?? searchParam);

      // 排除 0、undefined 等，返回 false 则不执行查询
      if ((searchParam as unknown as boolean) === false) return;

      if (columns) {
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          if (col.search?.beforeSearch) {
            searchParam[col.prop!] =
              col.search?.beforeSearch(searchParam[col.search.key ?? col.prop!], searchParam, col) ??
              searchParam[col.prop!];

            if (searchParam[col.prop!] === false) return;
          }
        }
      }

      let { data } = await api(searchParam);

      dataCallBack && (data = dataCallBack(data) || data);
      if (data) state.tableData = isBackPage(openPage) ? data.list : data;

      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isBackPage(openPage)) {
        const { pageNum, pageSize, total } = data;
        if (pageNum) updatePaging({ pageNum });
        if (pageSize) updatePaging({ pageSize });
        if (total) updatePaging({ total });
        else updatePaging({ total: data.length });
      }
    } catch (error) {
      console.error(error);
      requestError && requestError(error);
    }
  };

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    const nowSearchParam: Table.StateProps["searchParam"] = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (const key in state.searchParam) {
      // 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isBackPage() ? pageParam.value : {});
  };

  /**
   * @description 更新分页信息
   * @param {Object} paging 后台返回的分页数据
   * @return void
   * */
  const updatePaging = (paging: Partial<Table.Paging>) => {
    Object.assign(state.paging, paging);
  };

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.paging.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.paging.pageNum = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key];
    });
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} paging 当前分页信息
   * @return void
   * */
  const handlePagination = (paging: Paging) => {
    state.paging.pageNum = paging.currentPage;
    state.paging.pageSize = paging.pageSize;
    if (isBackPage()) getTableList();
  };

  const isOpenPage = (open: boolean | Table.PaginationProps = openPage) => {
    if (open === true) return true;
    if ((open as Table.PaginationProps)?.enabled) return true;
    return false;
  };

  const isBackPage = (open: boolean | Table.PaginationProps = openPage) => {
    if (open === true) return true;
    if (open === false) return false;
    if ((open as Table.PaginationProps)?.enabled && (open as Table.PaginationProps)?.fake !== true) return true;
    return false;
  };

  const isFrontPage = (open: boolean | Table.PaginationProps = openPage) => {
    if (open === true || open === false) return false;
    if ((open as Table.PaginationProps)?.enabled && (open as Table.PaginationProps)?.fake) return true;
    return false;
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handlePagination,
    updatedTotalParam,
    isOpenPage,
    isBackPage,
    isFrontPage,
  };
};
