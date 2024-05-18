<template>
  <div ref="echartsRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts" name="ChartBar">
import * as echarts from "echarts";
import { useEcharts } from "@/hooks";
import { onMounted, shallowRef } from "vue";

interface BarData {
  title: string;
  data: number[];
}

interface ChartBarProps {
  data: BarData[];
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  width: "100%",
  height: "300px",
});

const echartsRef = shallowRef();

onMounted(() => {
  initChart();
});

const initChart = () => {
  const chart = echarts.init(echartsRef.value as HTMLElement, "shine");
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    grid: {
      left: "1%",
      right: "1.2%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: props.data[0].title,
        type: "bar",
        data: props.data[0].data,
        emphasis: {
          focus: "series",
        },
        markLine: {
          lineStyle: {
            type: "dashed",
          },
          data: [[{ type: "min" }, { type: "max" }]],
        },
      },
      {
        name: props.data[1].title,
        type: "bar",
        barWidth: 5,
        stack: "搜索引擎",
        emphasis: {
          focus: "series",
        },
        data: props.data[1].data,
      },
      {
        name: props.data[2].title,
        type: "bar",
        stack: "搜索引擎",
        emphasis: {
          focus: "series",
        },
        data: props.data[2].data,
      },
      {
        name: props.data[3].title,
        type: "bar",
        stack: "搜索引擎",
        emphasis: {
          focus: "series",
        },
        data: props.data[3].data,
      },
      {
        name: props.data[4].title,
        type: "bar",
        stack: "搜索引擎",
        emphasis: {
          focus: "series",
        },
        data: props.data[4].data,
      },
    ],
  };
  useEcharts(chart, option);
};
</script>
