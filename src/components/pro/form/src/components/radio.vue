<script setup lang="ts">
import { ElRadio, ElRadioButton } from "element-plus";
import { ComponentNameEnum, type FormFieldNamesProps } from "../types";
import { computed } from "vue";

const props = defineProps<{
  options: Recordable[];
  optionField: FormFieldNamesProps;
  el: ComponentNameEnum;
}>();

// 计算要渲染的组件类型
const radioComponent = computed(() => (props.el === ComponentNameEnum.EL_RADIO_BUTTON ? ElRadioButton : ElRadio));
</script>

<template>
  <component
    v-for="option in options"
    :is="radioComponent"
    :key="option[optionField.value]"
    :disabled="option[optionField.disabled]"
    :label="option[optionField.label]"
    :value="option[optionField.value]"
  />
</template>
