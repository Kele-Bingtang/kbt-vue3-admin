import { useInstall } from "@/utils";
import index from "./src/index.vue";
import gridItem from "./src/components/GridItem.vue";

export { type BreakPoint, type Responsive } from "./src/index.vue";
export const Grid = useInstall(index);
export const GridItem = useInstall(gridItem);

export default index;
