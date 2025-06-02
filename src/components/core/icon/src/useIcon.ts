import type { IconType } from "./iconType";
import { IconifyOnline, IconifyOffline, FontIcon } from "../index";
import type { IconifyIcon } from "@iconify/vue";
import { type Component, defineComponent, h } from "vue";

/**
 * 支持 `iconfont`、自定义 `svg` 以及 `iconify` 中所有的图标
 * @param icon 必传 图标
 * @param attrs 可选 IconType 属性
 * @returns Component
 */
export const useIcon = (icon: string | IconifyIcon, attrs?: IconType): Component => {
  const ifReg = /^IF-/;
  const svgReg = /^SVG-/;

  if ((typeof icon === "string" && svgReg.test(icon)) || attrs?.name) {
    // svg
    const name = attrs?.name ? attrs?.name : (icon as string).slice(4);
    const prefix = attrs?.prefix ? attrs?.prefix : "icon";
    const iconStyle = attrs?.style || {
      width: "1em",
      height: "1em",
    };
    if (attrs?.width) iconStyle.width = attrs?.width;
    if (attrs?.height) iconStyle.height = attrs?.height;
    return defineComponent({
      name: "svgIcon",
      render() {
        return h(
          "svg",
          {
            class: `svg-icon ${name || ""}`,
            style: iconStyle,
            "aria-hidden": true,
            ...attrs,
          },
          h("use", {
            "xlink:href": `#${prefix}-${name}`,
            fill: attrs?.color,
          })
        );
      },
    });
  }

  if (typeof icon === "string" && ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(0, name.indexOf(" ") === -1 ? name.length : name.indexOf(" "));
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return defineComponent({
      name: "fontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs,
        });
      },
    });
  } else if (typeof icon === "object") {
    return defineComponent({
      name: "offlineIcon",
      render() {
        return h(IconifyOffline, {
          icon: icon,
          ...attrs,
        });
      },
    });
  } else {
    // 通过是否存在 `:` 符号来判断是在线还是本地图标，存在即是在线图标，反之为本地图标
    return defineComponent({
      name: "icon",
      render() {
        const IconifyIcon = icon && icon.includes(":") ? IconifyOnline : IconifyOffline;
        return h(IconifyIcon, {
          icon: icon,
          ...attrs,
        });
      },
    });
  }
};
