<template>
  <div class="login-container">
    <SwitchDark class="dark" />
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/images/login/login_left.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.png" alt="" />
          <h2 class="logo-text">{{ settings.title }}</h2>
        </div>
        <component :is="formComponents[formMode]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./loginForm.vue";
import settings from "@/config/settings";
import Phone from "./components/phone.vue";
import QrCode from "./components/qrCode.vue";
import Register from "./components/register.vue";
import Forget from "./components/forget.vue";

const formComponents: { [key: string]: Component } = {
  login: LoginForm,
  phone: Phone,
  qrCode: QrCode,
  register: Register,
  forget: Forget,
};

const formMode = ref("login");

const switchFormMode = (mode: string) => {
  formMode.value = mode;
};

provide("switchFormMode", switchFormMode);
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
