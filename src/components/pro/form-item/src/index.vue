<script setup lang="ts">
import type { FormItemInstance } from "element-plus";
import type { FormItemColumnProps, ModelBaseValueType } from "./types";
import { ElFormItem, ElTooltip, ElDivider, ElUpload, ElIcon } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { addUnit, isObject } from "@/utils";
import { formatValue, getProp, hyphenToCamelCase, setProp, componentMap, ComponentNameEnum } from "./helper";
import Checkbox from "./components/checkbox.vue";
import Radio from "./components/radio.vue";
import Select from "./components/select.vue";
import Tree from "./components/tree.vue";

defineOptions({ name: "ProFormItem" });

const props = withDefaults(defineProps<FormItemColumnProps>(), {
  prop: "",
  label: "",
  showLabel: true,
  width: "",
  el: "ElInput",
  elProps: () => ({}),
  elSlots: () => ({}),
  options: () => [],
  optionField: () => ({ label: "label", value: "value", children: "children", disabled: "disabled" }),
  formItemProps: () => ({}),
  clearable: true,
  tooltip: undefined,
  renderLabel: undefined,
  renderEl: undefined,
  getFormat: undefined,
});

const model = defineModel<ModelBaseValueType>({ required: false });
const enums = ref<Recordable[]>([]);

// 存储每一个 ElFormItem 实例
const elFormItemInstance = useTemplateRef<FormItemInstance>("elFormItemInstance");
// 存储每一个表单组件实例
const elInstance = useTemplateRef<Component>("elInstance");

const formEl = computed(() => hyphenToCamelCase(toValue(props.el)) as ComponentNameEnum);
const labelValue = computed(() => toValue(props.label));
const showLabelValue = computed(() => toValue(props.showLabel));
const withValue = computed(() => addUnit(toValue(props.width)));
const formItemPropsValue = computed(() => toValue(props.formItemProps));

const elModel = computed({
  get: () => {
    const { prop, getFormat } = props;
    // 如果 model 是对象，则取到对应的 prop 值
    if (isObject(model.value) && prop) return getProp(model.value, prop, getFormat);
    return model.value;
  },
  set: val => {
    const { prop } = props;
    if (isObject(model.value) && prop) return setProp(model.value, prop, val);
    model.value = val;
  },
});

// 处理透传的 elProps
const elPropsValue = computed<Recordable>(() => {
  const elPropsConst = toValue(props.elProps) as any;
  const { optionField } = props;
  const label = optionField.label;
  const value = optionField.value;
  const children = optionField.children;
  const formElConst = formEl.value;

  if (formElConst === ComponentNameEnum.EL_TREE_SELECT) {
    return { ...elPropsConst, props: { ...elPropsConst, label, children }, nodeKey: value };
  }

  if (formElConst === ComponentNameEnum.EL_CASCADER) {
    return { ...elPropsConst, props: { ...elPropsConst, label, value, children } };
  }

  if (formElConst === ComponentNameEnum.EL_DATE_PICKER) {
    if (elPropsConst.type === "datetime") return { valueFormat: "YYYY-MM-DD HH:mm:ss", ...elPropsConst };
    if (elPropsConst.type === "date") return { valueFormat: "YYYY-MM-DD", ...elPropsConst };

    return { valueFormat: "YYYY-MM-DD", ...elPropsConst };
  }

  if (formElConst === ComponentNameEnum.EL_TIME_PICKER) return { valueFormat: "HH:mm:ss", ...elPropsConst };

  return elPropsConst;
});

const slotParams = computed(() => ({
  ...props,
  model: model.value,
  label: labelValue.value,
  options: enums.value,
  elProps: elPropsValue.value,
  formItemProps: formItemPropsValue.value,
}));

const initOptions = async () => {
  const { options, optionField } = props;

  let value = await formatValue<FormItemColumnProps["options"]>(options, [model.value]);
  if (!value) return [];

  // 适配接口返回 data
  value = value?.data || value;

  if (formEl.value === ComponentNameEnum.EL_SELECT_V2) {
    // el 为 select-v2 需单独处理
    value = value.map((item: Recordable) => {
      return { ...item, label: item[optionField.label!], value: item[optionField.value!] };
    });
  }

  return value;
};

if (isRef(props.options) || isProxy(props.options)) {
  watch(
    () => props.options,
    async () => {
      enums.value = await initOptions();
    }
  );
}

onMounted(async () => {
  enums.value = await initOptions();
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const { type, isRange, placeholder } = elPropsValue.value;
  if (["datetimerange", "daterange", "monthrange"].includes(type) || isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }
  const placeholderConst = placeholder ?? (formEl.value === ComponentNameEnum.EL_INPUT ? "请输入" : "请选择");

  return { placeholder: placeholderConst };
});

