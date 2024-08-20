<template>
  <div class="InfoTable">
    <el-table v-loading="loading" :data="props.tableData" :header-cell-style="{
      height: '4vh',
      'text-align': 'center',
    }" size="small" :row-style="{ height: '4.3vh' }" :cell-style="tableCellStyle as any" style="font-size: 0.8vw"
      @selection-change="toggleSelection">
      <el-table-column type="selection" fixed v-if="(hasOp('guest-book:logistics:exception:delete') &&
        feedbackType === '1') ||
        (hasOp('guest-book:marketing:exception:delete') &&
          feedbackType === '2')
        " min-width="3%"
       />
      <el-table-column type="index" label="序号" min-width="3%" />
      <el-table-column prop="areaName" label="大区" min-width="4%" />
      <el-table-column prop="routeName" label="线路名称" min-width="5%" />
      <el-table-column prop="deliveryName" label="送货员" min-width="4%" />
      <el-table-column prop="customerManagerName" label="客户专员" min-width="5%" />
      <el-table-column prop="customerCode" label="客户编码" min-width="5%" />
      <el-table-column prop="contactName" label="客户名称" min-width="5%" />
      <el-table-column prop="storeAddress" label="客户地址" min-width="20%" />
      <el-table-column prop="feedbackInformation" label="异常信息反馈" min-width="8%" />
      <el-table-column prop="orderDate" label="订单时间" min-width="10%" />
      <el-table-column prop="updateTime" label="最新回复时间" min-width="10%" />
      <el-table-column label="操作" min-width="4%" fixed="right">
        <template #default="scope">
          <el-button link size="small" @click="handleEdit(scope.row)"><el-icon color="rgb(204,255,255)" size="15">
              <Edit />
            </el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { hasOp } from "@/op";
import type { IBoardItem } from "@/types/board";
import { storeToRefs } from "pinia";
import { Edit } from "@element-plus/icons-vue";
const emit = defineEmits(["itemClick"]);
import { useBoardStore } from "@/store/board";
const boardStore = useBoardStore();
const { loading } = storeToRefs(boardStore);
interface IProps {
  tableData?: IBoardItem[];
  feedbackType?: "1" | "2";
}
const props = withDefaults(defineProps<IProps>(), {
  tableData: () => {
    return [];
  },
});
// 修改表格每一行颜色
const tableCellStyle = ({ row }: { row: IBoardItem }) => {
  if (row.feedbackStatus === 0) {
    return {
      background: "rgba(161, 86, 192,0.8)",
      textAlign: "center",
    };
  } else if (row.feedbackStatus === 1) {
    return {
      background: "rgba(190,174,58,0.8)",
      textAlign: "center",
    };
  } else if (row.feedbackStatus === 3) {
    return {
      background: "rgba(124,135,148,0.8)",
      textAlign: "center",
    };
  } else if (row) {
    return {
      textAlign: "center",
    };
  }
};
// 点击编辑
function handleEdit(item: IBoardItem) {
  emit("itemClick", item);
}
// 多选
const deleteData = ref<string>();
function toggleSelection(items: IBoardItem[]) {
  deleteData.value = items
    .map((item) => {
      return item.feedbackId.toString();
    })
    .join();
  boardStore.UnhandledAmountAction()
}
defineExpose({ deleteData });
</script>
<style lang="scss" scoped>
.InfoTable {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
