import { useInstall } from "@/utils";
import index from "./src/index.vue";
export type { ProFormProps, ProFormOnEmits } from "./src/index.vue";
import Tree from "./src/components/tree.vue";
import ProFormItem from "./src/form-item.vue";

// export * from "./src/types";
// export * from "./src/helper";

export { Tree as TreeBeta, ProFormItem as ProFormItemBeta };

export const ProFormBeta = useInstall(index);

export default index;
