import type { ColProps, FormProps } from "element-plus";
import type { ComputedRef, ComponentPublicInstance, InjectionKey, Ref } from "vue";
import type { FormItemColumn, BaseValueType } from "@/components/pro/form-item";
import type { ProFormProps } from "./index.vue";
import ProForm from "./index.vue";

export interface ProElFormProps extends Partial<FormProps> {
  fixWidth?: boolean;
  width?: number | string;
}

/**
 * setSchema 函数的参数类型
 */
export interface FormSetProps {
  prop: string;
  field: string;
  value: BaseValueType;
}

/**
 * ProForm 表单配置项
 */
export interface FormColumn extends FormItemColumn {
  /**
   * ElCol Props
   */
  colProps?: MaybeRef<Partial<ColProps>>;
  /**
   * 表单属性的默认值
   */
  defaultValue?:
    | BaseValueType
    | ((model: Recordable, optionsMap: Map<string, Recordable>) => BaseValueType | Promise<BaseValueType>)
    | ComputedRef<BaseValueType>
    | Promise<BaseValueType>;
  /**
   * 表单排序（从大到小）
   */
  order?: number;
  /**
   * 是否销毁表单，true 销毁，false 不销毁，类似于 v-if
   * @default false
   */
  destroy?: boolean | ((model: Recordable) => boolean);
  /**
   * 是否隐藏表单，true 隐藏，false 不隐藏，类似于 v-show
   * @default false
   */
  hidden?: boolean | ((model: Recordable) => boolean);
  /**
   * 是否禁用表单，true 禁用，false 不禁用
   * @default false
   */
  disabled?: boolean | ((model: Recordable) => boolean);
  /**
   * 表单绑定的值格式，针对 Enum Value 是 string "1"，而值是 number 1 导致编辑时无法匹配问题
   * @default default
   */
  valueFormat?: "default" | "string" | "number" | "boolean";
  /**
   * 是否使用已缓存 Options 数据，防止重复请求
   * @default true
   */
  useCacheOptions?: boolean;
  /**
   * 指定 Options 的 key，如果设置了则优先从缓存获取对于 key 的 Options 数据
   */
  optionsProp?: string;
  /**
   * 自定义 render 时候，需要填写 render 里表单组件使用 v-model 绑定的 prop
   */
  renderUseProp?: string[];
  /**
   * 其他拓展
   */
  [key: string]: any;
}

export type ProFormInstance = Omit<InstanceType<typeof ProForm>, keyof ComponentPublicInstance | keyof ProFormProps>;

/**
 * provide 类型
 */
export const formEnumMapKey: InjectionKey<Ref<Map<string, Recordable[]>>> = Symbol("enumMap");
