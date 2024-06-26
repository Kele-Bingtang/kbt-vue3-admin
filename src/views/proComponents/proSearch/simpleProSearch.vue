<template>
  <el-space fill>
    <ProSearch :schema="schema" v-model="model" />
    {{ model }}
  </el-space>
</template>

<script setup lang="ts" name="SimpleProSearch">
import { ProSearch, type ProSearchSchemaProps } from "@/components";

const model = ref({});

const links = ref<{ value: string; link: string }[]>([]);

const querySearch = (queryString: string, cb) => {
  const results = queryString ? links.value.filter(createFilter(queryString)) : links.value;
  // call callback function to return suggestion objects
  cb(results);
};

const createFilter = (queryString: string) => {
  return (restaurant: { value: string; link: string }) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const schema: ProSearchSchemaProps[] = [
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
    label: "下拉自动补全",
    prop: "autocomplete",
    el: "el-autocomplete",
    props: { fetchSuggestions: querySearch },
  },
];

onMounted(() => {
  links.value = loadAll();
});

const loadAll = () => {
  return [
    { value: "vue", link: "https://github.com/vuejs/vue" },
    { value: "element", link: "https://github.com/ElemeFE/element" },
    { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
    { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "vuex", link: "https://github.com/vuejs/vuex" },
    { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
    { value: "babel", link: "https://github.com/babel/babel" },
  ];
};
</script>
