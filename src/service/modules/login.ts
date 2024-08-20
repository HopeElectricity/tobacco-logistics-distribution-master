import requests from "../index";
import { ILoginForm } from "@/pages/Login/types";
import { IRequest } from "../request/type";
import { ILoginData } from "@/types/login";
// 获取二维码
export function getCaptcha() {
  return requests.get<any>({url:'/userservice/captcha/captcha', 
  responseType: "blob",
  });
}
// 登录接口
export function postLogin(data: ILoginForm, captchaText: string) {
  return requests.post<IRequest<ILoginData>>({
    url: "/userservice/user/login",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      captcha: captchaText,
    },
    data,
  });
}
