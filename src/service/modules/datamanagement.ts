import requests from "../index";
import { IRequest } from "../request/type";
import {ImanagementSearchData, IupdateArea,IOptionalData,ImanagementStoreDetial}from '@/types/datamanagement'
// 表格信息
export function getStore(params:ImanagementSearchData) {
    return requests.get<IRequest<any>>({
      timeout:1000*60*3,
      url: "/datamanagement/list",
      params
    });
  }
  // 添加商铺
  export function addStore(data:ImanagementStoreDetial) {
    return requests.post<IRequest<any>>({
      url: "/datamanagement/add",
      data
    });
  }
// 删除商铺
  export function deleteStore(storeIdList:string) {
    return requests.delete<IRequest<any>>({
      url: `/datamanagement/delete/${storeIdList}`,
    });
  }
  // 获取下拉框数据
  export function getOptional(dataType:string) {
    return requests.get<IRequest<IOptionalData[]>>({
      url: `/datamanagement/getOptionalData/${dataType}`,
    });
  }
  // 修改行政区
  export function updateArea(data:IupdateArea) {
    return requests.post<IRequest<any>>({
      url: '/datamanagement/updateArea',
      data
    });
  }
  // 更新商铺
  export function updateStore(data:ImanagementStoreDetial) {
    return requests.post<IRequest<any>>({
      url: '/datamanagement/update',
      data
    });
  }
  // 获取商铺详情
  export function getStoreDetial(storeId:number) {
    return requests.get<IRequest<ImanagementStoreDetial>>({
      url: `/datamanagement/get/${storeId}`,
    });
  }
