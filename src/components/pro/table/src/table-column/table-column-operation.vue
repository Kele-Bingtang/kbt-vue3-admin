<script setup lang="ts">
import type { OperationNamespace } from "../types";
import { ArrowDownBold } from "@element-plus/icons-vue";
import { isFunction } from "@/utils";
import { hyphenToCamelCase } from "@/components/pro/form-item";
import { useNamespace } from "@/composables";
import { OperationConfirmEl, OperationEl, lastProp } from "../helper";
import OperationButton from "../plugins/operation-button.vue";

import "./table-column-operation.scss";

defineOptions({ name: "TableColumnOperation" });

const props = withDefaults(defineProps<OperationNamespace.Props>(), {
  buttons: () => [],
  el: OperationEl.ElLink,
  label: "操作栏",
  fixed: "right",
  width: 200,
  prop: "operation",
  showNumber: 3,
  confirm: false,
});

const emits = defineEmits<OperationNamespace.Emits>();

const ns = useNamespace("pro-table-operation");

// 控制下拉不隐藏，防止气泡定位异常
const hideOnClick = ref(true);

const widthValue = computed(() => toValue(props.width));
const labelValue = computed(() => toValue(props.label));

/**
 * 获取需要渲染的按钮和隐藏的按钮信息
 */
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

/**
 * 获取文本
 */
const getText = (buttonRaw: OperationNamespace.ButtonRaw, row: Recordable, index: number) => {
  return isFunction(buttonRaw.text)
    ? unref(buttonRaw.text(row, index, { ...buttonRaw, text: undefined }))
    : unref(buttonRaw.text);
};

const getButtonEl = (buttonRaw: OperationNamespace.ButtonRaw) =>
  hyphenToCamelCase(buttonRaw.el || props.el) as OperationEl;
/**
 * 获取按钮相关组件的 Props
 */
const getButtonElProps = (buttonRaw: OperationNamespace.ButtonRaw, row: Recordable, index: number) => {
  return isFunction(buttonRaw.elProps)
    ? buttonRaw.elProps(row, index, { ...buttonRaw, elProps: undefined })
    : unref(buttonRaw.elProps);
};

/**
 * 获取 emits 返回的参数信息
 */
const getCallbackParams = (
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable,
  event?: MouseEvent
) => {
  const text = getText(buttonRaw, row, index);
  return {
    text,
    row,
    rowIndex: index,
    buttonRaw,
    event,
    ...rest,
  } as OperationNamespace.ButtonsCallBackParams;
};

/**
 * 获取 confirm 弹窗组件
 */
const getConfirmEl = (buttonRaw: OperationNamespace.ButtonRaw) => {
  const confirm = buttonRaw.confirm ?? props.confirm;
  if (!confirm) return;
  if (confirm === true) return OperationConfirmEl.ElPopconfirm;
  return confirm.el;
};

/**
 * 获取 confirm 弹窗组件 props
 */
const getConfirmProps = (buttonRaw: OperationNamespace.ButtonRaw, row: Recordable, index: number, rest: Recordable) => {
  const confirmEl = getConfirmEl(buttonRaw);
  const confirm = buttonRaw.confirm ?? props.confirm;

  if (!confirmEl) return;
  if (confirmEl === OperationConfirmEl.ElPopconfirm) {
    return (confirm as OperationNamespace.Confirm<OperationConfirmEl.ElPopconfirm>).props;
  }

  const callbackParams = getCallbackParams(buttonRaw, row, index, rest);

  const elMessageBoxConfirm = confirm as OperationNamespace.Confirm<OperationConfirmEl.ElMessageBox>;

  const title = isFunction(elMessageBoxConfirm?.props?.title)
    ? elMessageBoxConfirm.props.title(callbackParams)
    : elMessageBoxConfirm?.props?.title;

  const message = isFunction(elMessageBoxConfirm?.props?.message)
    ? elMessageBoxConfirm?.props.message(callbackParams)
    : elMessageBoxConfirm?.props?.message;

  return {
    ...elMessageBoxConfirm?.props,
    title,
    message,
  };
};

