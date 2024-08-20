import {
  deleteClearInformationList,
  getAllResultPoints,
  getTransitDepotRouteData,
  getCheckErrorPoints,
  getClosestPoints,
  getErrorPoints,
  getInformationList,
  getMapData,
  getMapResultPoints,
  getRouteData,
  getRouteDetails,
  getStoreDetails,
  pathCalculateOne,
  postAddRoute,
  postCalculateAll,
  postUpdateStoreAccumulationId,
  calculateAll,
  getRouteVersion,
  getSplitLines,
  compareArea,
  adjustPoint,
  getConvexPoint,
  calculateSingleRoute,
  getConvex,
  getTransitDepotName,
  getAllColor,
} from "@/service/modules/cluster";
import {
  IAccumlationInfo,
  IAccumulationIdInfo,
  IAreaDetails,
  ICalculateInfo,
  IClusterAndShopList,
  IErrorPoints,
  IHistoricalPath,
  IInformationList,
  IMapResultPoints,
  IResultPoints,
  IRouteData,
  IShopData,
  IAccumulationList,
  IVersionRequest,
  polylineData,
  IRouteSave,
  Ipoints,
} from "@/types/cluster";
import { defineStore } from "pinia";

export const useClusterStore = defineStore("cluster", () => {
  //获取所有聚集区和对应商铺
  const clusterAndShopList = ref<IClusterAndShopList[]>([]);
  //获取聚集区和商铺
  const resultPoints = ref<IResultPoints[]>([]);
  async function getAllResultPointsAction() {
    const res = await getAllResultPoints();
    resultPoints.value = res.data;
    const mergedArray = resultPoints.value.reduce((result, point) => {
      const accumulation = point.accumulation;
      const existingItem = result.find(
        (item) => item.accumulation === accumulation
      );
      if (existingItem) {
        existingItem.son.push({
          shopName: point.name,
          lnglat: [point.longitude, point.latitude],
        });
      } else {
        result.push({
          accumulation: point.accumulation,
          son: [
            { shopName: point.name, lnglat: [point.longitude, point.latitude] },
          ],
        });
      }
      return result;
    }, clusterAndShopList.value);
    clusterAndShopList.value = mergedArray;
    console.log(clusterAndShopList.value);
  }
  //计算接口
  async function postCalculateAllAction() {
    const res = await postCalculateAll();
    if (res.code === 200) {
      ElMessage.success(res.msg);
    } else {
      ElMessage.error("失败");
    }
  }

  //清空修改数据信息列表哩的全部信息
  async function deleteClearInformationListAction() {
    await deleteClearInformationList();
  }

  //定义变量修改数据信息列表
  const InformationList = ref<IInformationList[]>();
  //获取修改数据信息列表
  async function getInformationListAction() {
    const res = await getInformationList();
    InformationList.value = res.data;
  }

  //定义变量聚集区错误点
  const ErrorPoints = ref<number>();
  //获取修改数据信息列表
  async function getCheckErrorPointsAction() {
    const res = await getCheckErrorPoints();
    ErrorPoints.value = res.data;
    console.log(res);
  }

  //获取错误点接口
  const errorResult = ref<IErrorPoints[]>();
  async function getErrorPointsAction() {
    const res = await getErrorPoints();
    errorResult.value = res.data;
  }

  //获取当前商铺可调整到的聚集区
  const AccumlationInfo = ref<IAccumlationInfo[]>();
  async function getClosestPointsAction(data: IShopData) {
    const res = await getClosestPoints(data);
    AccumlationInfo.value = res.data;
  }

  //获取成功的code
  const UpdateStoreAccumulationIdCode = ref<number>();
  //聚集区微调接口
  async function postUpdateStoreAccumulationIdAction(
    data: IAccumulationIdInfo
  ) {
    const res = await postUpdateStoreAccumulationId(data);
    UpdateStoreAccumulationIdCode.value = res.code;
    if (res.code === 200) {
      ElMessage.success(res.msg);
    } else {
      ElMessage.error("失败");
    }
  }

  //获取地图所有商铺点
  //定义变量储存数据
  const MapResultPoints = ref<IMapResultPoints[]>(
    localStorage.getItem("Points") != "undefined"
      ? JSON.parse(localStorage.getItem("Points")!)
      : undefined
  );
  async function getMapResultPointsAction() {
    const res = await getMapResultPoints();
    MapResultPoints.value = res.data.point;
    localStorage.setItem("Points", JSON.stringify(MapResultPoints.value));
  }

  //路径计算接口
  //定义变量储存重新计算完的路径数据
  const newPathResult = ref<IRouteData[]>();
  async function pathCalculateOneAction(data: ICalculateInfo) {
    const res = await pathCalculateOne(data);
    newPathResult.value = res.data;
    if (res.code == 200) {
      ElMessage.success("计算成功");
    }
  }

  //计算全部大区接口
  //定义变量储存重新计算完的路径数据
  const newPathResultAll = ref<IRouteData[]>();
  async function calculateAllAction(data: ICalculateInfo) {
    const res = await calculateAll(data);
    newPathResultAll.value = res.data;
    if (res.code == 200) {
      ElMessage.success("计算成功");
    }
  }

  //路径分析获取地图数据
  //定义变量储存路径数据
  const oldPathResult = ref<IRouteData[]>();
  async function getMapDataAction() {
    const res = await getMapData();
    oldPathResult.value = res.data;
  }

  //获取路线详情-大区路线聚集区详情
  //定义路线存储数据变量
  const routeDetails = ref<IAreaDetails[]>();
  async function getRouteDetailsAction() {
    const res = await getRouteDetails();
    routeDetails.value = res.data;
  }

  //获取路线详情下打卡点信息
  //定义变量打卡点信息
  const storeResult = ref<IAccumulationList[]>();
  async function getStoreDetailsAction(data: string) {
    const res = await getStoreDetails(data);
    storeResult.value = res.data;
  }

  //获取路径分析-大区历史路径数据
  //定义变量存储历史路径数据
  const historicalPath = ref<IHistoricalPath[]>();
  async function getTransitDepotRouteDataAction() {
    const res = await getTransitDepotRouteData();
    historicalPath.value = res.data;
  }

  //保存路径
  const saveState = ref<boolean>(false);
  async function postAddRouteAction(data: IRouteSave[]) {
    const res = await postAddRoute(data);
    if (res.code === 200) {
      ElMessage.success("保存成功");
      saveState.value = true;
    } else {
      ElMessage.error(res.msg);
    }
  }

  //获取路径分析详细数据
  //定义变量存储正在分析的路径数据
  const analysisRouteData = ref<IRouteData>();
  async function getRouteDataAction(data: IRouteData,apiKey:string) {
    const res = await getRouteData(data,apiKey);
    if (res.code === 200) {
      ElMessage.success(res.msg);
    } else if (res.code !== 500) {
      ElMessage.error("失败");
    }
    analysisRouteData.value = res.data;
  }

  //获取路径版本号
  const routeVersion = ref<string[]>();
  async function getRouteVersionAction(data: IVersionRequest) {
    const res = await getRouteVersion(data);
    console.log(res);
    routeVersion.value = res.data;
  }
  // 获取分割线
  const SplitLines = ref<polylineData[][]>();
  async function getSplitLinesAction() {
    const res = await getSplitLines("二四五一三六");
    SplitLines.value = res.data;
  }

  // 班组比较
  const compareAreaData = ref<any>();
  async function compareAreaAction(data: string,apiKey:string) {
    const res = await compareArea(data,apiKey);
    compareAreaData.value = res.data;
  }
  // 调整打卡点
  async function adjustPointAction(data: Ipoints) {
    const res = await adjustPoint(data);
    if (res.code === 200) {
      ElMessage.success(res.msg);
    } else {
      ElMessage.error("调整失败");
    }
    console.log(res);
  }
  // 获取凸包打卡点
  const convexPoint = ref<any>();
  async function getConvexPointAction() {
    const res = await getConvexPoint();
    convexPoint.value = res.data;
  }
  // 单条路径重新计算
  const SingleRoute = ref<any>();
  async function calculateSingleRouteAction(data: any) {
    const res = await calculateSingleRoute(data);
    SingleRoute.value = res.data;
  }
  // 获取凸包数据
  const convex = ref<any>(
    localStorage.getItem("convex") != "undefined"
      ? JSON.parse(localStorage.getItem("convex")!)
      : undefined
  );
  async function getConvexAction(apiKey:string) {
    const res = await getConvex(apiKey);
    convex.value = res.data;
    localStorage.setItem("convex", JSON.stringify(convex.value));
  }

  //获取中转站
  const areas = ref<any[]>();
  async function getTransitDepotNameAction() {
    const res = await getTransitDepotName();
    areas.value = res.data;
  }
  // 获取涂色数据
  const colorConvex = ref<any[]>(
    localStorage.getItem("convexColor") != "undefined"
      ? JSON.parse(localStorage.getItem("convexColor")!)
      : undefined
  );
  async function getColorConvexAction() {
    const res = await getAllColor();
    colorConvex.value = res.data;
    localStorage.setItem("convexColor", JSON.stringify(colorConvex.value));
  }
  return {
    getAllResultPointsAction,
    clusterAndShopList,
    resultPoints,
    postCalculateAllAction,
    getInformationListAction,
    InformationList,
    getCheckErrorPointsAction,
    ErrorPoints,
    deleteClearInformationListAction,
    getErrorPointsAction,
    errorResult,
    getClosestPointsAction,
    AccumlationInfo,
    postUpdateStoreAccumulationIdAction,
    UpdateStoreAccumulationIdCode,
    getMapResultPointsAction,
    MapResultPoints,
    pathCalculateOneAction,
    calculateAllAction,
    newPathResultAll,
    getMapDataAction,
    oldPathResult,
    getRouteDetailsAction,
    routeDetails,
    newPathResult,
    getStoreDetailsAction,
    storeResult,
    getTransitDepotRouteDataAction,
    historicalPath,
    postAddRouteAction,
    getRouteDataAction,
    analysisRouteData,
    getRouteVersionAction,
    routeVersion,
    getSplitLinesAction,
    SplitLines,
    compareAreaAction,
    compareAreaData,
    adjustPointAction,
    convexPoint,
    getConvexPointAction,
    SingleRoute,
    calculateSingleRouteAction,
    convex,
    getConvexAction,
    saveState,
    getTransitDepotNameAction,
    areas,
    colorConvex,
    getColorConvexAction,
  };
});
