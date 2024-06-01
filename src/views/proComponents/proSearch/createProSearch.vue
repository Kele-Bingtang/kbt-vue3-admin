<template>
  <el-space fill>
    <el-card shadow="never" header="createSearchComponent 函数式创建 Template 组件">
      <RenderProSearch></RenderProSearch>
    </el-card>

    <el-card shadow="never" header="createSearch 函数式动态渲染组件到指定元素">
      <div ref="proSearchRef"></div>
    </el-card>
  </el-space>
</template>

<script setup lang="ts" name="CreateProSearch">
import { useProSearch, type ProSearchSchemaProps } from "@/components";

const {
  createMethods: { createSearch, createSearchComponent },
} = useProSearch();

const model = ref<Record<string, any>>({});

/**
 * context 里有 slots 和 attrs，如果元素里有 slots 和 attrs，则必传
 */
const RenderProSearch = (_: any, context: Record<string, any>) => {
  // 函数式创建 Template 组件
  return createSearchComponent(
    {
      schema: schema,
      modeValue: model,
      onSearch: handleSearch,
      onReset: handleSearch,
    },
    context
  );
};

onMounted(() => {
  createSearch("proSearchRef", { schema: schema, modeValue: model, onSearch: handleSearch, onReset: handleSearch });
});

const handleSearch = async (data: Record<string, any>) => {
  console.log(data);
};

const schema: ProSearchSchemaProps[] = reactive([
  {
    label: "姓名",
    prop: "name",
    el: "el-input",
  },
  {
    label: "性别",
    prop: "sex",
    el: "el-select",
    enum: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  },
  {
    label: "年龄",
    prop: "age",
    el: "el-input-number",
    defaultValue: 18,
  },
  {
    label: "状态",
    prop: "status",
    el: "el-select",
    enum: [
      { label: "在职", value: "1" },
      { label: "离职", value: "2" },
    ],
  },
  {
    label: "input 框",
    prop: "input",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input1",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input2",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input3",
    el: "el-input",
  },
  {
    label: "input 框",
    prop: "input4",
    el: "el-input",
  },
]);
</script>

<style lang="scss" scoped></style>
