import type { Component } from "vue";
import type { PascalCaseComponentName } from "../types";
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
import Tree from "../components/tree.vue";
import CheckBoxSelect from "../components/checkbox.vue";
import WangEditor from "@/components/editor/wang-editor/index";
import Tinymce from "@/components/editor/tinymce/index";
import IconPicker from "@/components/view/icon-picker/index";

/**
 * 组件名枚举，key 要求是大写和 PascalCase 格式（自动与 componentMap 映射），value 则是 el 的字面量（使用配置项的 el 时用到）
 */
export enum ComponentNameEnum {
  EL_INPUT = "ElInput",
  EL_INPUT_NUMBER = "ElInputNumber",
  EL_SELECT = "ElSelect",
  EL_SELECT_V2 = "ElSelectV2",
  EL_TREE = "ElTree",
  EL_TREE_SELECT = "ElTreeSelect",
  EL_CASCADER = "ElCascader",
  EL_DATE_PICKER = "ElDatePicker",
  EL_TIME_PICKER = "ElTimePicker",
  EL_TIME_SELECT = "ElTimeSelect",
  EL_SWITCH = "ElSwitch",
  EL_SLIDER = "ElSlider",
  EL_RADIO = "ElRadio",
  EL_RADIO_GROUP = "ElRadioGroup",
  EL_RADIO_BUTTON = "ElRadioButton",
  EL_CHECKBOX = "ElCheckbox",
  EL_CHECKBOX_GROUP = "ElCheckboxGroup",
  EL_CHECKBOX_BUTTON = "ElCheckboxButton",
  EL_AUTOCOMPLETE = "ElAutocomplete",
  EL_RATE = "ElRate",
  EL_COLOR_PICKER = "ElColorPicker",
  EL_TRANSFER = "ElTransfer",
  EL_DIVIDER = "ElDivider",
  EL_UPLOAD = "ElUpload",
  CHECK_BOX_SELECT = "CheckBoxSelect",
  WANG_EDITOR = "WangEditor",
  TINYMCE = "Tinymce",
  ICON_PICKER = "IconPicker",
}

// 这里可以注册其他组件，先需要在 PascalCaseComponentName 里添加 el 名，再在这里进行组件映射
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
