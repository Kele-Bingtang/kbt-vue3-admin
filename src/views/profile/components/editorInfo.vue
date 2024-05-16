<template>
  <el-form ref="formRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="user.username" maxlength="30" />
    </el-form-item>
    <el-form-item label="联系方式" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="用户性别">
      <el-radio-group v-model="user.sex">
        <el-radio value="男">男</el-radio>
        <el-radio value="女">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(formRef)">保存</el-button>
      <el-button type="danger" @click="reset(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="EditorInfo">
import { useUserStore, type UserInfo } from "@/stores";
import { ElMessage, type FormInstance } from "element-plus";

const props = defineProps<{ user: UserInfo }>();

const { user } = toRefs(props);
const emit = defineEmits(["reset-user"]);
const userStore = useUserStore();
const formRef = ref();
const rules = {
  username: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "联系方式不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的联系方式",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
  ],
} as any;

const submit = (formRef: FormInstance) => {
  formRef.validate(valid => {
    if (valid) {
      userStore.setUserInfo({ ...user.value });
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      formRef.clearValidate();
    }
  });
};
const reset = (formRef: FormInstance) => {
  formRef.clearValidate();
  emit("reset-user");
};
</script>
