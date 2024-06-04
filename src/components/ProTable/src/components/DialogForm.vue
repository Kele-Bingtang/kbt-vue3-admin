<template>
  <WorkDialog v-model="dialogFormVisible" destroy-on-close draggable v-bind="dialog" :title="dialogTitle">
    <slot name="form">
      <ProForm
        v-if="formProps.schema"
        ref="formElementRef"
        v-bind="{ ...$attrs, ...formProps }"
        v-model="model"
        :schema="newSchema"
        :includeModelKeys="
          formProps.includeModelKeys?.length ? [...formProps.includeModelKeys, ...[id || 'id']] : [id || 'id']
        "
      >
        <template #footer v-if="$slots.formFooter">
          <slot name="formFooter" v-bind="model"></slot>
        </template>

        <template #operation v-if="$slots.formOperation">
          <slot name="formOperation" v-bind="model"></slot>
        </template>
      </ProForm>
    </slot>

    <template #header="scope" v-if="$slots.dialogHeader">
      <slot name="dialogHeader" v-bind="{ ...model, ...scope }"></slot>
    </template>

    <template #footer>
      <slot name="dialogFooter" v-bind="model">
        <el-button @click="dialogFormVisible = !dialogFormVisible">取消</el-button>
        <el-button type="primary" @click="handleFormConfirm(model, status)">保存</el-button>
      </slot>
    </template>
  </WorkDialog>
</template>

<script setup lang="ts">
import { ElButton, type DialogProps, ElMessage, type FormInstance, ElMessageBox } from "element-plus";
import { ProForm, WorkDialog, type ProFormProps, type FormSchemaProps, type ProFormInstance } from "@/components";
import { shallowRef, ref, computed, unref } from "vue";
import { deepCloneTableRow } from "../helper";

defineOptions({ name: "DialogForm" });

export type DialogStatus = "" | "edit" | "add" | "read";

export interface DialogFormSchemaProps<T = any> extends Omit<FormSchemaProps<T>, "destroy" | "hidden" | "disabled"> {
  destroy?: Array<"add" | "edit"> | boolean; // 是否销毁表单，类似于 v-if
  hidden?: Array<"add" | "edit"> | boolean; // 是否隐藏表单，类似于 v-show
  disabled?: Array<"add" | "edit"> | boolean; // 是否禁用表单
}

export interface DialogFormProps<T = any> {
  formProps: Omit<ProFormProps, "schema"> & { schema?: DialogFormSchemaProps<T>[] };
  dialog: Partial<
    Omit<DialogProps, "modelValue" | "title"> & {
      title: string | ((form: any, status: DialogStatus) => string);
      fullscreen: boolean;
      height: string | number;
    }
  >; // el-dialog 配置项
  id?: string; // 数据主键。编辑时必传，默认 id
  cache?: boolean; // 是否缓存新增、编辑后遗留的数据
  addApi?: (params: any) => Promise<any>; // 新增接口
  addCarryParams?: Record<string, any>; // 新增时，额外添加的函数
  addFilterKeys?: string[]; // 新增时，过滤的参数
  editApi?: (params: any) => Promise<any>; // 编辑接口
  editCarryParams?: Record<string, any>; // 编辑时，额外添加的参数
  editFilterKeys?: string[]; // 编辑时，过滤的参数
  removeApi?: (params: any) => Promise<any>; // 删除接口
  removeCarryParams?: Record<string, any>; // 删除时，额外添加的参数
  removeFilterKeys?: string[]; // 删除时，过滤的参数
  removeBatchCarryParams?: Record<string, any>; // 批量删除时，额外添加的参数
  removeBatchFilterKeys?: string[]; // 批量删除时，过滤的参数
  removeBatchApi?: (params: any) => Promise<any>; // 批量删除接口
  apiFilterKeys?: string[]; // 新增、编辑、删除时，过滤的参数
  apiCarryParams?: string[]; // 新增、编辑、删除时，额外添加的参数
  clickAdd?: (model: Record<string, any>) => void | Promise<any> | any; // 点击新增按钮回调
  clickEdit?: (model: Record<string, any>) => void | Promise<any> | any; // 点击编辑按钮回调
  beforeAdd?: (model: Record<string, any>) => void | Promise<any> | any; // 新增前回调
  afterAdd?: (model: Record<string, any>, result: any) => void; // 新增后回调
  beforeEdit?: (model: Record<string, any>) => void | Promise<any> | any; // 编辑前回调
  afterEdit?: (model: Record<string, any>, result: any) => void; // 编辑后回调
  beforeRemove?: (model: Record<string, any>) => void | Promise<any> | any; // 删除前回调
  afterRemove?: (model: Record<string, any>, result: any) => void; // 删除后回调
  beforeRemoveBatch?: (model: Record<string, any>) => void | Promise<any> | any; // 批量删除前回调
  afterRemoveBatch?: (model: Record<string, any>, result: any) => void; // 批量删除后回调
  beforeConfirm?: (status: string) => void; // 确定按钮触发前回调
  afterConfirm?: (status: string, result: any) => void; // 确定按钮触发后回调
  disableAdd?: boolean; // 禁用新增按钮
  disableEdit?: boolean; // 禁用编辑按钮
  disableRemove?: boolean; // 禁用删除按钮
  disableRemoveBatch?: boolean; // 禁用批量删除按钮
  useAdd?: boolean; // 使用新增按钮
  useEdit?: boolean; // 使用编辑按钮
  useRemove?: boolean; // 使用删除按钮
  useRemoveBatch?: boolean; // 使用批量删除按钮
}

