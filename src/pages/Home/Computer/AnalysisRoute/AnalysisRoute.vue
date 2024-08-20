<template>
    <div class="AnalysisRoute">
        <div class="back">
            <el-icon size="25" class="backBtn" @click="backBtn">
                <ArrowLeftBold />
            </el-icon>&nbsp;路径分析&nbsp;
        </div>
        <div class="AnalysisRouteTop">
            <div class="selete">
                请选择您要分析的路径：
                <el-select v-model="selectValue" placeholder="请选择中转站-车牌号" size="large"
                    style="width: 13vw; margin-top: 3.5vh;">
                    <el-option-group v-for="item in clusterStore.historicalPath" :key="item.transitDepotId"
                        :label="item.transitDepotName">
                        <el-option v-for="(item1) in item.licensePlateNumberList" :key="item1" :label="item1"
                            :value="item1"
                            @click="selectValueFun(item.transitDepotName + '-' + item1, item.transitDepotId)">
                        </el-option>
                    </el-option-group>
                </el-select>
                <el-select v-model="weekValue" placeholder="请选择星期" size="large" style="width: 13vw; margin-top: 3.5vh;">
                    <el-option v-for="item in week" :key="item" :label="item" :value="item" />
                </el-select>
                <el-date-picker style="width: 13vw; margin-top: 3.5vh;" v-model="pickerDate" type="date"
                    placeholder="选择日期时间" value-format="YYYY.MM.DD">
                </el-date-picker>
                <el-select v-model="versionValue" placeholder="请选择版本号" size="large"
                    style="width: 13vw; margin-top: 3.5vh;" @click="selectVersionFunction">
                    <el-option v-for="item in clusterStore.routeVersion" :key="item" :label="item" :value="item" />
                </el-select>
                <el-button class="btn" @click="analysisBtn">进行分析</el-button>
                <el-button class="btn">导出分析图</el-button>
            </div>
            <div class="oldRoute">
                旧路线：
                <div class="oldRouteBorder">
                    <div id="container"></div>
                </div>
            </div>
            <div class="newRoute">
                新路线：
                <div class="newRouteBorder">
                    <div id="container2"></div>
                </div>
            </div>
        </div>
        <div class="AnalysisRouteBottom">
            <div class="BottomLeft">
                <BorderBox11 :color="['#73e5ff', '#73e5ff']" backgroundColor='#001731' title="运行里程/公里">
                    <div id="main"></div>
                </BorderBox11>
            </div>
            <div class="BottomMiddle">
                <BorderBox11 :color="['#73e5ff', '#73e5ff']" backgroundColor='#001731' title="工作时长/小时">
                    <div id="main2"></div>
                </BorderBox11>
            </div>
            <div class="BottomRight">
                <BorderBox11 :color="['#73e5ff', '#73e5ff']" backgroundColor='#001731' title="载货量/盒">
                    <div id="main3"></div>
                </BorderBox11>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { BorderBox11 } from "@dataview/datav-vue3";
import AMapLoader from "@amap/amap-jsapi-loader";
import echarts from "@/store/echart";
import { useClusterStore } from "@/store/cluster";
window._AMapSecurityConfig = {
    securityJsCode: "1b6291b2fceee1cd3b7798bfdd4c39e4",
};
const router = useRouter();
function backBtn() {
    router.back()
}

let map: any = null;
let map2: any = null;
AMapLoader.load({
    key: "64c03ae77b4521e9dbb72475e120e70c", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.DistrictSearch'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
})
    .then((AMap:any) => {
        const district = new AMap.DistrictSearch({ subdistrict: 0, extensions: 'all', level: 'province' });
        district.search('韶关市', function (status: any, result: any) {
            // 查询成功时，result即为对应的行政区信息
            // console.log(result.districtList[0].boundaries,222) // 这里是整个郑州市的边界经纬度
            console.log(status);
            const bounds = result.districtList[0].boundaries
            const mask = []
            for (let i = 0; i < bounds.length; i++) {
                mask.push([bounds[i]])
            }
            map = new AMap.Map("container", {  // 设置地图容器id
                mask: mask, // 为Map实例制定掩模的路径,各图层将值显示路径范围内图像,3D模式下有效
                zoom: 9, // 设置当前显示级别
                expandZoomRange: true, // 开启显示范围设置
                zooms: [8, 18], //最小显示级别为7，最大显示级别为20
                center: [113.767587, 24.718014], // 设置地图中心点位置
                viewMode: "3D",    // 特别注意,设置为3D则其他地区不显示
                zoomEnable: true, // 是否可以缩放地图
                resizeEnable: true,
            });
            map2 = new AMap.Map("container2", {  // 设置地图容器id
                mask: mask, // 为Map实例制定掩模的路径,各图层将值显示路径范围内图像,3D模式下有效
                zoom: 9, // 设置当前显示级别
                expandZoomRange: true, // 开启显示范围设置
                zooms: [8, 18], //最小显示级别为7，最大显示级别为20
                center: [113.767587, 24.718014], // 设置地图中心点位置
                viewMode: "3D",    // 特别注意,设置为3D则其他地区不显示
                zoomEnable: true, // 是否可以缩放地图
                resizeEnable: true,
            });
            // 添加描边
            for (let i = 0; i < bounds.length; i++) {
                const polyline = new AMap.Polyline({
                    path: bounds[i], // polyline 路径，支持 lineString 和 MultiLineString
                    strokeColor: '#3078AC', // 线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC
                    strokeWeight: 2, // 轮廓线宽度,默认为:2
                    // map:map // 这种方式相当于: polyline.setMap(map);
                })
                polyline.setMap(map);
            }
            for (let i = 0; i < bounds.length; i++) {
                const polyline = new AMap.Polyline({
                    path: bounds[i], // polyline 路径，支持 lineString 和 MultiLineString
                    strokeColor: '#3078AC', // 线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC
                    strokeWeight: 2, // 轮廓线宽度,默认为:2
                    // map:map // 这种方式相当于: polyline.setMap(map);
                })
                polyline.setMap(map2);
            }

            //移动限制范围
            //northEastlat25.177474   114.74949
            //southWest24.28189  112.785684
            // const limitBound = map.getBounds();
            const limitBound = new AMap.Bounds([112.785684, 23.8], [114.74949, 25.56]);
            map.setLimitBounds(limitBound);
            map2.setLimitBounds(limitBound);

        })
    })
    .catch((e:Error) => {
        console.log(e);
    });
