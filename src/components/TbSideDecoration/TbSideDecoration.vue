<template>
    <div class="TbSideDecoration">
        <div class="vertical-bar" ></div>
        <div class="top-trapezium"></div>
        <div class="mid-trapezium"></div>
    </div>

</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.TbSideDecoration{
    position:relative;
    width: 30px;
    .vertical-bar{
    height: 86vh;
    width: 10px;
    background-color: #73e5ff;
    }
    .top-trapezium{
    position: absolute;
    top:40px;
    left:10px;
    width: 20px;     
    height: 100px;     
    background: #73e5ff;         
    transform: perspective(0.2em) rotateY(3deg);   
    }
    .mid-trapezium{
    position: absolute;
    top:300px;
    left:-5px;
    width: 10px;     
    height:40px;     
    background: #73e5ff;         
    transform: perspective(0.05em) rotateY(-3deg);   
    }
}
</style>
