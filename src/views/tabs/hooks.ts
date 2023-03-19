import { useRouter, useRoute, type LocationQueryValue } from "vue-router";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const id = route.query?.id ? route.query?.id : route.params?.id;

  function toDetail(
    index: number | string | string[] | number[] | LocationQueryValue[],
    model: string,
    noBeforeClose = false
  ) {
    if (model === "query") {
      // 路由跳转
      router.push({
        name: "Query",
        query: noBeforeClose ? { id: String(index) } : { id: String(index), noBeforeClose: "true" },
      });
    } else {
      router.push({
        name: "Params",
        params: { id: String(index) },
        query: noBeforeClose ? {} : { noBeforeClose: "true" },
      });
    }
  }

  return { toDetail, id, router };
}
