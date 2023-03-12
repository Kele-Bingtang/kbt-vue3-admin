import type { App } from "vue";
import copy from "./modules/copy";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import longPress from "./modules/longPress";
import waves from "./modules/waves";
import permission from "./modules/permission";

const directivesList: any = {
  // Custom directives
  copy,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longPress,
  waves,
  permission,
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      // 注册所有自定义指令
      app.directive(key, directivesList[key]);
    });
  },
};

export default directives;
