<template>
  <ElDrawer
    ref="elDrawerRef"
    v-model="drawerVisible"
    :title="title"
    size="30%"
    v-bind="$attrs"
    :class="[prefixClass, { 'is-fullscreen': isFullscreen }]"
  >
    <template #header="scope">
      <slot name="header" v-bind="scope">
        <div style="display: flex">
          <slot name="title">
            <span :class="`${variables.elNamespace}-drawer__title`" style="flex: 1">{{ title }}</span>
          </slot>
          <Icon
            v-if="fullscreenIcon"
            :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
            @click="toggleFull"
            width="18px"
            height="18px"
            :color="`var(--${variables.elNamespace}-color-info)`"
            :hover-color="`var(--${variables.elNamespace}-color-primary)`"
            :icon-style="{ cursor: 'pointer' }"
          />
        </div>
      </slot>
    </template>

    <slot></slot>

    <template #footer>
      <ElButton @Click="handleClose()">取 消</ElButton>
      <ElButton type="primary" @click="handleConfirm()">确 定</ElButton>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ElDrawer, ElButton, type DrawerProps } from "element-plus";
import { ref, unref, shallowRef } from "vue";
import { useDesign } from "@/hooks";

defineOptions({ name: "WorkDrawer" });

const { getPrefixClass, variables } = useDesign();
const prefixClass = getPrefixClass("work-drawer");

interface WorkDrawerProps {
  title?: string; // 顶部标题
  fullscreen?: boolean; // 是否默认全屏，默认 false
  fullscreenIcon?: boolean; // 是否渲染全屏图标，默认 true
}

const props = withDefaults(defineProps<WorkDrawerProps>(), {
  title: "弹框",
  fullscreen: false,
  fullscreenIcon: true,
});

const emits = defineEmits<{
  close: [value: DrawerProps | null];
  confirm: [value: DrawerProps | null];
}>();

const drawerVisible = defineModel<boolean>({ required: true });

const isFullscreen = ref(props.fullscreen);
const elDrawerRef = shallowRef<DrawerProps | null>(null);

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen);
};

const handleClose = () => {
  emits("close", unref(elDrawerRef));
  drawerVisible.value = false;
};

const handleConfirm = () => {
  emits("confirm", unref(elDrawerRef));
  drawerVisible.value = false;
};

defineExpose({ elDrawerRef });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
