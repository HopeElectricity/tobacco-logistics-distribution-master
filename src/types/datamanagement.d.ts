export interface ImanagementStoreDetial{
  accumulationId?:number,
  areaId?:number,
  areaName:string,
  contactName:string,
  contactPhone:string,
  createBy?:number,
  createTime:string,
  customerCode:string,
  customerManagerId?:number,
  customerManagerName:string,
  district:string,
  gear:string,
  groupId?:number,
  isDelete?:number,
  latitude?:number,
  longitude?:number,
  orderCycle:string,
  routeId?:number,
  routeName:string,
  status:string,
  storeAddress:string,
  storeId?:number,
  storeName:string,
  locationType:string
  type:string,
  updateBy?:number,
  updateTime:string
}
export interface ImanagementSearchData {
  pageNum: number;
  pageSize: number;
  areaId?: number;
  contactName?: string;
  customerCode?: string;
  groupId?: number;
  routeId?: number;
  storeAddress?: string;
}
export interface ImanagementTableData {
    storeId:string;
    contactName: string;
    customerCode: string;
    areaName: string;
    storeAddress: string;
    customerManagerName:string;
    contactPhone:string;
    routeName:string;
  }
  export interface ISearch {
    contactName?: string;
    customerCode?: string;
    areaId?: number;
    storeAddress?: string;
    routeId?:number;
    groupId?:number;
  }
  export interface IupdateArea{
    areaId: number,
    storeIdList:string[]
  }
  export interface IOptionalData{
    areaId?: string,
    areaName?: string;
    routeId?:  string;
    routeName?:string;
    groupId?:  string;
    groupName?: string;
  }
