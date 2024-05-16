<template>
  <div style="padding: 30px; background-color: #ffffff">
    <el-alert :closable="false" title="menu 1">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-alert>
  </div>
</template>

<script setup lang="ts" name="Menu1"></script>
