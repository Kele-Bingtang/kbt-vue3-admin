import { useInstall } from "@/utils";
import index, { type ProSearchProps, type ProSearchSchemaProps } from "./src/index.vue";

export { useProSearch } from "./src/hooks/useProSearch";
export { type ProSearchProps, type ProSearchSchemaProps };

export const ProSearch = useInstall(index);

export type ProSearchInstance = InstanceType<typeof index>;

export default index;
