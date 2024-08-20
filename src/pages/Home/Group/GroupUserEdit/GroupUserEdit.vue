<template>
  <div class="groupUserEditDialog">
    <el-dialog
      title="编辑信息"
      v-model="groupUserEditIsOpen"
      width="80%"
      @close="closeUserEdit(userEditFormRef)"
    >
      <div class="groupUserEdit">
        <div class="groupUserEditInfo">
          <el-form
            :inline="true"
            style="height: 100%"
            label-width="110"
            :model="EditData"
            :rules="rules"
            ref="userEditFormRef"
          >
            <el-form-item label="工号">
              :<span>{{ EditData.work_number }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              :<span>{{ EditData.user_name }}</span>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input
                v-model="EditData.phone"
                placeholder="点击输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="EditData.email"
                placeholder="点击输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-select v-model="EditData.department">
                <el-option
                  v-for="item in groupStore.groupList"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职时间" prop="sign_time">
              <el-date-picker
                v-model="EditData.signTime"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="点击输入"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="角色"
              prop="role_id"
              class="groupUserEditRadioGroup"
            >
              <el-select v-model="EditData.role_id">
                <el-option
                  v-for="item in groupStore.roles"
                  :key="item.role_id"
                  :label="item.role_name"
                  :value="item.role_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="EditData.newPassword"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="groupUserEditSetting">
          <el-button
            class="groupUserEditCancel"
            @click="closeUserEdit(userEditFormRef)"
            >取消</el-button
          >
          <el-button
            class="groupUserEditConfirm"
            @click="confirmEdit(userEditFormRef, EditData)"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { UserEditForm, IParamUserInfo } from "@/types/group";
  import { useGroupStore } from "@/store/group";
  import type { FormInstance, FormRules } from "element-plus";
  const groupStore = useGroupStore();
  const groupUserEditIsOpen = ref<boolean>(false);
  const emit = defineEmits(["renewUser"]);
  const EditData = ref<IParamUserInfo>({
    user_name: "",
    work_number: "",
    department: "",
    phone: "",
    role_id: undefined,
    signTime: "",
    email: "",
    newPassword: "",
  });
  defineExpose({
    groupUserEditIsOpen,
    EditData,
  });

  const userEditFormRef = ref<FormInstance>();
  const rules = reactive<FormRules<UserEditForm>>({
    phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
    department: [{ required: true, message: "请选择部门", trigger: "blur" }],
    sign_time: [{ required: true, message: "请选择入职时间", trigger: "blur" }],
    role_id: [{ required: true, trigger: "blur" }],
  });

  const closeUserEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    groupUserEditIsOpen.value = false;
    formEl.resetFields();
  };
  //确定编辑信息function
  const confirmEdit = (
    formEl: FormInstance | undefined,
    EditData: IParamUserInfo
  ) => {
    if (!formEl) return;

    // 改为表单
    const formData = new FormData();
    formData.append("user_name", EditData.user_name);
    formData.append("work_number", EditData.work_number);
    formData.append("department", EditData.department);
    formData.append("phone", EditData.phone);
    formData.append("role_id", EditData.role_id as unknown as string);
    formData.append("signTime", EditData.signTime);
    if (EditData.newPassword) {
      formData.append("newPassword", EditData.newPassword);
    } else {
      formData.append("newPassword", "");
    }
    if (EditData.email) {
      formData.append("email", EditData.email);
    } else {
      formData.append("email", "");
    }

    groupStore.updateUserInfoAction(formData as any).then((res) => {
      if (res.code == 200) {
        emit("renewUser");
        groupUserEditIsOpen.value = false;
        formEl.resetFields();
      }
    });
  };
</script>
<style lang="scss" scoped>
  .groupUserEdit {
    margin: 25px auto;
    width: 48vw;
    color: #73e1ff;
    font-size: 20px;

    .groupUserEditInfo {
      span {
        padding-left: 20px;
        font-size: 20px;
      }

      .el-form-item {
        width: 40%;
        margin: 30px 35px;
      }
    }

    .groupUserEditSetting {
      display: flex;
      justify-content: center;
      margin: 40px 0;

      .groupUserEditCancel,
      .groupUserEditConfirm {
        width: 85px;
        margin: 0 5vw;
      }
    }
  }
</style>
