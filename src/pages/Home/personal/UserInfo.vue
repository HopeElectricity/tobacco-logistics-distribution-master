<template>
  <div class="UserInfo">
    <el-dialog title="个人信息" width="70%" v-model="isOpen">
      <div class="content">
        <el-avatar shape="square" :size="150" :src="avatar" />
        <div class="items">
          <div class="item">姓名：{{ userInfo.userName }}</div>
          <div class="item">账号：{{ userInfo.loginName }}</div>
          <div class="item">工号：{{ userInfo.workNumber }}</div>
          <div class="item">班组：{{ userInfo.department }}</div>
          <div class="item">角色：{{ userInfo.position }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { useGetAvatar } from "@/hook/useGetAvatar";
  import { useLoginStore } from "@/store/login";
  const loginStore = useLoginStore();
  const userInfo = loginStore.userInfo.user;
  const { avatar } = useGetAvatar();
  const isOpen = ref(false);
  function handleOpen() {
    isOpen.value = true;
  }
  defineExpose({
    handleOpen,
  });
</script>
<style lang="scss" scoped>
  .UserInfo {
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar {
        height: 200px;
        width: 180px;
      }
      .items {
        margin-top: 50px;
        text-align: left;
        .item {
          line-height: 50px;
          font-size: 25px;
        }
      }
    }
  }
</style>
