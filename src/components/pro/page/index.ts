import { useInstall } from "@/utils";
import index from "./src/index.vue";

export type * from "./src/types";

export const ProPage = useInstall(index);

export default index;
