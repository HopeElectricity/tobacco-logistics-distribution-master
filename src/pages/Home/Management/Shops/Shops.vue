<template>
  <div class="Shops">
    <div     style="display: flex;">
      <div class="top">
        <el-input class="input" style="width: 500px" placeholder="请点击搜索" @focus="searchData" />
        <div class="search" v-show="isShow">
          <div class="off" @click="isShow = false">x</div>
          <el-form class="form" :model="searchForm">
            <el-form-item label="客户编码" style="width: 47%">
              <el-input v-model="searchForm.customerCode" placeholder="点击输入"></el-input>
            </el-form-item>
            <el-form-item label="负责人" style="width: 47%; margin-left: 20px">
              <el-input v-model="searchForm.contactName" placeholder="点击输入"></el-input>
            </el-form-item>
            <el-form-item label="商铺地址" style="width: 100%">
              <el-input v-model="searchForm.storeAddress" placeholder="点击输入"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select class="select" v-model="searchForm.groupId" placeholder="全部区域" size="large">
                <el-option v-for="item in regions" :key="item.groupId" :label="item.groupName" :value="Number(item.groupId)" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select class="select" v-model="searchForm.routeId" placeholder="全部路线" size="large">
                <el-option v-for="item in routes" :key="item.routeId" :label="item.routeName" :value="Number(item.routeId)" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select class="select" v-model="searchForm.areaId" placeholder="全部行政区" size="large">
                <el-option v-for="item in areas" :key="item.areaId" :label="item.areaName" :value="Number(item.areaId)" />
              </el-select>
            </el-form-item>
            <div class="btn-content">
              <el-button @click="handelReset">清空</el-button>
              <el-button @click="searchTable">搜索</el-button>
            </div>
          </el-form>
        </div>
      </div>
      <div class="second">
        <el-button class="btn" @click="openShopsAdd"  v-if="hasOp('data-management:store:add')">
          <el-icon>
            <Plus />
          </el-icon>添加商铺
        </el-button>
        <el-button class="btn" @click="updatedAreas"  v-if="hasOp('data-management:store:update')">
          <el-icon>
            <Place />
          </el-icon>调整归属地
        </el-button>
        <el-button class="btn" @click="handleDelete"  v-if="hasOp('data-management:store:delete')">
          <el-icon>
            <Delete />
          </el-icon>批量删除
        </el-button>
        <el-button class="btn" @click="openShopsEdit"  v-if="hasOp('data-management:store:area:update')">
          <el-icon>
            <EditPen />
          </el-icon>修改信息
        </el-button>
      </div>
    </div>

    <div class="main">
      <el-table :data="tableData" :cell-style="{ textAlign: 'center' }" @selection-change="handleSelectionChange"
        v-loading="datamanagementStore.loading" :header-cell-style="{
      height: '4vh',
      'text-align': 'center'
    }" size="small" :row-style="{ height: '4.3vh'}" style="font-size: 0.8vw" >
        <el-table-column type="selection"  min-width="1%" />
        <el-table-column label="序号" min-width="2%" type="index" />
        <el-table-column label="客户编码" min-width="3%" prop="customerCode" />
        <el-table-column label="客户名称" min-width="3%" prop="customerManagerName" />
        <el-table-column label="负责人" min-width="2%" prop="contactName" />
        <el-table-column label="订货电话" min-width="4%" prop="contactPhone" />
        <el-table-column label="地址" min-width="12%" prop="storeAddress" />
        <el-table-column label="所属行政区" min-width="3%" prop="areaName" />
        <el-table-column label="所属配送线路" min-width="4%" prop="routeName" />
      </el-table>
      <el-pagination layout="prev, pager, next" :current-page="pageData.pageNum" :page-size="pageData.pageSize"
        :total="Number(datamanagementStore.datamanagementList.total)" @current-change="currentChange" />
    </div>
    <ShopsEdit ref="ShopsEditRef"></ShopsEdit>
    <el-dialog width="40%" @close="AreaEdit = false" v-model="AreaEdit">
      <div style="margin-left: 30px">
        <div class="info">现选择商铺所属行政区为：{{ areasName }}</div>
        <el-form-item label="请选择调整后的行政区:">
          <el-select v-model="AreaId" placeholder="请选择">
            <el-option v-for="item in areas" :key="item.areaId" :label="item.areaName" :value="Number(item.areaId)" />
          </el-select>
        </el-form-item>
      </div>
      <el-button class="confirmArea" @click="confirmArea">确认</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { hasOp } from "@/op";
import { usedatamanagementStore } from "@/store/datamanagement";
const datamanagementStore = usedatamanagementStore();
import type { ImanagementSearchData, ImanagementTableData, ISearch ,IOptionalData} from "@/types/datamanagement";
import ShopsEdit from "../ShopsEdit/ShopsEdit.vue";
import {
  Plus,
  Place,
  Delete,
  EditPen,
} from "@element-plus/icons-vue";
const tableData = ref<ImanagementTableData[]>();
// 修改商铺
const ShopsEditRef = ref<InstanceType<typeof ShopsEdit>>();
function openShopsEdit() {
  if (!deleteData.value) {
    ElMessage.warning("请先选中要修改的商铺");
  } else if (updataData.value&&updataData.value.length == 1) {
    typeof ShopsEditRef.value?.title === "string"
      ? (ShopsEditRef.value.title = "修改商铺信息")
      : false;
    typeof ShopsEditRef.value?.ShopsEditIsOpen === "boolean"
      ? (ShopsEditRef.value.ShopsEditIsOpen = true)
      : false;
    typeof  ShopsEditRef.value?.storeId === "number"
      ? ( ShopsEditRef.value.storeId = Number(deleteData.value))
      : false;
    if(!regions.value){
      getOptionalList("group")
      watch(regions,(newValue)=>{
        if(ShopsEditRef.value){
        ShopsEditRef.value.groups = newValue
      }
      })
      }
  } else {
    ElMessage.warning("只能选中一个需要修改的商铺");
  }
}
function openShopsAdd() {
  typeof ShopsEditRef.value?.title === "string"
    ? (ShopsEditRef.value.title = "添加商铺信息")
    : false;
  typeof ShopsEditRef.value?.ShopsEditIsOpen === "boolean"
    ? (ShopsEditRef.value.ShopsEditIsOpen = true)
    : false;
}

