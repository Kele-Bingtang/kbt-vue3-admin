<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="menu 1-3" type="success">
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </el-alert>
  </div>
</template>

<script setup lang="ts" name="Menu1-3"></script>

<style lang="scss" scoped></style>
