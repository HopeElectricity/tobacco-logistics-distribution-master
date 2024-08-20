export interface IResultPoints {
    accumulation: string;
    name: string;
    longitude:number;
    latitude:number;
}

export interface IClusterAndShopList {
    accumulation: string;
    son: IShopList[];
}

export interface IShopList {
    shopName: string;
    lnglat:number[];
}

export interface IShopData {
    longitude: number;
    latitude: number;
    name?: string;
}
export interface IAccumlationInfo {
    accumulationId?: string;
    leaderName?: null | string;
    accumulationName: string;
    leaderPhone?: null | numbe;
    longitude?: number;
    latitude?: number;
    areaName?: string;
    createTime?: number;
    updateTime?: number;
    accumulationAddress?: string;
    delete?: boolean;
}

export interface IErrorPoints_data {
    longitude: number;
    latitude: number;
    name: string;
    son?: IErrorPoints_data[]
}

export interface IErrorPoints {
    number: number,
    accumulationName: string,
    data: IErrorPoints_data[],

}

export interface ItestInformation {
    data: string;
    managerName: string;
}

export interface IAccumulationIdInfo {
    longitude: number;
    latitude: number;
    accumulationId: string;
}

export interface IInformationList {
    name: string;
    number: number;
    data: string[];
}


export interface IMapResultPoints {
    lnglat: number[];
    state?: string;
    name: string;
    style?: number;
    accumulationId:string;
    routeId:string;
    areaId:string;
    accumulation: string;
}

export interface IMapResultSurface {
    center: number[];
    radius: number
}


export interface IMapResult {
    point: IMapResultPoints[];
    side: IMapResultSurface[];
}

export interface IRouteData {
    routeId?: string,
    routeName: string,
    transitDepotId: any,
    areaId: any,
    polyline: polylineData[],
    distance: string,
    cargoWeight: string,
    workTime?:number,
    createTime?: string,
    updateTime?: string,
    versionId?: string,
    delete?: boolean,
    convex:polylineData[]
}
export interface IRouteSave{
    routeName: string,
    transitDepotId: number,
    areaId: number,
    polyline: polylineData[],
    distance: string,
    cargoWeight: string,
    convex:polylineData[]
}

interface polylineData {
    longitude: number,
    latitude: number,
}

export interface ICalculateInfo {
    apiKey: string,
    areaName?: string,
    assignNumber?: number,
}

export interface IAreaDetails {
    groupId: string,
    groupName: string,
    list: IRouteList[],
    carCount:number,
    routeCount:number
}

interface IRouteList {
    transitDepotId: string,
    transitDepotName: string,
    routeList: any[],
}
interface IAccumulationList {
    accumulationId: string,
    accumulationName: string,
    longitude: number,
    latitude: number,
    accumulationAddress: string,
}

export interface IStoreDetails {
    storeId: string,
    storeName: string,
    longitude: number,
    latitude: number,
    storeAddress: string,
}

export interface IHistoricalPath{
    transitDepotId:string,
    transitDepotName:string,
    licensePlateNumberList:string[],
}

export interface IVersionRequest{
    date:string,
    transitDepotId:string,
}
export interface Ipoints{
    accumulationId:string,
    routeId: string
  }