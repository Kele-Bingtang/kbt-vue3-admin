<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="phoneRules" size="large">
    <el-form-item prop="phone">
      <el-input clearable v-model="ruleForm.phone" placeholder="手机号码" prefix-icon="Phone" />
    </el-form-item>
    <el-form-item prop="verifyCode">
      <div style="display: flex; justify-content: space-between; width: 100%">
        <el-input clearable v-model="ruleForm.verifyCode" placeholder="请输入验证码" prefix-icon="WarnTriangleFilled" />
        <el-button :disabled="isDisabled" @click="useVerifyCode().start(ruleFormRef, 'phone')">
          {{ text.length > 0 ? text + " 秒后重新获取" : "获取验证码" }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <div class="login-btn">
        <el-button icon="UserFilled" round @click="onLogin(ruleFormRef)" size="large" type="primary" :loading="loading">
          登录
        </el-button>
        <el-button icon="CircleClose" round @click="onBack" size="large">返回</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="Phone">
import { ElMessage, type FormInstance } from "element-plus";
import { useVerifyCode } from "../verifyCode";
import { phoneRules } from "../rules";

const loading = ref(false);
const ruleForm = reactive({
  phone: "",
  verifyCode: "",
});
const ruleFormRef = shallowRef<FormInstance>();
const { isDisabled, text } = useVerifyCode();
const switchFormMode = inject("switchFormMode") as (mode: string) => {};

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 模拟登录请求，需根据实际开发进行修改
      setTimeout(() => {
        ElMessage.success("登录成功");
        loading.value = false;
      }, 2000);
    } else {
      loading.value = false;
      return fields;
    }
  });
};

const onBack = () => {
  useVerifyCode().end();
  switchFormMode("login");
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
