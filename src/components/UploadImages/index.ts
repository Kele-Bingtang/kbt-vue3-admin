import { useInstall } from "@/utils";
import image from "./src/image.vue";
import images from "./src/images.vue";

export const UploadImage = useInstall(image);
export const UploadImages = useInstall(images);

export default [image, images];
