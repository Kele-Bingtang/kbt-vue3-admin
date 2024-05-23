<template>
  <div :class="prefixClass">
    <el-card shadow="never" style="margin-bottom: 10px">
      <template #header>
        <el-link
          href="https://github.com/inorganik/countUp.js"
          target="_blank"
          :underline="false"
          style="font-size: 20px"
        >
          CountUp.js
        </el-link>
      </template>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="4">
        <el-card shadow="hover">
          <template #header>
            <span>基础用法</span>
          </template>
          <div class="count-to-content">
            <CountTo :start-val="0" :end-val="2727" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="5">
        <el-card shadow="hover">
          <template #header>
            <span>添加前缀和后缀</span>
          </template>
          <div class="count-to-content">
            <CountTo :start-val="0" :end-val="2727" prefix="Lucky " suffix=" Num" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="7">
        <el-card shadow="hover">
          <template #header>
            <span>保留 2 位小数点 & 循环三次</span>
          </template>
          <div class="count-to-content">
            <CountTo :start-val="0" :end-val="2727" :decimals="2" :loop="3" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>动画持续 10 秒</span>
          </template>
          <div class="count-to-content">
            <CountTo
              :start-val="0"
              :end-val="2727"
              :decimals="2"
              :duration="10"
              :use-easing="false"
              count-class="count-text"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="count-to-row">
      <el-col :span="8">
        <el-card shadow="hover" style="height: 270px">
          <template #header>
            <span>单位转换（自带）</span>
          </template>
          <div class="count-to-content">
            <CountTo
              :simplify="true"
              :end-val="27272"
              prefix="原始数据：27272 => "
              count-class="count-text"
              unit-class="unit-class"
            />
            <CountTo
              :simplify="true"
              :end-val="27272727"
              prefix="原始数据：27272727 => "
              count-class="count-text"
              unit-class="unit-class"
            />
            <CountTo
              :simplify="true"
              :end-val="27272727277"
              prefix="原始数据：27272727277 => "
              count-class="count-text"
              unit-class="unit-class"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>自定义单位</span>
          </template>
          <div class="count-to-content">
            <CountTo
              :simplify="true"
              :end-val="2727"
              :unit="customUnit"
              count-class="count-text"
              unit-class="unit-class"
            >
              <template #prefix>原始数据：2727 =>&nbsp;</template>
            </CountTo>

            <CountTo
              :simplify="true"
              :end-val="27272"
              :unit="customUnit"
              count-class="count-text"
              unit-class="unit-class"
            >
              <template #prefix>原始数据：27272 =>&nbsp;</template>
            </CountTo>

            <CountTo
              :simplify="true"
              :end-val="272727"
              count-class="count-text"
              :unit="customUnit"
              unit-class="unit-class"
            >
              <template #prefix>原始数据：272727 =>&nbsp;</template>
            </CountTo>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" style="height: 270px">
          <template #header>
            <span>异步更新数据</span>
          </template>
          <div class="count-to-content" style="line-height: 149px">
            <CountTo :end-val="asyncEndVal" count-class="count-text" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="count-to-row">
      <el-card shadow="hover">
        <template #header>
          <span>
            完整 Demo： &lt;CountTo :start-val=&#x27;{{ startVal }}&#x27; :end-val=&#x27;{{ endVal }}&#x27;
            :duration=&#x27;{{ duration }}&#x27; :decimals=&#x27;{{ decimals }}&#x27; :separator=&#x27;{{
              separator
            }}&#x27; :prefix=&#x27;{{ prefix }}&#x27; :suffix=&#x27;{{ suffix }}&#x27; :autoplay=&#x27;false&#x27;
            :loop=&#x27;{{ loop }}&#x27; /&gt;
          </span>
        </template>
        <div class="count-to-content">
          <CountTo
            ref="countRef"
            :start-val="startVal"
            :end-val="endVal"
            :duration="duration"
            :decimals="decimals"
            :separator="separator"
            :prefix="prefix"
            :suffix="suffix"
            :autoplay="false"
            :loop="loop"
            class="count-demo"
          />
          <el-form :inline="true" :model="countToParams" class="demo-form-inline">
            <el-form-item label="起始值：">
              <el-input v-model="countToParams.startVal" placeholder="startVal"></el-input>
            </el-form-item>
            <el-form-item label="结束值：">
              <el-input v-model="countToParams.endVal" placeholder="endVal"></el-input>
            </el-form-item>
            <el-form-item label="持续时间：">
              <el-input v-model="countToParams.duration" placeholder="duration"></el-input>
            </el-form-item>
            <el-form-item label="保留小数：">
              <el-input v-model="countToParams.decimals" placeholder="decimals"></el-input>
            </el-form-item>
            <el-form-item label="分隔符：">
              <el-input v-model="countToParams.separator" placeholder="separator"></el-input>
            </el-form-item>
            <el-form-item label="前缀：">
              <el-input v-model="countToParams.prefix" placeholder="prefix"></el-input>
            </el-form-item>
            <el-form-item label="后缀：">
              <el-input v-model="countToParams.suffix" placeholder="suffix"></el-input>
            </el-form-item>
            <el-form-item label="循环：">
              <el-input v-model="countToParams.loop" placeholder="loop"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="start">Start</el-button>
              <el-button type="primary" @click="pauseResume">Pause/Resume</el-button>
              <el-button type="primary" @click="reset">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="CountToDemo">
