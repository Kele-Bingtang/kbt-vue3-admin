<template>
  <div class="animation-mixin-container">
    <el-card class="box-card">
      <template #header>
        <span>按钮</span>
      </template>
      <el-row>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center mixin-col">
          <button class="animation-btn blue-btn">Documentation</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn light-blue-btn">Icons</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn pink-btn">Excel</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn green-btn">Table</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn tiffany-btn">Form</button>
        </el-col>
        <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
          <button class="animation-btn yellow-btn">Theme</button>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>Material Design 的 input</span>
          </template>
          <div style="height: 100px">
            <el-form :model="demo" :rules="demoRules">
              <el-form-item prop="title">
                <MaterialInput v-model:value="demo.title" icon="Search" name="title" placeholder="输入标题">
                  标题
                </MaterialInput>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>水波纹 waves</span>
          </template>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
            <el-button v-waves type="success">水波纹效果</el-button>
            <el-button v-waves type="warning">水波纹效果</el-button>
            <el-button v-waves type="danger" style="margin-top: 10px">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>悬停文本</span>
          </template>
          <div class="component-item">
            <TextHoverEffect init-color="#4dd9d5" hover-color="var(--el-color-primary)" text="kbt-vue-admin" />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <template #header>
            <span>Share</span>
          </template>
          <div class="component-item" style="height: 420px">
            <DropdownMenu :items="articleList" style="margin: 0 auto" title="系列文章" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="AnimationMixin">
import MaterialInput from "@/components/MaterialInput/index.vue";
import TextHoverEffect from "@/components/TextHoverEffect/index.vue";
import DropdownMenu from "@/components/DropdownMenu/index.vue";

const demo = reactive({
  title: "",
});
const validateLength = (rule: any, value: string, callback: Function) => {
  if (value.length !== 6) {
    callback(new Error("请输入六个字符"));
  } else {
    callback();
  }
};

const demoRules = {
  title: [{ validator: validateLength, trigger: "change" }],
};

const articleList = [
  { title: "文章 1", href: "javascript:;" },
  { title: "文章 2", href: "javascript:;" },
  { title: "文章 3", href: "javascript:;" },
  { title: "文章 4", href: "javascript:;" },
  { title: "文章 5", href: "javascript:;" },
  { title: "文章 6", href: "javascript:;" },
];
</script>

<style lang="scss" scoped>
.animation-mixin-container {
  height: 100%;
  .mixin-col {
    margin-bottom: 15px;
  }
  @mixin colorBtn($color) {
    background: $color;

    &:hover {
      color: $color;

      &:before,
      &:after {
        background: $color;
      }
    }
  }

  .blue-btn {
    @include colorBtn($blue);
  }

  .light-blue-btn {
    @include colorBtn($light-blue);
  }

  .red-btn {
    @include colorBtn($red);
  }

  .pink-btn {
    @include colorBtn($pink);
  }

  .green-btn {
    @include colorBtn($green);
  }

  .tiffany-btn {
    @include colorBtn($tiffany);
  }

  .yellow-btn {
    @include colorBtn($yellow);
  }

  .animation-btn {
    font-size: 14px;
    color: #fff;
    padding: 14px 36px;
    border-radius: 8px;
    border: none;
    outline: none;
    transition: 600ms ease all;
    position: relative;
    display: inline-block;

    &:hover {
      background: #fff;

      &:before,
      &:after {
        width: 100%;
        transition: 600ms ease all;
      }
    }

    &:before,
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      height: 2px;
      width: 0;
      transition: 400ms ease all;
    }

    &::after {
      right: inherit;
      top: inherit;
      left: 0;
      bottom: 0;
    }
  }

  .component-item {
    min-height: 100px;
  }
}
</style>
