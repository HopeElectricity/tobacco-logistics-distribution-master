import requests from "../index";

import type {
  IBoardSearchData,
  IBoard,
  ICond,
  InfoDetail,
  IAddData,
  ISingleCondData,
  IUnhandledAmount,
} from "@/types/board";
import { IRequest } from "../request/type";

export function getList(params: IBoardSearchData) {
  return requests.get<IRequest<IBoard>>({
    url: "/guestbook/feedback/list",
    params,
  });
}

// 获取下拉框数据
export function getConditions() {
  return requests.get<IRequest<ICond>>({
    url: "/guestbook/feedback/getConditionsData",
  });
}

// 添加异常信息
export function addFeedback(data: IAddData) {
  return requests.post<IRequest<any>>({
    url: "/guestbook/feedback/add",
    data,
  });
}
// 删除异常信息
export function removeFeedback(ids: string) {
  return requests.delete({
    url: `/guestbook/feedback/delete/${ids}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
// 处理信息详情
export function getInfoDetail(id: number) {
  return requests.get<IRequest<InfoDetail[]>>({
    url: `/guestbook/feedback/details/${id}`,
  });
}
// 处理信息添加
export function postInfoAdd(addReply: any) {
  return requests.post<IRequest<string>>({
    url: "/guestbook/feedback/addReply",
    data: addReply,
  });
}
// 添加下拉框联动数据
export function getSingleConditions(customerCode: string) {
  return requests.get<IRequest<ISingleCondData>>({
    url: `/guestbook/feedback/getSingleConditionsData/${customerCode}`,
  });
}
// 获取未处理数目
export function getUnhandledAmount(){
  return requests.get<IRequest<IUnhandledAmount>>({
    url: '/guestbook/feedback/getUnhandledAmount',
  });
}
