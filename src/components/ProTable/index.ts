import { useInstall } from "@/utils";
import index from "./src/index.vue";

export * from "./src/interface";
export * from "./src/utils";
export { type DialogForm } from "./src/index.vue";

export const ProTable = useInstall(index);

export default index;
