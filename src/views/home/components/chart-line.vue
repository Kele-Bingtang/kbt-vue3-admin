<template>
  <div ref="echartsRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts" name="ChartLine">
import * as echarts from "echarts";
import { useEcharts } from "@/composables";
import { onMounted } from "vue";

interface ChartBarProps {
  width?: string;
  height?: string;
}

withDefaults(defineProps<ChartBarProps>(), {
  width: "100%",
  height: "300px",
});

const echartsRef = useTemplateRef("echartsRef");

onMounted(() => {
  initChart();
});

const initChart = () => {
  const chart = echarts.init(echartsRef.value as HTMLElement, "shine");
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["运营商/网络服务", "银行/证券", "游戏/视频", "餐饮/外卖", "快递/电商"],
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: "png",
        },
      },
    },
    grid: {
      left: "1%",
      right: "1.2%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
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
        name: "运营商/网络服务",
        type: "line",
        stack: "总量",
        areaStyle: {
          color: "#2d8cf0",
        },
        itemStyle: {
          color: "#5470c6",
        },
        emphasis: {
          focus: "series",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "银行/证券",
        type: "line",
        stack: "总量",
        areaStyle: {
          color: "#b2db9e",
        },
        itemStyle: {
          color: "#91cc75",
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "游戏/视频",
        type: "line",
        stack: "总量",
        areaStyle: {
          color: "#f8d588",
        },
        itemStyle: {
          color: "#facb0f",
        },
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "餐饮/外卖",
        type: "line",
        stack: "总量",
        areaStyle: {
          color: "#f39494",
        },
        itemStyle: {
          color: "#ee6666",
        },
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "快递/电商",
        type: "line",
        stack: "总量",
        label: {
          show: true,
          position: "top",
        },
        areaStyle: {
          color: "#879bd7",
        },
        itemStyle: {
          color: "#6db6d3",
        },
        emphasis: {
          focus: "series",
        },
        data: [1820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
  useEcharts(chart, option);
};
</script>