//eachart初始
const setEchartsOptions = () => {
    let myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(option);
}
const setEchartsOptions2 = () => {
    let myChart = echarts.init(document.getElementById('main2'));
    myChart.setOption(option2);
}
const setEchartsOptions3 = () => {
    let myChart = echarts.init(document.getElementById('main3'));
    myChart.setOption(option3);
}
onMounted(() => {
    setEchartsOptions()
    setEchartsOptions2()
    setEchartsOptions3()
})
let option = {
    textStyle: {
        color: '#ffffff'
    },
    xAxis: {
        type: 'category',
        data: ['旧线路', '新线路']
    },
    yAxis: {
        type: 'value'
    },
    grid: {
        x: 70,
        x2: 40,
        y: 70,
        y2: 40,
    },
    series: [
        {
            data: [
                {
                    value: 0,
                    itemStyle: {
                        color: '#fcfe6d'
                    },
                },
                {
                    value: 0,
                    itemStyle: {
                        color: '#3baefe'
                    }
                },
            ],
            type: 'bar',
            barWidth: '20%',
            label: {
                show: true, //开启显示
                position: 'top',
                textStyle: { //数值样式
                    color: '#ffffff',//字体颜色
                    fontSize: 15//字体大小
                }
            }
        }
    ]
};
let option2 = {
    textStyle: {
        color: '#ffffff'
    },
    xAxis: {
        type: 'category',
        data: ['旧线路', '新线路']
    },
    yAxis: {
        type: 'value'
    },
    grid: {
        x: 70,
        x2: 40,
        y: 70,
        y2: 40
    },
    series: [
        {
            data: [
                {
                    value: 0,
                    itemStyle: {
                        color: '#fcfe6d'
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        color: '#3baefe'
                    }
                },
            ],
            type: 'bar',
            barWidth: '20%',
            label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                    color: '#ffffff',//字体颜色
                    fontSize: 15//字体大小
                }
            }
        }
    ]
};
let option3 = {
    textStyle: {
        color: '#ffffff'
    },
    xAxis: {
        type: 'category',
        data: ['旧线路', '新线路']
    },
    yAxis: {
        type: 'value'
    },
    grid: {
        x: 75,
        x2: 40,
        y: 70,
        y2: 40
    },
    series: [
        {
            data: [
                {
                    value: 0,
                    itemStyle: {
                        color: '#fcfe6d'
                    }
                },
                {
                    value: 0,
                    itemStyle: {
                        color: '#3baefe'
                    }
                },
            ],
            type: 'bar',
            barWidth: '20%',
            label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                    color: '#ffffff',//字体颜色
                    fontSize: 15//字体大小
                }
            }
        }
    ]
};

//聚集区Store
const clusterStore = useClusterStore();
clusterStore.getTransitDepotRouteDataAction()

