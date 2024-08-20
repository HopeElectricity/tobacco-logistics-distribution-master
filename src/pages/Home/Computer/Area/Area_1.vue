<template>
  <div class="area">
    <div class="aside" :class="{ expanded: isCollapse }">
      <BorderBox9
        :color="['#73e5ff', '#73e5ff']"
        backgroundColor="#001731"
        style="width: 100%"
      >
        <transition name="slide-fade">
          <div class="areaCollapse" v-show="!isCollapse">
            <el-collapse
              v-model="activeNames"
              v-for="(item, index) in clusterStore.InformationList"
              :key="item.number"
            >
              <el-badge :value="item.number" class="item"></el-badge>
              <el-collapse-item :title="item.name" :name="index">
                <ul>
                  <li v-for="item1 in item.data" :key="item1">
                    {{ item1 }}
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
            <el-button class="btn" @click="CalculateBtnFunction"
              >重新计算</el-button
            >
          </div>
        </transition>
        <el-icon class="arrow" size="40" @click="isCollapse = !isCollapse">
          <component :is="isCollapse ? DArrowLeft : DArrowRight"> </component>
        </el-icon>
      </BorderBox9>
    </div>
    <div class="map">
      <div
        id="container"
        v-loading="isMaoFinished"
        element-loading-text="地图数据加载中..."
        element-loading-background="rgba(0,23,49,0.8)"
      ></div>
      <div class="btns">
        <el-button class="adjust" @click="routerChange">聚集区微调</el-button>
        <el-button class="save" @click="save">保存结果</el-button>
        <el-button class="save" @click="update">更新地图数据</el-button>
      </div>
    </div>
    <BorderBox9 :color="['#73e5ff', '#73e5ff']" backgroundColor="#001731">
      <div class="region">
        <el-collapse
          v-loading="isResultPointsFinished"
          element-loading-text="加载中..."
          element-loading-background="rgba(0,23,49,0.8)"
          v-model="activeNames2"
          accordion
        >
          <el-scrollbar height="75vh">
            <el-collapse-item
              v-for="item in clusterStore.clusterAndShopList"
              :title="item.accumulation"
              :name="item.accumulation"
              :key="item.accumulation"
              :id="item.accumulation"
            >
              <div
                class="regionCollapseItemContext"
                v-for="item1 in item.son"
                :key="item1.shopName"
                :id="item1.shopName"
                @click="mapShow(item1.lnglat)"
                :class="
                  longitude == item1.lnglat[0] && latitude == item1.lnglat[1]
                    ? 'active'
                    : ''
                "
              >
                {{ item1.shopName }}
              </div>
            </el-collapse-item>
          </el-scrollbar>
        </el-collapse>
      </div>
    </BorderBox9>
  </div>
