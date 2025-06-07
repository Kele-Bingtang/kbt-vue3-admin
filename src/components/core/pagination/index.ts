import { useInstall } from "@/utils";
import index, { defaultPageInfo } from "./src/index.vue";

export { defaultPageInfo };
export type * from "./src/types";

export const Pagination = useInstall(index);

export default index;
