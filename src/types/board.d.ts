export interface IBoardSearchData {
  /**
   * 大区名称
   */
  areaName?: string;
  /**
   * 客户名称
   */
  contactName?: string;
  /**
   * 客户编码
   */
  customerCode?: string;
  /**
   * 异常信息状态 不给是全部 0：未处理；1：处理中；2：已处理；3：无需处理
   */
  feedbackStatus?: "" | "0" | "1" | "2" | "3";
  /**
   * 异常信息类型 1：物流反馈；2：营销反馈
   */
  feedbackType?: "1" | "2";
  /**
   * 订单终止日期
   */
  orderEndDate?: string;
  /**
   * 订单起始日期
   */
  orderStartDate?: string;
  /**
   * 当前页码
   */
  pageNum: number;
  /**
   * 页记录数
   */
  pageSize: number;
  /**
   * 路线id
   */
  routeId?: number;
  [property: string]: any;
}

export interface IBoard {
  currentPageNum: number;
  dataCurrentPage: IBoardItem[];
  pageSize: number;
  totalCount: number;
  totalPageNum: number;
}

export interface IBoardItem {
  feedbackId: number;
  routeName: string;
  deliveryName: string;
  customerManagerName: string;
  feedbackInformation: string;
  customerCode: string;
  storeName: string;
  contactName: string;
  storeAddress: string;
  areaName: string;
  orderDate: string;
  feedbackFileList: Array;
  feedbackStatus: number;
  updateTime:string;
}
// 处理消息展示数据
export interface ItemInfo {
  contactName: string;
  deliveryName: string;
  orderDate: string;
  customerCode: string;
  customerManagerName: string;
  routeName: string;
  storeAddress: string;
}
// 处理消息详情返回参数
export interface InfoDetail {
  replyId?: string;
  replyContent?: string;
  createTime?: string;
  replyType?: string;
  replyFilePathList?: string[];
}

export interface ISearch {
  /**
   * 大区名称
   */
  areaName?: string;
  /**
   * 客户名称
   */
  contactName?: string;
  /**
   * 客户编码
   */
  customerCode?: string;
  /**
   * 异常信息状态 不给是全部 0：未处理；1：处理中；2：已处理；3：无需处理
   */
  feedbackStatus?: "" | "0" | "1" | "2" | "3";
  /**
   * 订单终止日期
   */
  orderEndDate?: string;
  /**
   * 订单起始日期
   */
  orderStartDate?: string;
  /**
   * 路线id
   */
  routeName?: string;
  /**
   * 送货员工号
   */
  deliveryWorkNumber?:string
  /**
   * 客户专员工号
   */
  managerWorkNumber?:string
  [property: string]: any;
}

export interface ICond {
  storeList: IStore[];
  routeList: IRoute[];
  areaList: IArea[];
  deliveryUserList: IDeliveryUser[];
  customerManagerList: ICustomerManager[];
}

export interface IStore {
  customerCode: string;
  contactName: string;
}
export interface IRoute {
  routeId: number;
  routeName: string;
}
export interface IArea {
  areaId: number;
  areaName: string;
}
export interface IDeliveryUser {
  userName: string;
  workNumber: string;
}
export interface ICustomerManager {
  userName: string;
  workNumber: string;
}

export interface IAddData {
  /**
   * 大区名称
   */
  areaName: string;
  /**
   * 客户编码
   */
  customerCode: string;
  /**
   * 客户专员名称
   */
  customerManagerName?: string;
  /**
   * 送货员名称
   */
  deliveryName: string;
  /**
   * 送货员工号
   */
  deliveryWorkNumber: string;
  /**
   * 反馈异常信息内容
   */
  feedbackInformation: string;
  /**
   * 反馈类型（1：物流反馈；2：营销反馈）
   */
  feedbackType: "1" | "2";
  /**
   * 反馈异常信息附带文件集合
   */
  fileList?: any[];
  managerWorkNumber?: string;
  /**
   * 订单日期
   */
  orderDate: string;
  /**
   * 路线id
   */
  routeId: number;
  /**
   * 路线名称
   */
  routeName: string;
  [property: string]: any;
}

export interface ISingleCondData {
  contactName: string;
  customerManagerId: string;
  customerManagerName: string;
  areaId: string;
  areaName: string;
  routeId: string;
  routeName: string;
}
export interface IUnhandledAmount{
  logisticsMount: number,
  marketingMount: number
}