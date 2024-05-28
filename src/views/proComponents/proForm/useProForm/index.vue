<template>
  <el-space fill>
    <el-card shadow="never" header="UseForm 操作">
      <el-space wrap>
        <el-button @click="changeCol(false)">禁用栅格</el-button>
        <el-button @click="changeCol(true)">使用栅格</el-button>
        <el-button @click="changeLabelWidth(150)">更改 labelWidth</el-button>
        <el-button @click="changeLabelWidth('auto')">还原 labelWidth</el-button>
        <el-button @click="changeSize('large')">更改 size</el-button>
        <el-button @click="changeSize('default')">还原 size</el-button>
        <el-button @click="changeDisabled(true)">禁用表单</el-button>
        <el-button @click="changeDisabled(false)">还原表单</el-button>
        <el-button @click="changeSchema(true)">删除选择器</el-button>
        <el-button @click="changeSchema(false)">添加选择器</el-button>
        <el-button @click="setValue(false)">设置表单值</el-button>
        <el-button @click="setValue(true)">还原表单值</el-button>
        <el-button @click="setSelectLabel">设置选择器 label</el-button>
        <el-button @click="addFormItem">添加子项</el-button>
        <el-button @click="formValidation">表单验证</el-button>
        <el-button @click="verifyReset">表单重置</el-button>
        <el-button @click="inoutFocus">输入框聚焦</el-button>
        <el-button @click="inoutValidation">输入框表单验证</el-button>
      </el-space>
    </el-card>

    <el-card>
      <ProForm
        :elFormProps="elFormProps"
        :schema="schema"
        v-model="model"
        @register="formRegister"
        @validate="formValidate"
      />
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="UseProForm">
import { ProForm, type FormSchemaProps, type ProElFormProps, useProForm } from "@/components";
import type { ComponentSize, FormItemProp, InputInstance } from "element-plus";

const { formRegister, formMethods } = useProForm();
const {
  setProps,
  delSchema,
  addSchema,
  setValues,
  setSchema,
  getComponentExpose,
  getFormItemExpose,
  getElFormExpose,
  getFormData,
} = formMethods;

const model = ref<Record<string, any>>({});

// 表单整体配置项
const elFormProps: ProElFormProps = {
  inline: false,
  labelPosition: "right",
  labelWidth: 120,
  size: "default",
  disabled: false,
  labelSuffix: " :",
};

// 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
const schema = reactive<FormSchemaProps[]>([
  {
    formItem: { required: true },
    label: "输入框",
    prop: "input",
    el: "el-input",
  },
  {
    formItem: { required: true },
    label: "选择器",
    prop: "select",
    el: "el-select",
    enum: [
      {
        label: "option1",
        value: "1",
      },
      {
        label: "option2",
        value: "2",
      },
    ],
  },
  {
    prop: "radio",
    label: "单选框",
    el: "el-radio-group",
    isHidden: true,
    defaultValue: "1",
    enum: [
      {
        label: "option-1",
        value: "1",
      },
      {
        label: "option-2",
        value: "2",
      },
    ],
  },
  {
    prop: "checkbox",
    label: "多选框",
    el: "el-checkbox",
    isDestroy: true,
    defaultValue: "1",
    enum: [
      {
        label: "option-1",
        value: "1",
      },
      {
        label: "option-2",
        value: "2",
      },
      {
        label: "option-3",
        value: "3",
      },
    ],
  },
  {
    label: "日期选择器",
    prop: "datePicker",
    el: "el-date-picker",
    props: { type: "date" },
  },
  {
    label: "时间选择器",
    prop: "timeSelect",
    el: "el-time-select",
  },
  {
    label: "树形选择",
    prop: "treeSelect",
    el: "el-tree-select",
    enum: () => getTreeSelectData(), // 模拟远程获取数据
  },
]);

const changeCol = (col: boolean) => {
  setProps({
    useCol: col,
  });
};

const changeLabelWidth = (width: number | string) => {
  setProps({
    elFormProps: { labelWidth: width },
  });
};

const changeSize = (size: ComponentSize) => {
  setProps({
    elFormProps: { size },
  });
};
const changeDisabled = (bool: boolean) => {
  setProps({
    elFormProps: { disabled: bool },
  });
};

const changeSchema = (del: boolean) => {
  if (del) {
    delSchema("select");
  } else if (!del && schema[1].prop !== "select") {
    addSchema(
      {
        formItem: { required: true },
        label: "选择器",
        prop: "select",
        el: "el-select",
        enum: [
          {
            label: "option1",
            value: "1",
          },
          {
            label: "option2",
            value: "2",
          },
        ],
      },
      1
    );
  }
};

const setValue = async (reset: boolean) => {
  const elFormExpose = await getElFormExpose();
  if (reset) {
    elFormExpose?.resetFields();
  } else {
    setValues({
      input: "输入框",
      select: "2",
      radio: "2",
      checkbox: ["1", "3"],
      datePicker: "2022-01-27",
      timeSelect: "17:00",
      field8: [
        {
          name: "element-plus-logo.svg",
          url: "https://element-plus.org/images/element-plus-logo.svg",
        },
        {
          name: "element-plus-logo2.svg",
          url: "https://element-plus.org/images/element-plus-logo.svg",
        },
      ],
    });
    const formData = await getFormData();
    console.log(formData);
  }
};

const index = ref(7);

const setSelectLabel = () => {
  setSchema([
    {
      prop: "select",
      field: "label",
      value: `选择器 ${index.value}`,
    },
    {
      prop: "select",
      field: "enum",
      value: [
        {
          label: "option-1",
          value: "1",
        },
        {
          label: "option-2",
          value: "2",
        },
        {
          label: "option-3",
          value: "3",
        },
      ],
    },
  ]);
  index.value++;
};

const addFormItem = () => {
  if (unref(index) % 2 === 0) {
    addSchema({
      prop: `input${unref(index)}`,
      label: `输入框 ${unref(index)}`,
      el: "el-input",
    });
  } else {
    addSchema(
      {
        prop: `input${unref(index)}`,
        label: `输入框 ${unref(index)}`,
        el: "el-input",
      },
      unref(index)
    );
  }
  index.value++;
};

const formValidation = async () => {
  const elFormExpose = await getElFormExpose();
  elFormExpose?.validate(isValid => {
    console.log(isValid);
  });
};

const verifyReset = async () => {
  const elFormExpose = await getElFormExpose();
  elFormExpose?.resetFields();
};

const inoutFocus = async () => {
  const inputEl: InputInstance = await getComponentExpose("input");
  inputEl?.focus();
};

const inoutValidation = async () => {
  const formItem = await getFormItemExpose("input");
  const inputEl: InputInstance = await getComponentExpose("input");
  inputEl?.focus();
  formItem?.validate("focus", (val: boolean) => {
    console.log(val);
  });
};

const formValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.log(prop, isValid, message);
};

const treeSelectData = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [
          {
            value: "1-1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [
          {
            value: "2-1-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [
          {
            value: "2-2-1",
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [
          {
            value: "3-1-1",
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [
          {
            value: "3-2-1",
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];

// 模拟远程加载
const getTreeSelectData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(treeSelectData);
    }, 3000);
  });
};
</script>
