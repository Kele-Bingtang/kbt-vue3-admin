import { useInstall } from "@/utils";
import index from "./src/index.vue";

export * from "./src/types";
export * from "./src/helper";
export { useProForm } from "./src/composables/use-form";

export const ProForm = useInstall(index);

export default index;
