<template>
  <div class="routeEChart" v-show="isOpenEChart">
    <div class="AnalysisRouteBottom">
      <el-carousel :autoplay="false" height="220px">
        <el-select
          v-model="type"
          placeholder="请选择"
          class="changeType"
          @change="changeType"
        >
          <el-option style="width: 110px;" label="路径比较" value="路径比较" />
          <el-option style="width: 110px;" label="班组间比较" value="班组间比较" />
          <el-option style="width: 110px;" label="班组内比较" value="班组内比较" />
        </el-select>
        <el-carousel-item>
          <div class="content">
            <div class="title">{{title?props.data.groupName?props.data.groupName+'运行里程/km':title:'运行里程/km'}}</div>
            <div class="canvas" ref="distanceRef"></div>
          </div>
          <div class="variance">方差：{{varianceDis}}</div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="content">
            <div class="title">{{title?props.data.groupName?props.data.groupName+'载货量/条':title:'载货量/条'}}</div>
            <div class="canvas" ref="weightRef"></div>
          </div>
          <div class="variance">方差：{{varianceWei}}</div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="content">
            <div class="title">{{title?props.data.groupName?props.data.groupName+'工作时长/h':title:'工作时长/h'}}</div>
            <div class="canvas" ref="timeRef"></div>
          </div>
          <div class="variance">方差：{{varianceTim}}</div>
        </el-carousel-item>
      </el-carousel>
      
    </div>
  </div>
