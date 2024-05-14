import { useInstall } from "@/utils";
import index, { type UITheme } from "./src/index.vue";

export { type UITheme };

export const Tinymce = useInstall(index);

export default index;
