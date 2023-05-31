export interface Frame {
  src: string; // 地址
  name: string; // 名字
  show: boolean; // 是否展示
}

export function useFrameKeepAlive() {
  const router = useRouter();
  const { currentRoute } = router;

  function showIframe(item: Frame) {
    return item.name === unref(currentRoute).name;
  }
  return {
    showIframe,
  };
}
