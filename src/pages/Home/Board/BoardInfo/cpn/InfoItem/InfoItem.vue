<template>
  <div class="InfoItem">
    <el-dialog v-model="isOpen" width="70%" top="4%" title="nihao">
      <template #header>
        <div class="my-header">
          <div class="el-dialog-div-top">
            <div class="round" :class="stateColor(replyStatus)"></div>
            <p>
              {{ Item?.feedbackInformation }}&nbsp;&nbsp;({{
                stateText(replyStatus)
              }})
            </p>
          </div>
        </div>
      </template>
      <div class="el-dialog-div">
        <el-scrollbar class="scroll">
          <div class="el-dialog-div-info">
            <template v-for="(value, key) in itemInfo" :key="key">
              <div class="el-dialog-div-info-item">
                {{ InfoText[key] }}:&nbsp;&nbsp;{{ value }}
              </div>
            </template>
          </div>
          <div class="el-dialog-div-img">
            <template v-for="item in feedbackImg" :key="item">
              <div class="el-dialog-div-img-item">
                <img :src="item" alt="" />
              </div>
            </template>
          </div>
          <div
            class="el-dialog-div-recover"
            v-if="
              isShow &&
              ((hasOp('guest-book:logistics:exception:reply') &&
                props.feedbackType === '1') ||
                (hasOp('guest-book:marketing:exception:reply') &&
                  props.feedbackType === '2'))
            "
          >
            <span class="line"></span>
            <el-button @click="replyItemClick(id)">点击回复</el-button>
            <span class="line"></span>
          </div>
          <template v-for="item in replyData" :key="item.replyId">
            <div class="reply-text">
              <span
                >{{
                  item.replyType == "1" ? "送货部回复" : "营销部回复"
                }}:&nbsp;&nbsp;{{ item.replyContent || "没有回复消息" }}</span
              >
              <div class="reply-date">{{ item.createTime }}</div>
            </div>
            <div class="reply-img">
              <template
                v-for="imgList in mapPath(item.replyFilePathList as string[])"
                :key="imgList"
              >
                <div class="reply-img-item">
                  <img :src="imgList" alt="" />
                </div>
              </template>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import type { IBoardItem, ItemInfo, InfoDetail } from "@/types/board";
  import { useBoardStore } from "@/store/board";
  import { hasOp } from "@/op";
  const boardStore = useBoardStore();
  const emit = defineEmits(["replyClick"]);
  const isOpen = ref<boolean>(false);
  const id = ref<number>(0);

  // prop
  interface IProps {
    feedbackType?: "1" | "2";
  }
  const props = defineProps<IProps>();

  const InfoText: ItemInfo = {
    contactName: "客户名称",
    deliveryName: "送货员",
    orderDate: "订单日期",
    customerCode: "客户编号",
    customerManagerName: "客户专员",
    routeName: "送货路线",
    storeAddress: "客户地址",
  };
  const itemInfo = ref<ItemInfo>({
    contactName: "",
    deliveryName: "",
    orderDate: "",
    customerCode: "",
    customerManagerName: "",
    routeName: "",
    storeAddress: "",
  });

  // 反馈消息类型
  const Item = ref<IBoardItem>();
  function stateColor(state?: number) {
    switch (state) {
      case 0:
        return "notProcessed";
      case 1:
        return "dispose";
      case 2:
        return "processed";
      case 3:
        return "notDispose";
    }
  }
  function stateText(state?: number) {
    switch (state) {
      case 0:
        return "未处理";
      case 1:
        return "处理中";
      case 2:
        return "已处理";
      case 3:
        return "无需处理";
    }
  }
  // 匹配图片路径
  function mapPath(array: string[]) {
    const newArray = array.map((i: string) => {
      console.log(i)
      return import.meta.env.VITE_BASE_URL + i;
    });
    return newArray;
  }
  // 回复信息列表
  const replyData = ref<InfoDetail[]>([]);
  // 获取数据和图片
  const isShow = ref<boolean>(true);
  const feedbackImg = ref<string[]>([]);
  const replyStatus = ref<number>(0);
  function handleOpen(item: IBoardItem) {
    isOpen.value = true;
    id.value = item.feedbackId;
    replyStatus.value = item.feedbackStatus;
    Item.value = item;
    boardStore.getDetailData(id.value);
    watch(
      () => boardStore.detail,
      (n) => {
        replyData.value = n as InfoDetail[];
        let key: keyof ItemInfo;
        for (key in itemInfo.value) {
          itemInfo.value[key] = item[key];
        }
        feedbackImg.value = mapPath(item.feedbackFileList);
      }
    );
    if (Item.value.feedbackStatus == 2 || Item.value.feedbackStatus == 3) {
      isShow.value = false;
    } else {
      isShow.value = true;
    }
  }
  function getReplyData(id: number, feedbackStatus: number) {
    replyStatus.value = feedbackStatus;
    boardStore.getDetailData(id);
    watch(
      () => boardStore.detail,
      (n) => {
        replyData.value = n as InfoDetail[];
      }
    );
    if (replyStatus.value == 2 || replyStatus.value == 3) {
      isShow.value = false;
    }
  }
  defineExpose({
    handleOpen,
    getReplyData,
  });
  // 点击回复
  function replyItemClick(id: number) {
    emit("replyClick", id);
  }
</script>
<style lang="scss" scoped>
  .InfoItem {
    color: white;

    /* 此处的 div 可以依照情况替换成对应的元素名称 */
    div::-webkit-scrollbar {
      display: none;
    }

    .my-header {
      height: 10px;
    }

    .el-dialog-div-top {
      display: flex;
      align-items: center;

      p {
        margin: 0 15px;
        font-size: 25px;
      }
    }

    .el-dialog-div {
      height: 69vh;
      overflow: auto;

      .el-dialog-div-info {
        margin: 0px 40px 10px 40px;
        display: flex;
        flex-wrap: wrap;
        font-size: 18px;

        .el-dialog-div-info-item {
          box-sizing: border-box;
          padding: 10px;
          flex: 33.3%;
        }
      }

      .el-dialog-div-img {
        display: flex;
        flex-wrap: wrap;

        .el-dialog-div-img-item {
          margin: 10px 30px;
          height: 30vh;
          border: 2px solid #73e1ffce;

          img {
            height: 100%;
            width: 100%;
          }
        }
      }

      .el-dialog-div-recover {
        height: 50px;
        line-height: 60px;
        text-align: center;

        .line {
          margin: 0 10px;
          display: inline-block;
          width: 150px;
          border-top: 2px solid #73e1ffce;
          vertical-align: 4%;
        }
      }

      .reply-text {
        font-size: larger;
        border-top: 1px solid #73e1ffce;
        margin-top: 20px;
        padding: 10px 30px;
        display: flex;
        justify-content: space-between;

        .reply-date {
          margin-right: 30px;
        }
      }

      .reply-img {
        display: flex;
        flex-wrap: wrap;

        .reply-img-item {
          margin: 10px 30px;
          height: 20vh;
          border: 1px solid #73e1ffce;

          img {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
</style>
