import { useInstall } from "@/utils";
import index, { type ProFormProps } from "./src/index.vue";
import Tree from "./src/components/Tree.vue";
import ProFormItem from "./src/components/ProFormItem.vue";

export * from "./src/interface";
export * from "./src/utils";

export { Tree, ProFormItem, type ProFormProps };

export const ProForm = useInstall(index);

export default index;
