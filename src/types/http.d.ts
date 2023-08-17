declare namespace http {
  interface Response<T> {
    code: number; // 状态码
    status: string; // 状态码信息
    message: string; // 消息
    data: T; // 数据
  }
}
