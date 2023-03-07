<template>
  <div class="login-container flx-center">
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
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
import settings from "@/config/settings";
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
