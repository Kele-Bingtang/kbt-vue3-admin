<template>
  <ElDialog
    ref="elDialogRef"
    v-model="dialogVisible"
    :title="title"
    :fullscreen="isFullscreen"
    top="2vh"
    width="50%"
    :close-on-click-modal="false"
    draggable
    v-bind="$attrs"
    :class="prefixClass"
  >
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <div style="display: flex">
          <slot name="title">
            <span :class="`${variables.elNamespace}-dialog__title`" style="flex: 1">{{ title }}</span>
          </slot>
          <Icon
            v-if="fullscreenIcon"
            :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
            @click="toggleFull"
            width="15px"
            height="15px"
            :color="`var(--${variables.elNamespace}-color-info)`"
            :hover-color="`var(--${variables.elNamespace}-color-primary)`"
            :icon-style="{ cursor: 'pointer' }"
          />
        </div>
      </slot>
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template #footer>
      <slot name="footer">
        <ElButton @Click="handleClose()">取 消</ElButton>
        <ElButton type="primary" @click="handleConfirm()">确 定</ElButton>
      </slot>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElScrollbar, ElButton, type DialogProps } from "element-plus";
import { Icon } from "@/components";
import { computed, nextTick, ref, unref, watch, useSlots, shallowRef } from "vue";
import { getPx } from "@/utils";
import { useDesign } from "@/hooks";

defineOptions({ name: "WorkDialog" });

const { getPrefixClass, variables } = useDesign();
const prefixClass = getPrefixClass("work-dialog");

interface WorkDialogProps {
  title?: string; // 顶部标题
  fullscreen?: boolean; // 是否默认全屏，默认 false
  fullscreenIcon?: boolean; // 是否渲染全屏图标，默认 true
  height?: string | number; // 内容高度，默认 400px
}

const props = withDefaults(defineProps<WorkDialogProps>(), {
  title: "弹框",
  fullscreen: false,
  fullscreenIcon: true,
  height: 400,
});

const emits = defineEmits<{
  close: [value: DialogProps | null];
  confirm: [value: DialogProps | null];
}>();

const dialogVisible = defineModel<boolean>({ required: true });

const slots = useSlots();

const isFullscreen = ref(false);
const elDialogRef = shallowRef<DialogProps | null>(null);

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen);
};

const dialogHeight = ref(getPx(props.height));

watch(
  isFullscreen,
  async (val: boolean) => {
    await nextTick();
    if (val) {
      const windowHeight = document.documentElement.offsetHeight;
      dialogHeight.value = `${windowHeight - 41 - 49 - 47 - (slots.footer ? 63 : 0)}px`;
    } else {
      dialogHeight.value = getPx(props.height);
    }
  },
  {
    immediate: true,
  }
);

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight),
  };
});

const handleClose = () => {
  emits("close", unref(elDialogRef));
  dialogVisible.value = false;
};

const handleConfirm = () => {
  emits("confirm", unref(elDialogRef));
  dialogVisible.value = false;
};

defineExpose({ elDialogRef });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
