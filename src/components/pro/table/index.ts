import { useInstall } from "@/utils";
import index from "./src/index.vue";
import tableMain from "./src/table-main.vue";

export * from "./src/types";

export const ProTable = useInstall(index);
export const TableMain = useInstall(tableMain);

export default index;
