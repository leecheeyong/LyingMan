import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import CreateRoom from "./views/CreateRoom.vue";
import JoinRoom from "./views/JoinRoom.vue";
import GameRoom from "./views/GameRoom.vue";
import "./style.css";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    name: "CreateRoom",
    component: CreateRoom,
  },
  {
    path: "/join",
    name: "JoinRoom",
    component: JoinRoom,
  },
  {
    path: "/room/:code",
    name: "GameRoom",
    component: GameRoom,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
