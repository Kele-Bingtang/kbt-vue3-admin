import type { Router } from "vue-router";
import { NProgress } from "@/utils";

/**
 * 路由跳转结束
 **/
export const afterEach = (router: Router) => {
  router.afterEach(() => {
    NProgress.done();
  });
};
