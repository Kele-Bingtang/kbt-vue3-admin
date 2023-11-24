import type { OptionsProps } from "@/components/ProForm/interface";

export const options: OptionsProps = {
  form: {
    inline: true,
    labelPosition: "right",
    labelWidth: "120px",
    size: "default",
    disabled: false,
    labelSuffix: " :",
    fixWidth: true,
  },
  columns: [
    {
      formItem: { label: "Ticket Desc", prop: "ticketDesc", required: true, br: true },
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
      formItem: { label: "Due Date", prop: "dueDate", required: true },
      attrs: {
        el: "el-date-picker",
        props: { placeholder: "请输入 DueDate", type: "date", valueFormat: "YYYY-MM-DD" },
      },
    },
    {
      formItem: { label: "Status", prop: "status", required: true },
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
      formItem: { label: "Priority", prop: "priority", required: true },
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
      attrs: { el: "el-input", props: { placeholder: "请选择 Category", filterable: true } },
    },
    {
      formItem: { label: "Sub Category", prop: "subCategory" },
      attrs: { el: "el-input", props: { placeholder: "请选择 Sub Category", filterable: true } },
    },
    {
      formItem: { label: "Owner", prop: "owner", required: true },
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
