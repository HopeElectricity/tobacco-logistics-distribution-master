<template>
  <ElConfigProvider :locale="zhCn">
    <router-view></router-view>
  </ElConfigProvider>
</template>
  
<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import { zhCn } from "element-plus/es/locale/index.mjs";
import "@/types/components.d.ts"
// 1
</script>

<style scoped></style>