</template>
<script lang="ts" setup>
  import { useClusterStore } from "@/store/cluster";
  import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
  import { ElLoading } from "element-plus";
  import { useRouter } from "vue-router";
  import { BorderBox9 } from "@dataview/datav-vue3";
  window._AMapSecurityConfig = {
    securityJsCode: "1b6291b2fceee1cd3b7798bfdd4c39e4",
  };
  const router = useRouter();
  // 跳转
  function routerChange() {
    router.replace("/home/computer/AreaAdjust");
  }
  //聚集区Store
  const clusterStore = useClusterStore();

  //获取修改数据信息列表
  clusterStore.getInformationListAction();

  //获取聚集区错误点（只有数量、检查）
  clusterStore.getCheckErrorPointsAction();

  // 更新数据
  const isUpdate = ref<boolean>(false);
  function update() {
    if (clusterStore.MapResultPoints) {
      const Overlays = map.getAllOverlays("marker");
      map.remove(Overlays);
      isUpdate.value = true;
      getALLMapData();
    }
  }
  // 折叠
  const isCollapse = ref<boolean>(false);
  // 保存结果
  function save() {
    if (clusterStore.ErrorPoints == undefined) {
      ElMessage.warning("数据处理中请稍后再试。");
    } else {
      const loading1 = ElLoading.service({
        lock: true,
        text: "保存中...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (clusterStore.ErrorPoints === 0) {
        clusterStore.deleteClearInformationListAction().then(() => {
          clusterStore.getInformationListAction();
        });
        loading1.close();
        ElMessage.success("保存成功");
      } else {
        ElMessageBox({
          title: "注意!",
          message: "还有未保存的聚集区错误点，是否忽略并继续保存?",
          showCancelButton: true,
        })
          .then((action) => {
            console.log(action);
            if (action == "confirm") {
              clusterStore.deleteClearInformationListAction().then(() => {
                clusterStore.getInformationListAction();
              });
              loading1.close();
              ElMessage.success("保存成功");
            }
          })
          .catch(() => {
            loading1.close();
          });
      }
    }
  }
  //第一个折叠面板的参数
  const activeNames = ref(["0"]);
  //第二个折叠面板的参数
  const activeNames2 = ref();
  //定义是否加载完成的变量
  const isResultPointsFinished = ref<boolean>(true);
  //获取聚集区和商铺信息的方法
  clusterStore.getAllResultPointsAction().then(() => {
    isResultPointsFinished.value = false;
  });

  //计算接口
  const CalculateBtnFunction = () => {
    const loading = ElLoading.service({
      lock: true,
      text: "计算中...",
      background: "rgba(0, 0, 0, 0.7)",
    });
    clusterStore.postCalculateAllAction().then(() => {
      loading.close();
    });
  };
  //地图部分
  //定义是否加载的变量
  const longitude = ref<number>();
  const latitude = ref<number>();

  function mapShow(lnglat: number[]) {
    if (longitude.value != lnglat[0] && latitude.value != lnglat[1]) {
      longitude.value = lnglat[0];
      latitude.value = lnglat[1];
    }
    map.setZoomAndCenter(12, lnglat);
  }
  //@ts-ignore
  import AMapLoader from "@amap/amap-jsapi-loader";
  import { mapIcon } from "@/utils/mapBluePoint";
  const isMaoFinished = ref<boolean>(true);
  let map: any = null;
  onMounted(() => {
    getALLMapData();
  });
  function getALLMapData() {
    AMapLoader.load({
      key: "64c03ae77b4521e9dbb72475e120e70c", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.DistrictSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap: any) => {
        const district = new AMap.DistrictSearch({
          subdistrict: 1,
          extensions: "all",
          level: "province",
        });
        district.search("韶关市", function (_: any, result: any) {
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
          for (let i = 0; i < bounds.length; i++) {
            const polyline = new AMap.Polyline({
              path: bounds[i], // polyline 路径，支持 lineString 和 MultiLineString
              strokeColor: "#3078AC", // 线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC
              strokeWeight: 2, // 轮廓线宽度,默认为:2
              // map:map // 这种方式相当于: polyline.setMap(map);
            });
            polyline.setMap(map);
          }
          // 绑定点击事件
          if (clusterStore.MapResultPoints && !isUpdate.value) {
            mapPoints();
          } else {
            isMaoFinished.value = true;
            clusterStore.getMapResultPointsAction().then(() => {
              isMaoFinished.value = false;
              mapPoints();
            });
          }
          function mapPoints() {
            // 地图标点
            isMaoFinished.value = false;
            clusterStore.MapResultPoints!.forEach((item) => {
              const oldIcon = new AMap.Icon({
                size: new AMap.Size(25, 25),
                image: mapIcon.orange,
                imageSize: new AMap.Size(25, 25), // 图标图片地址
              });
              const newIcon = new AMap.Icon({
                size: new AMap.Size(30, 30),
                image: mapIcon.blue,
                imageSize: new AMap.Size(30, 30), // 图标图片地址
              });
              if (item.state == "center") {
                // 将 Icon 实例添加到 marker 上:
                const marker = new AMap.Marker({
                  position: new AMap.LngLat(item.lnglat[0], item.lnglat[1]), //点标记的位置
                  offset: new AMap.Pixel(-7, -17), //偏移量
                  icon: oldIcon, //添加 Icon 实例
                  title: "中心点",
                  zooms: [9, 18], //点标记显示的层级范围，超过范围不显示
                });
                map!.add(marker);
                marker.on("click", function () {
                  activeNames2.value = item.accumulation;
                  document.getElementById(item.accumulation)?.scrollIntoView();
                  if (
                    longitude.value != item.lnglat[0] &&
                    latitude.value != item.lnglat[1]
                  ) {
                    longitude.value = item.lnglat[0];
                    latitude.value = item.lnglat[1];
                  }
                });
                watch([longitude, latitude], (newValue) => {
                  if (
                    newValue[0] == item.lnglat[0] &&
                    newValue[1] == item.lnglat[1]
                  ) {
                    marker.setIcon(newIcon);
                  } else {
                    marker.setIcon(oldIcon);
                  }
                });
              } else if (item.state == "error") {
                const errorIcon = new AMap.Icon({
                  size: new AMap.Size(30, 30),
                  image: mapIcon.red,
                  imageSize: new AMap.Size(30, 30), // 图标图片地址
                });
                // 将 Icon 实例添加到 marker 上:
                const marker = new AMap.Marker({
                  position: new AMap.LngLat(item.lnglat[0], item.lnglat[1]), //点标记的位置
                  offset: new AMap.Pixel(-7, -17), //偏移量
                  zIndex: 100,
                  icon: errorIcon, //添加 Icon 实例
                  title: "错误点",
                  zooms: [9, 18], //点标记显示的层级范围，超过范围不显示
                });
                marker.on("click", function () {
                  activeNames2.value = item.accumulation;
                  document.getElementById(item.accumulation)?.scrollIntoView();
                  if (
                    longitude.value != item.lnglat[0] &&
                    latitude.value != item.lnglat[1]
                  ) {
                    longitude.value = item.lnglat[0];
                    latitude.value = item.lnglat[1];
                  }
                });
                watch([longitude, latitude], (newValue) => {
                  if (
                    newValue[0] == item.lnglat[0] &&
                    newValue[1] == item.lnglat[1]
                  ) {
                    marker.setIcon(newIcon);
                  } else {
                    marker.setIcon(errorIcon);
                  }
                });
                map!.add(marker);
              }
            });
          }
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  onBeforeUnmount(() => {
    //销毁地图，并清空地图容器
    map!.destroy();
    //地图对象赋值为null
    map = null;
    //清除地图容器的 DOM 元素
    document.getElementById("container")!.remove(); //"container" 为指定 DOM 元素的id
  });
</script>
<style lang="scss" scoped>
  .area {
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
        height: 100%;
        margin: 0.5vh 0;
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
      .areaCollapse {
        margin-left: 1vw;
        padding-top: 2vh;
        width: 85%;

        .el-collapse {
          .el-collapse-item {
            ::v-deep(.el-collapse-item__header::before) {
              content: "";
              display: inline-block;
              width: 15px;
              height: 15px;
              background-color: #e0c340;
              border-radius: 50%;
              margin-right: 10px;
            }

            ::v-deep(.el-collapse-item__header::after) {
              margin-left: 10px;
              margin-right: -15px;
              width: 33px;
              height: 33px;
              background: #e0c340;
              transform: rotate(45deg);
              content: "";
              display: inline-block;
            }
          }
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
          background-color: #b5a55f;
          border-radius: 50%;
          margin-bottom: 4px;
          margin-right: 10px;
        }
      }

      .region {
        margin-left: 1.4vw;
        margin-top: 3vh;
        width: 85%;

        .el-collapse {
          --el-collapse-header-bg-color: rgb(2, 119, 168);
          --el-collapse-header-text-color: #e1f7ff;
          --el-collapse-header-font-size: 18px;
          --el-collapse-content-bg-color: #001731;
          --el-collapse-content-font-size: 18px;
          --el-collapse-content-text-color: #e1f7ff;
          --el-collapse-border-color: #001731;
        }

        .el-collapse-item {
          padding-left: 30px;
          position: relative;
          .active {
            background-color: rgb(2, 119, 168);
            padding: 0 0.5vw;
          }
          ::v-deep(.el-collapse-item__content) {
            padding: 0;
          }

          .regionCollapseItemContext {
            margin: 10px 0;
            cursor: pointer;
          }

          .regionCollapseItemContext:before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: rgb(0, 179, 255);
            border-radius: 50%;
            margin-bottom: 4px;
            margin-right: 10px;
          }
        }

        .el-collapse-item:before {
          position: absolute;
          left: 5px;
          top: 0;
          border-right: 25px solid rgb(2, 119, 168);
          border-top: 24px solid transparent;
          border-bottom: 24px solid transparent;
          content: "";
          width: 0;
          height: 0;
        }
      }

      .btn {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 8%;
      }
    }
  }
</style>