// 获取表格数据
const pageData = ref<ImanagementSearchData>({
  pageNum: 1,
  pageSize: 15,
});
function getDate(searchData: ISearch = {}) {
  datamanagementStore
    .getStoreAction({
      ...pageData.value,
      ...searchData
    })
    .then(() => {
      pageData.value.pageNum = datamanagementStore.datamanagementList.current;
      tableData.value = datamanagementStore.datamanagementList.records;
      console.log(datamanagementStore.datamanagementList);
    });
}
function currentChange(value: number) {
  pageData.value.pageNum = value;
  getDate();
}
// 获取下拉框数据
// 获取焦点弹窗
const isShow = ref<boolean>(false);
const areas = ref<IOptionalData[]>()
const regions = ref<IOptionalData[]>()
const routes = ref<IOptionalData[]>()
const searchForm = ref<ISearch>({
    contactName: '',
    customerCode: '',
    storeAddress: '',
});
function getOptionalList(dataType: string) {
  datamanagementStore.getOptionalAction(dataType).then(() => {
    if (dataType == "area") {
      areas.value = datamanagementStore.getOptionalData;
    } else if (dataType == "route") {
      routes.value = datamanagementStore.getOptionalData;
    } else if(dataType == "group") {
      regions.value = datamanagementStore.getOptionalData;
    }
  }
  )
}
function searchData() {
  isShow.value = true
  if (!areas.value || !routes.value || !regions.value) {
    getOptionalList("route")
    getOptionalList("group")
    getOptionalList("area")
  }
}
function searchTable() {
  getDate(searchForm.value)
}
function handelReset() {
  searchForm.value = {
    contactName: '',
    customerCode: '',
    areaId: undefined,
    storeAddress: '',
    routeId: undefined,
    groupId: undefined
  };
}
// 多选删除
const deleteData = ref<string>();
const sameArea = ref<boolean>()
const AreaId = ref<number>()
const areasName = ref<string>()
const updataData = ref<string[]>()
function handleSelectionChange(items: ImanagementTableData[]) {
  areasName.value = items[0]?.areaName
  sameArea.value = items.map((i) => i.areaName).every((value) => {
    return value == items[0].areaName
  })
  updataData.value = items
    .map((item) => {
      return item.storeId.toString();
    })
  deleteData.value = updataData.value?.join();
}

function handleDelete() {
  if (!deleteData.value) {
    ElMessage.warning("请先选中要删除的商铺");
  } else if (deleteData.value) {
    ElMessageBox.confirm("确认删除选中的商铺?")
      .then(() => {
        datamanagementStore.deleteStoreAction(deleteData.value as string).then(() => {
          getDate()
        })
      })
  }
}
// 调整归属地
const AreaEdit = ref<boolean>();
function updatedAreas() {
  if (!deleteData.value) {
    ElMessage.warning("请先选中要调整的商铺");
  } else if (!sameArea.value) {    
    ElMessage.warning("请选择商铺中同一个行政区");
  } else {
    getOptionalList("area")
    AreaEdit.value = true
  }
}
function confirmArea() {
  console.log({ areaId: AreaId.value, storeIdList: updataData.value });
  if (AreaId.value&&updataData.value) {
    datamanagementStore.updateAreaAction({ areaId: AreaId.value, storeIdList: updataData.value }).then(() => {
      AreaEdit.value = false
      getDate(searchForm.value);
    })
    
  } else {
    ElMessage.warning("请选择调整后的行政区");
  }
}
onMounted(() => {
  getDate();
});
</script>
<style lang="scss" scoped>
.Shops {
 
  .top {
    margin: 1vh 0px;

    .select {
      margin: 0 1vw;
    }

    .btn {
      box-sizing: border-box;
      width: 2.3vw;
      height: 4vh;
    }

    .search {
      position: absolute;
      z-index: 9;
      background-color: #091b3a;
      width: 500px;

      .off {
        width: 1.5vw;
        height: 2vh;
        background-color: #9addf6;
        position: absolute;
        right: 0;
        color: #041c3f;
        text-align: center;
        cursor: pointer;
      }

      .form {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        align-items: center;
        border: 1px solid #9addf6;
      }

      .btn-content {
        margin: 0 auto;
      }

      .el-form-item {
        width: 33.3%;
      }
    }
  }

  .second {
    margin: 1vh;

    .btn {
      margin: 0 10px;
      box-sizing: border-box;
      width: 6.5vw;
      height: 4vh;
    }
  }

  .main {
    :deep(.el-table__header th) {
      background-color: #9addf6;
    }
  }
}

.el-pagination {
  display: flex;
  justify-content: center;
  margin-right: 130px;
  margin-top: 1vh;
}

.info {
  height: 4.5vh;
  font-size: 20px;
  color: rgb(204, 255, 255);
  margin-bottom: 3vh;
}

.confirmArea {
  margin-top: 10vh;
  width: 100px;
  position: relative;
  left: 50%;
  transform: translate(-50%);
}
</style>
