// src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// 静态路由
const constantRoutes: RouteRecordRaw[] = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/Home/Home.vue"),
    meta: { order: 0 },
    redirect: "/home/board",
    children: [
      {
        path: "/home/board",
        component: () => import("@/pages/Home/Board/Board.vue"),
        redirect: "/home/board/info?feedbackType=1",
        children: [
          {
            path: "/home/board/info",
            name: "boardInfo",
            component: () => import("@/pages/Home/Board/BoardInfo/BoardInfo.vue"),
          },
       
        ],
      },
      {
        path: "/home/group",
        name: "group",
        meta: { order: 1 },
        component: () => import("@/pages/Home/Group/Group.vue"),
      },
      {
        path: "/home/computer",
        name: "computer",
        meta: { order: 2 },
        component: () => import("@/pages/Home/Computer/Computer.vue"),
        redirect: "/home/computer/route",
        children: [
          {
            path: "/home/computer/area",
            name: "area",
            component: () => import("@/pages/Home/Computer/Area/Area.vue"),
          },
          {
            path: "/home/computer/route",
            name: "route",
            component: () => import("@/pages/Home/Computer/Route/Route.vue"),
          },
          {
            path: "/home/computer/SaleRoute",
            name: "SaleRoute",
            component: () => import("@/pages/Home/Computer/SaleRoute/SaleRoute.vue"),
          },
          {
            path: "/home/computer/AreaAdjust",
            name: "AreaAdjust",
            component: () => import("@/pages/Home/Computer/AreaAdjust/AreaAdjust.vue"),
            meta:{
             isShow:true,
             order: 2
            }
          },
        ],
      },
     
      {
        path: "/home/AnalysisRoute",
        name: "AnalysisRoute",
        component: () => import("@/pages/Home/Computer/AnalysisRoute/AnalysisRoute.vue"),
      },
      {
        path: "/home/management",
        name: "management",
        meta: { order: 3 },
        component: () => import("@/pages/Home/Management/Management.vue"),
        children: [
          {
            path: "/home/management/shops",
            name: "shops",
            component: () => import("@/pages/Home/Management/Shops/Shops.vue"),
          },
          {
            path: "/home/management/area",
            name: "areas",
            component: () => import("@/pages/Home/Management/Area/Area.vue"),
          },
        ],
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.push({ path: "/login" });
  location.reload();
}
router.beforeEach((to) => {
  //登录成功有token进入main
  const token = localStorage.getItem("token");
  if (to.path.startsWith("/home") && !token) {
    return "/login";
  }
});
// 声明meta属性类型
declare module 'vue-router' {
  interface RouteMeta {
    order: number
  }
}
export default router;
