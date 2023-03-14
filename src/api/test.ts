import http from "@/config/request";

export const test = () => {
  http.request({
    url: "/test",
    method: "post",
    headers: {
      mapping: true,
    },
  });
};
