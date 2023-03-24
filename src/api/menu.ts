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
  http.request<BackstageMenuList>({
    url: "/getMenuList",
    method: "get",
  });
};

export const test = () => {
  http.request({
    url: "/test",
    method: "post",
    headers: {
      mapping: true,
    },
  });
};
