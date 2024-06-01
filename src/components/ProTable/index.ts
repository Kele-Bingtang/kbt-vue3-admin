import { useInstall } from "@/utils";
import index from "./src/index.vue";

export * from "./src/interface";
export * from "./src/helper";
export { type DialogForm, type ProTableOnEmits } from "./src/index.vue";
export { type DialogProFormProps } from "./src/components/DialogForm.vue";
export { useProTable } from "./src/hooks/useProTable";

export const ProTable = useInstall(index);

export default index;
