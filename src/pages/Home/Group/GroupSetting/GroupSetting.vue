<template>
  <div class="groupSettingDialog">
    <el-dialog
      title="设置权限"
      v-model="groupSettingOpen"
      width="69%"
      @close="closeGroupSetting"
    >
      <div class="groupSettingTopText">设置角色权限点：</div>
      <div class="groupSettingContent">
        <div class="groupSettingLeft">
          <el-button
            v-for="item in roles"
            :key="item.role_id"
            class="groupSettingLeftButton"
            @click="changeRoleID(item.role_id)"
            :class="{ active: currentIndex === item.role_id }"
            >{{ item.role_name }}</el-button
          >
        </div>
        <div class="groupSettingRight">
          <el-transfer
            class="groupSettingTransfer"
            v-model="value"
            :data="data"
            :titles="['权限点', '该角色权限点']"
          />

          <div class="groupSettingRightBtn">
            <el-button
              class="groupSettingRightCancel"
              @click="closeGroupSetting()"
              >取消</el-button
            >
            <el-button
              class="groupSettingRightConfirm"
              @click="groupSettingConfirm()"
              >确认</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from "vue";
  import { IUserAuthorityDataType, IRole } from "@/types/group";
  import { useGroupStore } from "@/store/group";
  const groupStore = useGroupStore();
  interface Option {
    key: number;
    label: string;
    value: string;
  }
  const value = ref<number[]>([]);
  const AllAuthorityList = ref();
  const data = ref<Option[]>([]); //这个是放权限数据的
  const currentIndex = ref<number>(1);
  const roles = ref<IRole[]>([]);
  const groupSettingOpen = ref<boolean>(false);
  watch(groupSettingOpen, (newValue) => {
    if (newValue) {
      // 将选中置为1
      currentIndex.value = 1;
      // 获取所有权限
      groupStore.getAllAuthorityAction().then(() => {
        AllAuthorityList.value = groupStore.AllAuthority;
        data.value = groupStore.AllAuthority.map((item) => {
          return {
            key: item.operation_id,
            label: item.operation_state,
            value: item.operation_name,
          };
        });
      });
      // 获取角色权限
      groupStore.getRoleAction().then(() => {
        roles.value = groupStore.roles;
      });
      // 获取当前选中权限
      getRoleOperations(currentIndex.value);
    }
  });
  const closeGroupSetting = () => {
    groupSettingOpen.value = false;
    currentIndex.value = 1;
  };
  defineExpose({
    groupSettingOpen,
  });

  const changeRoleID = (e: number) => {
    userAuthorityData.role_id = e;
    currentIndex.value = e;
    getRoleOperations(e);
  };
  function getRoleOperations(role_id: number) {
    groupStore.getRoleOperationsAction(role_id).then(() => {
      value.value = groupStore.roleAuthority.map((item) => {
        return item.operationId;
      });
    });
  }
  const userAuthorityData: IUserAuthorityDataType = reactive({
    idList: "",
    role_id: 0,
  });
  const groupSettingConfirm = () => {
    const arr = Array.from(value.value);
    userAuthorityData.idList = arr.toString();
    if (userAuthorityData.idList == "") {
      ElMessage({
        type: "warning",
        message: "该角色权限点不能为空",
      });
    } else {
      groupStore.setUserAuthorityAction({ ...userAuthorityData }).then(() => {
        closeGroupSetting();
      });
    }
  };
</script>
<style lang="scss" scoped>
  .groupSettingTopText {
    margin-left: 4.5vw;
    font-size: 25px;
  }
  .groupSettingContent {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 50px;

    .groupSettingLeft {
      margin: 6px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .el-button {
        --el-color-primary: #73e1ff;
        --el-button-bg-color: #73e1ff;
        --el-button-border-color: #46899c;
        --el-button-text-color: rgb(0, 0, 51);
        --el-button-hover-bg-color: #041c3f;
        --el-button-hover-border-color: #1f3d45;
      }
      .el-button.active {
        color: var(--el-button-hover-text-color);
        border-color: var(--el-button-hover-border-color);
        background-color: var(--el-button-hover-bg-color);
        outline: none;
      }
      .groupSettingLeftButton {
        margin: 3px;
        width: 120px;
        /* height: 20px; */
        /* font-size: 20px; */
      }
    }
    .groupSettingRight {
      margin: 10px;
      padding: 30px;
      border: 1px solid #73e1ff;
      .groupSettingTransfer {
        margin: 10px;
      }
      .groupSettingRightBtn {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        .groupSettingRightCancel,
        .groupSettingRightConfirm {
          font-size: 20px;
          width: 100px;
          height: 35px;
        }
      }
    }
  }
</style>