//大区-车牌号
const selectValue = ref('')
const saveTransitDepotId = ref('')
const selectValueFun = (data: string, transitDepotId: string) => {
    selectValue.value = data
    saveTransitDepotId.value = transitDepotId
}
//星期
const weekValue = ref('')
//日期
const pickerDate = ref('')
let week = new Array("星期一", "星期二", "星期三", "星期四", "星期五");
//版本号
const versionValue = ref('')
const selectVersionFunction = () => {
    if (saveTransitDepotId.value == '') {
        ElMessage.warning('请先选择中转站-车牌号')
    }
    else if (pickerDate.value == '') {
        ElMessage.warning('请先选择日期')
    } else {
        clusterStore.getRouteVersionAction({ date: pickerDate.value.replaceAll(".", "-"), transitDepotId: saveTransitDepotId.value, })
    }
}
//地图
let oldPolyline: AMap.Polyline[] = []
let newPolyline: AMap.Polyline[] = []
//分析
const analysisBtn = () => {
    let routeName = selectValue.value + '-' + weekValue.value
    map.remove(oldPolyline);
    map2.remove(newPolyline);
    oldPolyline = []
    newPolyline = []
    clusterStore.getRouteDataAction({ transitDepotId: saveTransitDepotId.value, routeName: routeName + '-' + pickerDate.value + '-' + versionValue.value },'309bde1e73b984c7d8a87ab19255963c')
        .then(() => {
            //旧路线数据
            //柱状图
            console.log("旧路线");
            console.log(clusterStore.analysisRouteData?.cargoWeight);
            option.series[0].data[0].value = Number(clusterStore.analysisRouteData?.cargoWeight)
            console.log(clusterStore.analysisRouteData?.workTime);
            option2.series[0].data[0].value = Number(clusterStore.analysisRouteData?.workTime)
            console.log(clusterStore.analysisRouteData?.distance);
            option3.series[0].data[0].value = Number(clusterStore.analysisRouteData?.distance)

            //地图路线-折线数据展示
            //配置折线路径
            let path: AMap.LngLat[] = [];
            clusterStore.analysisRouteData?.polyline?.forEach((item) => {
                path.push(new AMap.LngLat(item.longitude, item.latitude))
            })
            // 创建 Polyline 实例
            let polyline = new AMap.Polyline({
                path: path,
                strokeWeight: 6,
                showDir: true,
                strokeColor: "#001731", //线条颜色
                lineJoin: "round", //折线拐点连接处样式
            });
            oldPolyline.push(polyline)
            map.add(oldPolyline)
            // setEchartsOptions()
            // setEchartsOptions2()
            // setEchartsOptions3()
            //新路线数据
            console.log(JSON.parse(window.sessionStorage.getItem("newPath")!));
            JSON.parse(window.sessionStorage.getItem("newPath")!).find((item: any) => {
                if (item.routeName.slice(0, -11) === routeName) {
                    //地图路线-折线数据展示
                    //配置折线路径
                    let path: AMap.LngLat[] = [];
                    item.polyline?.forEach((item1: any) => {
                        path.push(new AMap.LngLat(item1.longitude, item1.latitude))
                    })
                    // 创建 Polyline 实例
                    let polyline = new AMap.Polyline({
                        path: path,
                        strokeWeight: 6,
                        showDir: true,
                        strokeColor: "red", //线条颜色
                        lineJoin: "round", //折线拐点连接处样式
                    });
                    newPolyline.push(polyline)
                    map2.add(newPolyline)
                    //柱状图
                    console.log("新路线");
                    console.log(item.cargoWeight);
                    option.series[0].data[1].value = Number(item.cargoWeight)
                    console.log(item.workTime);
                    option2.series[0].data[1].value = Number(item.workTime)
                    console.log(item.distance);
                    option3.series[0].data[1].value = Number(item.distance)
                }
            })
            // if (option.series[0].data[1].value == 0 && option.series[0].data[1].value == 0 && option3.series[0].data[1].value == 0) {
            //     ElMessage.warning("没有新路线数据");
            // }
            setEchartsOptions()
            setEchartsOptions2()
            setEchartsOptions3()
        })
}

</script>

<style lang="scss" scoped>
.AnalysisRoute {
    width: 100%;

    .back {
        font-size: 20px;
        display: flex;
        align-items: center;
        font-weight: bolder;
        color: #73e1ff;
        user-select: none;
        letter-spacing: 2px;

        .backBtn {
            cursor: pointer;
        }
    }

    .AnalysisRouteTop {
        display: flex;
        margin: 13px 0;

        .selete {
            flex: 2;
            height: 45vh;
            color: #73e1ff;
            font-size: 21px;

            .btn {
                margin-top: 15%;

            }
        }

        .oldRoute {
            flex: 5;
            height: 45vh;
            color: #73e1ff;
            font-size: 25px;
            margin: 0 30px;

            .oldRouteBorder {
                margin: 11px 0;
                border: 1px solid #73e1ff;
                height: 85%;

                #container {
                    width: 99%;
                    height: 98%;
                    margin: 0.5vh;
                }

            }
        }

        .newRoute {
            flex: 5;
            height: 45vh;
            color: #73e1ff;
            font-size: 25px;

            .newRouteBorder {
                margin: 11px 0;
                border: 1px solid #73e1ff;
                height: 85%;

                #container2 {
                    width: 99%;
                    height: 98%;
                    margin: 0.5vh;
                }
            }
        }
    }

    .AnalysisRouteBottom {
        display: flex;

        .BottomLeft {
            flex: 1;
            height: 35vh;

            #main {
                box-sizing: border-box;
                // padding: 2vh 0 0 1.5vw;
                width: 100%;
                height: 100%;
            }
        }

        .BottomMiddle {
            flex: 1;
            height: 35vh;
            margin: 0 30px;

            #main2 {
                box-sizing: border-box;
                // padding: 2vh 0;
                width: 100%;
                height: 100%;
            }
        }

        .BottomRight {
            flex: 1;
            height: 35vh;

            #main3 {
                box-sizing: border-box;
                // padding: 2vh 0 0 1.5vw;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>