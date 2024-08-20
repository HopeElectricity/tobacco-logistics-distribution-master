<template>
    <div class="Management">
        <div class="List">
            <div class="listItem" v-for="(item, index) in ManagementList" :class="{ active: currentRoute === item.value }" :key="index"
                @click="routerChange(item)">
                {{ item.name }}
            </div>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
import { ManagementList } from "../config";
const currentRoute = ref(ManagementList[4].value);
function routerChange(route: any) {
    router.push(route.router);
    currentRoute.value = route.value
}
</script>
<style lang="scss" scoped>
.Management{
    display: flex;

    .List{
        width: 10vw;
        height: 70vh;
        color: #66ecf5;
        font-size: 1.2vw;
        text-align: center;
        margin-right: 2vw;
        .listItem{
            padding: 1vw 0;
            background-color:rgba(0, 31, 60,0.6);
        }
        .active{
            background-color:rgba(1, 130, 180,0.7);
        }
    }
    .content{
        width: 100%;
    }   
}
</style>