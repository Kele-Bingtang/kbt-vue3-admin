import { useInstall } from "@/utils";
import index, { type ProSearchSchemaProps } from "./src/index.vue";

export { type ProSearchSchemaProps };

export const ProSearch = useInstall(index);

export default index;
