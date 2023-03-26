<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="font-medium">
          二维码（基于
          <el-link
            href="https://github.com/soldair/node-qrcode"
            target="_blank"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            qrcode
          </el-link>
          生成）
        </div>
      </template>
      <el-row :gutter="20" justify="space-between">
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">基础用法</div>
            <QrCode :text="qrCodeText" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">img标签</div>
            <QrCode :text="qrCodeText" tag="img" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">样式配置</div>
            <QrCode
              :text="qrCodeText"
              :options="{
                color: {
                  dark: '#55D187',
                  light: '#2d8cf0',
                },
              }"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">点击事件</div>
            <QrCode :text="qrCodeText" @click="codeClick" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">异步内容</div>
            <QrCode :text="asyncTitle" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">失效</div>
            <QrCode :text="qrCodeText" disabled @disabled-click="disabledClick" />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">logo配置</div>
            <QrCode
              :text="qrCodeText"
              logo="https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">logo样式</div>
            <QrCode
              :text="qrCodeText"
              :logo="{
                src: 'https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png',
                logoSize: 0.2,
                borderSize: 0.05,
                borderRadius: 50,
                bgColor: 'blue',
              }"
            />
          </el-card>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
          <el-card shadow="hover" class="mb-[10px] text-center">
            <div class="font-bold">大小配置</div>
            <QrCode :text="qrCodeText" :width="100" />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="QrCodeDemo">
import { ref, unref } from "vue";
import { message } from "@/utils/layout/message";
import QrCode from "@/components/QrCode/index.vue";

const qrCodeText = "kbt-vue3-admin";

const asyncTitle = ref("");
setTimeout(() => {
  asyncTitle.value = unref(qrCodeText);
}, 3000);
const codeClick = () => {
  message("点击事件", { type: "info" });
};
const disabledClick = () => {
  message("失效", { type: "info" });
};
</script>
