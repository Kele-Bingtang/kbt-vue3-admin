<script setup lang="ts">
import { type FormColumnProps, ComponentNameEnum, type FieldValueType } from "./types";
import { QuestionFilled } from "@element-plus/icons-vue";
import { formatValue, hyphenToCamelCase, getProp } from "./helper";
import { componentMap } from "./helper/component-map";
import Checkbox from "./components/checkbox.vue";
import Radio from "./components/radio.vue";
import Select from "./components/select.vue";
import Tree from "./components/tree.vue";
import type { FormItemInstance } from "element-plus";

defineOptions({ name: "ProFormItem" });

interface ProFormItemProps {
  prop: FormColumnProps["prop"];
  label?: FormColumnProps["label"];
  hasLabel?: FormColumnProps["hasLabel"];
  el?: FormColumnProps["el"];
  elProps?: FormColumnProps["elProps"];
  elSlots?: FormColumnProps["elSlots"];
  options?: FormColumnProps["options"];
  optionField?: FormColumnProps["optionField"];
  formItemProps?: FormColumnProps["formItemProps"];
  defaultValue?: FormColumnProps["defaultValue"];
  tooltip?: FormColumnProps["tooltip"];
  renderLabel?: FormColumnProps["renderLabel"];
  renderEl?: FormColumnProps["renderEl"];
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

const model = defineModel<FieldValueType>({ required: false });

// 存储每一个 ElFormItem 实例
const formItemComponentsRef = ref<Record<string, FormItemInstance>>({});
// 存储表单组件实例
const formComponentRef = useTemplateRef<Component>("formComponentRef");

const formEl = computed(() => hyphenToCamelCase(props.el) as ComponentNameEnum);
const labelValue = computed(() => unref(props.label));

const enums = ref<Recordable[]>([]);

const initOptions = async () => {
  const { options, optionField } = props;

  let data = await formatValue<FormColumnProps["options"]>(options, [model.value]);
  // 适配接口返回 data
  data = data?.data || data;

  if (formEl.value === ComponentNameEnum.EL_SELECT_V2) {
    // el 为 select-v2 需单独处理
    data = data.map((item: Recordable) => {
      return { ...item, label: item[optionField.label], value: item[optionField.value] };
    });
  }

  return data;
};

onMounted(async () => {
  enums.value = await initOptions();
});

// 处理透传的 elProps
const elProps = computed(() => {
  const { elProps, optionField } = props;
  const label = optionField.label;
  const value = optionField.value;
  const children = optionField.children;
  const formElConst = formEl.value;

  if (formElConst === ComponentNameEnum.EL_TREE_SELECT) {
    return { ...elProps, props: { ...elProps, label, children }, nodeKey: value };
  }

  if (formElConst === ComponentNameEnum.EL_CASCADER) {
    return { ...elProps, props: { ...elProps, label, value, children } };
  }

  if (formElConst === ComponentNameEnum.EL_DATE_PICKER) {
    if (elProps.type === "datetime") return { valueFormat: "YYYY-MM-DD HH:mm:ss", ...elProps };
    if (elProps.type === "date") return { valueFormat: "YYYY-MM-DD", ...elProps };

    return { valueFormat: "YYYY-MM-DD", ...elProps };
  }

  if (formElConst === ComponentNameEnum.EL_TIME_PICKER) return { valueFormat: "HH:mm:ss", ...elProps };

  return elProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const { elProps: { type, isRange, placeholder } = {}, el } = props;
  if (["datetimerange", "daterange", "monthrange"].includes(type) || isRange) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  }
  const placeholderConst = placeholder ?? (hyphenToCamelCase(el) === ComponentNameEnum.EL_INPUT ? "请输入" : "请选择");

  return { placeholder: placeholderConst };
});

// 是否有清除按钮 (当有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const { elProps: { clearable } = {}, defaultValue } = props;
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

// 渲染自定义插槽
const RenderElSlot = () => {
  const { renderEl, prop } = props;
  return renderEl?.({
    model: model.value,
    data: getProp(model.value, prop),
    options: enums,
  });
};

const RenderLabelSlot = ({ label }: { label: string }) => {
  const { renderLabel } = props;
  return renderLabel?.(label, props);
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
    :label="hasLabel ? labelValue + '' : ''"
    :prop="prop"
    class="plus-form-item"
    v-bind="formItemProps"
    :label-width="hasLabel ? formItemProps?.labelWidth : '0px'"
  >
    <template v-if="hasLabel" #label="{ label }">
      <RenderLabelSlot v-if="!!renderLabel" :label />

      <slot v-else :name="`${prop}-label`" v-bind="{ ...props, label, options: enums, elProps }">
        {{ label }}
      </slot>

      <el-tooltip v-if="tooltip" placement="top" effect="dark" v-bind="tooltip">
        <RenderTooltipDefaultSlot v-if="!!tooltip.render" />

        <template v-if="!!tooltip.contentRender" #content>
          <RenderTooltipContentSlot />
        </template>

        <slot name="tooltip-icon">
          <Icon :size="16">
            <QuestionFilled />
          </Icon>
        </slot>
      </el-tooltip>
    </template>

    <RenderElSlot v-if="!!renderEl" />

    <Tree v-else-if="formEl === ComponentNameEnum.EL_TREE" :data="enums" v-model="model" v-bind="{ ...elProps }" />

    <ElUpload
      v-else-if="formEl === ComponentNameEnum.EL_UPLOAD"
      ref="formComponentRef"
      v-model:file-list="model"
      :clearable
      v-bind="{ ...elProps, ...placeholder }"
    />

    <component
      v-else-if="formEl"
      :is="componentMap[formEl]"
      ref="formComponentRef"
      v-model="model"
      :clearable
      v-bind="{ ...elProps, ...placeholder }"
      :data="formEl === ComponentNameEnum.EL_TREE_SELECT ? enums : []"
      :options="[ComponentNameEnum.EL_CASCADER, ComponentNameEnum.EL_SELECT_V2].includes(formEl) ? enums : []"
    >
      <component :is="childComponentMap[formEl]" :options="enums" :optionField :el="formEl" />

      <template v-for="(elSlot, key) in elSlots" :key="key" #[key]="data">
        <component :is="elSlot" v-bind="data" />
      </template>
    </component>
  </el-form-item>
</template>
