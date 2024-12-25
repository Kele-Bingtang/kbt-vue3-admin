import { useInstall } from "@/utils";
import index from "./src/index.vue";
import tableMain from "./src/components/TableMain.vue";

export * from "./src/interface";
export * from "./src/helper";
export { type DialogForm, type ProTableOnEmits } from "./src/index.vue";
export { type DialogFormSchemaProps } from "./src/components/DialogForm.vue";
export { useProTable } from "./src/hooks/useProTable";

export const ProTable = useInstall(index);
export const TableMain = useInstall(tableMain);

export default index;
