<script setup lang="ts">
import type { AppContext } from "vue";
import type { ElMessageBoxOptions, PopconfirmProps, ElTooltipProps } from "element-plus";
import { ElPopconfirm, ElTooltip, ElIcon, ElButton, ElLink, ElMessageBox } from "element-plus";
import { OperationConfirmEl, OperationEl } from "../helper";

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
  /**
   * 按钮文字
   */
  text?: string;
  /**
   * 按钮类型
   */
  el?: OperationEl | `${OperationEl}`;
  /**
   * 按钮组件 props
   */
  elProps?: Recordable;
  /**
   * 按钮图标，仅当 el 为 ElIcon 时有效
   */
  icon?: Component;
  /**
   * ElTooltipProps props
   */
  tooltipProps?: Partial<ElTooltipProps>;
  /**
   * 二次确认组件
   */
  confirmEl?: OperationConfirmEl | `${OperationConfirmEl}`;
  /**
   * 二次确认组件 props
   */
  confirmProps?: Partial<PopconfirmProps> | ElMessageBoxProps;
}

export interface OperationButtonEmits {
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

const defaultTitle = "温馨提示";
const defaultMessage = "确定执行本次操作?";

const icon = computed(() => toRaw(props.icon));

const handleButtonClick = (event: MouseEvent) => {
  emits("buttonClick", event);

  const { confirmEl, confirmProps } = props;

  if (confirmEl === OperationConfirmEl.ElMessageBox) {
    const { title = defaultTitle, message = defaultMessage, options, appContext } = confirmProps as ElMessageBoxProps;

    ElMessageBox.confirm(message, title, { type: "warning", ...options }, appContext)
      .then(() => emits("confirm", event))
      .catch(() => emits("cancel", event));
  }
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
  <el-tooltip v-if="el === OperationEl.ElIcon" placement="top" :content="text" v-bind="tooltipProps">
    <!-- 带二次确认的图标按钮 -->
    <span v-if="confirmEl === OperationConfirmEl.ElPopconfirm" class="el-icon">
      <el-popconfirm
        trigger="click"
        :title="defaultMessage"
        v-bind="confirmProps"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #reference>
          <el-icon size="16" v-bind="elProps" @click="handleButtonClick">
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
      v-if="confirmEl === OperationConfirmEl.ElPopconfirm"
      trigger="click"
      :title="defaultMessage"
      v-bind="confirmProps"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #reference>
        <component
          :is="el === OperationEl.ElButton ? ElButton : ElLink"
          size="small"
          :href="el === OperationEl.ElLink ? 'javascript:;' : undefined"
          v-bind="elProps"
          @click="handleButtonClick"
        >
          {{ text }}
        </component>
      </template>
    </el-popconfirm>

    <!-- 普通按钮 -->
    <component
      v-else
      :is="el === OperationEl.ElButton ? ElButton : ElLink"
      size="small"
      :href="el === OperationEl.ElLink ? 'javascript:;' : undefined"
      v-bind="elProps"
      @click="handleButtonClick"
    >
      {{ text }}
    </component>
  </template>
</template>
