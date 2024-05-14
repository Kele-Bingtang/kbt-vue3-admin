<template>
  <ElDialog
    ref="elDialogRef"
    :fullscreen="isFullscreen"
    :modelValue="dialogVisible"
    :title="title"
    size="30%"
    v-bind="$attrs"
    class="work-drawer"
  >
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <div style="display: flex">
          <slot name="title">
            <span class="el-dialog__title" style="flex: 1">{{ title }}</span>
          </slot>
          <Icon
            :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
            @click="toggleFull"
            width="15px"
            height="15px"
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            :icon-style="{ cursor: 'pointer' }"
          />
        </div>
      </slot>
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template #footer>
      <ElButton @Click="handleClose()">取 消</ElButton>
      <ElButton type="primary" @click="handleConfirm()">确 定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts" name="Dialog">
import { ElDialog, ElScrollbar, ElButton, type DialogProps } from "element-plus";
import { computed, nextTick, ref, unref, watch, useSlots, shallowRef, defineEmits } from "vue";
import { getPx } from "@/utils";

interface Dialog {
  modelValue: boolean;
  title?: string;
  fullscreen?: boolean;
  height?: string | number;
}

const props = withDefaults(defineProps<Dialog>(), {
  title: "弹框",
  fullscreen: false,
  height: 400,
});

const emits = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [value: DialogProps | null];
  confirm: [value: DialogProps | null];
}>();

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});

const slots = useSlots();

const isFullscreen = ref(false);
const elDialogRef = shallowRef<DialogProps | null>(null);

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen);
};

const dialogHeight = ref(getPx(props.height));

watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick();
    if (val) {
      const windowHeight = document.documentElement.offsetHeight;
      dialogHeight.value = `${windowHeight - 41 - 49 - (slots.footer ? 63 : 0)}px`;
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
  emits("close", elDialogRef.value);
  dialogVisible.value = false;
};

const handleConfirm = () => {
  emits("confirm", elDialogRef.value);
  dialogVisible.value = false;
};

defineExpose({
  elDialogRef,
});
</script>

<style lang="scss" scoped></style>
