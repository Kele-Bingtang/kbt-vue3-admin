<script setup lang="ts">
import type { OperationNamespace } from "../types";
import { isFunction } from "@/utils";
import operationButton from "../plugins/operation-button.vue";
import { hyphenToCamelCase } from "@/components/pro/form-item";

defineOptions({ name: "TableColumnOperation" });

const props = withDefaults(defineProps<OperationNamespace.Props>(), {
  buttons: () => [],
  el: "ElLink",
  label: "操作栏",
  fixed: "right",
  width: 200,
  showNumber: 3,
  confirm: false,
});

const emits = defineEmits<OperationNamespace.Emits>();

// 控制下拉不隐藏，防止气泡定位异常
const hideOnClick = ref(true);

const labelValue = computed(() => toValue(props.label));
const buttonEl = computed(() => hyphenToCamelCase(props.el) as "ElIcon" | "ElLink" | "ElButton");

const getButtons = (row: Recordable, index: number) => {
  const { buttons, showNumber } = props;

  const data = buttons.filter(item => {
    if (!isFunction(item.show)) return unref(item.show) !== false;
    const isShow = item.show(row, index, item);
    return unref(isShow) !== false;
  });

  const showNumberConst = isFunction(showNumber) ? showNumber(row, index) : showNumber;
  const showMore = data.length > showNumberConst;

  if (!showMore) return { showMore, showButtons: data, hideButtons: [] };
  return { showMore, showButtons: data.slice(0, showNumberConst), hideButtons: data.slice(showNumberConst) };
};

const getText = (buttonRaw: OperationNamespace.ButtonRaw, row: Recordable, index: number) => {
  return isFunction(buttonRaw.text)
    ? unref(buttonRaw.text(row, index, { ...buttonRaw, text: undefined }))
    : unref(buttonRaw.text);
};

const getElProps = (buttonRaw: OperationNamespace.ButtonRaw, row: Recordable, index: number) => {
  return isFunction(buttonRaw.elProps)
    ? buttonRaw.elProps(row, index, { ...buttonRaw, elProps: undefined })
    : unref(buttonRaw.elProps);
};

const getConfirmProps = (buttonRaw: OperationNamespace.ButtonRaw, row: Recordable, index: number, rest: Recordable) => {
  const { confirm } = buttonRaw;
  const text = getText(buttonRaw, row, index);
  const callbackParams = {
    text,
    row,
    rowIndex: index,
    buttonRaw,
    ...rest,
  } as OperationNamespace.ButtonsCallBackParams;

  if (confirm?.el === "ElPopconfirm") return confirm?.props;

  const title = isFunction(confirm?.props.title) ? confirm.props.title(callbackParams) : confirm?.props.title;
  const message = isFunction(confirm?.props.message) ? confirm?.props.message(callbackParams) : confirm?.props.message;
  return {
    ...confirm?.props,
    title,
    message,
  };
};

const handleButtonClick = (
  event: MouseEvent,
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable
) => {
  hideOnClick.value = true;
  const text = getText(buttonRaw, row, index);
  const callbackParams = {
    text,
    row,
    rowIndex: index,
    event,
    buttonRaw,
    ...rest,
  } as OperationNamespace.ButtonsCallBackParams;
  if (isFunction(buttonRaw.onClick)) buttonRaw.onClick(callbackParams);

  emits("buttonClick", callbackParams);
};

const handleButtonConfirmClick = (
  event: MouseEvent,
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable
) => {
  hideOnClick.value = false;
  const text = getText(buttonRaw, row, index);
  const callbackParams = {
    text,
    row,
    rowIndex: index,
    event,
    buttonRaw,
    ...rest,
  } as OperationNamespace.ButtonsCallBackParams;

  if (isFunction(buttonRaw.onClick)) buttonRaw.onClick(callbackParams);
  // emits("buttonClick", event);
};

const handleConfirm = (
  event: MouseEvent,
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable
) => {
  const text = getText(buttonRaw, row, index);
  const callbackParams = {
    text,
    row,
    rowIndex: index,
    buttonRaw,
    event,
    ...rest,
  } as OperationNamespace.ButtonsCallBackParams;

  if (isFunction(buttonRaw.onConfirm)) buttonRaw.onConfirm(callbackParams);
  emits("confirm", callbackParams);
};

const handleCancel = (
  event: MouseEvent,
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable
) => {
  const text = getText(buttonRaw, row, index);
  const callbackParams = {
    text,
    row,
    rowIndex: index,
    buttonRaw,
    event,
    ...rest,
  } as OperationNamespace.ButtonsCallBackParams;

  if (isFunction(buttonRaw.onCancel)) buttonRaw.onCancel(callbackParams);
  emits("cancel", callbackParams);
};
</script>

<template>
  <el-table-column :label="labelValue" :fixed :width v-bind="{ props, buttons: undefined }">
    <template #default="{ row, $index, ...rest }">
      <!-- 显示出来的按钮 -->
      <template v-for="button in getButtons(row, $index).showButtons" :key="button.text">
        <operationButton
          :text="getText(button, row, $index)"
          :el-props="getElProps(button, row, $index)"
          :el="buttonEl"
          :icon="button.icon"
          :tooltip-props="button.tooltipProps"
          :confirm-el="button.confirm?.el"
          :confirm-props="getConfirmProps(button, row, $index, rest)"
          @buttonClick="e => handleButtonClick(e, button, row, $index, rest)"
          @buttonConfirmClick="e => handleButtonConfirmClick(e, button, row, $index, rest)"
          @confirm="e => handleConfirm(e, button, row, $index, rest)"
          @cancel="e => handleCancel(e, button, row, $index, rest)"
        />
      </template>

      <!-- 隐藏的按钮 -->
      <el-dropdown
        v-if="getButtons(row, $index).showMore"
        trigger="click"
        class="plus-table-action-bar__dropdown"
        :hide-on-click="hideOnClick"
      >
        <span>
          <span>更多</span>
          <slot name="operation-more-icon">
            <el-icon><ArrowDownBold /></el-icon>
          </slot>
        </span>

        <!-- 下拉按钮 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="button in getButtons(row, $index).hideButtons" :key="getText(button, row, $index)">
              <operationButton
                :text="getText(button, row, $index)"
                :el-props="getElProps(button, row, $index)"
                :el="buttonEl"
                :icon="button.icon"
                :tooltip-props="button.tooltipProps"
                :confirm-el="button.confirm?.el"
                :confirm-props="getConfirmProps(button, row, $index, rest)"
                @buttonClick="e => handleButtonClick(e, button, row, $index, rest)"
                @buttonConfirmClick="e => handleButtonConfirmClick(e, button, row, $index, rest)"
                @confirm="e => handleConfirm(e, button, row, $index, rest)"
                @cancel="e => handleCancel(e, button, row, $index, rest)"
              />
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-table-column>
</template>
