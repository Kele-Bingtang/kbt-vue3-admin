import { defineComponent, h } from "vue";

export default defineComponent({
  name: "svgIcon",
  props: {
    icon: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  render() {
    const attrs = this.$attrs;
    return h(
      "svg",
      {
        class: `svg-icon ${this.name}`,
        "aria-hidden": true,
        ...attrs,
      },
      {
        default: () => [
          h("use", {
            "xlink:href": `#${this.prefix}-${this.name}`,
            fill: this.color,
          }),
        ],
      }
    );
  },
});
