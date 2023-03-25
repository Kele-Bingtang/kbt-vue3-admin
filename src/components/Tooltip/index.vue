<!-- 利用 el-tooltip 实现文字超出时显示省略号并气泡提示，否则不气泡提示，支持 el-tooltip 的所有属性 -->
<!-- 使用: Tooltip 组件内必须包裹仅且一个 html 标签，外层 div 标签需要具有宽度
    <div>
      <Tooltip><span>...</span></Tooltip>
    </div>
 -->

<template>
  <template v-if="showTip">
    <el-tooltip placement="top" v-bind="$attrs">
      <template #content>{{ content.join("") }}</template>
      <div ref="slotRef" class="sle">
        <slot></slot>
      </div>
    </el-tooltip>
  </template>
  <template v-else>
    <div ref="slotRef" class="sle">
      <slot></slot>
    </div>
  </template>
</template>

<script setup lang="ts" name="Tooltip">
import { isArray } from "@/utils/layout/validate";

const props = defineProps<{ realTime?: boolean }>();

const slots = useSlots() as any;
let slotDom = slots.default();

const slotRef = ref<HTMLElement | null>(null);
const showTip = ref(false);
const content = ref<any>([]);

const childrenIsArray = (arr: any, content: Array<string>) => {
  arr.forEach((v: any) => {
    if (isArray(v.children)) childrenIsArray(v.children, content);
    else content.push(v.children);
  });
};

const slotDomIsSingleElArray = (slotDom: any) => {
  if (isArray(slotDom.children)) childrenIsArray(slotDom.children, content.value);
  else content.value = [slotDom.children];
};

const getContent = () => {
  if (slotDom.length > 1) {
    slotDom.forEach((v: any) => {
      slotDomIsSingleElArray(v);
    });
  } else slotDomIsSingleElArray(slotDom[0]);
};

const compareWidth = () => {
  content.value = [];
  const parentW = slotRef.value?.offsetWidth || 0;
  const childW = (slotRef.value?.firstElementChild as any).offsetWidth || 0;
  childW > parentW ? (showTip.value = true) : (showTip.value = false);
  if (showTip.value) getContent();
};

onMounted(() => {
  compareWidth();
  if (props.realTime) slotRef.value?.addEventListener("mouseover", compareWidth);
  else slotRef.value?.removeEventListener("mouseout", compareWidth);
});

onUpdated(() => {
  slotDom = slots.default();
  compareWidth();
});
</script>
