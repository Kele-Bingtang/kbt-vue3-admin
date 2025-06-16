import { useInstall } from "@/utils";
import index from "./src/index.vue";
import tableMain from "./src/table-main.vue";

export type * from "./src/types";
export type { TableSetProps } from "./src/composables/use-table-api";

export * from "./src/helper";
export * from "./src/composables/use-table";

export const ProTable = useInstall(index);
export const ProTableMain = useInstall(tableMain);

export default index;