const props = defineProps<DialogFormProps>();
const formElementRef = shallowRef<ProFormInstance>();
const dialogFormVisible = ref(false);

// 表单
const model = ref<Record<string, any>>({});
const status = ref<DialogStatus>("");

/**
 * Dialog 标题
 */
const dialogTitle = computed(() =>
  typeof props?.dialog?.title === "function" ? props?.dialog?.title(unref(model), unref(status)) : props?.dialog?.title
);

/**
 * 表单配置项
 */
const newSchema = computed((): FormSchemaProps[] | undefined => {
  // 目前 status 一变化，都走一遍循环，优化：可以利用 Map 存储有 show 的 column（存下标），然后监听 status，当 status 变化，则通过下标获取 column，将 hidden 设置为 true
  props.formProps.schema?.forEach(column => {
    if (!column) return;
    const { destroy, hidden, disabled } = column;

    if (Array.isArray(destroy)) {
      if (destroy.includes("add")) (column.destroy as boolean) = status.value === "add";
      else if (destroy.includes("edit")) (column.destroy as boolean) = status.value === "edit";
    }
    if (Array.isArray(hidden)) {
      if (hidden.includes("add")) (column.hidden as boolean) = status.value === "add";
      else if (hidden.includes("edit")) (column.hidden as boolean) = status.value === "edit";
    }

    if (Array.isArray(disabled)) {
      if (disabled.includes("add")) (column.disabled as boolean) = status.value === "add";
      else if (disabled.includes("edit")) (column.disabled as boolean) = status.value === "edit";
    }
  });

  return props.formProps?.schema as FormSchemaProps[];
});

/**
 * 触发新增事件
 */
const handleAdd = async () => {
  const { cache, id = "id", clickAdd } = props;

  status.value = "add";
  if (!cache) model.value = {};
  else id && delete unref(model)[id];
  clickAdd && (model.value = (await clickAdd(unref(model))) ?? unref(model));
  dialogFormVisible.value = true;
};

/**
 * 触发编辑事件
 */
const handleEdit = async ({ row }: any) => {
  const { clickEdit } = props;

  status.value = "edit";
  model.value = deepCloneTableRow(row);
  clickEdit && (model.value = (await clickEdit(unref(model))) ?? unref(model));
  dialogFormVisible.value = true;
};

/**
 * 点击保存事件
 */
const handleFormConfirm = (data: any, status: DialogStatus) => {
  const { beforeConfirm } = props;

  beforeConfirm && beforeConfirm(status);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  if (status === "add") handleDoAdd(data);
  else if (status === "edit") handleDoEdit(data);
};

/**
 * 执行新增事件
 */
const handleDoAdd = (data: any) => {
  const formRef = unref(formElementRef)?.form as FormInstance;

  formRef.validate(async valid => {
    if (valid) {
      const {
        beforeAdd,
        apiFilterKeys,
        addFilterKeys,
        addApi,
        apiCarryParams,
        addCarryParams,
        afterAdd,
        cache,
        afterConfirm,
      } = props;

      data = (beforeAdd && (await beforeAdd(data))) || data;

      // 删除 Add 不允许传输的数据
      const filterParams = [...(apiFilterKeys || []), ...(addFilterKeys || [])];
      filterParams.forEach(item => delete data[item]);

      // 执行新增接口
      executeApi(
        addApi,
        { ...apiCarryParams, ...addCarryParams, ...data },
        "添加成功！",
        "添加失败！",
        async res => {
          afterAdd && (await afterAdd({ ...addCarryParams, data }, res));
          if (!cache) model.value = {};
          dialogFormVisible.value = false;
          afterConfirm && afterConfirm(unref(status), true);
        },
        () => afterConfirm && afterConfirm(unref(status), false)
      );
    }
  });
};

