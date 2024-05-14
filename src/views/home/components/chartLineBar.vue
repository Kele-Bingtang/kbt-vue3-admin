<template>
  <div ref="echartsRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts" name="ChartLineBar">
import * as echarts from "echarts";
import { useEcharts } from "@/hooks";

interface LineBarData {
  lineData: string;
  barData: string;
  category: string;
  lineName: string;
  barName: string;
}

interface ChartBarProps {
  data: LineBarData[];
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
  const category = props.data.map(item => item.category);
  const lineData = props.data.map(item => item.lineData);
  const barData = props.data.map(item => item.barData);
  const { lineName } = props.data[0];
  const { barName } = props.data[0];

  const chart = echarts.init(echartsRef.value as HTMLElement, "shine");
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 20,
      containLabel: true,
    },
    legend: {
      data: [lineName, barName],
      textStyle: {
        color: "#333",
      },
    },
    xAxis: {
      data: category,
    },
    yAxis: {
      splitLine: { show: false },
    },
    series: [
      {
        name: lineName,
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 10,
        data: lineData,
        animationDuration: 2700,
      },
      {
        name: barName,
        type: "bar",
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#14c8d4" },
            { offset: 1, color: "#43eec6" },
          ]),
        },
        data: barData,
      },
      {
        name: lineName,
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(20, 200, 212, 0.5)" },
            { offset: 0.2, color: "rgba(20, 200, 212, 0.2)" },
            { offset: 1, color: "rgba(20, 200, 212, 0)" },
          ]),
        },
        z: -12,
        data: lineData,
        animationDuration: 2000,
      },
    ],
  };
  useEcharts(chart, option);
};
</script>

<style lang="scss" scoped></style>
