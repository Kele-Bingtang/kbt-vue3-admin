<template>
  <div :ref="'wrap' + classOption['key']">
    <div :style="leftSwitch" v-if="navigation" :class="leftSwitchClass" @click="leftSwitchClick">
      <slot name="left-switch" />
    </div>
    <div :style="rightSwitch" v-if="navigation" :class="rightSwitchClass" @click="rightSwitchClick">
      <slot name="right-switch" />
    </div>
    <div
      :ref="'realBox' + classOption['key']"
      :style="pos"
      @mouseenter="enter"
      @mouseleave="leave"
      @touchstart.passive="touchStart"
      @touchmove.passive="touchMove"
      @touchend="touchEnd"
      @mousewheel.passive="wheel"
    >
      <div :ref="'slotList' + classOption['key']" :style="float">
        <slot />
      </div>
      <div v-html="copyHtml" :style="float" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, unref, type CSSProperties } from "vue";
import { tryOnMounted, tryOnUnmounted, templateRef, useDebounceFn } from "@vueuse/core";
import * as utilsMethods from "./utils";

defineOptions({ name: "SeamlessScroll" });

const { animationFrame } = utilsMethods;
animationFrame();

interface ClassOption {
  key?: number; // ref key
  step?: number; // 步长
  limitMoveNum?: number; // 启动无缝滚动最小数据数
  hoverStop?: boolean; // 是否启用鼠标hover控制
  direction?: string; // bottom 往下 top 往上(默认) left 向左 right 向右
  openTouch?: boolean; // 开启移动端 touch
  singleHeight?: number; // 单条数据高度有值 hoverStop 关闭
  singleWidth?: number; // 单条数据宽度有值 hoverStop 关闭
  waitTime?: number; // 单步停止等待时间
  switchOffset?: number; // 偏移量
  autoPlay?: boolean; // 是否自动播放
  navigation?: boolean; // 是否暂停播放
  switchSingleStep?: number; // 单步距离
  switchDelay?: number; // 切换模式延迟
  switchDisabledClass?: string; // 滚动元素的 class
  isSingleRemUnit?: boolean; // singleWidth/singleHeight 是否开启 rem 度量
}

interface SeamlessScrollProps {
  data: any[];
  classOption: ClassOption;
}

const props = defineProps<SeamlessScrollProps>();

type SeamlessScrollEmits = {
  scrollEnd: []; // 滚动结束事件
};

const emits = defineEmits<SeamlessScrollEmits>();

const xPos = ref<number>(0);
const yPos = ref<number>(0);
const delay = ref<number>(0);
const height = ref<number>(0);
// 外容器宽度
const width = ref<number>(0);
// 内容实际宽度
const realBoxWidth = ref<number>(0);
const realBoxHeight = ref<number>(0);
const copyHtml = ref("");
// single 单步滚动的定时器
let singleWaitTime: NodeJS.Timeout | null = null;
// move 动画的 animationFrame 定时器
let reqFrame = -1;
let startPos = { x: 0, y: 0 };
// 记录 touchStart 时候的 posY
let startPosY = -1;
// 记录 touchStart 时候的 posX
let startPosX = -1;
// mouseenter mouseleave 控制 scrollMove() 的开关
let isHover = false;
let ease = "ease-in";

const { classOption } = props;

if (classOption["key"] === undefined) {
  classOption["key"] = 0;
}

const wrap = templateRef<HTMLElement | null>(`wrap${classOption["key"]}`, null);
const slotList = templateRef<HTMLElement | null>(`slotList${classOption["key"]}`, null);
const realBox = templateRef<HTMLElement | null>(`realBox${classOption["key"]}`, null);

const leftSwitchState = computed(() => {
  return unref(xPos) < 0;
});

const rightSwitchState = computed(() => {
  return Math.abs(unref(xPos)) < unref(realBoxWidth) - unref(width);
});

const defaultOption = computed(() => {
  return {
    // 步长
    step: 1,
    // 启动无缝滚动最小数据数
    limitMoveNum: 5,
    // 是否启用鼠标 hover 控制
    hoverStop: true,
    // bottom 往下 top 往上(默认) left 向左 right 向右
    direction: "top",
    // 开启移动端touch
    openTouch: true,
    // 单条数据高度有值 hoverStop 关闭
    singleHeight: 0,
    // 单条数据宽度有值 hoverStop 关闭
    singleWidth: 0,
    // 单步停止等待时间
    waitTime: 1000,
    // 偏移量
    switchOffset: 30,
    // 是否自动播放
    autoPlay: true,
    // 是否暂停播放
    navigation: false,
    // 单步距离
    switchSingleStep: 134,
    // 切换模式延迟
    switchDelay: 400,
    // 滚动元素的 class
    switchDisabledClass: "disabled",
    // singleWidth/singleHeight 是否开启 rem 度量
    isSingleRemUnit: false,
  };
});

const options = computed(() => {
  return Object.assign({}, unref(defaultOption), classOption);
});

