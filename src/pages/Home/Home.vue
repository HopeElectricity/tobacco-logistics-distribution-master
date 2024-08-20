<template>
  <div class="home">
    <div class="main">
      <div class="title"></div>
      <div class="menu">
        <div
          v-for="(item, index) in MenuList"
          :class="{ active: activeMenu === index }"
          :key="index"
          @click="handleMenu(item.router, index)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="personal">
        <el-dropdown>
          <el-avatar shape="circle" :size="50" :src="avatar" />
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openUserInfo"
                ><el-icon><User /></el-icon>个人信息</el-dropdown-item
              >
              <el-dropdown-item
                v-op="'user-service:password:update'"
                @click="openChangePwd"
                ><el-icon><Setting /></el-icon>修改密码</el-dropdown-item
              >
              <el-dropdown-item @click="loginOut"
                ><el-icon><SwitchButton /></el-icon>退出系统</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
    <ChangePwd ref="changePwdRef"></ChangePwd>
    <UserInfo ref="userInfoRef"></UserInfo>
  </div>
</template>
<script lang="ts" setup>
  import { MenuList } from "./config";
  import { useRouter, useRoute } from "vue-router";
  import {
    ArrowDown,
    SwitchButton,
    Setting,
    User,
  } from "@element-plus/icons-vue";
  import ChangePwd from "./personal/ChangePwd.vue";
  import UserInfo from "./personal/UserInfo.vue";
  import { useGetAvatar } from "@/hook/useGetAvatar";
  const router = useRouter();
  const route = useRoute();
  const { avatar } = useGetAvatar();
  const activeMenu = ref<number>(route.meta.order);
  function handleMenu(activeRouter: string, index: number) {
    activeMenu.value = index;
    router.push(activeRouter);
  }
  function loginOut() {
    ElMessageBox.confirm("确认退出登录？").then((res) => {
      if (res) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("operation");
        router.push("/login");
      }
    });
  }
  //打开修改密码对话框
  const changePwdRef = ref<InstanceType<typeof ChangePwd>>();
  function openChangePwd() {
    typeof changePwdRef.value?.changePwdIsOpen === "boolean"
      ? (changePwdRef.value.changePwdIsOpen = true)
      : false;
  }
  const userInfoRef = ref<InstanceType<typeof UserInfo>>();
  function openUserInfo() {
    userInfoRef.value?.handleOpen();
  }
</script>
<style lang="scss" scoped>
  .home {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    background: url("@/assets/images/background.png") center no-repeat;
    background-size: cover;
    padding: 0.5vh 3vw;
    display: flex;
    flex-direction: column;
    .main {
      display: flex;
      justify-content: space-between;
      .title {
        width: 30vw;
        height: 10vh;
        background: url("@/assets/images/title.png") center no-repeat;
        background-size: contain;
      }
      .menu {
        margin-left: 150px;
        display: flex;
        flex: 1;
        justify-content: space-around;
        align-items: center;
        height: 10vh;
        div {
          padding: 0 1.5vw;
          display: flex;
          align-items: center;
          height: 5vh;
          font-size: 1.2vw;
          cursor: pointer;
          transition: all 0.2s;
          &.active {
            background-color: #006a94;
            box-shadow:
              rgba(0, 0, 0, 0.25) 0px 14px 28px,
              rgba(0, 0, 0, 0.22) 0px 10px 10px;
          }
        }
      }
      .personal {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 10vh;
        .personalAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
    }
    .content {
      flex: 1;
    }
  }
</style>
