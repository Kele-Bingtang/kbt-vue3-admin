import { useInstall } from "@/utils";
import index from "./src/index.vue";

export type * from "./src/types";
export type { FormSetProps } from "./src/composables/use-form-api";

export * from "./src/helper";
export * from "./src/composables/use-form";
export { proFormOptionsMapKey } from "./src/types";

export const ProForm = useInstall(index);

export default index;
