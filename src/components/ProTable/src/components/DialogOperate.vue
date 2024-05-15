<template>
  <el-dialog v-model="dialogFormVisible" destroy-on-close draggable v-bind="dialog" :title="dialogTitle">
    <slot name="form">
      <ProForm v-if="options" ref="formElementRef" :options="formOptions" v-model="form">
        <template #footer v-if="$slots.formFooter">
          <slot name="formFooter" v-bind="form"></slot>
        </template>

        <template #operation v-if="$slots.formOperation">
          <slot name="formOperation" v-bind="form"></slot>
        </template>
      </ProForm>
    </slot>

    <template #header="scope" v-if="$slots.dialogHeader">
      <slot name="dialogHeader" v-bind="{ ...form, ...scope }"></slot>
    </template>

    <template #footer>
      <slot name="dialogFooter" v-bind="form">
        <el-button @click="dialogFormVisible = !dialogFormVisible">取消</el-button>
        <el-button type="primary" @click="handleFormConfirm(form, status)">保存</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { type DialogProps, ElMessage, type FormInstance, ElMessageBox } from "element-plus";
import { ProForm, type FormOptionsProps } from "@/components";
import { shallowRef, ref, computed, defineOptions, defineProps } from "vue";
import { deepCloneTableRow } from "../utils";

defineOptions({ name: "DialogOperate" });

export type DialogStatus = "" | "edit" | "add" | "read";

export interface DialogFormProps {
  options: FormOptionsProps; // 表单配置项
  dialog: Partial<
    Omit<DialogProps, "modelValue" | "title"> & { title: string | ((form: any, status: DialogStatus) => string) }
  >; // el-dialog 配置项
  addApi?: (params: any) => Promise<any>; // 新增接口
  addCarryParams?: any; // 额外添加的函数, valueEquals
  addFilterParams?: string[]; // 过滤走的参数
  editApi?: (params: any) => Promise<any>; // 编辑接口
  editCarryParams?: any;
  editFilterParams?: string[];
  deleteApi?: (params: any) => Promise<any>; // 删除接口
  deleteCarryParams?: any;
  deleteFilterParams?: string[];
  deleteBatchApi?: (params: any) => Promise<any>; // 批量删除接口
  apiFilterParams?: string[];
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
const form = ref({});
const status = ref<DialogStatus>("");

const dialogTitle = computed(() =>
  typeof props?.dialog?.title === "function" ? props?.dialog?.title(form.value, status.value) : props?.dialog?.title
);

const formOptions = computed(() => {
  // 目前 status 一变化，都走一遍循环，优化：可以利用 Map 存储有 show 的 column（存下标），然后监听 status，当 status 变化，则通过下标获取 column，将 isHidden 设置为 true
  props.options.columns.forEach(column => {
    if (!column.attrs) return;
    const { destroy, hidden, disabled } = column.attrs;

    if (Array.isArray(destroy)) {
      if (destroy.includes("add")) column.attrs.isDestroy = status.value === "add";
      else if (destroy.includes("edit")) column.attrs.isDestroy = status.value === "edit";
    }
    if (Array.isArray(hidden)) {
      if (hidden.includes("add")) column.attrs.isHidden = status.value === "add";
      else if (hidden.includes("edit")) column.attrs.isHidden = status.value === "edit";
    }

    if (Array.isArray(disabled)) {
      if (disabled.includes("add")) column.attrs.isDisabled = status.value === "add";
      else if (disabled.includes("edit")) column.attrs.isDisabled = status.value === "edit";
    }
  });

  return props.options;
});

const handleAdd = async () => {
  status.value = "add";
  if (!props?.cache) form.value = {};
  else props?.id && delete (form.value as any)[props?.id!];
  props.clickAdd && (form.value = (await props.clickAdd(form.value)) ?? form.value);
  dialogFormVisible.value = true;
};

const handleEdit = async ({ row }: any) => {
  status.value = "edit";
  form.value = deepCloneTableRow(row);
  props.clickEdit && (form.value = (await props.clickEdit(form.value)) ?? form.value);
  dialogFormVisible.value = true;
};

const handleFormConfirm = (data: any, status: string) => {
  const formRef = formElementRef.value.formRef as FormInstance;
  props.beforeConfirm && props.beforeConfirm(status);

  // _enum 是 ProTable 内置的属性，专门存储字典数据，不需要发送给后台
  delete data._enum;

  if (status === "add") {
    formRef.validate(async valid => {
      if (valid && props) {
        data = (props.beforeAdd && (await props.beforeAdd(data))) || data;

        // 删除 Insert 不允许传输的数据
        const filterParams = [...(props?.apiFilterParams || []), ...(props?.addFilterParams || [])];
        filterParams.forEach(item => delete data[item]);

        // 执行新增接口
        executeApi(
          props.addApi,
          { ...props.addCarryParams, ...data },
          "添加成功！",
          "添加失败！",
          async res => {
            props.afterAdd && (await props.afterAdd({ ...props.addCarryParams, data }, res));
            if (!props.cache) form.value = {};
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
        const filterParams = [...(props?.apiFilterParams || []), ...(props?.editFilterParams || [])];
        filterParams.forEach(item => delete data[item]);

        executeApi(
          props.editApi,
          { ...props.editCarryParams, ...data },
          "编辑成功！",
          "编辑失败！",
          async res => {
            props.afterEdit && (await props.afterEdit({ ...props.editCarryParams, data }, res));
            if (!props.cache) form.value = {};
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
    const filterParams = [...(props?.apiFilterParams || []), ...(props?.deleteFilterParams || [])];
    filterParams.forEach(item => delete data[item]);

    executeApi(
      props.deleteApi,
      { ...props.deleteCarryParams, ...data },
      "删除成功！",
      "删除失败！",
      async res => {
        props.afterDelete && (await props.afterDelete(form, res));
        if (props.cache) form.value = {};
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
          props.afterDeleteBatch && (await props.afterDeleteBatch(form, res));
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
      // ElMessage.warning(failure + "错误：", err);
      return failureCallBack && failureCallBack(err);
    });
};

defineExpose({ handleAdd, handleEdit, handleDelete, handleDeleteBatch });
</script>
