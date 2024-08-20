<template>
  <div class="route">
    <div class="aside" :class="{ expanded: isCollapse }">
      <BorderBox9
        :color="['#73e5ff', '#73e5ff']"
        backgroundColor="#001731"
        style="width: 100%"
      >
        <transition name="slide-fade">
          <div class="leftInformation" v-show="!isCollapse">
            <el-select v-model="area">
              <el-option
                v-for="item in areas"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
            <div class="routeCollapse">
              <el-collapse v-model="activeNames">
                <el-badge :value="1" class="item"></el-badge>
                <el-collapse-item title="聚集区信息改变" name="1">
                  <ul>
                    <li>班组1聚集区发生改变</li>
                  </ul>
                </el-collapse-item>
                <el-badge :value="1" class="item"></el-badge>
                <el-collapse-item title="系统参数" name="2">
                  <ul>
                    <li>单车载货量更改为700条</li>
                    <li>班组2可工作车辆数更改为5辆</li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="btns">
              <el-input-number
                v-if="area !== '韶关市'"
                class="num"
                v-model="num"
                :min="1"
                :max="1000"
                style="color: black"
              />
              <el-button
                class="btn"
                @click="CalculateBtnFunction()"
                :loading="loadCalculate"
                >重新计算</el-button
              >
            </div>
          </div>
        </transition>
        <el-icon class="arrow" size="40" @click="isCollapse = !isCollapse">
          <component :is="isCollapse ? DArrowLeft : DArrowRight"> </component>
        </el-icon>
      </BorderBox9>
    </div>
    <div class="map">
      <el-button class="icon" @click="openEChart">
        <el-icon>
          <Edit />
        </el-icon>
      </el-button>
      <div id="container"></div>
      <div class="position-message" v-if="appearPositionMessage">
        <template v-for="(item,index) in clusterStore.storeResult" :key="index">
          <div>
            {{ index + 1 }} : {{ item.accumulationAddress }}
          </div>
        </template>
      </div>
      <RouteEChart
        :data="eChartData"
        :api-key="pathCalculateInfo.apiKey"
        v-model="isOpenEChart"
        @dis="disEchart"
        @tim="timEchart"
        @wei="weiEchart"
      ></RouteEChart>
      <div class="btn-box">
        <el-button
          v-if="hasOp('path-calculate:accumulation:update')"
          class="adjustPoint"
          @click="adjustPoint"
          :loading="adjustLoad"
          >{{ adjustText }}</el-button
        >
        <el-button
          class="adjustPoint"
          @click="refreshConvex"
          :loading="adjustLoad"
          >刷新缓存</el-button
        >
        <el-button
          class="adjustPoint detailPoint"
          >退出详细</el-button
        >
      </div>
    </div>
    <BorderBox9
      :color="['#73e5ff', '#73e5ff']"
      backgroundColor="#001731"
      style="margin-right: -1vw"
    >
      <div class="rightInformation">
        <div class="rtitle">{{ route }}</div>
        <div class="detailedRoute">
          <el-scrollbar height="68vh">
            <el-collapse
              v-model="activeNames2"
              v-loading="isResultPointsFinished"
              element-loading-text="加载中..."
              element-loading-background="rgba(0,23,49,0.8)"
            >
              <el-collapse-item
                :title="
                  item.groupName +
                  '-' +
                  item.carCount +
                  '辆车' +
                  '-' +
                  item.routeCount +
                  '条路线'
                "
                :name="item.groupId"
                v-for="item in clusterStore.routeDetails"
                :key="item.groupId"
              >
                <template
                  class="routeNameLi"
                  v-for="item1 in item.list"
                  :key="item1.transitDepotId"
                >
                  <el-collapse-item
                    v-for="item2 in item1.routeList"
                    :key="item1.transitDepotId"
                    :title="item1.transitDepotName + '-' + item2.date"
                    :name="item1.transitDepotName"
                  >
                    <ul>
                      <li
                        class="accumulationNameLi"
                        tabindex="1"
                        v-for="item3 in item2.routeList"
                        :key="item3.routeId"
                        @click.stop="accumulationNameClick(item3)"
                        :class="item3.routeName == mapRouteName ? 'active' : ''"
                        :id="item3.routeName"
                      >
                        {{ item3.routeName }}
                      </li>
                    </ul>
                  </el-collapse-item>
                </template>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </div>
        <el-button class="saveRoute" @click="addRouteBtn" :loading="saveLoading"
          >保存路径</el-button
        >
        <el-dialog
          style="transform: translate(17.5vw, 48vh); height: 32vh"
          v-model="isOpenRouteDialog"
          width="20%"
          :modal="false"
          :before-close="closeRouteDialog"
          :append-to-body="true"
          :title="titleAccumulationName"
        >
          <el-scrollbar height="20vh">
            <ul style="margin-left: 20px; padding-top: 0px">
              <li
                style="padding: 0.3vh; list-style: square"
                v-for="item3 in clusterStore.storeResult"
                :key="item3.accumulationId"
              >
                {{ item3.accumulationAddress }}
              </li>
            </ul>
          </el-scrollbar>
        </el-dialog>
      </div>
    </BorderBox9>
  </div>
