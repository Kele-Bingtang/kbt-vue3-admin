<template>
  <div style="padding: 30px; background-color: #fff">
    <el-alert :closable="false" title="menu 1">
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </el-alert>
  </div>
</template>

<script setup lang="ts" name="Menu1"></script>

<style lang="scss" scoped></style>
