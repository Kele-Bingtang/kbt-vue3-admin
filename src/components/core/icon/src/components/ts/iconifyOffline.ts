import { Icon as IconifyIcon, addIcon, type IconifyIcon as IconifyIconInterface } from "@iconify/vue/dist/offline";
import { defineComponent, h } from "vue";

// Iconify Icon 在 Vue 里本地使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "iconifyOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: [Object, String],
      default: null,
    },
  },
  render() {
    if (typeof this.icon === "object") addIcon(this.icon + "", this.icon as IconifyIconInterface);
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: this.icon as IconifyIconInterface,
        style: attrs?.style ? Object.assign(attrs.style as any, { outline: "none" }) : { outline: "none" },
        ...attrs,
      },
      {
        default: () => [],
      }
    );
  },
});