/**
 * 点击按钮事件
 */
const handleButtonClick = (
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable,
  event: MouseEvent
) => {
  hideOnClick.value = true;
  const callbackParams = getCallbackParams(buttonRaw, row, index, rest, event);
  if (isFunction(buttonRaw.onClick)) buttonRaw.onClick(callbackParams);

  emits("buttonClick", callbackParams);
};

/**
 * 点击确认按钮事件
 */
const handleConfirm = (
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable,
  event: MouseEvent
) => {
  const callbackParams = getCallbackParams(buttonRaw, row, index, rest, event);

  if (isFunction(buttonRaw.onConfirm)) buttonRaw.onConfirm(callbackParams);
  emits("confirm", callbackParams);
};

/**
 * 点击取消按钮事件
 */
const handleCancel = (
  buttonRaw: OperationNamespace.ButtonRaw,
  row: Recordable,
  index: number,
  rest: Recordable,
  event: MouseEvent
) => {
  const callbackParams = getCallbackParams(buttonRaw, row, index, rest, event);

  if (isFunction(buttonRaw.onCancel)) buttonRaw.onCancel(callbackParams);
  emits("cancel", callbackParams);
};
</script>

<template>
  <el-table-column
    v-bind="{ ...props, buttons: undefined }"
    :fixed
    :label="labelValue"
    :width="widthValue"
    :class-name="ns.b()"
  >
    <!-- 表头插槽 - 表头内容 -->
    <template #header="scope">
      <component v-if="headerRender" :is="headerRender(scope)" />
      <slot v-else :name="`${lastProp(prop!)}-header`" v-bind="scope">{{ scope.column.label }}</slot>
    </template>

    <!-- 默认插槽 - 单元格内容 -->
    <template #default="{ row, $index, ...rest }">
      <component v-if="render" :is="render(scope)" />
      <slot v-else-if="$slots[lastProp(prop!)]" :name="lastProp(prop!)" v-bind="scope" />

      <template v-else>
        <!-- 显示出来的按钮 -->
        <template v-for="button in getButtons(row, $index).showButtons" :key="button.text">
          <OperationButton
            :text="getText(button, row, $index)"
            :el="getButtonEl(button)"
            :el-props="getButtonElProps(button, row, $index)"
            :icon="button.icon"
            :tooltip-props="button.tooltipProps"
            :confirm-el="getConfirmEl(button)"
            :confirm-props="getConfirmProps(button, row, $index, rest)"
            @buttonClick="e => handleButtonClick(button, row, $index, rest, e)"
            @confirm="e => handleConfirm(button, row, $index, rest, e)"
            @cancel="e => handleCancel(button, row, $index, rest, e)"
          />
        </template>

        <!-- 隐藏的按钮 -->
        <el-dropdown v-if="getButtons(row, $index).showMore" trigger="click" :hide-on-click="hideOnClick">
          <span :class="ns.e('more')">
            <span :class="ns.em('more', 'text')">更多</span>
            <slot name="operation-more-icon">
              <el-icon><ArrowDownBold /></el-icon>
            </slot>
          </span>

          <!-- 下拉按钮 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="button in getButtons(row, $index).hideButtons"
                :key="getText(button, row, $index)"
              >
                <OperationButton
                  :text="getText(button, row, $index)"
                  :el="getButtonEl(button)"
                  :el-props="getButtonElProps(button, row, $index)"
                  :icon="button.icon"
                  :tooltip-props="button.tooltipProps"
                  :confirm-el="getConfirmEl(button)"
                  :confirm-props="getConfirmProps(button, row, $index, rest)"
                  @buttonClick="e => handleButtonClick(button, row, $index, rest, e)"
                  @confirm="e => handleConfirm(button, row, $index, rest, e)"
                  @cancel="e => handleCancel(button, row, $index, rest, e)"
                />
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </template>
  </el-table-column>
</template>
