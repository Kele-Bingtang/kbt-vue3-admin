import axios, { type AxiosInstance, AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/request/serviceLoading";
import qs from "qs";
import { isArray, isExternal } from "@/utils/layout/validate";
import { ContentTypeEnum, ResultEnum } from "./httpEnum";
import { useErrorLogStore } from "@/stores/errorLog";
import { AxiosCanceler } from "./axiosCancel";
import { checkStatus } from "./checkStatus";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { LOGIN_URL } from "@/router/routesConfig";
import { message } from "@/utils/layout/message";

const axiosCanceler = new AxiosCanceler();

type AxiosRequestConfigProp<D = any> = AxiosRequestConfig<D> & {
  method: "get" | "post" | "delete" | "put" | "download";
};

/**
 * @description 当请求 url 携带的如下前缀（key），会替换为 http（value），如接口 url 为 /test/xx/xxx，则最终发送的请求为 https://youngkbt.cn/xx/xxx
 * @condition 接口在 header 填写 mapping: true 来开启 URL 映射功能，{ headers: { mapping: true } }
 * 详细请看 README.md 文档的 API 介绍
 */
const mappingUrl: { [key: string]: string } = {
  default: import.meta.env.VITE_API_URL,
  // test: "https://youngkbt.cn",
};

const config = {
  // 默认地址请求地址，可在 .env.*** 文件中修改
  baseURL: mappingUrl.default,
  // 设置超时时间（10s）
  timeout: ResultEnum.TIMEOUT as number,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     */
    this.service.interceptors.request.use(
      config => {
        // 如果当前请求需要显示 loading，在 api 服务中通过指定: { headers: { loading: true } } 来控制显示 loading
        if (config.headers?.loading) showFullScreenLoading();
        else {
          axiosCanceler.removePendingRequest(config);
          axiosCanceler.addPendingRequest(config);
        }
        const userStore = useUserStore();
        // 处理 url 映射
        config.headers?.mapping && processMappingUrl(config) && delete config.headers?.mapping;
        // 处理 ContentType
        config.params?._type && config.method?.toLocaleLowerCase() === "post" && processParamsType(config);
        config.params?._type === "multi" && processArray(config);
        config.params && delete config.params._type;
        config.headers.token = userStore.token;
        return config;
      },
      (error: AxiosError) => {
        // TODO：请求的异常进行捕获处理
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     */
    this.service.interceptors.response.use(
      response => {
        const { data } = response;
        // 在请求结束后，并关闭请求 loading
        if (response.config.headers?.loading) tryHideFullScreenLoading();
        else axiosCanceler.removePendingRequest(response.config);
        const userStore = useUserStore();
        //  登陆失效（code == 401）
        if (data.code === ResultEnum.OVERDUE) {
          message.error(data.msg);
          userStore.logout();
          router.replace(LOGIN_URL);
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件得时候返回数据流，没有 code，直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          message.error(data.msg);
          return Promise.reject(data);
        }
        return data;
      },
      async (error: AxiosError) => {
        const errorStore = useErrorLogStore();
        if (error.config?.headers?.loading) tryHideFullScreenLoading();
        else axiosCanceler.removePendingRequest(error.config || {});
        if (error.message === "身份异常") return message.error("身份异常");
        else if (error.message.indexOf("timeout") !== -1) message.error("请求超时！请您稍后重试");
        else if (error.message.indexOf("Network Error") !== -1) message.error("网络错误！请您稍后重试");
        // 根据响应的错误状态码，做不同的处理
        if (error.response) checkStatus(error.response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace("/500");
        const e = processError(error);
        e && errorStore.addErrorLog(e);
        return Promise.reject(error);
      }
    );
  }

  // 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }

  // 全写请求封装
  request<T, R = any>(config: AxiosRequestConfigProp<R>): Promise<T> {
    return this.service(config) as unknown as Promise<T>;
  }
}

export default new RequestHttp(config);

function processMappingUrl(config: InternalAxiosRequestConfig) {
  const keys = Object.keys(mappingUrl);
  let url = config.url || "";
  let prefix = "";
  let index = url.indexOf("/");
  // 如果 url 开头携带 /
  if (index === 0) {
    // 去掉开头的 /，获取后面的第二个 / 位置
    const u = url.slice(1);
    index = u.indexOf("/");
    prefix = u.slice(0, index);
    // 去掉的 / 占一个数
    index += 1;
  } else prefix = url.slice(0, index);
  // 获取除 prefix 的 url
  url = url.slice(index);
  for (const key of keys) {
    if (prefix === key) {
      config.url = mappingUrl[key] + url;
      config.baseURL = "";
      break;
    }
  }
  return config;
}

/**
 * 通过 params 的 _type 属性来设置不同的 contentType
 * @param config Axios 配置信息
 * @returns config
 */
function processParamsType(config: InternalAxiosRequestConfig) {
  if (config.params?._type) {
    const type = config.params._type;
    if (type === "form") {
      config.headers["Content-Type"] = ContentTypeEnum.FORM_URLENCODED;
      config.data = qs.stringify(config.data);
    } else if (type === "file") config.headers["Content-Type"] = ContentTypeEnum.FILE_FORM_DATA;
    else if (type === "json") config.headers["Content-Type"] = ContentTypeEnum.JSON;
    else if (type === "info") {
      config.headers["Content-Type"] = ContentTypeEnum.Multi_FILE_FORM_DATA; // 传输数据为二进制类型，如：图片、MP3、文件
    }
  } else {
    config.headers["Content-Type"] = ContentTypeEnum.JSON;
    config.data = qs.stringify(config.data);
  }
  return config;
}
/**
 * 处理参数的数组
 * @param config Axios 配置信息
 * @returns config
 */
function processArray(config: InternalAxiosRequestConfig) {
  let url = String(config.url);
  if (url.indexOf("?") !== -1) url += "&";
  else url += "?";
  const keys = Object.keys(config.params);
  for (const key of keys) {
    if (config.params[key]) {
      if (isArray(config.params[key])) {
        config.params[key].forEach((item: any) => {
          url += `${key}=${item}&`;
        });
      } else url += `${key}=${config.params[key]}&`;
    }
  }
  config.params = {};
  config.url = url.slice(0, -1);
  return config;
}
/**
 * Axios 的错误提示和持久化处理
 * @param error Axios 错误
 * @returns 持久化数据
 */
function processError(error: AxiosError) {
  const e = JSON.stringify(error);
  if (e !== "{}") {
    const {
      config: { baseURL, url, params, method, data },
    } = JSON.parse(e);
    const requestURL = isExternal(baseURL) ? baseURL + url : url;
    let { message } = error;
    message = message + "，token 不存在或者失效了";
    let stack = "您发送的请求为 " + method.toUpperCase() + "，您请求的地址为 " + requestURL;
    if (params) stack = stack + "，请求携带的 params 为 " + JSON.stringify(params);
    if (data) stack = stack + "，请求携带的 data 为 " + JSON.stringify(data);
    error.stack = stack;
    error.message = message;
    // 添加异常
    return {
      error,
      vm: null,
      info: "axios 请求错误",
      url: window.location.href,
      hasRead: false,
    };
  }
}
