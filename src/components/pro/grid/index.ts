import { useInstall } from "@/utils";
import index from "./src/index.vue";
import gridItem from "./src/components/grid-item.vue";

export { type GridProps, type BreakPoint, type Responsive } from "./src/index.vue";
export { type GridItemProps } from "./src/components/grid-item.vue";
export const Grid = useInstall(index);
export const GridItem = useInstall(gridItem);

export type GridInstance = InstanceType<typeof index>;

export default index;
