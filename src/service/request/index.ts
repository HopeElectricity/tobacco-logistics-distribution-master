import axios from "axios";
import type { AxiosInstance } from "axios";
import type { requestConfig } from "./type";

class request {
  instance: AxiosInstance;
  constructor(config: requestConfig) {
    this.instance = axios.create(config);
    this.instance.defaults.timeout=2500
    //全局拦截器
    this.instance.interceptors.request.use(
      //全局请求成功拦截
      (config) => {
        return config;
      },
      //全局失败拦截
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      //全局响应成功拦截
      (res) => {
        return res.headers.captcha?res:res.data;
      },
      //全局响应失败
      (err) => {
        if(err.message.includes('timeout')){
          ElMessage({message:'请求页面超时，请刷新重试',duration:5*1000,type:'error'});
        }else if(err.message.includes('Network Error')){
          ElMessage({message:'网络错误，请检查网络连接',duration:5*1000,type:'error'});
        }
        return err;
      }
    );

    // //特定实例拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    );
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn
    );
  }
  //封装网络请求
  request<T = any>(config: requestConfig<T>) {
    //单次请求拦截
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config);
    }
    //返回自己控制的promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          //单次响应拦截
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T = any>(config: requestConfig<T>) {
    return this.request({ ...config, method: "GET" });
  }
  post<T = any>(config: requestConfig<T>) {
    return this.request({ ...config, method: "POST" });
  }
  delete<T = any>(config: requestConfig<T>) {
    return this.request({ ...config, method: "DELETE" });
  }
  patch<T = any>(config: requestConfig<T>) {
    return this.request({ ...config, method: "PATCH" });
  }
}
export default request;
