import type { Component } from "vue";
import {
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadio,
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
  ElUpload,
} from "element-plus";
import type { PascalCaseComponentName } from "../types";
import Tree from "../components/tree.vue";
import CheckBoxSelect from "../components/checkbox.vue";
import WangEditor from "@/components/editor/wang-editor/index";
import Tinymce from "@/components/editor/tinymce/index";
import IconPicker from "@/components/view/icon-picker/index";

// 这里可以注册其他组件，先需要在 PascalCaseComponentName 里添加 el 名，再在这里进行映射
const componentMap: Record<PascalCaseComponentName, Component> = {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElSelectV2,
  ElTree: Tree,
  ElTreeSelect,
  ElCascader,
  ElDatePicker,
  ElTimePicker,
  ElTimeSelect,
  ElSwitch,
  ElSlider,
  ElRadio,
  ElRadioGroup,
  ElRadioButton: ElRadioGroup,
  ElCheckbox,
  ElCheckboxGroup,
  ElCheckboxButton: ElCheckboxGroup,
  ElAutocomplete,
  ElRate,
  ElColorPicker,
  ElTransfer,
  ElDivider,
  ElUpload,
  CheckBoxSelect,
  WangEditor,
  Tinymce,
  IconPicker,
};

export { componentMap };
