<template>
  <div class="login">
    <div class="login-content">
      <h1 class="title">粤北卷烟物流管理系统</h1>
      <div class="login-form">
        <el-form :model="loginForm" @keyup.enter="handleLogin">
          <el-form-item>
            <el-input
              v-model.trim="loginForm.loginName"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="loginForm.password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              style="width: 60% !important"
              v-model.trim="loginForm.captcha"
              placeholder="请输入验证码"
            ></el-input>
            <img
              @click="loginStore.getCaptchaAction()"
              :src="loginStore.captcha"
              alt=""
            />
          </el-form-item>
        </el-form>
        <div class="button" @click="handleLogin">GO</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ILoginForm } from "./types.ts";
  import { useLoginStore } from "@/store/login";
  const loginStore = useLoginStore();
  const loginForm = ref<ILoginForm>({
    loginName: "",
    password: "",
    captcha: "",
  });
  // 获取二维码
  loginStore.getCaptchaAction();
  function handleLogin() {
    loginStore.loginAction({ ...loginForm.value });
  }
</script>
<style lang="scss" scoped>
  .login {
    width: 100vw;
    height: 100vh;
    background: url("@/assets/images/Login/background.png") center no-repeat;
    background-size: cover;
    .login-content {
      width: 550px;
      height: 400px;
      position: relative;
      top: 35%;
      margin: 0 auto;
      background: url("@/assets/images/Login/login-background.png") center
        no-repeat;
      background-size: contain;
      .title {
        text-align: center;
        line-height: 120px;
        font-weight: 400;
      }
      .login-form {
        width: 55%;
        margin: 0 auto;
        :deep(.el-form-item__content) {
          justify-content: space-between;
        }
        .el-input {
          width: 100% !important;
          height: 40px;
          :deep(.el-input__wrapper) {
            background-color: #00000000;
          }
        }
        :deep(.el-input__inner) {
          color: #e1f7ff;
          height: 45px;
          line-height: 45px;
        }
        img {
          width: 30%;
          height: 45px;
          object-fit: contain;
        }
        .button {
          position: relative;
          margin: 0 auto;
          color: #0c2e48;
          font-weight: 700;
          font-size: 30px;
          width: 100px;
          height: 45px;
          line-height: 50px;
          text-align: center;
          background-color: #73e5ff;
          transition: box-shadow 0.5s;
          cursor: pointer;
          box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;

          &:hover {
            box-shadow:
              rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
              rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
              rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
              rgba(0, 0, 0, 0.06) 0px 2px 1px,
              rgba(0, 0, 0, 0.09) 0px 4px 2px,
              rgba(0, 0, 0, 0.09) 0px 8px 4px,
              rgba(0, 0, 0, 0.09) 0px 16px 8px,
              rgba(0, 0, 0, 0.09) 0px 32px 16px;
          }
          &::before {
            content: "";
            position: absolute;
            display: block;
            left: 100%;
            width: 45px;
            height: 45px;
          }
        }
      }
    }
  }
</style>
