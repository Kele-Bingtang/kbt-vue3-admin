import http from "@/config/request";

export interface BackstageMenuList {
  imageIcon: string;
  menuCode: string;
  pagePath: string;
  menuName: string;
  menuUrl: string;
  parentMenuCode: string;
  seq: number;
  children?: BackstageMenuList[];
}

export const getMenuList = () => {
  // 模拟请求菜单
  return Promise.resolve([] as BackstageMenuList[]);
  // return http.request<http.JsonResponse<BackstageMenuList[]>>({
  //   url: "/getMenuList",
  //   method: "get",
  // });
};

export const test = () => {
  return http.request({
    url: "/test",
    method: "post",
    headers: {
      mapping: true,
    },
  });
};
