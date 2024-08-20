import requests from "../index";
import { IRequest } from "../request/type";
import {
  IAccumlationInfo,
  IAccumulationIdInfo,
  IAreaDetails,
  ICalculateInfo,
  IErrorPoints,
  IHistoricalPath,
  IInformationList,
  IMapResult,
  IResultPoints,
  IRouteData,
  IShopData,
  IAccumulationList,
  IVersionRequest,
  ItestInformation,
  IRouteSave,
  Ipoints,
} from "@/types/cluster";

// 获取所有聚集区及商铺点
export function getAllResultPoints() {
  return requests.get<IRequest<IResultPoints[]>>({
    timeout: 1000 * 60 * 3,
    url: "/clustercalculate/cluster/getListResultPoints",
  });
}

// 计算接口
export function postCalculateAll() {
  return requests.post<IRequest<any[]>>({
    timeout: 1000 * 60 * 4,
    url: "/clustercalculate/cluster/calculateAll",
  });
}

//检测所有大区的所有聚集区是否有错误点
export function getCheckErrorPoints() {
  return requests.get<IRequest<number>>({
    timeout: 1000 * 80,
    url: "/clustercalculate/cluster/checkErrorPoints",
  });
}

//清空修改数据信息列表哩的全部信息
export function deleteClearInformationList() {
  return requests.delete<IRequest<any[]>>({
    url: "/clustercalculate/cluster/clearInformationList",
  });
}

//获取当前商铺可调整到的聚集区
export function getClosestPoints(data: IShopData) {
  return requests.get<IRequest<IAccumlationInfo[]>>({
    url: `/clustercalculate/cluster/getClosestPoints?latitude=${data.latitude}&longitude=${data.longitude}`,
  });
}

//获取错误点接口
export function getErrorPoints() {
  return requests.get<IRequest<IErrorPoints[]>>({
    timeout: 1000 * 60,
    url: "/clustercalculate/cluster/getErrorPoints",
  });
}

//获取修改数据信息列表
export function getInformationList() {
  return requests.get<IRequest<IInformationList[]>>({
    url: "/clustercalculate/cluster/getInformationList",
  });
}

//获取地图所有商铺点()
export function getMapResultPoints() {
  return requests.get<IRequest<IMapResult>>({
    timeout: 1000 * 60 * 7,
    url: "/clustercalculate/cluster/getMapResultPoints",
  });
}

//测试增删改修改数据信息
export function postTestInformation(data: ItestInformation) {
  return requests.post<IRequest<any[]>>({
    url: "/clustercalculate/cluster/testInformation",
    data,
  });
}

//聚集区微调接口
export function postUpdateStoreAccumulationId(data: IAccumulationIdInfo) {
  return requests.post<IRequest<any[]>>({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: "/clustercalculate/cluster/updateStoreAccumulationId",
    data,
  });
}

//路径计算接口
export function pathCalculateOne(data: ICalculateInfo) {
  return requests.get<IRequest<IRouteData[]>>({
    timeout: 1000 * 60 * 5,
    url: `/pathcalculate/path/calculateOne?apiKey=${data.apiKey}&areaName=${data.areaName}&assignNumber=${data.assignNumber}`,
  });
}

//路径计算接口
export function calculateAll(data: ICalculateInfo) {
  return requests.get<IRequest<IRouteData[]>>({
    timeout: 1000 * 60 * 20,
    url: `/pathcalculate/path/calculateAll?apiKey=${data.apiKey}`,
  });
}

//获取地图数据
export function getMapData() {
  return requests.get<IRequest<IRouteData[]>>({
    url: "/pathcalculate/path/getMapData",
  });
}

//获取路线详情-大区路线聚集区数据
export function getRouteDetails() {
  return requests.get<IRequest<IAreaDetails[]>>({
    timeout: 1000 * 60 * 20,
    url: "/pathcalculate/path/getRouteDetails",
  });
}

//获取路线详情-聚集区下商户信息
export function getStoreDetails(data: string) {
  return requests.get<IRequest<IAccumulationList[]>>({
    url: `/pathcalculate/path/getAccumulationDetails/${data}`,
  });
}

//获取路径分析-大区历史路径数据
export function getTransitDepotRouteData() {
  return requests.get<IRequest<IHistoricalPath[]>>({
    url: "/pathcalculate/path/getTransitDepotRouteData",
  });
}

//保存路径
export function postAddRoute(data: IRouteSave[]) {
  return requests.post<IRequest<any>>({
    timeout: 1000 * 60 * 5,
    url: "/pathcalculate/path/addRoute",
    data,
  });
}

// 获取路径分析详细数据
export function getRouteData(data: IRouteData,apiKey:string) {
  return requests.get<IRequest<IRouteData>>({
    url: `/pathcalculate/path/getRouteData/${apiKey}?transitDepotId=${data.transitDepotId}&routeName=${data.routeName}`,
  });
}

//获取路径版本号
export function getRouteVersion(data: IVersionRequest) {
  return requests.get<IRequest<string[]>>({
    url: `/pathcalculate/path/getRouteVersion?transitDepotId=${data.transitDepotId}&date=${data.date}`,
  });
}
// 获取分割线
export function getSplitLines(groupOrder: string) {
  return requests.get({
    timeout: 1000 * 60,
    url: `/pathcalculate/path/getSplitLines?groupOrder=${groupOrder}`,
  });
}

// 班组比较
export function compareArea(groupIdList: string,apiKey:string) {
  return requests.get({
    timeout: 1000 * 60,
    url: `/pathcalculate/path/compareBaseGroup/${groupIdList}/${apiKey}`,
  });
}
// 调整打卡点
export function adjustPoint(data: Ipoints) {
  return requests.post<IRequest<any>>({
    url: "/pathcalculate/path/adjustPoint",
    data,
  });
}
// 获取凸包打卡点
export function getConvexPoint() {
  return requests.get<IRequest<any>>({
    timeout: 1000 * 60 * 3,
    url: "/pathcalculate/path/getConvexPoint",
  });
}
// 单条路径重新计算
export function calculateSingleRoute(data: any) {
  return requests.get<IRequest<any>>({
    timeout: 1000 * 60,
    url: `/pathcalculate/path/calculateRangedRoute?apiKey=${data.apiKey}&routeName1=${data.routeName1}&routeName2=${data.routeName2}`,
  });
}
// 获取凸包数据
export function getConvex(apiKey:string) {
  return requests.get<IRequest<any>>({
    timeout: 1000 * 60 * 5,
    url: `/pathcalculate/path/getConvex?apiKey=${apiKey}`,
  });
}

export function getTransitDepotName() {
  return requests.get<IRequest<any>>({
    timeout: 1000 * 60 * 5,
    url: "/pathcalculate/path/getTransitDepotName",
  });
}

// 获取涂色数据
export function getAllColor() {
  return requests.get<IRequest<any>>({
    timeout: 1000 * 60 * 5,
    url: "/pathcalculate/path/getAllColourConvex",
  });
}
