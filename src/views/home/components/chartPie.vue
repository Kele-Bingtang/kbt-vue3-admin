<template>
  <div ref="echartsRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts" name="ChartPie">
import * as echarts from "echarts";
import { useEcharts } from "@/hooks";
import { shallowRef, onMounted } from "vue";

export interface PieData {
  name: string;
  value: number;
}

interface ChartBarProps {
  data: PieData[];
  title?: string;
  subTitle?: string;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  title: "",
  subTitle: "",
  width: "100%",
  height: "300px",
});

const echartsRef = shallowRef();

onMounted(() => {
  initChart();
});

const initChart = () => {
  const legendData = props.data.map(item => item.name);
  const chart = echarts.init(echartsRef.value as HTMLElement, "shine");
  const option = {
    title: {
      text: props.title,
      subtext: props.subTitle,
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      left: "left",
      orient: "vertical",
      data: legendData,
    },
    series: [
      {
        name: props.title,
        type: "pie",
        radius: [15, 95],
        center: ["50%", "60%"],
        data: props.data,
        animationDuration: 2700,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  useEcharts(chart, option);
};
</script>
