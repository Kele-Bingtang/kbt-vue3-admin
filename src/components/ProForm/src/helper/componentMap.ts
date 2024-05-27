import type { Component } from "vue";
import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElAutocomplete,
  ElDivider,
  ElTreeSelect,
} from "element-plus";
import { WangEditor, Tinymce } from "@/components";
import Tree from "./components/Tree.vue";
import { type ComponentName } from "../interface";

const componentMap: Record<ComponentName, Component> = {
  Input: ElInput,
  InputNumber: ElInputNumber,
  Select: ElSelect,
  SelectV2: ElSelectV2,
  Tree: Tree,
  TreeSelect: ElTreeSelect,
  Cascader: ElCascader,
  TimePicker: ElTimePicker,
  DatePicker: ElDatePicker,
  TimeSelect: ElTimeSelect,
  Switch: ElSwitch,
  Slider: ElSlider,
  RadioGroup: ElRadioGroup,
  RadioButton: ElRadioGroup,
  CheckboxGroup: ElCheckboxGroup,
  CheckboxButton: ElCheckboxGroup,
  Autocomplete: ElAutocomplete,
  Rate: ElRate,
  ColorPicker: ElColorPicker,
  Transfer: ElTransfer,
  Divider: ElDivider,
  WangEditor: WangEditor,
  Tinymce: Tinymce,
};

export { componentMap };
