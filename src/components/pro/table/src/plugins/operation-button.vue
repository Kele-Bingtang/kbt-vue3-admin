<script setup lang="ts">
import type { ElMessageBoxOptions, PopconfirmProps } from "element-plus";
import type { OperationNamespace } from "../types";
import { ElPopconfirm, ElTooltip, ElIcon, ElButton, ElLink, ElMessageBox } from "element-plus";
import type { AppContext } from "vue";

defineOptions({ name: "OperationButton" });

export interface ElMessageBoxProps {
  /**
   * ElMessageBox.confirm 的 title
   *
   * @default '提示'
   */
  title?: string;
  /**
   * ElMessageBox.confirm 的 message
   *
   * @default '确定执行本次操作'
   */
  message?: string;
  /**
   * ElMessageBox.confirm 的 options
   */
  options?: ElMessageBoxOptions;
  /**
   * ElMessageBox.confirm 的 appContext
   */
  appContext?: AppContext | null;
}

export interface OperationButtonProps {
  text?: string;
  el?: "ElIcon" | "ElLink" | "ElButton";
  elProps?: Recordable;
  icon?: OperationNamespace.ButtonRaw["icon"];
  tooltipProps?: OperationNamespace.ButtonRaw["tooltipProps"];
  confirmEl?: "ElPopconfirm" | "ElMessageBox";
  confirmProps?: Partial<PopconfirmProps> | ElMessageBoxProps;
}

interface OperationButtonEmits {
  buttonClick: [event: MouseEvent];
  buttonConfirmClick: [event: MouseEvent];
  confirm: [event: MouseEvent];
  cancel: [event: MouseEvent];
}

const props = withDefaults(defineProps<OperationButtonProps>(), {
  text: "",
  el: "ElLink",
  elProps: undefined,
  icon: undefined,
  tooltipProps: undefined,
  confirmEl: undefined,
  confirmProps: undefined,
});

const emits = defineEmits<OperationButtonEmits>();

const handleButtonClick = (event: MouseEvent) => {
  const { confirmEl, confirmProps } = props;
  if (confirmEl === "ElMessageBox") {
    const { title, message, options, appContext } = confirmProps as ElMessageBoxProps;

    ElMessageBox.confirm(message, title, options, appContext)
      .then(() => {
        emits("confirm", event);
      })
      .catch(() => {
        emits("cancel", event);
      });
  } else emits("buttonClick", event);
};

const handleButtonConfirmClick = (event: MouseEvent) => {
  emits("buttonConfirmClick", event);
};

const handleConfirm = (event: MouseEvent) => {
  emits("confirm", event);
};

const handleCancel = (event: MouseEvent) => {
  emits("cancel", event);
};
</script>

<template>
  <!-- Icon 类型按钮 -->
  <el-tooltip v-if="el === 'ElIcon'" placement="top" :content="text" v-bind="tooltipProps">
    <!-- 带二次确认的图标按钮 -->
    <span v-if="confirmEl === 'ElPopconfirm'" class="el-icon">
      <el-popconfirm
        trigger="click"
        title="确定执行本次操作?"
        v-bind="confirmProps"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #reference>
          <el-icon size="16" style="margin: 0" v-bind="elProps" @click="handleButtonConfirmClick">
            <component v-if="icon" :is="icon" />
          </el-icon>
        </template>
      </el-popconfirm>
    </span>

    <!-- 普通图标按钮 -->
    <el-icon v-else size="16" v-bind="elProps" @click="handleButtonClick">
      <component v-if="icon" :is="icon" />
    </el-icon>
  </el-tooltip>

  <!-- 按钮/链接类型 -->
  <template v-else>
    <!-- 带二次确认的按钮 -->
    <el-popconfirm
      v-if="confirmEl === 'ElPopconfirm'"
      trigger="click"
      title="确定执行本次操作?"
      v-bind="confirmProps"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #reference>
        <component
          :is="el === 'ElButton' ? ElButton : ElLink"
          size="small"
          :href="el === 'ElLink' ? 'javascript:;' : undefined"
          v-bind="elProps"
          @click="handleButtonConfirmClick"
        >
          {{ text }}
        </component>
      </template>
    </el-popconfirm>

    <!-- 普通按钮 -->
    <component
      v-else
      :is="el === 'ElButton' ? ElButton : ElLink"
      size="small"
      :href="el === 'ElLink' ? 'javascript:;' : undefined"
      v-bind="elProps"
      @click="handleButtonClick"
    >
      {{ text }}
    </component>
  </template>
</template>
