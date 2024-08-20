import { defineStore } from "pinia";
import {ImanagementSearchData,IupdateArea,IOptionalData,ImanagementStoreDetial}from '@/types/datamanagement'
import {
    getStore,getOptional,deleteStore,updateArea,updateStore,addStore,getStoreDetial
  } from "@/service/modules/datamanagement";

  export const usedatamanagementStore = defineStore("datamanagement", () => {
    const loading = ref<boolean>(false);
    const datamanagementList = ref<any>({
      });
      async function getStoreAction(data:ImanagementSearchData) {
        loading.value = true;
        const res = await getStore(data);
        datamanagementList.value = res.data;
        loading.value = false;  
      }
      const getOptionalData = ref<IOptionalData[]>()
      async function getOptionalAction(data:string) {
        const res = await getOptional(data);
        getOptionalData.value = res.data
      }
      async function deleteStoreAction(data:string) {
        const res = await deleteStore(data);
        if (res.code === 20000) {
          ElMessage.success("删除成功");
        }else{
          ElMessage.error("删除失败");
        }
      }
      async function updateAreaAction(data:IupdateArea) {
        const res = await updateArea(data);
        console.log(res);
        if (res.code === 20000) {
          ElMessage.success("调整成功");
        }else{
          ElMessage.error("调整失败");
        }
      }
      async function updateStoreAction(data:ImanagementStoreDetial) {
        const res = await updateStore(data);
        console.log(res);
        if (res.code === 20000) {
          ElMessage.success("修改成功");
        }else{
          ElMessage.error("修改失败");
        }
      }
      async function addStoreAction(data:ImanagementStoreDetial) {
        const res = await addStore(data);
        console.log(res);
        if (res.code === 20000) {
          ElMessage.success("添加成功");
        }else{
          ElMessage.error("添加失败");
        }
      }
      const storeDetialData = ref<any>()
      async function getStoreDetialAction(data:number) {
        const res = await getStoreDetial(data);
        storeDetialData.value = res.data
      }
      return {
        datamanagementList,
        getStoreAction,
        loading,
        getOptionalData,
        getOptionalAction,
        deleteStoreAction,
        updateAreaAction,
        updateStoreAction,
        addStoreAction,
        storeDetialData,
        getStoreDetialAction
      }
  })
