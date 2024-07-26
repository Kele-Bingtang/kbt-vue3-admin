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

    <ElScrollbar :height="dialogHeight" :maxHeight>
      <slot></slot>
    </ElScrollbar>

    <template #footer>
      <slot name="footer">
        <ElButton @Click="handleClose()">{{ closeLabel }}</ElButton>
        <ElButton type="primary" @click="handleConfirm()">{{ confirmLabel }}</ElButton>
      </slot>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElScrollbar, ElButton, type DialogProps } from "element-plus";
import { Icon } from "@/components";
import { nextTick, ref, unref, watch, useSlots, shallowRef } from "vue";
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
  maxHeight?: string | number; // 内容最大高度，默认 400px
  confirmLabel?: string; // 确认按钮文字，默认 确 认
  closeLabel?: string; // 关闭按钮文字，默认 关 闭
}

const props = withDefaults(defineProps<WorkDialogProps>(), {
  title: "弹框",
  fullscreen: false,
  fullscreenIcon: true,
  height: 400,
  confirmLabel: "确认",
  closeLabel: "关闭",
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
