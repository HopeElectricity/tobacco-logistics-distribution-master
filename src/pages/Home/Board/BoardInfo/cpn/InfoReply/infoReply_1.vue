<template>
  <div class="infoReply">
    <el-dialog
      v-model="isReply"
      width="70%"
      center
      top="4%"
      @close="ReplyClose(replyFormRef)"
    >
      <div class="el-dialog-div">
        <el-form
          ref="replyFormRef"
          :model="replyForm"
          :rules="rules"
          label-width="160px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item
            :label="replyType() == '1' ? '物流部反馈 :' : '营销部反馈 :'"
            prop="replyContent"
          >
            <el-input
              v-model="replyForm.replyContent"
              maxlength="100"
              placeholder="点击输入自定义内容......"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 10 }"
              type="textarea"
          /></el-form-item>
          <el-form-item label="上传照片 :">
            <el-upload
              v-model:file-list="replyForm.UploadFile"
              accept="image/*"
              multiple
              action="fakeAction"
              :show-file-list="true"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleChange"
              ref="uploadRef"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="状态修改为 :"
            prop="feedbackStatus"
            v-if="
              (hasOp('guest-book:logistics:exception:modify') &&
                props.feedbackType === '1') ||
              (hasOp('guest-book:marketing:exception:modify') &&
                props.feedbackType === '2')
            "
          >
            <el-radio-group v-model="replyForm.feedbackStatus">
              <template v-for="item in stateBtn" :key="item.index">
                <el-radio :label="item.index">{{ item.stateText }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-button class="btn" @click="submitForm(replyFormRef)"
            >回复</el-button
          >
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { Plus } from "@element-plus/icons-vue";
  import { hasOp } from "@/op";
  import { useBoardStore } from "@/store/board";
  import {
    type UploadUserFile,
    type UploadFile,
    type UploadFiles,
  } from "element-plus";

  const boardStore = useBoardStore();
  const stateBtn = [
    { index: 1, stateText: "处理中" },
    { index: 2, stateText: "已处理" },
    { index: 3, stateText: "无需处理" },
  ];
  // 表单信息
  interface ReplyForm {
    replyContent: string;
    feedbackStatus: string;
    UploadFile: UploadUserFile[];
  }
  const replyForm = reactive<ReplyForm>({
    replyContent: "",
    feedbackStatus: "",
    UploadFile: [],
  });
  const isReply = ref<boolean>(false);
  // 获取token
  const userInfo: any = localStorage.getItem("userInfo");
  const position = JSON.parse(userInfo).position;
  function replyType() {
    if (position == "客户专员") {
      return "2";
    } else if (position == "送货员") {
      return "1";
    } else {
      return "0";
    }
  }
  interface IProps {
    feedbackType?: "1" | "2";
  }
  const props = defineProps<IProps>();
  const feedbackId = ref<number>(13);
  function handleReply(id: number) {
    isReply.value = true;
    feedbackId.value = id;
  }
  defineExpose({
    handleReply,
  });

  //  文本框
  import type { FormInstance, FormRules } from "element-plus";
  const replyFormRef = ref<FormInstance>();
  const rules = reactive<FormRules<ReplyForm>>({
    replyContent: [
      { required: true, message: "请输入自定义内容", trigger: "blur" },
    ],
    feedbackStatus: [
      {
        required: true,
        message: "请选择反馈信息处理状态",
        trigger: "change",
      },
    ],
  });
  // 上传图片
  const fileList = ref<UploadFiles>([]);
  const uploadRef = ref();
  const handleChange = (file: UploadFile, files: UploadFiles) => {
    fileList.value = files;
    console.log(file);
  };
  // 提交
  const emit = defineEmits(["renewClick"]);

  const submitForm = async (formEl?: FormInstance) => {
    if (!formEl) return;

    await formEl.validate((valid, fields) => {
      if (valid) {
        ElMessageBox.confirm("确认提交回复?")
          .then(() => {
            const loading = ElLoading.service({
              lock: true,
              text: "正在提交中",
              background: "rgba(0, 0, 0, 0.7)",
            });
            let dataForm = new FormData();
            dataForm.append("feedbackId", feedbackId.value as any);
            dataForm.append("replyContent", replyForm.replyContent);
            dataForm.append("replyType", replyType() as string);
            dataForm.append("feedbackStatus", replyForm.feedbackStatus);
            fileList.value.forEach((it: UploadFile) => {
              dataForm.append("fileList", it.raw as any);
            });
            boardStore
              .postInfoAddAction(dataForm)
              .then((res) => {
                loading.close();
                if (res.code == 200) {
                  isReply.value = false;
                  emit("renewClick", feedbackId.value);
                  boardStore.UnhandledAmountAction();
                  ElMessage({
                    type: "success",
                    message: "提交成功",
                  });
                } else {
                  ElMessage({
                    message: "提交失败",
                    type: "warning",
                  });
                }
              })
              .catch(() => {});
          })
          .catch(() => {});
      } else {
        console.log("error", fields);
      }
    });
  };

  const ReplyClose = (formEl?: FormInstance) => {
    if (!formEl) return;
    uploadRef.value.clearFiles();
    formEl.resetFields();
  };
</script>
<style lang="scss" scoped>
  .infoReply {
    .el-dialog-div {
      height: 69vh;
      .el-form-item {
        margin-right: 50px;
        margin-bottom: 40px;
        .el-radio-group {
          .el-radio {
            margin-right: 50px;
          }
        }
      }
      .btn {
        width: 100px;
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }
</style>
