<script setup lang="ts">
import type { FormItemInstance } from "element-plus";
import type { FormItemColumn, FieldBaseValueType } from "./types";
import { ElFormItem, ElTooltip, ElDivider, ElUpload, ElIcon } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { addUnit } from "@/utils";
import { ComponentNameEnum } from "./types";
import { formatValue, hyphenToCamelCase } from "./helper";
import { componentMap } from "./helper/component-map";
import Checkbox from "./components/checkbox.vue";
import Radio from "./components/radio.vue";
import Select from "./components/select.vue";
import Tree from "./components/tree.vue";

defineOptions({ name: "ProFormItem" });

export interface ProFormItemProps {
  prop: FormItemColumn["prop"];
  label?: FormItemColumn["label"];
  hasLabel?: FormItemColumn["hasLabel"];
  width?: FormItemColumn["width"];
  el?: FormItemColumn["el"];
  elProps?: FormItemColumn["elProps"];
  elSlots?: FormItemColumn["elSlots"];
  options?: FormItemColumn["options"];
  optionField?: FormItemColumn["optionField"];
  formItemProps?: FormItemColumn["formItemProps"];
  defaultValue?: FormItemColumn["defaultValue"];
  tooltip?: FormItemColumn["tooltip"];
  renderLabel?: FormItemColumn["renderLabel"];
  renderEl?: FormItemColumn["renderEl"];
  // modelProp?: string; // model 的 key
}

const props = withDefaults(defineProps<ProFormItemProps>(), {
  el: "ElInput",
  label: "",
  hasLabel: true,
  elProps: () => ({}),
  elSlots: () => ({}),
  options: () => [],
  optionField: () => ({ label: "label", value: "value", children: "children", disabled: "disabled" }),
  formItemProps: () => ({}),
  defaultValue: undefined,
  tooltip: undefined,
  renderLabel: undefined,
  renderEl: undefined,
});

const model = defineModel<FieldBaseValueType | any>({ required: false });
const enums = ref<Recordable[]>([]);

// 存储每一个 ElFormItem 实例
const formItemComponentsRef = useTemplateRef<FormItemInstance>("formItemComponentsRef");
// 存储表单组件实例
const formComponentRef = useTemplateRef<Component>("formComponentRef");

const formEl = computed(() => hyphenToCamelCase(toValue(props.el)) as ComponentNameEnum);
const labelValue = computed(() => toValue(props.label));
const hasLabelValue = computed(() => toValue(props.hasLabel));
const withValue = computed(() => addUnit(toValue(props.width)));
const formItemPropsValue = computed(() => toValue(props.formItemProps));

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

  let value = await formatValue<FormItemColumn["options"]>(options, [model.value]);
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

// 是否有清除按钮 (当有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const { defaultValue } = props;
  const { clearable } = elPropsValue.value;
  return clearable ?? (defaultValue === null || defaultValue === undefined);
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

// 渲染自定义插槽
const RenderElSlot = () => {
  const { renderEl } = props;
  return renderEl?.(slotParams.value);
};

const RenderLabelSlot = ({ label }: { label: string }) => {
  const { renderLabel } = props;
  return renderLabel?.(label, slotParams.value);
};

const RenderTooltipDefaultSlot = () => {
  const { tooltip } = props;
  return tooltip?.render?.();
};

const RenderTooltipContentSlot = () => {
  const { tooltip } = props;
  return tooltip?.contentRender?.();
};

defineExpose({
  formItemComponentsRef,
  formComponentRef,
});
</script>

<template>
  <el-form-item
    ref="formItemComponentsRef"
    :label="hasLabelValue ? labelValue + '' : ''"
    :prop="prop"
    class="plus-form-item"
    v-bind="formItemProps"
    :label-width="hasLabelValue ? formItemPropsValue?.labelWidth : '0px'"
  >
    <template v-if="hasLabelValue" #label="{ label }">
      <RenderLabelSlot v-if="!!renderLabel" :label />

      <slot v-else :name="`${prop}-label`" v-bind="slotParams">
        {{ label }}
      </slot>

      <el-tooltip v-if="tooltip" placement="top" effect="dark" v-bind="tooltip">
        <RenderTooltipDefaultSlot v-if="!!tooltip.render" />

        <template v-if="!!tooltip.contentRender" #content>
          <RenderTooltipContentSlot />
        </template>

        <slot name="tooltip-icon">
          <el-icon :size="16">
            <QuestionFilled />
          </el-icon>
        </slot>
      </el-tooltip>
    </template>

    <RenderElSlot v-if="!!renderEl" />

    <Tree
      v-else-if="formEl === ComponentNameEnum.EL_TREE"
      :data="enums"
      v-model="model"
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
      ref="formComponentRef"
      v-model:file-list="model"
      :clearable
      v-bind="{ ...elPropsValue, ...placeholder }"
      :style="{ width: withValue }"
    />

    <component
      v-if="childComponentMap[formEl]"
      :is="componentMap[formEl]"
      ref="formComponentRef"
      v-model="model"
      :clearable
      v-bind="{ ...elPropsValue, ...placeholder }"
      :style="{ width: withValue }"
    >
      <component :is="childComponentMap[formEl]" :options="enums" :optionField :el="formEl" />

      <template v-for="(elSlot, key) in elSlots" :key="key" #[key]="data">
        <component :is="elSlot" v-bind="{ ...slotParams, ...data }" />
      </template>
    </component>

    <component
      v-else-if="formEl"
      :is="componentMap[formEl]"
      ref="formComponentRef"
      v-model="model"
      :clearable
      v-bind="{ ...elPropsValue, ...placeholder }"
      :data="formEl === ComponentNameEnum.EL_TREE_SELECT ? enums : []"
      :options="[ComponentNameEnum.EL_CASCADER, ComponentNameEnum.EL_SELECT_V2].includes(formEl) ? enums : []"
      :style="{ width: withValue }"
    >
      <template v-for="(elSlot, key) in elSlots" :key="key" #[key]="data">
        <component :is="elSlot" v-bind="{ ...slotParams, ...data }" />
      </template>
    </component>
  </el-form-item>
</template>
