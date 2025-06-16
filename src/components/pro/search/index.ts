import { useInstall } from "@/utils";
import index from "./src/index.vue";
export type { ProSearchExpose } from "./src/index.vue";

export * from "./src/types";

export { useProSearch } from "./src/composables/use-search";

export const ProSearch = useInstall(index);

export type ProSearchInstance = InstanceType<typeof index>;

export default index;
