import { useInstall } from "@/utils";
import index from "./src/index.vue";
import SvgIcon from "./src/components/svg-icon.vue";
import FontIcon from "./src/components/font-icon.vue";
import IconifyOnline from "./src/components/iconify-online.vue";
import IconifyOffline from "./src/components/iconify-offline.vue";

export { SvgIcon, FontIcon, IconifyOnline, IconifyOffline };

export * from "./src/icon";

export const Icon = useInstall(index);

export default index;
