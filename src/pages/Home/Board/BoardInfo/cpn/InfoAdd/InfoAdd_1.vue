<template>
  <div class="InfoAdd">
    <el-dialog v-model="isOpen" width="90%" @closed="resetForm(ruleFormRef, ruleFormRef2)">
      <div class="dialog-content">
        <div class="form-content">
          <el-form :inline="true" :model="addForm" label-width="130" :rules="rules" ref="ruleFormRef">
            <el-form-item label="客户编码" prop="customerCode">
              <el-select v-model="addForm.customerCode" placeholder="请选择客户编码" @change="selectChange">
                <el-option v-for="item in boardStore.cond?.storeList" :key="item.customerCode" :label="item.customerCode"
                  :value="item.customerCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送货员" prop="deliveryName">
              <el-select v-model="addForm.deliveryName" placeholder="请选择送货员名称">
                <el-option v-for="item in boardStore.cond?.deliveryUserList" :key="item.workNumber"
                  :value="item.userName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单日期" prop="orderDate">
              <el-date-picker v-model="addForm.orderDate" type="datetime" placeholder="选择日期时间"
                value-format="YYYY-MM-DD hh:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerCode">
              <el-select disabled v-model="addForm.customerCode" placeholder="请选择客户名称">
                <el-option v-for="item in boardStore.cond?.storeList" :key="item.customerCode" :label="item.contactName"
                  :value="item.customerCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="路线名称" prop="routeName">
              <el-select disabled v-model="addForm.routeName" placeholder="请选择路线名称">
                <el-option v-for="item in boardStore.cond?.routeList" :key="item.routeId"
                  :value="item.routeName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户专员" prop="customerManagerName">
              <el-select disabled v-model="addForm.customerManagerName" placeholder="请选择客户专员名称">
                <el-option v-for="item in boardStore.cond?.customerManagerList" :key="item.workNumber"
                  :value="item.userName"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-form :rules="rules" :model="addForm" ref="ruleFormRef2">
          <el-form-item class="item" label="编辑异常信息" prop="feedbackInformation">
            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 20 }"
              v-model="addForm.feedbackInformation"></el-input>
          </el-form-item>
          <el-form-item class="item" label="上传签收照片">
            <el-upload accept="image/*" multiple list-type="picture-card" :auto-upload="false"
              v-model:file-list="addForm.fileList">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-button class="btn" size="large" @click="submitForm(ruleFormRef, ruleFormRef2)">提交</el-button>
          <el-button class="btn" size="large" @click="resetForm(ruleFormRef, ruleFormRef2)">清空</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useBoardStore } from "@/store/board";
import { storeToRefs } from "pinia";
import { IAddData, ICond } from "@/types/board";
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
const boardStore = useBoardStore();
const { singleCondData } = storeToRefs(boardStore);
// 打开
const isOpen = ref<boolean>(false);
function handleOpen(feedbackType: "1" | "2") {
  isOpen.value = true;
  addForm.value.feedbackType = feedbackType;
}
defineExpose({
  handleOpen,
});
const emit = defineEmits(["addSuccess"]);
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
//校验
const rules = reactive<FormRules<IAddData>>({
  customerCode: [
    { required: true, message: "请选择客户名称", trigger: "blur" },
  ],
  areaName: [{ required: true, message: "请选择大区名称", trigger: "blur" }],
  routeName: [{ required: true, message: "请选择路线名称", trigger: "blur" }],
  orderDate: [{ required: true, message: "请选择日期", trigger: "blur" }],
  deliveryName: [
    { required: true, message: "请选择送货员", trigger: "blur" },
  ],
  customerManagerName: [
    { required: true, message: "请选择客户专员", trigger: "blur" },
  ],
  feedbackInformation: [
    { required: true, message: "请填写异常信息", trigger: "blur" },
  ],
});

// 添加
const addForm = ref<IAddData>({
  areaName: "",
  customerCode: "",
  deliveryName: "",
  deliveryWorkNumber: "",
  feedbackInformation: "",
  feedbackType: "1",
  orderDate: "",
  routeId: 0,
  routeName: "",
  customerManagerName: "",
  fileList: [],
});
// 选项修改
async function selectChange(e: string) {
  boardStore.singleCondDataAction(e).then(() => {
    console.log(boardStore.cond);
    addForm.value.areaName = singleCondData.value.areaName;
    addForm.value.customerManagerName =
      singleCondData.value.customerManagerName;
    addForm.value.routeId = Number(singleCondData.value.routeId);
    addForm.value.routeName = singleCondData.value.routeName;
  });
}
// 提交
const submitForm = async (
  formEl: FormInstance | undefined,
  formEl2: FormInstance | undefined
) => {
  if (!(formEl && formEl2)) return;
  formEl
    .validate(() => { })
    .then((res) => {

      formEl2.validate((valid, fields) => {
        if (valid) {
          if (res) {
            // 发请求
            boardStore.getCondAction().then(() => {
              const { customerManagerList, deliveryUserList }
                = boardStore.cond as ICond
              for (const obj of deliveryUserList) {
                console.log(addForm.value.deliveryName);
                if (obj.userName == addForm.value.deliveryName) {
                  addForm.value.deliveryWorkNumber = obj.workNumber
                }
              }
              for (const obj of customerManagerList) {
                if (obj.userName == addForm.value.customerManagerName) {
                  addForm.value.managerWorkNumber = obj.workNumber
                }
              }
              const formData = new FormData();
              formData.append("areaName", addForm.value.areaName);
              formData.append("customerCode", addForm.value.customerCode);
              formData.append("deliveryName", addForm.value.deliveryName);
              formData.append(
                "deliveryWorkNumber",
                addForm.value.deliveryWorkNumber
              );
              formData.append(
                "managerWorkNumber",
                addForm.value.managerWorkNumber as any
              );
              formData.append(
                "feedbackInformation",
                addForm.value.feedbackInformation
              );
              formData.append("feedbackType", addForm.value.feedbackType);
              formData.append(
                "routeId",
                addForm.value.routeId as unknown as string
              );
              formData.append("routeName", addForm.value.routeName);
              formData.append(
                "customerManagerName",
                addForm.value.customerManagerName as unknown as string
              );
              formData.append(
                "orderDate",
                addForm.value.orderDate as unknown as string
              );
              addForm.value.fileList?.forEach((item) => {
                formData.append("fileList", item.raw);
              });
              boardStore
                .addFeedbackAction(formData as unknown as IAddData)
                .then(() => {
                  isOpen.value = false;
                  emit("addSuccess");
                  boardStore.UnhandledAmountAction()
                });
            })
          }
        } else {
          console.log("error submit!", fields);
        }
      });
    });
};
const resetForm = (
  formEl: FormInstance | undefined,
  formEl2: FormInstance | undefined
) => {
  if (!(formEl && formEl2)) return;
  formEl.resetFields();
  formEl2.resetFields();
  addForm.value.fileList = [];
  console.log(addForm.value);
};
</script>
<style lang="scss" scoped>
.InfoAdd {
  .dialog-content {
    margin: 40px;

    .form-content {
      padding: 30px;
      border: 1px solid $processed;
    }

    .item {
      margin-top: 50px;
    }

    .btn {
      position: relative;
      left: 50%;
    }
  }

  .el-form-item__label {
    font-size: 15px !important;
  }
}
</style>