const leftSwitchClass = computed(() => {
  return unref(leftSwitchState) ? "" : unref(options).switchDisabledClass;
});

const rightSwitchClass = computed(() => {
  return unref(rightSwitchState) ? "" : unref(options).switchDisabledClass;
});

const leftSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${unref(height) / 2}px 0 0 -${unref(options).switchOffset}px`,
    transform: "translate(-100%,-50%)",
  };
});

const rightSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${unref(height) / 2}px 0 0 ${unref(width) + unref(options).switchOffset}px`,
    transform: "translateY(-50%)",
  };
});

const isHorizontal = computed(() => {
  return unref(options).direction !== "bottom" && unref(options).direction !== "top";
});

const float = computed((): CSSProperties => {
  return unref(isHorizontal) ? { float: "left", overflow: "hidden" } : { overflow: "hidden" };
});

const pos = computed(() => {
  return {
    transform: `translate(${unref(xPos)}px,${unref(yPos)}px)`,
    transition: `all ${ease} ${unref(delay)}ms`,
    overflow: "hidden",
  };
});

const navigation = computed(() => {
  return unref(options).navigation;
});

const autoPlay = computed(() => {
  if (unref(navigation)) return false;
  return unref(options).autoPlay;
});

const scrollSwitch = computed(() => {
  // 从 props 解构出来的 属性 不再具有响应性.
  return (props.data as any).length >= unref(options).limitMoveNum;
});

const hoverStopSwitch = computed(() => {
  return unref(options).hoverStop && unref(autoPlay) && unref(scrollSwitch);
});

const canTouchScroll = computed(() => {
  return unref(options).openTouch;
});

const baseFontSize = computed(() => {
  return unref(options).isSingleRemUnit
    ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize)
    : 1;
});

const realSingleStopWidth = computed(() => {
  return unref(options).singleWidth * unref(baseFontSize);
});

const realSingleStopHeight = computed(() => {
  return unref(options).singleHeight * unref(baseFontSize);
});

const step = computed(() => {
  let singleStep;
  const step = unref(options).step;
  if (unref(isHorizontal)) {
    singleStep = unref(realSingleStopWidth);
  } else {
    singleStep = unref(realSingleStopHeight);
  }
  if (singleStep > 0 && singleStep % step > 0) {
    throw Error("如果设置了单步滚动，step需是单步大小的约数，否则无法保证单步滚动结束的位置是否准确");
  }
  return step;
});

function reset() {
  xPos.value = 0;
  yPos.value = 0;
  scrollCancle();
  scrollInitMove();
}

function leftSwitchClick() {
  if (!unref(leftSwitchState)) return;
  // 小于单步距离
  if (Math.abs(unref(xPos)) < unref(options).switchSingleStep) {
    xPos.value = 0;
    return;
  }
  xPos.value += unref(options).switchSingleStep;
}

function rightSwitchClick() {
  if (!unref(rightSwitchState)) return;
  // 小于单步距离
  if (unref(realBoxWidth) - unref(width) + unref(xPos) < unref(options).switchSingleStep) {
    xPos.value = unref(width) - unref(realBoxWidth);
    return;
  }
  xPos.value -= unref(options).switchSingleStep;
}

function scrollCancle() {
  cancelAnimationFrame(reqFrame);
}

function touchStart(e: any) {
  if (!unref(canTouchScroll)) return;
  let timer;
  // touches数组对象获得屏幕上所有的touch，取第一个touch
  const touch = e.targetTouches[0];
  const { waitTime, singleHeight, singleWidth } = unref(options);
  // 取第一个touch的坐标值
  startPos = {
    x: touch.pageX,
    y: touch.pageY,
  };
  // 记录touchStart时候的posY
  startPosY = unref(yPos);
  // 记录touchStart时候的posX
  startPosX = unref(xPos);
  if (!!singleHeight && !!singleWidth) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      scrollCancle();
    }, waitTime + 20);
  } else {
    scrollCancle();
  }
}

function touchMove(e: any) {
  // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
  if (!unref(canTouchScroll) || e.targetTouches.length > 1 || (e.scale && e.scale !== 1)) return;
  const touch = e.targetTouches[0];
  const { direction } = unref(options);
  const endPos = {
    x: touch.pageX - startPos.x,
    y: touch.pageY - startPos.y,
  };
  // 阻止触摸事件的默认行为，即阻止滚屏
  e.preventDefault();
  // dir，1表示纵向滑动，0为横向滑动
  const dir = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0;
  if ((dir === 1 && direction === "bottom") || (dir === 1 && direction === "top")) {
    // 表示纵向滑动 && 运动方向为上下
    yPos.value = startPosY + endPos.y;
  } else if ((dir === 0 && direction === "left") || (dir === 0 && direction === "right")) {
    // 为横向滑动 && 运动方向为左右
    xPos.value = startPosX + endPos.x;
  }
}

