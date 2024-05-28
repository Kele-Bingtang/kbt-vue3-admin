import { useInstall } from "@/utils";
import index from "./src/index.vue";
export type { ProSearchProps, ProSearchSchemaProps, ActionPosition } from "./src/index.vue";

export { useProSearch } from "./src/hooks/useProSearch";

export const ProSearch = useInstall(index);

export type ProSearchInstance = InstanceType<typeof index>;

export default index;
