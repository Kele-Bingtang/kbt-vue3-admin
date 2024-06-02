import type { FormSchemaProps } from "@/components";
import type { FormRules } from "element-plus";

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入 Title", trigger: "blur" }],
  dueDate: [{ required: true, message: "请选择 Due Date", trigger: "blur" }],
  status: [{ required: true, message: "请输入 Status", trigger: "blur" }],
  priority: [{ required: true, message: "请输入 Priority", trigger: "blur" }],
  owner: [{ required: true, message: "请输入 Owner", trigger: "blur" }],
});

export const elFormProps = {
  inline: false,
  labelPosition: "right",
  labelWidth: "120px",
  disabled: false,
  labelSuffix: " :",
  fixWidth: true,
  rules: rules,
};

export const schema: FormSchemaProps[] = [
  {
    label: "Title",
    el: "el-input",
    prop: "title",
    props: { clearable: true, placeholder: "请输入 TicketDesc" },
  },
  {
    label: "EventStarTime",
    prop: "eventStarTime",
    el: "el-date-picker",
    props: {
      type: "datetime",
      clearable: true,
      placeholder: "请输入 StarTime",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
    },
  },
  {
    label: "EventEndTime",
    prop: "eventEndTime",
    el: "el-date-picker",
    props: { type: "datetime", clearable: true, placeholder: "请输入 EndTime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
  },
  {
    label: "Due Date",
    prop: "dueDate",
    el: "el-date-picker",
    props: { placeholder: "请输入 DueDate", type: "date", valueFormat: "YYYY-MM-DD" },
  },
  {
    label: "Status",
    prop: "status",
    el: "el-select",
    fieldNames: { value: "OptionValue", label: "OptionDesc" },
    enum: [
      { OptionValue: "1", OptionDesc: "Open" },
      { OptionValue: "2", OptionDesc: "Hold" },
      { OptionValue: "0", OptionDesc: "Close" },
    ],
    defaultValue: "1",
    props: { placeholder: "请选择 Status", filterable: true },
  },
  {
    label: "Priority",
    prop: "priority",
    el: "el-select",
    fieldNames: { value: "OptionValue", label: "OptionDesc" },
    enum: [
      { OptionValue: "高", OptionDesc: "高" },
      { OptionValue: "中", OptionDesc: "中" },
      { OptionValue: "低", OptionDesc: "低" },
    ],
    props: { placeholder: "请选择 Priority", filterable: true },
  },
  {
    label: "Category",
    prop: "category",
    el: "el-select",
    enum: [
      { value: "Project", label: "Project" },
      { value: "Tool", label: "Tool" },
      { value: "AR", label: "AR" },
    ],
    subProp: "subCategory",
    subEnum: (value: string) => {
      if (value === "Project") {
        return [
          { value: "CIM", label: "CIM" },
          { value: "Rule", label: "Rule" },
        ];
      }
      if (value === "Tool") {
        return [
          { value: "ATNA101", label: "AANA101" },
          { value: "ATNA102", label: "ATNA102" },
        ];
      }
      if (value === "AR") {
        return [
          { value: "OP", label: "OP" },
          { value: "Q", label: "Q" },
        ];
      }
      return [];
    },
    props: { placeholder: "请选择 Category", filterable: true },
  },
  {
    label: "Sub Category",
    prop: "subCategory",
    el: "el-select",
    props: { placeholder: "请选择 Sub Category", filterable: true },
  },
  {
    label: "Owner",
    prop: "owner",
    el: "el-select",
    enum: [
      { value: "k100338", label: "Kobe Liu", subValue: "智能制造科" },
      { value: "j100378", label: "Jessany Liu", subValue: "IPS 科" },
      { value: "p100339", label: "Peter Yu", subValue: "CIM 科" },
    ],
    subProp: "ownerDept",
    props: {
      placeholder: "请选择 Owner",
      filterable: true,
      onChange: (val: string) => {
        console.log(val);
      },
    },
  },
  {
    label: "OwnerDept",
    prop: "ownerDept",
    el: "el-input",
    props: { placeholder: "请输入 OwnerDept", filterable: true },
  },
  {
    col: { span: 24 },
    label: "Root Cause",
    prop: "rootCause",
    el: "el-input",
    props: {
      type: "textarea",
      placeholder: "请输入 RootCause",
      maxlength: "1000",
      showWordLimit: true,
      autocomplete: "off",
      rows: "4",
    },
  },
  {
    col: { span: 24 },
    label: "Description",
    prop: "description",
    el: "wang-editor",
    props: { placeholder: "请输入 Description" },
  },
];
