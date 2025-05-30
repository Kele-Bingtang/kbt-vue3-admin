import type { RouteLocationNormalizedLoaded } from "vue-router";
import { ElMessageBox } from "element-plus";

type BeforeCloseType = (value: unknown) => void;

interface BeforeClose {
  [key: string]: (resolve: BeforeCloseType, route: RouteLocationNormalizedLoaded) => void;
  before_close_normal: (resolve: BeforeCloseType, route: RouteLocationNormalizedLoaded) => void;
}

const beforeClose: BeforeClose = {
  before_close_normal: (resolve: any, route: RouteLocationNormalizedLoaded) => {
    if (route.query.noBeforeClose) return resolve(true);
    ElMessageBox.confirm("确定要关闭这一页吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  },
};

export default beforeClose;
