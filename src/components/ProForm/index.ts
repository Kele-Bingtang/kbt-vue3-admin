import { useInstall } from "@/utils";
import index from "./src/index.vue";
import Tree from "./src/components/Tree.vue";

export * from "./src/interface";
export * from "./src/utils";

export { Tree };

export const ProForm = useInstall(index);

export default index;
