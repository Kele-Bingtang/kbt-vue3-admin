<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名（任意）" :prefix-icon="User"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        placeholder="密码（任意）"
        show-password
        autocomplete="new-password"
        :prefix-icon="Lock"
      ></el-input>
    </el-form-item>
    <el-form-item prop="verifyCode">
      <el-input clearable v-model="loginForm.verifyCode" placeholder="验证码" :prefix-icon="WarnTriangleFilled">
        <template #append>
          <ImageVerifyCode v-model:code="imgCode" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <div :class="`${prefixClass}__item`">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-button link type="primary" @click="handleForgetPwd">忘记密码?</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <div :class="`${prefixClass}__btn`">
        <el-button :icon="CircleClose" round @click="resetForm()" size="large">重置</el-button>
        <el-button :icon="UserFilled" round @click="startLogin()" size="large" type="primary" :loading="loading">
          登录
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <div :class="`${prefixClass}__item`">
        <el-button v-for="(item, index) in operates" :key="index" @click="switchFormMode(item.mode)" size="default">
          {{ item.title }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-divider>第三方登录</el-divider>
      <div :class="`${prefixClass}__third--item`">
        <span v-for="(item, index) in thirdParty" :key="index" :title="item.title">
          <Icon :name="item.icon" width="20" height="20" />
        </span>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="LoginForm">
import { useRouter } from "vue-router";
import { ElNotification, type FormInstance } from "element-plus";
import { useUserStore } from "@/stores";
import { getTimeState } from "@/utils";
import settings from "@/config/settings";
import { ImageVerifyCode } from "@/components";
import { HOME_URL } from "@/router/routesConfig";
import { useRoutes } from "@/hooks";
import { User, Lock, WarnTriangleFilled, CircleClose, UserFilled } from "@element-plus/icons-vue";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("login");

interface LoginForm {
  username: string;
  password: string;
  verifyCode: string;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { initDynamicRouters } = useRoutes();
const switchFormMode = inject("switchFormMode") as (mode: string) => {};

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verifyCode: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value === "") {
          callback(new Error("请输入验证码"));
        } else if (imgCode.value !== value) {
          callback(new Error("请输入正确的验证码"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};
const operates = [
  {
    title: "手机登录",
    mode: "phone",
  },
  {
    title: "二维码登录登录",
    mode: "qrCode",
  },
  {
    title: "注册登录",
    mode: "register",
  },
];
const thirdParty = [
  {
    title: "微信登录",
    icon: "wechat",
  },
  {
    title: "QQ登录",
    icon: "qq",
  },
  {
    title: "支付宝登录",
    icon: "alipay",
  },
  {
    title: "微博登录",
    icon: "weibo",
  },
];

const loginFormRef = shallowRef<FormInstance>();

const imgCode = ref("");
const loading = ref(false);
const loginForm = reactive<LoginForm>({ username: "", password: "", verifyCode: "" });
const checked = ref(false);

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: any) => {
    e = window.event || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      startLogin();
    }
  };
});

const handleForgetPwd = () => {
  switchFormMode("forget");
};

const startLogin = () => {
  loginFormRef.value?.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 执行登录
      const result = await userStore.login({ ...loginForm });
      if (!result) {
        ElNotification({
          title: getTimeState(),
          message: "登录失败，用户名或密码错误",
          type: "success",
          duration: 3000,
        });
        return;
      }
      // 加载动态路由
      await initDynamicRouters();

      // 跳转到首页或者 URL 携带的 redirect 页（优先级高）
      let path = HOME_URL;
      const { query } = route;
      if (query.redirect) path = query.redirect as string;
      const otherQuery = getOtherQuery(query);
      // otherQuery 不能是 {}，否则无法跳转
      if (Object.keys(otherQuery).length === 0) router.push(path);
      else router.push({ path, query: otherQuery });
      ElNotification({
        title: `欢迎登录 ${settings.title}`,
        message: getTimeState(),
        type: "success",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  });
};

const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
};

// resetForm
const resetForm = () => {
  loginFormRef.value?.resetFields();
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
