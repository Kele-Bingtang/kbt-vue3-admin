<script setup lang="ts">
import { ElOption, ElOptionGroup } from "element-plus";
import type { FormFieldNamesProps } from "../types";

defineProps<{
  options: Recordable[];
  optionField: FormFieldNamesProps;
}>();
</script>

<template>
  <template v-for="col in options" :key="col[optionField.value]">
    <el-option-group v-if="col?.options?.length" :label="col[optionField.label]">
      <el-option
        v-for="option in col.options"
        :key="option[optionField.value]"
        :label="option[optionField.label]"
        :value="option[optionField.value]"
        :disabled="option[optionField.disabled!]"
      />
    </el-option-group>

    <el-option
      v-else
      :label="col[optionField.label]"
      :value="col[optionField.value]"
      :disabled="col[optionField.disabled!]"
    />
  </template>
</template>