</template>
<script lang="ts" setup>
  import * as echart from "echarts";
  type EChartsOption = echarts.EChartsOption;
  import { useClusterStore } from "@/store/cluster";
  const clusterStore = useClusterStore();
  type IProps = {
    apiKey:string;
    data: {
      [key: string]: any;
      dis: Array<number>;
      wei: Array<number>;
      time: Array<number>;
      groupDis:Array<number>;
      groupWei:Array<number>;
      groupTime:Array<number>;
      routeName:Array<string>;
      groupRouteName:Array<string>;
      groupName?:string;
    };
  };
  const props = defineProps<IProps>();
  // 显示隐藏
  const isOpenEChart = defineModel<boolean>({ required: true, default: false });
  const distanceRef = ref<HTMLElement>();
  const weightRef = ref<HTMLElement>();
  const timeRef = ref<HTMLElement>();
  const disArea = ref<number[]>();
  const weiArea = ref<number[]>();
  const timeArea = ref<number[]>();
  const varianceDis=ref<number>(0)
  const varianceWei=ref<number>(0)
  const varianceTim=ref<number>(0)
  const title = ref<string>()
    function calculateVariance(data:number[]) {  
    // 计算平均值  
    let min = Math.min(...data);  
    let max = Math.max(...data);
    let arr=data.map(value => (value - min) / (max - min));
    let sum = arr.reduce((a, b) => a + b, 0);  
    let avg = sum / arr.length;  
    // 计算方差  
    let variance = arr.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0);  
    variance /= arr.length;  
    variance = parseFloat(variance.toFixed(2));  
    return variance;  
}  
  onMounted(() => {
    setEchart();
    clickEchart()
    clusterStore.compareAreaAction("1,2,3,4,5",props.apiKey).then(() => {
      disArea.value = clusterStore.compareAreaData.map(
        (i: any) => i.averageDistance
      );
      weiArea.value = clusterStore.compareAreaData.map(
        (i: any) => i.averCargoWeight
      );
      timeArea.value = clusterStore.compareAreaData.map(
        (i: any) => i.averageWorkTime
      );
    });
  });
  function setEchart() {
    var distanceEC = echart.init(distanceRef?.value);
    var weightEC = echart.init(weightRef?.value);
    var timeEC = echart.init(timeRef?.value);
    if (type.value == "路径比较") {
      title.value=''
      watch(
        props.data.dis,
        () => {
          if(type.value=="路径比较"){
            index.value = props.data.routeName.map(
            (_value: string,index:number) => index
          );  
            if(props.data.dis.length>1){
              varianceDis.value=calculateVariance(props.data.dis)
            }else{
              varianceDis.value=0
            }
            if(props.data.wei.length>1){
              varianceWei.value=calculateVariance(props.data.wei)
            }else{
              varianceDis.value=0
            }
            if(props.data.time.length>1){
              varianceTim.value=calculateVariance(props.data.time)
            }else{
              varianceDis.value=0
            }
            distanceEC.setOption(newOption("dis",'routeName'));
            weightEC.setOption(newOption("wei",'routeName'));
            timeEC.setOption(newOption("time",'routeName'));
          }
          },  
        { immediate: true }
      );
    } else if (type.value == "班组间比较") {
      title.value=''
      watch(
        disArea,
        () => {
          if(disArea.value&&disArea.value.length>0){
              varianceDis.value=calculateVariance(disArea.value.map((i)=>Number(i)))
            }
            if(weiArea.value&&weiArea.value.length>0){
              varianceWei.value=calculateVariance(weiArea.value.map((i)=>Number(i)))
            }
            if(timeArea.value&&timeArea.value.length>0){
              varianceTim.value=calculateVariance(timeArea.value.map((i)=>Number(i)))
            }
          distanceEC.setOption(newAreaOption(disArea.value));
          weightEC.setOption(newAreaOption(weiArea.value));
          timeEC.setOption(newAreaOption(timeArea.value));
        },
        { immediate: true }
      );
    }else if(type.value == "班组内比较"){
    
      title.value='暂无数据，请先在班组间比较选择要比较的班组路径'
      watch(
        props.data.groupRouteName,
        () => {
          index.value = props.data.groupRouteName.map(
            (_value: string,index:number) => index
          );  
            if(props.data.groupDis.length>0){
              varianceDis.value=calculateVariance(props.data.groupDis)
            }else{
              varianceDis.value=0
            }
            if(props.data.groupWei.length>0){
              varianceWei.value=calculateVariance(props.data.groupWei)
            }else{
              varianceDis.value=0
            }
            if(props.data.groupTime.length>0){
              varianceTim.value=calculateVariance(props.data.groupTime)
            }else{
              varianceDis.value=0
            }
            distanceEC.setOption(newOption("groupDis",'groupRouteName'));
            weightEC.setOption(newOption("groupWei",'groupRouteName'));
            timeEC.setOption(newOption("groupTime",'groupRouteName'));
        },
        { immediate: true }
      );
    }
  }
  
  const emit = defineEmits(['dis','wei','tim'])
  function clickEchart(){
    var distanceEC = echart.init(distanceRef?.value);
    var weightEC = echart.init(weightRef?.value);
    var timeEC = echart.init(timeRef?.value);
      distanceEC.on('click', function dis (params) {
        if(type.value=='班组间比较'||type.value=='班组内比较'){
          emit('dis',params)
        }
    })
    weightEC.on('click', function wei (params) {
      if(type.value=='班组间比较'||type.value=='班组内比较'){
        emit('wei',params)
        }
    })
    timeEC.on('click', function tim (params) {
      if(type.value=='班组间比较'||type.value=='班组内比较'){
        emit('tim',params)
        } 
    })
  }
  const index = ref<number[]>();
  function newOption(type: keyof IProps["data"],groupType:string): EChartsOption {
    return {
      grid: {  
        width: '85%',
        left:'5%' 
    },
      xAxis: {
        data: index.value,
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        position:'top',
        appendToBody:true,
      formatter(params:any) {
			return `
		${params.data} </br> 
		${props.data[groupType][params.dataIndex]}
			`;
   
		}
    },
      series: [
        {
          data: props.data[type],
          type: "bar",
          itemStyle: {
            color: "#73e5ff",
          },
        },
      ],
    };
  }
  function newAreaOption(type?: number[]): EChartsOption {
    return {
      xAxis: {
        data: ["班组一", "班组二", "班组三", "班组四", "班组五"],
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        position:'top',
        appendToBody:true,
      formatter(params:any) {
			return `
		${params.data} </br> 
		 ${params.name}
			`;
		},
    },
      series: [
        {
          data: type,
          type: "bar",
  
          itemStyle: {
            color: function (params) {
              var colorarrays = [
                "#e4c974",
                "#814146",
                "#798f4a",
                "#8b90a3",
                "#728593",
                "#383a4b",
              ];
              return colorarrays[params.dataIndex];
            },
          },
        },
      ],
    };
  }
  const type = ref<string>("路径比较");
    function changeType() {
    setEchart();
  }

</script>
<style lang="scss" scoped>
  .routeEChart {
    position: absolute;
    width: 100%;
    bottom: -3vh;
    .AnalysisRouteBottom {
      .changeType {
        position: absolute;
        height: 1vh;
        width: 110px;
        right: 2%;
        top: 5%;
        z-index: 10;
      }
      position: relative;
      color: #73e5ff;

      .content {
        flex: 1;
        position: relative;
        height: 220px;
        background-color: #001731;
        margin: 0px;
        border: #73e5ff 1px solid;
        border-radius: 2px;
        padding: 5px;
        .title {
          position: absolute;
          left: 48%;
          transform: translate(-50%);
        }
        .canvas {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 740px;
          height: 280px;
        }
    }
            .variance{
          position: absolute;
          top: 30%;
          right: 2%;
        }
    }
  }
  .el-select-dropdown__item {
    display: grid !important;
        place-items: center !important;
      
      }
      .el-popper .el-popper__arrow::before {
        border-top: 1px solid #73e1ff;
        background-color: #73e1ff !important;
      }
</style>
