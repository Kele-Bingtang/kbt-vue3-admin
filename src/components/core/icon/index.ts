import { useInstall } from "@/utils";
import index from "./src/index.vue";
import FontIcon from "./src/components/ts/iconfont";
import IconifyOnline from "./src/components/ts/iconifyOnline";
import IconifyOffline from "./src/components/ts/iconifyOffline";

export { FontIcon, IconifyOnline, IconifyOffline };

export * from "./src/useIcon";
export * from "./src/iconType";

export const Icon = useInstall(index);

export default index;
