<template>
  <div :class="prefixClass">
    <SwitchDark class="dark" />
    <div :class="`${prefixClass}__box`">
      <div :class="`${prefixClass}__box--left`">
        <img src="@/assets/images/login/login_left.png" alt="login" />
      </div>
      <div :class="`${prefixClass}__box__form`">
        <div :class="`${prefixClass}__box__form--logo`">
          <img :class="`${prefixClass}__box__form--logo__img`" src="@/assets/images/logo.png" alt="" />
          <h2 :class="`${prefixClass}__box__form--logo__text`">{{ settings.title }}</h2>
        </div>
        <component :is="formComponents[formMode]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Login">
import { SwitchDark } from "@/components";
import LoginForm from "./loginForm.vue";
import settings from "@/config/settings";
import Phone from "./components/phone.vue";
import QrCode from "./components/qrCode.vue";
import Register from "./components/register.vue";
import Forget from "./components/forget.vue";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("login");

const formComponents: Record<string, Component> = {
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
@use "./index";
</style>
