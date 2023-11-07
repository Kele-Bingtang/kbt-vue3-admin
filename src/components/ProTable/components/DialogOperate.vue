<template>
  <el-dialog v-model="dialogFormVisible" v-bind="dialog" :title="dialogTitle">
    <slot name="form">
      <ProForm v-if="options" ref="formElement" :options="options" v-model="form">
        <template #footer>
          <slot name="formFooter" v-bind="form"></slot>
        </template>

        <template #operation>
          <div style="width: 100%; text-align: right">
            <el-button @click="dialogFormVisible = !dialogFormVisible">取消</el-button>
            <el-button type="primary" @click="handleFormConfirm(form, status)">保存</el-button>
          </div>
        </template>
      </ProForm>
    </slot>

    <template #footer v-if="$slots.dialogFooter">
      <slot name="dialogFooter" v-bind="form"></slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="DialogOperate">
import { type DialogProps, ElMessage, type FormInstance } from "element-plus";
import ProForm from "@/components/ProForm/index.vue";
import type { OptionsProps } from "@/components/ProForm/interface";

export type DialogStatus = "" | "edit" | "add" | "read";

export interface DialogFormProps {
  options: OptionsProps; // 表单配置项
  dialog: Partial<
    Omit<DialogProps, "modelValue" | "title"> & { title: string | ((form: any, status: DialogStatus) => string) }
  >; // el-dialog 配置项
  addApi?: (params: any) => Promise<any>; // 新增接口
  addCarryParams?: any; // 额外添加的函数
  addFilterParams?: string[]; // 过滤走的参数
  editApi?: (params: any) => Promise<any>; // 编辑接口
  editCarryParams?: any;
  editFilterParams?: string[];
  deleteApi?: (params: any) => Promise<any>; // 删除接口
  deleteCarryParams?: any;
  deleteFilterParams?: string[];
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
  beforeConfirm?: (status: string) => void; // 确定按钮触发前回调
  afterConfirm?: (result: boolean) => void; // 确定按钮触发后回调
}

const props = defineProps<DialogFormProps>();
const formElement = shallowRef();
const dialogFormVisible = ref(false);

// 表单
const form = ref({});
const status = ref<DialogStatus>("");

const dialogTitle = computed(() =>
  typeof props?.dialog?.title === "function" ? props?.dialog?.title(form.value, status.value) : props?.dialog?.title
);

const handleAdd = async () => {
  status.value = "add";
  if (!props?.cache) form.value = {};
  else props?.id && delete (form.value as any)[props?.id!];
  props.clickAdd && (form.value = (await props.clickAdd(form.value)) ?? form.value);
  dialogFormVisible.value = true;
};

const handleEdit = async ({ row }: any) => {
  status.value = "edit";
  form.value = { ...row };
  props.clickEdit && (form.value = (await props.clickEdit(form.value)) ?? form.value);
  dialogFormVisible.value = true;
};

const handleFormConfirm = (f: any, status: string) => {
  const formRef = formElement.value.formRef as FormInstance;
  props.beforeConfirm && props.beforeConfirm(status);

  let data = { ...f };
  if (status === "add") {
    // 删除 Insert 不允许传输的数据
    const filterParams = [...(props?.apiFilterParams || []), ...(props?.addFilterParams || [])];
    filterParams.forEach(item => delete data[item]);

    formRef.validate(async valid => {
      if (valid && props) {
        data = (props.beforeAdd && (await props.beforeAdd(data))) || data;

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
    // 删除 Update 不允许传输的数据
    const filterParams = [...(props?.apiFilterParams || []), ...(props?.editFilterParams || [])];
    filterParams.forEach(item => delete data[item]);

    formRef.validate(async valid => {
      if (valid && props) {
        data = (props.beforeEdit && (await props.beforeEdit(data))) || data;

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
    let data = { ...row };

    // 删除 Delete 不允许传输的数据
    const filterParams = [...(props?.apiFilterParams || []), ...(props?.deleteFilterParams || [])];
    filterParams.forEach(item => delete data[item]);
    props.beforeConfirm && props.beforeConfirm("delete");
    data = (props.beforeDelete && (await props.beforeDelete(data))) || data;

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
      ElMessage.warning(failure + "错误：", err);
      return failureCallBack && failureCallBack(err);
    });
};

defineExpose({ handleAdd, handleEdit, handleDelete });
</script>
