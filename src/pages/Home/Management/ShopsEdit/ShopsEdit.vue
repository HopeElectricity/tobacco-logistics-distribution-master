<template>
  <div class="ShopsEdit">
    <el-dialog :title="title" v-model="ShopsEditIsOpen" width="80%" @close="closeShopsEdit(formRef)" @open="openShops">
      <div>
        <div class="ShopsEditInfo">
          <el-form class="form" ref="formRef" :model="searchForm">
            <div class="leftInfo">
              <el-form-item prop="customerCode">
              <div class="info">客户编码：{{ searchForm.customerCode }}</div>
            </el-form-item>
              <el-form-item label="地址" prop="storeAddress">
                <el-input placeholder="点击输入" v-model="searchForm.storeAddress"></el-input>
              </el-form-item>
              <el-form-item label="商铺经度" prop="longitude">
                <el-input placeholder="点击输入" v-model="searchForm.longitude"></el-input>
              </el-form-item>
              <el-form-item label="所属大区" prop="groupId">
                <el-select class="select" v-model="searchForm.groupId" placeholder="全部区域" size="large">
                <el-option v-for="item in groups" :key="item.groupId" :label="item.groupName" :value="Number(item.groupId)" />
              </el-select>
              </el-form-item>
              <el-form-item label="负责人" prop="contactName">
                <el-input placeholder="点击输入" v-model="searchForm.contactName"></el-input>
              </el-form-item>
              <el-form-item label="订货电话" prop="contactPhone">
                <el-input placeholder="点击输入" v-model="searchForm.contactPhone"></el-input>
              </el-form-item>
              <div class="info">订货周期：{{ searchForm.orderCycle }}</div>
              <el-form-item label="客户专员id" prop="customerManagerId">
                <el-input placeholder="点击输入" v-model="searchForm.customerManagerId"></el-input>
              </el-form-item>
              <el-form-item prop="createTime">
              <div class="info" prop="customerCode">创建时间：{{ searchForm.createTime }}</div>
            </el-form-item>
            </div>
            <div class="centerInfo">
              <el-form-item label="客户名称" prop="customerManagerId">
                <el-input placeholder="点击输入"  v-model="searchForm.customerManagerId"></el-input>
              </el-form-item>
              <el-form-item prop="areaName">
              <div class="info">所属行政区：{{ searchForm.areaName }}</div>
            </el-form-item>
              <el-form-item label="商铺维度" prop="latitude"> 
                <el-input placeholder="点击输入" v-model="searchForm.latitude"></el-input>
              </el-form-item>
              <div class="info">所属聚集区：{{ searchForm.district }}</div>
              <el-form-item label="客户状态" >
                <el-select v-model="searchForm.status"><el-option label="异常" value="0" /> 
                  <el-option label="正常" value="1" /> </el-select>
              </el-form-item>
              <el-form-item label="收货电话" prop="">
                <el-input placeholder="点击输入" ></el-input>
              </el-form-item>
              <el-form-item label="返销周期">
                <el-input placeholder="点击输入" ></el-input>
              </el-form-item>
              <el-form-item label="客户专员名称" prop="customerManagerName">
                <el-input placeholder="点击输入" v-model="searchForm.customerManagerName"></el-input>
              </el-form-item>
              <el-form-item prop="updateTime">
              <div class="info">更新时间：{{ searchForm.updateTime }}</div>
            </el-form-item>
          </div>
            <div class="rightInfo">
              <el-form-item label="商圈类型" prop="type">
                <el-select v-model="searchForm.type">
                  <el-option v-for="item in types" :key="item" :label="item" :value="item" /></el-select>
              </el-form-item>
              <el-form-item label="商铺类型" prop="locationtype">
                <el-select v-model="searchForm.locationType">
                  <el-option v-for="item in locationTypes" :key="item" :label="item" :value="item" /></el-select>
              </el-form-item>
              <el-form-item prop="routeId">
              <div class="info">路线id：{{ searchForm.routeId }}</div>
            </el-form-item>
              <el-form-item label="客户档位" prop="gear">
                <el-select v-model="searchForm.gear"><el-option v-for="item in gears" :key="item" :label="item" :value="item" /></el-select>
              </el-form-item>
              <el-form-item label="备用收货电话">
                <el-input placeholder="点击输入"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="ShopsEditBtn">
          <el-button @click="closeShopsEdit(formRef)">取消</el-button>
          <el-button @click="updateStore">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { usedatamanagementStore } from "@/store/datamanagement";
import type {IOptionalData,ImanagementStoreDetial} from "@/types/datamanagement";
const datamanagementStore = usedatamanagementStore();
import type { FormInstance } from 'element-plus'
const title = ref<string>("");
const storeId = ref<number>(0)
const formRef = ref<FormInstance>();
const ShopsEditIsOpen = ref<boolean>(false);
const groups = ref<IOptionalData[]>()
  const searchForm = ref<ImanagementStoreDetial>({
  areaName:"",
  contactName:"",
  contactPhone:'',
  createTime:"",
  customerCode:"",
  customerManagerName:"",
  district:'',
  gear:"",
  orderCycle:"",
  routeName:"",
  status:'',
  storeAddress:"",
  storeName:"",
  type:"",
  updateTime:"",
  locationType:""
});
const types:string[] = ['商业娱乐区','旅游景区','居民区','其他','工业区','院校学区','办公区','交通枢纽区','集贸区','农林渔牧区']
const gears:string[] = ['一档','二档','三档','四档','五档','六档','七档','八档','九档','十档'
,'十一档','十二档','十三档','十四档','十五档','十六档','十七档','十八档','十九档','二十档',
'二十一档','二十二档','二十三档','二十四档','二十五档','二十六档','二十七档','二十八档','二十九档','三十档']
const locationTypes:string[]=['乡镇','城区']
const closeShopsEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ShopsEditIsOpen.value = false; 
};
function openShops(){
  if(title.value == '修改商铺信息'){
    datamanagementStore.getStoreDetialAction(storeId.value).then(() => {
    searchForm.value = datamanagementStore.storeDetialData 
    console.log(searchForm.value); 
  })
}
}
function updateStore(){
  if(title.value == '修改商铺信息'){
 datamanagementStore.updateStoreAction(searchForm.value)
 ShopsEditIsOpen.value = false; 
}else{
  datamanagementStore.addStoreAction(searchForm.value)
  ShopsEditIsOpen.value = false;
}
}
defineExpose({
  ShopsEditIsOpen,
  title,
  storeId,
  groups
});

</script>
<style lang="scss" scoped>
.ShopsEdit {
  margin: 25px auto;
  width: 48vw;
  color: #73e1ff;
  font-size: 20px;

  .form {
    display: flex;

    .info {
      height: 45px;
      font-size: 20px;
      color: rgb(204, 255, 255);
    }

    .leftInfo {
      width: 30%;
      margin-left: 30px;
    }

    .centerInfo {
      width: 30%;
      margin-left: 50px;
    }

    .rightInfo {
      width: 30%;
      margin-left: 50px;
    }
  }

  .ShopsEditBtn {
    display: flex;
    justify-content: center;

    .el-button {
      width: 85px;
      margin: 30px 5vw;
    }
  }
}
</style>