</template>

<script lang="ts" setup>
  import { hasOp } from "@/op";
  import { Edit, DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
  import { BorderBox9 } from "@dataview/datav-vue3";
  //@ts-ignore
  import AMapLoader from "@amap/amap-jsapi-loader";
  import { useClusterStore } from "@/store/cluster";
  import RouteEChart from "./cpn/routeEChart.vue";
  import { data1, data2, data3, data4, data5 } from "./data/data";
  import colorArr from "./data/colorArr";
  window._AMapSecurityConfig = {
    securityJsCode: "1b6291b2fceee1cd3b7798bfdd4c39e4",
  };
  // 点击图表
  let EchartFun: (groupData: any) => void;
  const groupName = ref<string>();
  const routeIndex = ref<number>();
  const appearPositionMessage = ref<boolean>(false);


  function disEchart(groupData: any) {
    EchartFun(groupData);
    if (groupData.name.substring(0, 2) != "班组") {
      routeIndex.value = groupData.dataIndex;
    }
  }
  function timEchart(groupData: any) {
    EchartFun(groupData);
    if (groupData.name.substring(0, 2) != "班组") {
      routeIndex.value = groupData.dataIndex;
    }
  }
  function weiEchart(groupData: any) {
    EchartFun(groupData);
    if (groupData.name.substring(0, 2) != "班组") {
      routeIndex.value = groupData.dataIndex;
    }
  }
  // 折叠
  const isCollapse = ref<boolean>(false);
  //聚集区Store
  const clusterStore = useClusterStore();
  var map: any = null;
  AMapLoader.load({
    key: "64c03ae77b4521e9dbb72475e120e70c", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.DistrictSearch", "AMap.MarkerCluster"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等 // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then(async (AMap: any) => {
    // 创建一个DistrictSearch对象，用于搜索行政区划信息。
    const district = new AMap.DistrictSearch({
      subdistrict: 1,
      extensions: "all",
      level: "province",
    });
    // 使用DistrictSearch对象搜索"韶关市"的行政区划信息，并在回调函数中处理结果
    district.search("韶关市", async function (_: any, result: any) {
      const bounds = result.districtList[0].boundaries;
      const mask = [];
      for (let i = 0; i < bounds.length; i++) {
        mask.push([bounds[i]]);
      }
      
      map = new AMap.Map("container", {
        // 设置地图容器id
        mask: mask, // 为Map实例制定掩模的路径,各图层将值显示路径范围内图像,3D模式下有效
        zoom: 9, // 设置当前显示级别
        expandZoomRange: true, // 开启显示范围设置
        zooms: [9, 18], //最小显示级别为7，最大显示级别为20
        center: [113.767587, 24.718014], // 设置地图中心点位置
        viewMode: "3D", // 特别注意,设置为3D则其他地区不显示
        zoomEnable: true, // 是否可以缩放地图
        resizeEnable: true,
      });
      //分割线涂色
      let polygon: any[] = [
        "polygon1",
        "polygon2",
        "polygon3",
        "polygon4",
        "polygon5",
      ];
      let polygonData: any = [data1, data2, data3, data4, data5];
      for (let i = 0; i < polygon.length; i++) {
        polygon[i] = new AMap.Polyline({
          path: polygonData[i], // 路径
          strokeWeight: 1, // 线条宽度，默认为 2
          strokeColor: "#001731", // 线条颜色
          lineJoin: "round", // 折线拐点连接处样式
          zIndex: 100,
        });
      }
      map.add(polygon);

      function revisePolylineToMap(
        newPolyon: any,
        pathData: any,
        color: string,
        strokeWeight: number
      ) {
        newPolyon.setOptions({
          path: pathData,
          strokeWeight: strokeWeight,
          strokeColor: color,
        });
      }
      // 使用该函数来添加折线
      EchartFun = function EchartSplice(groupData: any) {
        switch (groupData.name) {
          case "班组一":
            groupName.value = "班组一";
            revisePolylineToMap(polygon[0], data1, groupData.color, 8);
            revisePolylineToMap(polygon[1], data2, "#001731", 1);
            revisePolylineToMap(polygon[2], data3, "#001731", 1);
            revisePolylineToMap(polygon[3], data4, "#001731", 1);
            revisePolylineToMap(polygon[4], data5, "#001731", 1);
            break;
          case "班组二":
            groupName.value = "班组二";
            revisePolylineToMap(polygon[0], data1, "#001731", 1);
            revisePolylineToMap(polygon[1], data1, groupData.color, 8);
            revisePolylineToMap(polygon[2], data3, "#001731", 1);
            revisePolylineToMap(polygon[3], data4, "#001731", 1);
            revisePolylineToMap(polygon[4], data5, "#001731", 1);
            break;
          case "班组三":
            groupName.value = "班组三";
            revisePolylineToMap(polygon[0], data1, "#001731", 1);
            revisePolylineToMap(polygon[1], data2, "#001731", 1);
            revisePolylineToMap(polygon[2], data3, groupData.color, 8);
            revisePolylineToMap(polygon[3], data4, "#001731", 1);
            revisePolylineToMap(polygon[4], data5, "#001731", 1);
            break;
          case "班组四":
            groupName.value = "班组四";
            revisePolylineToMap(polygon[0], data1, "#001731", 1);
            revisePolylineToMap(polygon[1], data2, "#001731", 1);
            revisePolylineToMap(polygon[2], data3, "#001731", 1);
            revisePolylineToMap(polygon[3], data4, groupData.color, 8);
            revisePolylineToMap(polygon[4], data5, "#001731", 1);
            break;
          case "班组五":
            groupName.value = "班组五";
            revisePolylineToMap(polygon[0], data1, "#001731", 1);
            revisePolylineToMap(polygon[1], data2, "#001731", 1);
            revisePolylineToMap(polygon[2], data3, "#001731", 1);
            revisePolylineToMap(polygon[3], data4, "#001731", 1);
            revisePolylineToMap(polygon[4], data5, groupData.color, 8);
            break;
        }
      };
      //绑定点击事件
      map.on("click", function (e: any) {
        // console.log("当前坐标：" + e.lnglat.getLng() + "," + e.lnglat.getLat());
        navigator.clipboard.writeText(
          e.lnglat.getLng() + "," + e.lnglat.getLat()
        );
      });
    });
  });
  const activeNames = ref();
  const activeNames2 = ref();
  // 路径互动
  const mapRouteName = ref<string>();
  const area = ref("韶关市");
  const areas = ref<any>();
  clusterStore.getTransitDepotNameAction().then(() => {
    areas.value = clusterStore.areas;
  });
  const route = ref("路线详情");
  //楚鸿的key： 309bde1e73b984c7d8a87ab19255963c
  //我的key：   cdeaa7cd146a1a9612827190fb0e0962
  //黄健的key：	af42aaba236b2553c34fc11ed5c18311
  const pathCalculateInfo = ref({
    apiKey: "af42aaba236b2553c34fc11ed5c18311",
    areaName: area.value,
    assignNumber: 10,
  });
  const choiceCalculateType = ref(0);
  const num = ref(10);

  // 打卡 eChart
  const isOpenEChart = ref(false);
  function openEChart() {
    isOpenEChart.value = !isOpenEChart.value;
  }
  const eChartData = ref<{
    dis: number[];
    wei: number[];
    time: number[];
    groupDis: number[];
    groupWei: number[];
    groupTime: number[];
    routeName: string[];
    groupRouteName: string[];
    groupName?: string;
  }>({
    dis: [],
    wei: [],
    time: [],
    routeName: [],
    groupDis: [],
    groupTime: [],
    groupWei: [],
    groupRouteName: [],
  });
  onMounted(() => {
    setTimeout(() => {
      // 加载保存的地图数据
      if (!clusterStore.convex) {
        refreshConvex();
      } else {
        countPathResult();
      }
    }, 1000);
  });
  const markers: Array<AMap.Text> = [];
  const points = ref<boolean>(false);
  const accumulationId = ref<string>();
  const routeId = ref<string>();
  const routeName = ref<string>();
  const oldRouteName = ref<string>();
  const clickRoute = ref<string>();

  function countPathResult() {
    // 绘制点
    clusterStore.getConvexPointAction().then(() => {
      clusterStore.convexPoint.forEach((point: any) => {
        const position = new AMap.Marker({
          position: new AMap.LngLat(point.longitude, point.latitude),
          title: point.routeName,
          content: `<div style="font-size: 8px;color: #bcbcbc;">◉</div>`,
          //@ts-ignore
          anchor: "center",
        });
        map.add(position);
        
        points.value = true;
        //@ts-ignore
        position.on("click", function () {
          if (adjustLoad.value) {
            accumulationId.value = point.accumulationId;
            oldRouteName.value = point.routeName;
          }
        });
      });
    });

    // 涂色渲染

    clusterStore.colorConvex?.forEach((item: string[], index) => {
      item.forEach((item1, index1) => {
        const coordinatesArray = item1.split(";");
        // 将每个字符串转换成数组格式
        // const formattedArray = coordinatesArray.map((coord) => `[${coord}]`);
        const path = coordinatesArray.map((item) => {
          const arr = item.split(",");
          return new AMap.LngLat(Number(arr[0]), Number(arr[1]));
        });
        let polygon = new AMap.Polygon({
          //@ts-ignore
          path, //路径
          fillColor: colorArr[index][index1 % 5], //多边形填充颜色
          strokeWeight: 1, //线条宽度，默认为 2
          strokeColor: "#fff", //线条颜色
          fillOpacity: 0.6,
        });
        map.add(polygon);
      });
    });
    watch(groupName, () => {
      eChartData.value.groupDis = [];
      eChartData.value.groupWei = [];
      eChartData.value.groupTime = [];
      eChartData.value.groupRouteName = [];
    });
    // 开始读
    clusterStore.convex?.forEach((item: any) => { 
      function addData() {
        // distance: "109.63"
        eChartData.value.groupDis.push(Number(item.distance));
        // cargoWeight: "1326.00"
        eChartData.value.groupWei.push(Number(item.cargoWeight));
        // workTime: 6.15
        eChartData.value.groupTime.push(Number(item.workTime));
        // routeName: "新丰县中转站-粤F QB12345-星期一-2024.06.04-1.0-1.0-2.0-1.0-1.0-2.0"
        eChartData.value.groupRouteName.push(item.routeName);
        // groupName：班组一/二/三/四/五  => item.groupId = 1/2/3/4/5
        eChartData.value.groupName = groupName.value;
      }
      watch(groupName, () => {
        if (groupName.value == "班组一" && item.groupId == 1) {
          addData();
        } else if (groupName.value == "班组二" && item.groupId == 2) {
          addData();
        } else if (groupName.value == "班组三" && item.groupId == 3) {
          addData();
        } else if (groupName.value == "班组四" && item.groupId == 4) {
          addData();
        } else if (groupName.value == "班组五" && item.groupId == 5) {
          addData();
        }
      });
      // 凸包渲染
      const polygonPath = item.convex.map((item: any) => {
        return [item.longitude, item.latitude];
      });
      
      const activePolyOption = {
        path: polygonPath,
        strokeOpacity: 1,
        strokeColor: "black",
        fillOpacity: 0.5,
        strokeWeight: 5,
        fillColor: "skyblue",
        strokeStyle: "solid",
      };
      const unActivePolyOption = {
        path: polygonPath,
        strokeColor: "#eee",
        strokeWeight: 3,
        fillOpacity: 0,
        strokeStyle: "solid",
      };
      const unchosenPolyOption = {
        path: polygonPath,
        strokeColor: "#eee",
        strokeWeight: 1,
        fillOpacity: 0,
        strokeStyle: "dashed",
      };
      
      let polygon = new AMap.Polygon(unActivePolyOption);
      let isActive = false;
      let marker: any = null;

      polygon.on("click", (event: any) => {
        console.log(item);

        clusterStore.getStoreDetailsAction(item.routeId).then(res => {
          appearPositionMessage.value = true

          console.log(clusterStore.storeResult);

          clusterStore.storeResult?.forEach((iten: any, index:number) => {
            let location = [iten.longitude, iten.latitude] 

            let circleMarker = new AMap.CircleMarker({
              center: location, //圆心  
              radius: 8, //半径
              strokeColor: "white", //轮廓线颜色
              strokeWeight: 2, //轮廓线宽度
              strokeOpacity: 0.5, //轮廓线透明度
              fillColor: "rgba(0,0,255,1)", //圆点填充颜色
              fillOpacity: 1, //圆点填充透明度
              zIndex: 10, //圆点覆盖物的叠加顺序

            });
            map.add(circleMarker);

            let text = new AMap.Text({
              text: index + 1,
              anchor: "top-center", //设置文本标记锚点位置
              position: location, //点标记在地图上显示的位置
              style: {
                "color": "black",
                "font-size":"10px"
              }
            })
            text.setMap(map); //将文本标记设置到地图上

            
          })
        })

        clickRoute.value = item.routeName;
        
        activeNames2.value = item.groupId;
        document.getElementById(item.routeName)?.scrollIntoView();
        if (mapRouteName.value != item.routeName) {
          mapRouteName.value = item.routeName;
        }

        let index = eChartData.value.dis.indexOf(Number(item.distance));
        if (!isActive) {
          eChartData.value.dis.push(Number(item.distance));
          eChartData.value.wei.push(Number(item.cargoWeight));
          eChartData.value.time.push(Number(item.workTime));
          eChartData.value.routeName.push(item.routeName);
          index = eChartData.value.dis.indexOf(Number(item.distance));
          routeId.value = item.routeId;
          routeName.value = item.routeName;
          marker = new AMap.Text({
            position: new AMap.LngLat(
              event.lnglat.getLng(),
              event.lnglat.getLat()
            ),
            text: index.toString(),
            anchor: "center",
            style: {
              color: "#000",
            },
          });
          marker.dis = item.distance;
          markers.push(marker);
          map.add(marker);
        } else {
          if (index !== -1) {
            eChartData.value.dis.splice(index, 1);
            eChartData.value.wei.splice(index, 1);
            eChartData.value.time.splice(index, 1);
            eChartData.value.routeName.splice(index, 1);
            routeId.value = undefined;
          }
          if (markers.indexOf(marker) !== -1) {
            markers.splice(markers.indexOf(marker), 1);
            map.remove(marker);
            renderMarkers();
          }
        }
        isActive = !isActive;
      });
      // 点击事件结束
      map.add(polygon);
      watch(mapRouteName, () => {
        if (mapRouteName.value == item.routeName) {
          polygon.setOptions(activePolyOption);
          map.setZoomAndCenter(10, polygonPath[0]);
        } else {
          polygon.setOptions(unchosenPolyOption);
        }
      });

      watch(routeIndex, () => {
        if (
          routeIndex.value &&
          eChartData.value.groupRouteName[routeIndex.value] == item.routeName
        ) {
          polygon.setOptions(activePolyOption);
          map.setZoomAndCenter(11, polygonPath[0]);
        } else {
          polygon.setOptions(unchosenPolyOption);
        }
      });
      watch(clickRoute, () => {
        if (clickRoute.value == item.routeName) {
          polygon.setOptions(activePolyOption);
        } else {
          polygon.setOptions(unchosenPolyOption);
        }
      });
      // 重新渲染 marker
      function renderMarkers() {
        markers.forEach((marker) => {
          const newIndex = eChartData.value.dis.indexOf(Number(marker.dis));
          if (marker.getText() !== newIndex.toString()) {
            marker.setText(newIndex.toString());
          }
        });
      }
      // //路线绘制
    });
  }
  const loadCalculate = ref<boolean>(false);
  const CalculateBtnFunction = () => {
    loadCalculate.value = true;
    if (area.value == "韶关市") {
      clusterStore
        .calculateAllAction({ apiKey: pathCalculateInfo.value.apiKey })
        .then(() => {
          choiceCalculateType.value = 1;
          loadCalculate.value = false;
        });
    } else {
      pathCalculateInfo.value.assignNumber = num.value;
      pathCalculateInfo.value.areaName = area.value;
      clusterStore.pathCalculateOneAction(pathCalculateInfo.value).then(() => {
        loadCalculate.value = false;
        choiceCalculateType.value = 2;
      });
    }
  };
  const isResultPointsFinished = ref<boolean>(true);
  //获取路线详情-大区路线聚集区信息
  clusterStore.getRouteDetailsAction().then(() => {
    isResultPointsFinished.value = false;
  });
  //定义弹框标题accumulationName的变量
  const titleAccumulationName = ref<string>("");
  //获取路线详情-聚集区下商户信息
const accumulationNameClick = (accumulation: any) => {
    console.log(accumulation);
    
    titleAccumulationName.value = accumulation.routeName;
    clusterStore.getStoreDetailsAction(accumulation.routeId);
    isOpenRouteDialog.value = true;
    if (mapRouteName.value != accumulation.routeName) {
      mapRouteName.value = accumulation.routeName;  
    }
  };
  //定义是否打开弹窗的变量
  const isOpenRouteDialog = ref(false);
  //关闭窗口
  const closeRouteDialog = () => {
    isOpenRouteDialog.value = false;
  };
  const saveLoading = ref<boolean>(false);
  const addRouteBtn = () => {
    saveLoading.value = true;
    if (adjustSave.value) {
      clusterStore.convex.forEach((item: any) => {
        delete item.createTime;
        delete item.updateTime;
        delete item.versionId;
        delete item.delete;
        delete item.routeId;
        delete item.workTime;
      });
      let saveRouteData = clusterStore.convex!.map((i: any) => {
        i.areaId = Number(i.areaId);
        i.transitDepotId = Number(i.transitDepotId);
        return i;
      });
      // 重新计算情况数据
      eChartData.value = {
        dis: [],
        wei: [],
        time: [],
        routeName: [],
        groupDis: [],
        groupTime: [],
        groupWei: [],
        groupRouteName: [],
      };
      markers.splice(0, markers.length);
      ElMessage.closeAll("warning");
      clusterStore.postAddRouteAction(saveRouteData).then(() => {
        saveLoading.value = false;
        if (clusterStore.saveState) {
          refreshConvex();
        }
      });
    }
    if (choiceCalculateType.value == 0 && !adjustSave.value) {
      saveLoading.value = false;
      ElMessage.warning("请先进行重新计算");
    }
    if (choiceCalculateType.value == 1) {
      clusterStore.newPathResultAll?.forEach((item) => {
        delete item.createTime;
        delete item.updateTime;
        delete item.versionId;
        delete item.delete;
        delete item.routeId;
        delete item.workTime;
      });
      let saveRouteData = clusterStore.newPathResultAll!.map((i) => {
        i.areaId = Number(i.areaId);
        i.transitDepotId = Number(i.transitDepotId);
        return i;
      });
      // console.log(saveRouteData);
      clusterStore.postAddRouteAction(saveRouteData).then(() => {
        saveLoading.value = false;
        if (clusterStore.saveState) {
          refreshConvex();
        }
      });
    }

    if (choiceCalculateType.value == 2) {
      clusterStore.newPathResult?.forEach((item) => {
        delete item.createTime;
        delete item.updateTime;
        delete item.versionId;
        delete item.delete;
        delete item.routeId;
        delete item.workTime;
      });
      let saveRouteData = clusterStore.newPathResult!.map((i) => {
        i.areaId = Number(i.areaId);
        i.transitDepotId = Number(i.transitDepotId);
        return i;
      });
      // console.log(saveRouteData);
      clusterStore.postAddRouteAction(saveRouteData).then(() => {
        saveLoading.value = false;
        if (clusterStore.saveState) {
          refreshConvex();
        }
      });
    }
  };

  //  调整打卡点
  const adjustConfirm = ref<boolean>(false);
  const adjustLoad = ref<boolean>(false);
  const adjustText = ref<string>("打卡点调整");
  const adjustSave = ref<boolean>(false);
  function adjustPoint() {
    if (!points.value) {
      ElMessage.warning("请等待打卡点数据加载完毕");
    } else if (!adjustConfirm.value) {
      adjustLoad.value = true;
      ElMessage({
        message: "已进入调整打卡点模式，请选择要调整的打卡点",
        type: "warning",
        duration: 0,
      });
      watch(accumulationId, (newValue) => {
        ElMessage.closeAll("warning");
        ElMessage({
          message: `已选择最新的打卡点，打卡点的Id为${newValue},然后请选择打卡点的新路径`,
          duration: 0,
          type: "warning",
        });

        watch(routeId, (newValue) => {
          if (newValue) {
            ElMessage.closeAll("warning");
            ElMessage({
              message: `已选择最新的路径，路径的名称为${routeName.value},请再点击调整按钮确认`,
              duration: 0,
              type: "warning",
            });

            adjustLoad.value = false;
            adjustText.value = "点击确认调整";
            adjustConfirm.value = true;
          }
        });
      });
    } else if (adjustConfirm.value) {
      if (routeId.value && accumulationId.value) {
        clusterStore
          .adjustPointAction({
            routeId: routeId.value,
            accumulationId: accumulationId.value,
          })
          .then(() => {
            adjustConfirm.value = false;
            ElMessage.closeAll("warning");
            const loading = ElLoading.service({
              lock: true,
              text: "加载地图数据中...",
              background: "rgba(0, 0, 0, 0.7)",
            });
            clusterStore
              .calculateSingleRouteAction({
                apiKey: pathCalculateInfo.value.apiKey,
                routeName1: oldRouteName.value,
                routeName2: routeName.value,
              })
              .then(() => {
                for (let item of clusterStore.SingleRoute) {
                  let index = clusterStore.convex.findIndex(
                    (obj: any) => obj.routeName === item.routeName
                  );
                  if (index !== -1) {
                    clusterStore.convex[index] = item;
                  }
                }
                const Overlays = map.getAllOverlays("polygon");
                map.remove(Overlays);
                countPathResult();
                loading.close();
                ElMessage({
                  message:
                    "调整结果如图，如需保存请点击保存路径按钮，否则刷新页面恢复调整前状态",
                  duration: 0,
                  type: "warning",
                });
                adjustSave.value = true;
              });
          });
      } else {
        ElMessage({ message: `请选择打卡点的新路径`, type: "warning" });
      }
    }
  }

  function refreshConvex() {
    const loading = ElLoading.service({
      lock: true,
      text: "加载地图数据中...",
      background: "rgba(0, 0, 0, 0.7)",
    });
    clusterStore.getConvexAction(pathCalculateInfo.value.apiKey).then(() => {
      clusterStore.getColorConvexAction().then(() => {
        countPathResult();      
        loading.close();
      });
    });
  }
</script>

<style lang="scss" scoped>
.position-message{
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: auto;
  color: white;
  opacity: 0.7;
  font-size: 10px;
  line-height: 15px;
  background-color: rgb(87, 83, 83);
}
  .route {
    width: 100%;
    display: flex;

    .map {
      position: relative;
      flex-grow: 1;
      margin: 0 1.5vw;
      :deep(.amap-marker-label) {
        background-color: #3490f5;
        border: 0px;
        border-radius: 30%;
        position: relative;
      }
      #container {
        padding: 0px;
        margin: 0px;
        width: 100%;
        height: 103%;
        margin: 0.5vh 0;
      }
      .btn-box {
        display: flex;
        width: 100%;
        justify-content: center;
      }

      .icon {
        position: absolute;
        top: 10px;
        right: 5px;
        z-index: 10;
        width: 20px;
        height: 25px;
        box-shadow: 1px 1px 1px 1px rgb(0, 0, 0, 0.4);
        border-radius: 10%;
        background-color: #72e4ff;
      }
    }
    .aside {
      width: 20vw;
      transition: width 0.3s ease;
    }
    .expanded {
      width: 3vw;
    }
    .slide-fade-enter-active {
      transition: opacity 0.8s;
    }
    .slide-fade-enter-from {
      opacity: 0;
    }

    .dv-border-box-9 {
      height: 80vh;
      width: 20vw;
      box-shadow: 10px 10px 5px 5px rgb(0, 0, 0, 0.4);
      .arrow {
        position: absolute;
        right: -8%;
        top: 26%;
        width: 2.5vw;
        height: 6vh;
        background-color: #001731;
        cursor: pointer;
      }
      :deep(.el-input__wrapper) {
        font-size: 18px;
        width: 10vw;
        background-color: #001731;
        box-shadow: none;
      }

      :deep(.el-input__inner) {
        font-weight: bolder;
        text-align: center;
      }
      .el-select {
        --el-select-input-focus-border-color: transparent;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -30%);
      }

      :deep(.el-icon) {
        font-size: 20px;
      }

      .el-input {
        border: none;
      }
      .rtitle {
        width: 140px;
        height: 50px;
        font-size: 20px;
        letter-spacing: 2px;
        line-height: 40px;
        background-color: #001731;
        text-align: center;
        color: rgb(204, 255, 255);
        font-weight: bolder;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -30%);
      }
      .num {
        width: 120px;
        height: 40px;
      }

      .el-input__inner {
        color: #ff0000;
      }

      .btns {
        position: absolute;
        bottom: 3%;
        display: flex;
        width: 100%;
        justify-content: center;
        .btn {
          width: 120px;
          height: 40px;
        }
      }

      .leftInformation {
        .routeCollapse {
          padding-left: 1vw;
          padding-top: 4vh;
          width: 85%;
          ::v-deep(.el-collapse-item__header::before) {
            content: "";
            display: inline-block;
            width: 15px;
            height: 15px;
            background-color: #fcd539;
            border-radius: 50%;
            margin-right: 10px;
          }

          ::v-deep(.el-collapse-item__header::after) {
            margin-left: 10px;
            margin-right: -15px;
            width: 33px;
            height: 33px;
            background: #fcd539;
            transform: rotate(45deg);
            content: "";
            display: inline-block;
          }

          .item {
            position: absolute;
            z-index: 10;
            margin-top: 20px;
            margin-left: 16.4vw;
          }

          li {
            list-style: disc;
            padding: 5px 10px;
          }

          li:before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #fcd539;
            border-radius: 50%;
            margin-bottom: 4px;
            margin-right: 0.5vw;
          }
        }
      }

      .rightInformation {
       margin-right: -1vw;
        .detailedRoute {
          padding-left: 1vw;
          padding-top: 4vh;
          width: 85%;
          .accumulationNameLi::before{
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: rgb(0, 179, 255);
            border-radius: 50%;
            margin-bottom: 4px;
            margin-right: 0.5vw;
          }
          .el-collapse {
            --el-collapse-header-bg-color: rgb(2, 119, 168);
            --el-collapse-header-text-color: #e1f7ff;
            --el-collapse-header-font-size: 18px;
            --el-collapse-content-bg-color: #001731;
            --el-collapse-content-font-size: 18px;
            --el-collapse-content-text-color: #e1f7ff;
            --el-collapse-border-color: #001731;
            :deep(.el-loading-spinner) {
              margin-top: 28vh;
            }
          }

          .el-collapse-item {
            position: relative;
            ::v-deep(.el-collapse-item__content) {
              padding: 0;
            }
            ::v-deep(.el-collapse-item__header) {
              font-size: 1.8vh;
            }
          }

          .el-collapse-item:before {
            position: absolute;
            top: 0;
            border-right: 25px solid rgb(2, 119, 168);
            border-top: 24px solid transparent;
            border-bottom: 24px solid transparent;
            content: "";
          }
        }

        .saveRoute {
          width: 120px;
          height: 40px;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 3%;
        }
      }
    }
  }
  .active {
    background-color: rgb(2, 119, 168);
    padding: 0 0.5vw;
  }
  .el-select-dropdown__item {
    display: grid !important;
    place-items: center !important;
    font-size: 18px;
    font-weight: bolder;
  }
  .el-popper .el-popper__arrow::before {
    border-top: 1px solid #73e1ff;
    background-color: #73e1ff !important;
  }
</style>