/**
 * 执行编辑事件
 */
const handleDoEdit = (data: any) => {
  const formRef = unref(formElementRef)?.form as FormInstance;

  formRef.validate(async valid => {
    if (valid) {
      const {
        beforeEdit,
        apiFilterKeys,
        editFilterKeys,
        editApi,
        apiCarryParams,
        editCarryParams,
        afterEdit,
        cache,
        afterConfirm,
      } = props;

      data = (beforeEdit && (await beforeEdit(data))) || data;

      // 删除 Update 不允许传输的数据
      const filterParams = [...(apiFilterKeys || []), ...(editFilterKeys || [])];
      filterParams.forEach(item => delete data[item]);

      executeApi(
        editApi,
        { ...apiCarryParams, ...editCarryParams, ...data },
        "编辑成功！",
        "编辑失败！",
        async res => {
          afterEdit && (await afterEdit({ ...editCarryParams, data }, res));
          if (!cache) model.value = {};
          dialogFormVisible.value = false;
          // 回调
          afterConfirm && afterConfirm(unref(status), res);
        },
        () => afterConfirm && afterConfirm(unref(status), false)
      );
    }
  });
};

/**
 * 执行删除事件
 */
const handleRemove = async ({ row }: any) => {
  let data = deepCloneTableRow(row);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  const {
    beforeConfirm,
    beforeRemove,
    apiFilterKeys,
    removeFilterKeys,
    removeApi,
    apiCarryParams,
    removeCarryParams,
    afterRemove,
    cache,
    afterConfirm,
  } = props;

  beforeConfirm && beforeConfirm("remove");
  data = (beforeRemove && (await beforeRemove(data))) || data;

  // 删除 Remove 不允许传输的数据
  const filterParams = [...(apiFilterKeys || []), ...(removeFilterKeys || [])];
  filterParams.forEach(item => delete data[item]);

  executeApi(
    removeApi,
    { ...apiCarryParams, ...removeCarryParams, ...data },
    "删除成功！",
    "删除失败！",
    async res => {
      afterRemove && (await afterRemove(model, res));
      if (!cache) model.value = {};
      afterConfirm && afterConfirm(unref(status), res);
    },
    () => afterConfirm && afterConfirm(unref(status), false)
  );
};

/**
 * 执行批量删除事件
 */
const handleRemoveBatch = async (selectedListIds: string[], selectedList: any, fallback: () => void) => {
  ElMessageBox.confirm(`删除所选信息?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  }).then(async () => {
    let data = { idList: selectedListIds, dataList: selectedList };

    const {
      beforeConfirm,
      beforeRemoveBatch,
      apiFilterKeys,
      removeBatchFilterKeys,
      removeBatchApi,
      apiCarryParams,
      removeBatchCarryParams,
      afterRemoveBatch,
      cache,
      afterConfirm,
    } = props;

    beforeConfirm && beforeConfirm("deleteBatch");
    data = (beforeRemoveBatch && (await beforeRemoveBatch(data))) || data;

    // 删除 Remove 不允许传输的数据
    const filterParams = [...(apiFilterKeys || []), ...(removeBatchFilterKeys || [])];
    filterParams.forEach(item => delete data[item]);

    executeApi(
      removeBatchApi,
      { ...apiCarryParams, ...removeBatchCarryParams, ...data },
      "删除成功！",
      "删除失败！",
      async res => {
        afterRemoveBatch && (await afterRemoveBatch(model, res));
        if (!cache) model.value = {};
        afterConfirm && afterConfirm(unref(status), res);
        fallback();
      },
      () => afterConfirm && afterConfirm(unref(status), false)
    );
  });
};

const executeApi = (
  api: undefined | ((params: any) => Promise<any>),
  params: any,
  success: string,
  failure: string,
  successCallBack?: (res: any) => void,
  failureCallBack?: (res: any) => void
) => {
  if (!api) return ElMessage.warning({ message: `${failure}没有提供对应接口`, plain: true });
  api(params)
    .then(res => {
      ElMessage.success({ message: success, plain: true });
      return successCallBack && successCallBack(res);
    })
    .catch(err => {
      return failureCallBack && failureCallBack(err);
    });
};

defineExpose({ handleAdd, handleEdit, handleRemove, handleRemoveBatch });
</script>
