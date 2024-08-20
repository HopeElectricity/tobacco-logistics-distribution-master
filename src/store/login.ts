import { defineStore } from "pinia";
import { getCaptcha, postLogin } from "@/service/modules/login";
import type { ILoginForm } from "@/pages/Login/types";
import { ILoginData, IUser } from "@/types/login";
import { useRouter } from "vue-router";

export const useLoginStore = defineStore("login", () => {
  // 二维码模块
  const router = useRouter();
  const captcha = ref<string>("");
  const captchaText = ref<string>("");
  async function getCaptchaAction() {
    getCaptcha().then((res) => {
      const headers = res.headers;
      captchaText.value = headers.captcha;
      const url = URL.createObjectURL(res.data);
      captcha.value = url;
    });
  }

  const userInfo = ref<ILoginData>({
    token: localStorage.getItem("token") ?? "",
    user:
      (JSON.parse(localStorage.getItem("userInfo") as string) as IUser) ?? "",
    operations:
      (JSON.parse(localStorage.getItem("operation") as string) as string[]) ??
      "",
  });
  const token = ref<string>();
  async function loginAction(data: ILoginForm) {
    const res = await postLogin(data, captchaText.value);
    token.value = res.data.token;
    localStorage.setItem("token", token.value);
    userInfo.value = res.data;
    localStorage.setItem("userInfo", JSON.stringify(userInfo.value?.user));
    localStorage.setItem(
      "operation",
      JSON.stringify(userInfo.value?.operations)
    );
    ElMessage.success("登录成功");
    router.push("/home");
  }

  return {
    // 二维码
    captcha,
    captchaText,
    getCaptchaAction,
    // 登录
    loginAction,
    userInfo,
  };
});
