import { createApp } from "vue";
import "normalize.css";
import "@/assets/styles/reset.scss";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "@/router";
import Vop from "@/op";

createApp(App).use(createPinia()).use(router).use(Vop).mount("#app");
