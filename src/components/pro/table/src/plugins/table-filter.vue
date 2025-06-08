<script setup lang="ts">
import type { ModelBaseValueType, ProFormItemInstance } from "@/components/pro/form-item";
import type { TableFilterProps } from "../types";
import { computed } from "vue";
import { ElPopover, ElIcon, ElButton } from "element-plus";
import { Filter } from "@element-plus/icons-vue";
import { useNamespace } from "@/composables";
import { isEmpty } from "@/utils";
import { hyphenToCamelCase } from "@/components/pro/form-item";
import ProFormItem from "@/components/pro/form-item";

defineOptions({ name: "TableFilter" });

interface TableFilterEmits {
  filter: [model: ModelBaseValueType];
  clear: [model: ModelBaseValueType];
  reset: [];
}

const props = withDefaults(defineProps<TableFilterProps>(), {
  enabled: false,
  el: "ElInput",
  rule: "eq",
  prop: "",
  formColumn: () => ({}),
  popoverProps: () => ({}),
});

const emits = defineEmits<TableFilterEmits>();

const ns = useNamespace();

const model = defineModel<ModelBaseValueType>({ required: false });
const proFormItemInstance = useTemplateRef<ProFormItemInstance>("proFormItemInstance");

const prop = computed(() => props.prop ?? props.formColumn.prop);
const elProps = computed(() => ({ ...props.formColumn.elProps, teleported: false }));
const el = computed(() => {
  const elValue = hyphenToCamelCase(toValue(props.el));
  return elValue === "ElSelect" ? "CheckBoxSelect" : elValue || "ElInput";
});

// 事件处理方法
const handleFilter = () => {
  emits("filter", model.value);
};

const handleClear = () => {
  proFormItemInstance.value?.elFormItemInstance?.resetField();
  handleFilter();
  emits("clear", model.value);
};

const handleReset = () => {
  model.value = undefined;
  emits("reset");
};
</script>

<template>
  <ElPopover
    v-if="enabled"
    :width="popoverProps?.width || 230"
    :trigger="popoverProps?.trigger || 'click'"
    v-bind="popoverProps"
  >
    <!-- 过滤图标 -->
    <template #reference>
      <ElIcon
        style="margin-left: 2px; vertical-align: -2px; cursor: pointer"
        class="theme-color-hover"
        :color="isEmpty(model) ? 'inherit' : `var(--${ns.elNamespace}-color-primary)`"
        @click.stop
      >
        <Filter />
      </ElIcon>
    </template>

    <!-- 过滤内容区域 -->
    <div class="filter-content">
      <ProFormItem
        ref="proFormItemInstance"
        v-model="model"
        v-bind="formColumn"
        :prop
        :el
        :show-label="false"
        :el-props
      />

      <div style="display: flex; justify-content: space-between; margin-top: 10px">
        <ElButton @click="handleReset">重置</ElButton>
        <div>
          <ElButton @click="handleClear">清除</ElButton>
          <ElButton @click="handleFilter">筛选</ElButton>
        </div>
      </div>
    </div>
  </ElPopover>
</template>
