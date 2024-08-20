<template>
  <div class="InfoSearch">
    <div class="title">
      <div class="round" :class="stateColor(searchForm.feedbackStatus)"></div>
      <p>{{ props.feedbackType == "1" ? "物流反馈" : "营销反馈" }}</p>
      <el-select
        v-model="searchForm.feedbackStatus"
        size="small"
        v-on:change="changeState"
      >
        <template v-for="item in options" :key="item.value">
          <el-option :label="item.label" :value="item.value">
            <div :class="item.class"></div>
            <span>{{ item.label }}</span>
          </el-option>
        </template>
      </el-select>
    </div>
    <div class="search-content">
      <el-form :inline="true" label-width="100px" :model="searchForm">
        <el-form-item label="订单时间" class="block">
          <el-date-picker
            v-model="time"
            value-format="YYYY-MM-DD hh:mm:ss"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item label="客户编码">
          <el-input v-model="searchForm.customerCode"  placeholder="点击输入"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="searchForm.contactName"  placeholder="点击输入"></el-input>
        </el-form-item>
        <el-form-item label="大区">
          <el-select clearable  filterable v-model="searchForm.areaName">
            <el-option
              v-for="item in boardStore.cond?.areaList"
              :key="item.areaId"
              :value="item.areaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路线名称">
          <el-input v-model="searchForm.routeName"  placeholder="点击输入"></el-input>
        </el-form-item>
        <el-form-item label="客户专员">
          <el-select clearable  filterable v-model="searchForm.managerWorkNumber">
            <el-option
              v-for="item in boardStore.cond?.customerManagerList"
              :key="item.workNumber"
              :label="item.userName"
              :value="item.workNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送货员">
          <el-select clearable  filterable v-model="searchForm.deliveryWorkNumber">
            <el-option
              v-for="item in boardStore.cond?.deliveryUserList"
              :key="item.workNumber"
              :label="item.userName"
              :value="item.workNumber"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handelReset">重置</el-button>
      </div>
    </div>
    <div class="btn-content">
      <el-button
        :icon="Plus"
        @click="handleAdd"
        v-if="
          (hasOp('guest-book:logistics:exception:add') &&
            feedbackType === '1') ||
          (hasOp('guest-book:marketing:exception:add') && feedbackType === '2')
        "
        >添加异常信息</el-button
      >
      <el-button
        :icon="Delete"
        v-if="
          (hasOp('guest-book:logistics:exception:delete') &&
            feedbackType === '1') ||
          (hasOp('guest-book:marketing:exception:delete') &&
            feedbackType === '2')
        "
        @click="handleDelete"
        >批量删除</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search, Refresh, Plus, Delete } from "@element-plus/icons-vue";
  import type { ISearch } from "@/types/board";
  import { useBoardStore } from "@/store/board";
  import { hasOp } from "@/op";
  const boardStore = useBoardStore();
  const emit = defineEmits([
    "itemAdd",
    "itemSearch",
    "itemReset",
    "itemState",
    "itemDelete",
  ]);
  interface IProps {
    feedbackType?: "1" | "2";
  }
  const props = defineProps<IProps>();
  onMounted(() => {
    boardStore.getCondAction();
  });
  // 反馈颜色
  const options = [
    { label: "全部", value: "", class: "sRound round all" },
    { label: "未处理", value: "0", class: "sRound round notProcessed" },
    { label: "处理中", value: "1", class: "sRound round dispose" },
    { label: "已处理", value: "2", class: "sRound round processed" },
    { label: "无需处理", value: "3", class: "sRound round notDispose" },
  ];
  function stateColor(state?: string) {
    switch (state) {
      case "0":
        return "notProcessed";
      case "1":
        return "dispose";
      case "2":
        return "processed";
      case "3":
        return "notDispose";
      case "":
        return "all";
    }
  }
  const searchForm = ref<ISearch>({
    contactName: "",
    areaName: "",
    customerCodeL: "",
    feedbackStatus: "",
    deliveryWorkNumber: "",
    managerWorkNumber: "",
    orderEndDate: "",
    orderStartDate: "",
    routeName:""
  });
  // 时间数据处理
  const time = ref();
  function changeTime() {
    if (time.value == null) {
      searchForm.value.orderStartDate = "";
      searchForm.value.orderEndDate = "";
    } else {
      searchForm.value.orderStartDate = time.value[0];
      searchForm.value.orderEndDate = time.value[1];
    }
  }
  // 下拉框改变请求数据
  function changeState() {
    emit("itemState", { ...searchForm.value });
  }
  // 点击搜索
  function handleSearch() {
    emit("itemSearch", { ...searchForm.value });
  }
  // 重置
  function handelReset() {
    searchForm.value = {
      contactName: "",
      areaName: "",
      customerCodeL: "",
      feedbackStatus: "",
      deliveryWorkNumber: "",
      managerWorkNumber: "",
      orderEndDate: "",
      orderStartDate: "",
      routeName:""
    };
    time.value = "";
    emit("itemReset");
  }
  // 点击添加
  function handleAdd() {
    emit("itemAdd");
  }
  // 点击删除
  function handleDelete() {
    emit("itemDelete");
  }
  // 暴露
  defineExpose({
    searchForm,
  });
</script>
<style lang="scss" scoped>
  .InfoSearch {
    .title {
      display: flex;
      align-items: center;

      p {
        margin: 0 15px;
      }
    }

    .search-content {
      display: flex;
      margin-top: 1vh;
      padding: 2vh 3vw 0 3vw;
      border: 2px solid $processed;

      .el-form-item {
        width: 30%;
        margin-bottom: 1.8vh;
      }

      .search-btn {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: start;
        height: 100%;
      }

      .el-button + .el-button {
        margin-top: 10%;
        margin-left: 0;
      }
    }

    .btn-content {
      margin: 0.8vh 0;
    }
  }
</style>
