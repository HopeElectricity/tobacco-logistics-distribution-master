import { BASE_URL, TIME_OUT } from "./config";
import request from "./request";
const requests = new request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      const token = localStorage.getItem("token");
      if (config.headers && token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    responseSuccessFn: (response: any) => {
      if (response.code === 500) {
        ElMessage.error(response.msg);
      }
      return response;
    },
  },
});

export default requests;
