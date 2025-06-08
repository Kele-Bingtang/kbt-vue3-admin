import type { FormItemProp } from "element-plus";
import type { BreakPoint, FormColumn, GridItemProps, ProFormProps } from "@/components";
import type { ProSearchExpose } from "./index.vue";
import type ProSearch from "./index.vue";

export type ActionPosition = "left" | "right" | "block-left" | "block-center" | "block-right";

export type ProSearchColumnProps = FormColumn & {
  grid?: Partial<GridItemProps>; // GridItem props
};

export interface ProSearchProps extends ProFormProps {
  /**
   * 搜索配置列
   */
  columns?: ProSearchColumnProps[];
  /**
   * Action 位置，block 代表换行
   *
   * @default right
   */
  position?: ActionPosition;
  /**
   * 响应式布局
   *
   * @default '{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }'
   */
  searchCols?: number | Record<BreakPoint, number>;
  /**
   * 行和列间距
   *
   * @default '[20, 0]''
   */
  gap?: [number, number] | number;
  /**
   * 是否展示操作按钮
   *
   * @default true
   */
  showAction?: boolean;
  /**
   * 是否展示搜索按钮
   *
   * @default true
   */
  showSearch?: boolean;
  /**
   * 是否展示重置按钮
   *
   * @default true
   */
  showReset?: boolean;
  /**
   * 是否展示折叠功能
   *
   * @default true
   */
  showCollapse?: boolean;
  /**
   * 搜索按钮的文字
   *
   * @default '搜索'
   */
  searchText?: string;
  /**
   * 重置按钮的文字
   *
   * @default '重置'
   */
  resetText?: string;
  /**
   * 展开按钮的文字
   *
   * @default '展开'
   */
  collapseText?: string;
  /**
   * 折叠按钮的文字
   *
   * @default '折叠'
   */
  expandText?: string;
  /**
   * 是否默认折叠搜索项
   *
   * @default true
   */
  collapse?: boolean;
  /**
   * 超出指定行数后折叠
   *
   * @default 1
   */
  showRow?: number;
  /**
   * 搜索按钮的 loading
   *
   * @default false
   */
  searchLoading?: boolean;
  /**
   * 重置按钮的 loading
   *
   * @default false
   */
  resetLoading?: boolean;
  /**
   * 是否自动去除表单数据的空值项
   *
   * @default true
   */
  removeNoValue?: boolean;
  /**
   * 是否校验表单组件
   *
   * @default true
   */
  validate?: boolean;
}

export type ProSearchEmits = {
  search: [params: Record<string, any>]; // 搜索方法
  reset: [params: Record<string, any>]; // 重置方法
  register: [expose: ProSearchExpose]; // 注册方法
  validate: [prop: FormItemProp, isValid: boolean, message: string]; // ElForm 触发验证事件
};

/**
 * 将 ProSearchEmits 类型的 key 变为 on{Key} 的形式
 *
 * @example 返回 { onSearch: (params: Record<string, any>) => void }
 */
export type ProSearchOnEmits = keyOnPrefix<ProSearchEmits>;

/**
 * ProSearch 组件实例
 */
export type ProSearchInstance = Omit<
  InstanceType<typeof ProSearch>,
  keyof ComponentPublicInstance | keyof ProSearchColumnProps
> & { $parent?: ComponentPublicInstance | null };
