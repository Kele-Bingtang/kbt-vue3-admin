import axios, { type AxiosInstance, AxiosError, type AxiosRequestConfig } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import qs from "qs";
import { isArray } from "@/utils/validate";
import { ElNotification } from "element-plus";
import { ContentTypeEnum } from "./enums/httpEnum";

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

type AxiosRequestConfigProp<D = any> = AxiosRequestConfig<D> & {
  method: "get" | "post" | "delete" | "put" | "download";
};

const config = {
  // 默认地址请求地址，可在 .env.*** 文件中修改
  baseURL: import.meta.env.VITE_API_URL,
  // 设置超时时间（10s）
  timeout: 1000,
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
        // 如果当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示 loading
        config.headers!.noLoading || showFullScreenLoading();
        const accessToken = localStorage.get("token");
        if (!accessToken) {
          config.cancelToken = source.token;
          source.cancel("身份异常");
        }
        if ((config.method as string).toLocaleLowerCase() === "post" && config.headers) {
          if (config.params && config.params._type) {
            if (config.params._type === "form") {
              config.headers["Content-Type"] = ContentTypeEnum.FORM_URLENCODED;
              config.data = qs.stringify(config.data);
            } else if (config.params._type === "file") config.headers["Content-Type"] = ContentTypeEnum.FILE_FORM_DATA;
            else if (config.params._type === "json") config.headers["Content-Type"] = ContentTypeEnum.JSON;
            else if (config.params._type === "info") {
              config.headers["Content-Type"] = ContentTypeEnum.Multi_FILE_FORM_DATA; // 传输数据为二进制类型，如：图片、MP3、文件
            }
          }
        }
        // 多选
        if (config.params && config.params._type && config.params._type === "multi") {
          delete config.params._type;
          let url = String(config.url);
          if (url.indexOf("?") !== -1) {
            url += "&";
          } else {
            url += "?";
          }
          const keys = Object.keys(config.params);
          for (const key of keys) {
            if (config.params[key]) {
              if (isArray(config.params[key])) {
                config.params[key].forEach((item: any) => {
                  url += `${key}=${item}&`;
                });
              } else {
                url += `${key}=${config.params[key]}&`;
              }
            }
          }
          config.params = {};
          config.url = url.slice(0, -1);
        }
        config.params && delete config.params._type;
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
        const res = response.data;
        // 在请求结束后，并关闭请求 loading
        tryHideFullScreenLoading();
        return res;
      },
      async (error: AxiosError) => {
        tryHideFullScreenLoading();
        if (error.message === "身份异常") return ElNotification.error("身份异常");
        else if (error.message.indexOf("timeout") !== -1) ElNotification.error("请求超时！请您稍后重试");
        else if (error.message.indexOf("Network Error") !== -1) ElNotification.error("网络错误！请您稍后重试");
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
  request<T, R = any>(config: AxiosRequestConfigProp<T>): Promise<R> {
    return this.service(config) as unknown as Promise<R>;
  }
}

export default new RequestHttp(config);