const childComponentMap: Record<string, Component> = {
  [ComponentNameEnum.EL_SELECT]: Select,
  [ComponentNameEnum.EL_RADIO_GROUP]: Radio,
  [ComponentNameEnum.EL_RADIO_BUTTON]: Radio,
  [ComponentNameEnum.EL_CHECKBOX]: Checkbox,
  [ComponentNameEnum.EL_CHECKBOX_GROUP]: Checkbox,
  [ComponentNameEnum.EL_CHECKBOX_BUTTON]: Checkbox,
};

// 获取标题样式
const formatDividerTitle = (labelSize = "default") => {
  if (labelSize === "default") return { fontSize: "16px", fontWeight: 600 };
  if (labelSize === "small") return { fontSize: "14px", fontWeight: 600 };
  if (labelSize === "large") return { fontSize: "18px", fontWeight: 600 };

  return {};
};

const RenderElSlot = () => {
  const { renderEl } = props;
  return renderEl?.(slotParams.value);
};

const RenderLabelSlot = ({ label }: { label: string }) => {
  const { renderLabel } = props;
  return renderLabel?.(label, slotParams.value);
};

// const RenderTooltipDefaultSlot = () => {
//   const { tooltip } = props;
//   return tooltip?.render?.();
// };

// const RenderTooltipContentSlot = () => {
//   const { tooltip } = props;
//   return tooltip?.contentRender?.();
// };

const expose = {
  elFormItemInstance,
  elInstance,
};

defineExpose(expose);
</script>

<template>
  <el-form-item
    ref="elFormItemInstance"
    :label="showLabelValue ? labelValue + '' : ''"
    :prop="prop"
    v-bind="formItemProps"
    :label-width="showLabelValue ? formItemPropsValue?.labelWidth : '0px'"
  >
    <template v-if="showLabelValue" #label="{ label }">
      <!-- 自定义 label 插槽 -->
      <slot :name="`${prop}-label`" v-bind="slotParams">
        <!-- 自定义 label（h、JSX）渲染 -->
        <RenderLabelSlot v-if="!!renderLabel" :label />
        <span v-else>{{ label }}</span>
      </slot>

      <el-tooltip v-if="tooltip" placement="top" effect="dark" v-bind="tooltip">
        <!-- ElToolTip 默认插槽 -->
        <!-- <RenderTooltipDefaultSlot v-if="!!tooltip.render" /> -->
        <component v-if="tooltip.render" :is="tooltip.render()" />
        <!-- ElToolTip content 插槽 -->
        <template v-if="tooltip.contentRender" #content>
          <!-- <RenderTooltipContentSlot /> -->
          <component v-if="tooltip.contentRender" :is="tooltip.contentRender()" />
        </template>
        <slot name="tooltip-icon">
          <el-icon :size="16"><QuestionFilled /></el-icon>
        </slot>
      </el-tooltip>
    </template>

    <!-- 自定义表单组件插槽 -->
    <slot :name="`${prop}-el`" v-bind="slotParams">
      <!-- 自定义表单组件（h、JSX）渲染-->
      <RenderElSlot v-if="!!renderEl" />

      <Tree
        v-else-if="formEl === ComponentNameEnum.EL_TREE"
        :data="enums"
        v-model="elModel"
        v-bind="elPropsValue"
        :style="{ width: withValue }"
      />

      <el-divider v-else-if="formEl === ComponentNameEnum.EL_DIVIDER" v-bind="elPropsValue">
        <span :style="formatDividerTitle(elPropsValue.labelSize)">
          {{ labelValue }}
        </span>
      </el-divider>

      <el-upload
        v-else-if="formEl === ComponentNameEnum.EL_UPLOAD"
        ref="elInstance"
        v-model:file-list="elModel"
        :clearable
        v-bind="{ ...elPropsValue, ...placeholder }"
        :style="{ width: withValue }"
      />

      <component
        v-if="childComponentMap[formEl]"
        :is="componentMap[formEl]"
        ref="elInstance"
        v-model="elModel"
        :clearable
        v-bind="{ ...elPropsValue, ...placeholder }"
        :style="{ width: withValue }"
      >
        <component :is="childComponentMap[formEl]" :options="enums" :optionField :el="formEl" />

        <template v-for="(slot, key) in elSlots" :key="key" #[key]="data">
          <component :is="slot" v-bind="{ ...slotParams, ...data }" />
        </template>
      </component>

      <component
        v-else-if="formEl"
        :is="componentMap[formEl]"
        ref="elInstance"
        v-model="elModel"
        :clearable
        v-bind="{ ...elPropsValue, ...placeholder }"
        :data="formEl === ComponentNameEnum.EL_TREE_SELECT ? enums : []"
        :options="[ComponentNameEnum.EL_CASCADER, ComponentNameEnum.EL_SELECT_V2].includes(formEl) ? enums : []"
        :style="{ width: withValue }"
      >
        <template v-for="(slot, key) in elSlots" :key="key" #[key]="data">
          <component :is="slot" v-bind="{ ...slotParams, ...data }" />
        </template>
      </component>
    </slot>
  </el-form-item>
</template>
