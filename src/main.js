import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia"; // 新增

const app = createApp(App);
app.use(router);
app.use(createPinia()); // 新增
app.mount("#app");
