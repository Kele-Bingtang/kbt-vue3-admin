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
import { ProForm, WorkDialog, type ProFormProps, type FormSchemaProps } from "@/components";
import { shallowRef, ref, computed } from "vue";
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
  addApi?: (params: Record<string, any>) => Promise<any>; // 新增接口
  addCarryParams?: Record<string, any>; // 新增时，额外添加的函数
  addFilterKeys?: string[]; // 新增时，过滤的参数
  editApi?: (params: Record<string, any>) => Promise<any>; // 编辑接口
  editCarryParams?: Record<string, any>; // 编辑时，额外添加的参数
  editFilterKeys?: string[]; // 编辑时，过滤的参数
  deleteApi?: (params: Record<string, any>) => Promise<any>; // 删除接口
  deleteCarryParams?: Record<string, any>; // 删除时，额外添加的参数
  deleteFilterKeys?: string[]; // 删除时，过滤的参数
  deleteBatchApi?: (params: Record<string, any>) => Promise<any>; // 批量删除接口
  apiFilterKeys?: string[]; // 新增、编辑、删除时，过滤的参数
  apiCarryParams?: string[]; // 新增、编辑、删除时，额外添加的参数
  id?: string; // 数据主键
  cache?: boolean; // 是否缓存新增、编辑后遗留的数据
  clickAdd?: (form: any) => void | Promise<any> | any; // 点击新增按钮回调
  clickEdit?: (form: any) => void | Promise<any> | any; // 点击编辑按钮回调
  beforeAdd?: (form: any) => void | Promise<any> | any; // 新增前回调
  afterAdd?: (form: any, res: any) => void; // 新增后回调
  beforeEdit?: (form: any) => void | Promise<any> | any; // 编辑前回调
  afterEdit?: (form: any, res: any) => void; // 编辑后回调
  beforeDelete?: (form: any) => void | Promise<any> | any; // 删除前回调
  afterDelete?: (form: any, res: any) => void; // 删除后回调
  beforeDeleteBatch?: (form: any) => void | Promise<any> | any; // 批量删除前回调
  afterDeleteBatch?: (form: any, res: any) => void; // 批量删除后回调
  beforeConfirm?: (status: string) => void; // 确定按钮触发前回调
  afterConfirm?: (result: boolean) => void; // 确定按钮触发后回调
  disableAdd?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableDeleteBatch?: boolean;
  useAdd?: boolean;
  useEdit?: boolean;
  useDelete?: boolean;
  useDeleteBatch?: boolean;
}

const props = defineProps<DialogFormProps>();
const formElementRef = shallowRef();
const dialogFormVisible = ref(false);

// 表单
const model = ref({});
const status = ref<DialogStatus>("");

const dialogTitle = computed(() =>
  typeof props?.dialog?.title === "function" ? props?.dialog?.title(unref(model), unref(status)) : props?.dialog?.title
);

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

const handleAdd = async () => {
  status.value = "add";
  if (!props?.cache) model.value = {};
  else props?.id && delete (model.value as Record<string, any>)[props?.id!];
  props.clickAdd && (model.value = (await props.clickAdd(unref(model))) ?? unref(model));
  dialogFormVisible.value = true;
};

const handleEdit = async ({ row }: any) => {
  status.value = "edit";
  model.value = deepCloneTableRow(row);
  props.clickEdit && (model.value = (await props.clickEdit(unref(model))) ?? unref(model));
  dialogFormVisible.value = true;
};

const handleFormConfirm = (data: any, status: string) => {
  const formRef = unref(formElementRef).form as FormInstance;
  props.beforeConfirm && props.beforeConfirm(status);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  if (status === "add") {
    formRef.validate(async valid => {
      if (valid && props) {
        data = (props.beforeAdd && (await props.beforeAdd(data))) || data;

        // 删除 Insert 不允许传输的数据
        const filterParams = [...(props?.apiFilterKeys || []), ...(props?.addFilterKeys || [])];
        filterParams.forEach(item => delete data[item]);

        // 执行新增接口
        executeApi(
          props.addApi,
          { ...props.apiCarryParams, ...props.addCarryParams, ...data },
          "添加成功！",
          "添加失败！",
          async res => {
            props.afterAdd && (await props.afterAdd({ ...props.addCarryParams, data }, res));
            if (!props.cache) model.value = {};
            dialogFormVisible.value = false;
            props.afterConfirm && props.afterConfirm(true);
          },
          () => props.afterConfirm && props.afterConfirm(false)
        );
      }
    });
  } else if (status === "edit") {
    formRef.validate(async valid => {
      if (valid && props) {
        data = (props.beforeEdit && (await props.beforeEdit(data))) || data;

        // 删除 Update 不允许传输的数据
        const filterParams = [...(props?.apiFilterKeys || []), ...(props?.editFilterKeys || [])];
        filterParams.forEach(item => delete data[item]);

        executeApi(
          props.editApi,
          { ...props.apiCarryParams, ...props.editCarryParams, ...data },
          "编辑成功！",
          "编辑失败！",
          async res => {
            props.afterEdit && (await props.afterEdit({ ...props.editCarryParams, data }, res));
            if (!props.cache) model.value = {};
            dialogFormVisible.value = false;
            // 回调
            props.afterConfirm && props.afterConfirm(true);
          },
          () => props.afterConfirm && props.afterConfirm(false)
        );
      }
    });
  }
};

const handleDelete = async ({ row }: any) => {
  if (props) {
    let data = deepCloneTableRow(row);
    // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
    delete data._enum;

    props.beforeConfirm && props.beforeConfirm("delete");
    data = (props.beforeDelete && (await props.beforeDelete(data))) || data;
    // 删除 Delete 不允许传输的数据
    const filterParams = [...(props?.apiFilterKeys || []), ...(props?.deleteFilterKeys || [])];
    filterParams.forEach(item => delete data[item]);

    executeApi(
      props.deleteApi,
      { ...props.apiCarryParams, ...props.deleteCarryParams, ...data },
      "删除成功！",
      "删除失败！",
      async res => {
        props.afterDelete && (await props.afterDelete(model, res));
        if (props.cache) model.value = {};
        props.afterConfirm && props.afterConfirm(true);
      },
      () => props.afterConfirm && props.afterConfirm(false)
    );
  }
};

const handleDeleteBatch = async (selectedListIds: string[], selectedList: any, fallback: () => void) => {
  ElMessageBox.confirm(`删除所选信息?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  }).then(async () => {
    if (props) {
      let data = { idList: selectedListIds, dataList: selectedList };

      props.beforeConfirm && props.beforeConfirm("deleteBatch");
      data = (props.beforeDeleteBatch && (await props.beforeDeleteBatch(data))) || data;

      executeApi(
        props.deleteBatchApi,
        data,
        "删除成功！",
        "删除失败！",
        async res => {
          props.afterDeleteBatch && (await props.afterDeleteBatch(model, res));
          props.afterConfirm && props.afterConfirm(true);
          fallback();
        },
        () => props.afterConfirm && props.afterConfirm(false)
      );
    }
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
  if (!api) return ElMessage.warning(failure + "没有提供对应接口");
  api(params)
    .then(res => {
      ElMessage.success(success);
      return successCallBack && successCallBack(res);
    })
    .catch(err => {
      return failureCallBack && failureCallBack(err);
    });
};

defineExpose({ handleAdd, handleEdit, handleDelete, handleDeleteBatch });
</script>
