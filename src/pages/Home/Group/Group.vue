<template>
  <div class="Group">
    <div class="groupControl">
      <div class="groupSearch" v-op="'user-service:view'">
        <el-form
          :inline="true"
          style="height: 100%; margin-top: 7px"
          v-model="searchCond"
        >
          <el-form-item label="姓名" label-width="70">
            <el-input
              v-model="searchCond.userName"
              placeholder="点击输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="工号" label-width="100">
            <el-input
              v-model="searchCond.workNumber"
              placeholder="点击输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门" label-width="100">
            <el-select v-model="searchCond.department">
              <el-option v-for="item in groupStore.groupList" :key="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-button
        class="groupSearchButton"
        :icon="Search"
        @click="searchUser"
      ></el-button>
      <el-button
        class="groupSearchButton"
        :icon="RefreshRight"
        @click="refreshUser"
      ></el-button>
      <el-button
        class="groupSet"
        :icon="Tools"
        @click="openGroupSetting"
        v-op="'user-service:set'"
        >设置权限</el-button
      >
      <el-button
        class="groupAdd"
        :icon="Plus"
        @click="openGroupAdd"
        v-op="'user-service:add'"
        >添加用户</el-button
      >
    </div>
    <div class="useInfo">
      <el-empty class="empty" v-if="isShow" description="查无此人" />
      <template v-else>
        <div
          class="useInfoItem"
          :key="item.work_number"
          v-for="item in userInfo"
        >
          <div class="usePhoto">
            <img alt="" :src="item.avatar_path" />
            <el-button
              class="groupInfoItemButton"
              :icon="EditPen"
              @click="openGroupUserEdit(item.work_number)"
              v-op="'user-service:update'"
            ></el-button>
          </div>
          <div>{{ item.user_name }}</div>
          <div>{{ item.department }}&nbsp;&nbsp;{{ item.position }}</div>
          <div>工号：{{ item.work_number }}</div>
        </div>
      </template>
    </div>
    <div class="groupDialog">
      <GroupSetting ref="groupSettingRef"></GroupSetting>
      <GroupAdd ref="groupAddRef" @renew-user="searchUser"></GroupAdd>
      <GroupUserEdit
        ref="groupUserEditRef"
        @renew-user="searchUser"
      ></GroupUserEdit>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import GroupSetting from "./GroupSetting/GroupSetting.vue";
  import GroupAdd from "./GroupAdd/GroupAdd.vue";
  import GroupUserEdit from "./GroupUserEdit/GroupUserEdit.vue";
  import {
    Plus,
    Search,
    Tools,
    EditPen,
    RefreshRight,
  } from "@element-plus/icons-vue";
  import { useGroupStore } from "@/store/group";
  import type { IUserInfo } from "@/types/group";
  const groupStore = useGroupStore();
  const searchCond = ref({
    department: "",
    userName: "",
    workNumber: "",
  });
  const userInfo = ref<IUserInfo[]>(groupStore.userInfoArr);
  groupStore.getRoleAction();
  function getData() {
    groupStore.getAllUserAction({ ...searchCond.value }).then(() => {
      userInfo.value = groupStore.userInfoArr;
      if (userInfo.value.length == 0) {
        isShow.value = true;
      } else {
        isShow.value = false;
      }
    });
  }
  getData();
  const groupSettingRef = ref<InstanceType<typeof GroupSetting>>();
  const groupAddRef = ref<InstanceType<typeof GroupAdd>>();
  const groupUserEditRef = ref<InstanceType<typeof GroupUserEdit>>();
  function openGroupAdd() {
    typeof groupAddRef.value?.groupAddOpen === "boolean"
      ? (groupAddRef.value.groupAddOpen = true)
      : false;
  }
  function openGroupSetting() {
    typeof groupSettingRef.value?.groupSettingOpen === "boolean"
      ? (groupSettingRef.value.groupSettingOpen = true)
      : false;
  }
  //修改个人信息的入口
  function openGroupUserEdit(work_number: string) {
    typeof groupUserEditRef.value?.groupUserEditIsOpen === "boolean"
      ? (groupUserEditRef.value.groupUserEditIsOpen = true)
      : false;
    groupStore.getEditUserInfoAction(work_number).then(() => {
      if (groupUserEditRef.value) {
        const EditData = {
          ...groupStore.editUserInfo[0],
          signTime: groupStore.editUserInfo[0].sign_time,
        };
        groupUserEditRef.value.EditData = EditData;
      }
    });
  }
  const isShow = ref<boolean>(false);
  function searchUser() {
    getData();
  }

  function refreshUser() {
    searchCond.value = {
      department: "",
      userName: "",
      workNumber: "",
    };
    getData();
  }
</script>
<style lang="scss" scoped>
  .Group {
    height: 76vh;
    margin: 0 3vw;
    padding: 0 2vw;
    display: flex;
    .groupControl {
      position: fixed;
      display: flex;
      height: 6.3vh;
      padding: 1vh 0;
      width: 84%;
      .groupSearch {
        .el-form-item {
          width: 28%;
        }
        border: 2px solid #73e1ff;
        width: 60vw;
      }
      .groupSearchButton {
        height: 100%;
        width: 50px;
        border-radius: 0%;
      }
      .groupSet,
      .groupAdd {
        margin: 0 0 0 40px;
        height: 100%;
        text-align: center;
      }
    }
    .useInfo::-webkit-scrollbar {
      display: none;
    }
    .useInfo {
      width: 100%;
      padding: 1vw;
      position: relative;
      top: 12%;
      border: 1px solid #73e1ff;
      display: flex;
      flex-wrap: wrap;
      overflow-x: hidden;
      overflow-y: auto;
      .empty {
        margin: 0 auto;
      }
      .useInfoItem {
        margin: 20px 30px;
        width: 190px;
        text-align: center;
        line-height: 23px;
        .usePhoto {
          width: 190px;
          height: 250px;
          border: 2px solid #73e1ff;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .groupInfoItemButton {
            position: absolute;
            bottom: -2px;
            right: -2px;
            border-radius: 0%;
            height: 15%;
          }
        }
      }
    }
  }
</style>
