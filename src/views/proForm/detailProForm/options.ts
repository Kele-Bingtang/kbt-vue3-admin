import type { FormOptionsProps } from "@/components";
import type { FormRules } from "element-plus";

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入 Title", trigger: "blur" }],
  dueDate: [{ required: true, message: "请选择 Due Date", trigger: "blur" }],
  status: [{ required: true, message: "请输入 Status", trigger: "blur" }],
  priority: [{ required: true, message: "请输入 Priority", trigger: "blur" }],
  owner: [{ required: true, message: "请输入 Owner", trigger: "blur" }],
});

export const options: FormOptionsProps = {
  form: {
    inline: true,
    labelPosition: "right",
    labelWidth: "120px",
    size: "default",
    disabled: false,
    labelSuffix: " :",
    fixWidth: true,
    rules: rules,
  },
  columns: [
    {
      formItem: { label: "Title", prop: "title", br: true },
      attrs: { el: "el-input", props: { clearable: true, placeholder: "请输入 TicketDesc" } },
    },
    {
      formItem: { label: "EventStarTime", prop: "eventStarTime" },
      attrs: {
        el: "el-date-picker",
        props: {
          type: "datetime",
          clearable: true,
          placeholder: "请输入 StarTime",
          valueFormat: "YYYY-MM-DD HH:mm:ss",
        },
      },
    },
    {
      formItem: { label: "EventEndTime", prop: "eventEndTime" },
      attrs: {
        el: "el-date-picker",
        props: { type: "datetime", clearable: true, placeholder: "请输入 EndTime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      },
    },
    {
      formItem: { label: "Due Date", prop: "dueDate" },
      attrs: {
        el: "el-date-picker",
        props: { placeholder: "请输入 DueDate", type: "date", valueFormat: "YYYY-MM-DD" },
      },
    },
    {
      formItem: { label: "Status", prop: "status" },
      attrs: {
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
    },
    {
      formItem: { label: "Priority", prop: "priority" },
      attrs: {
        el: "el-select",
        fieldNames: { value: "OptionValue", label: "OptionDesc" },
        enum: [
          { OptionValue: "高", OptionDesc: "高" },
          { OptionValue: "中", OptionDesc: "中" },
          { OptionValue: "低", OptionDesc: "低" },
        ],
        props: { placeholder: "请选择 Priority", filterable: true },
      },
    },
    {
      formItem: { label: "Category", prop: "category" },
      attrs: {
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
    },
    {
      formItem: { label: "Sub Category", prop: "subCategory" },
      attrs: { el: "el-select", props: { placeholder: "请选择 Sub Category", filterable: true } },
    },
    {
      formItem: { label: "Owner", prop: "owner" },
      attrs: {
        el: "el-select",
        enum: [
          { value: "k100338", label: "Kobe Liu", subValue: "智能制造科" },
          { value: "j100378", label: "Jessany Liu", subValue: "IPS 科" },
          { value: "p100339", label: "Peter Yu", subValue: "CIM 科" },
        ],
        subProp: "ownerDept",
        defaultValue: "",
        props: {
          placeholder: "请选择 Owner",
          filterable: true,
          onChange: (val: string) => {
            console.log(val);
          },
        },
      },
    },
    {
      formItem: { label: "OwnerDept", prop: "ownerDept" },
      attrs: {
        el: "el-input",
        defaultValue: "",
        props: { placeholder: "请输入 OwnerDept", filterable: true },
      },
    },
    {
      formItem: { label: "Root Cause", prop: "rootCause", br: true },
      attrs: {
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
    },
    {
      formItem: { label: "Description", prop: "description", br: true },
      attrs: { el: "wang-editor", props: { placeholder: "请输入 Description" } },
    },
  ],
};