import { CountTo } from "@/components";
import { useDesign } from "@/hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("count-to-demo");

const customUnit = [
  { value: 3, label: "千多" },
  { value: 4, label: "万多" },
  { value: 5, label: "十万多" },
];

const countRef = ref();
const asyncEndVal = ref(199);
const timer = ref<NodeJS.Timer | null>(null);
const countToParams = reactive({
  startVal: 0,
  endVal: 1999,
  duration: 4,
  decimals: 0,
  separator: ",",
  suffix: " Year",
  prefix: "Be ",
  loop: 1,
});

const startVal = computed(() => {
  if (countToParams.startVal) {
    return countToParams.startVal;
  } else {
    return 0;
  }
});

const endVal = computed(() => {
  if (countToParams.endVal) {
    return countToParams.endVal;
  } else {
    return 0;
  }
});
const duration = computed(() => {
  if (countToParams.duration) {
    return countToParams.duration;
  } else {
    return 100;
  }
});

const decimals = computed(() => {
  if (countToParams.decimals) {
    if (countToParams.decimals < 0 || countToParams.decimals > 20) {
      alert("decimals 值应该在 0 - 20 区间内");
      return 0;
    }
    return countToParams.decimals;
  } else {
    return 0;
  }
});

const separator = computed(() => countToParams.separator);
const suffix = computed(() => countToParams.suffix);
const prefix = computed(() => countToParams.prefix);
const loop = computed(() => countToParams.loop);

onMounted(() => {
  init();
});

onActivated(() => {
  init();
});

onDeactivated(() => {
  timer.value = null;
});

onBeforeUnmount(() => {
  timer.value = null;
});

const init = () => {
  timer.value = setInterval(() => {
    asyncEndVal.value += parseInt(Math.random() * 30 + "");
  }, 2000);
};

const start = () => {
  countRef.value && countRef.value.restart();
};
const pauseResume = () => {
  countRef.value && countRef.value.pause();
};
const reset = () => {
  countRef.value && countRef.value.reset();
};
</script>

<style lang="scss" scoped>
$prefix-class: #{$namespace}-count-to-demo;

.#{$prefix-class} {
  .count-to-row {
    margin-top: 20px;
  }

  .count-to-content {
    text-align: center;
  }

  .count-demo {
    display: block;
    margin-bottom: 20px;
    font-size: 80px;
    font-weight: 500;
    color: var(--el-color-primary);
    text-align: center;
  }

  :deep(.count-text),
  :deep(.unit-class) {
    font-size: 50px;
    color: var(--el-color-primary);
  }
}
</style>