function touchEnd() {
  if (!unref(canTouchScroll)) return;
  // eslint-disable-next-line prefer-const
  let timer: any;
  const direction = unref(options).direction;
  delay.value = 50;
  if (direction === "top") {
    if (unref(yPos) > 0) yPos.value = 0;
  } else if (direction === "bottom") {
    const h = (unref(realBoxHeight) / 2) * -1;
    if (unref(yPos) < h) yPos.value = h;
  } else if (direction === "left") {
    if (unref(xPos) > 0) xPos.value = 0;
  } else if (direction === "right") {
    const w = unref(realBoxWidth) * -1;
    if (unref(xPos) < w) xPos.value = w;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    delay.value = 0;
    scrollMove();
  }, unref(delay));
}

function enter() {
  if (unref(hoverStopSwitch)) scrollStopMove();
}

function leave() {
  if (unref(hoverStopSwitch)) scrollStartMove();
}

function scrollMove() {
  // 鼠标移入时拦截scrollMove()
  if (isHover) return;
  // 进入move立即先清除动画 防止频繁touchMove导致多动画同时进行
  // scrollCancle();
  reqFrame = requestAnimationFrame(function () {
    // 实际高度
    const h = unref(realBoxHeight) / 2;
    // 宽度
    const w = unref(realBoxWidth) / 2;
    const { direction, waitTime } = unref(options);
    if (direction === "top") {
      // 上
      if (Math.abs(unref(yPos)) >= h) {
        emits("scrollEnd");
        yPos.value = 0;
      }
      yPos.value -= step.value;
    } else if (direction === "bottom") {
      // 下
      if (unref(yPos) >= 0) {
        emits("scrollEnd");
        yPos.value = h * -1;
      }
      yPos.value += step.value;
    } else if (direction === "left") {
      // 左
      if (Math.abs(unref(xPos)) >= w) {
        emits("scrollEnd");
        xPos.value = 0;
      }
      xPos.value -= step.value;
    } else if (direction === "right") {
      // 右
      if (unref(xPos) >= 0) {
        emits("scrollEnd");
        xPos.value = w * -1;
      }
      xPos.value += step.value;
    }
    if (singleWaitTime) clearTimeout(singleWaitTime);
    if (unref(realSingleStopHeight)) {
      // 是否启动了单行暂停配置
      if (Math.abs(unref(yPos)) % unref(realSingleStopHeight) < unref(step)) {
        // 符合条件暂停waitTime
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else if (unref(realSingleStopWidth)) {
      if (Math.abs(unref(xPos)) % unref(realSingleStopWidth) < unref(step)) {
        // 符合条件暂停waitTime
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else {
      scrollMove();
    }
  });
}

function scrollInitMove() {
  nextTick(() => {
    const { switchDelay } = unref(options);
    // 清空copy
    copyHtml.value = "";
    if (unref(isHorizontal)) {
      height.value = unref(wrap)?.offsetHeight || 0;
      width.value = unref(wrap)?.offsetWidth || 0;
      let slotListWidth = unref(slotList)?.offsetWidth || 0;
      // 水平滚动设置warp width
      if (unref(autoPlay)) {
        // 修正offsetWidth四舍五入
        slotListWidth = slotListWidth * 2 + 1;
      }
      const r = unref(realBox);
      r && (r.style.width = slotListWidth + "px");
      realBoxWidth.value = slotListWidth;
    }

    if (unref(autoPlay)) {
      ease = "ease-in";
      delay.value = 0;
    } else {
      ease = "linear";
      delay.value = switchDelay;
      return;
    }

    // 是否可以滚动判断
    if (unref(scrollSwitch)) {
      let timer;
      if (timer) clearTimeout(timer);
      copyHtml.value = unref(slotList)?.innerHTML || "";
      setTimeout(() => {
        realBoxHeight.value = unref(realBox)?.offsetHeight || 0;
        scrollMove();
      }, 0);
    } else {
      scrollCancle();
      yPos.value = xPos.value = 0;
    }
  });
}

function scrollStartMove() {
  // 开启scrollMove
  isHover = false;
  scrollMove();
}

function scrollStopMove() {
  // 关闭scrollMove
  isHover = true;
  // 防止频频hover进出单步滚动,导致定时器乱掉
  if (singleWaitTime) clearTimeout(singleWaitTime);
  scrollCancle();
}

// 鼠标滚轮事件
function wheel(e: WheelEvent) {
  if (unref(options).direction === "left" || unref(options).direction === "right") return;
  useDebounceFn(() => {
    e.deltaY > 0 ? (yPos.value -= step.value) : (yPos.value += step.value);
  }, 50)();
}

// watchEffect(() => {
//   const watchData = data;
//   if (!watchData) return;
//   nextTick(() => {
//     reset();
//   });

//   const watchAutoPlay = unref(autoPlay);
//   if (watchAutoPlay) {
//     reset();
//   } else {
//     scrollStopMove();
//   }
// });

tryOnMounted(() => {
  scrollInitMove();
});

tryOnUnmounted(() => {
  scrollCancle();
  singleWaitTime && clearTimeout(singleWaitTime);
});

defineExpose({
  reset,
});
</script>
