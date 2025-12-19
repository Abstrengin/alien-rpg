import { createApp } from "vue";
import App from "./App.vue";

// Create and mount the app
const app = createApp(App);
app.mount("#app");

// Also mount to ttbg-app for backward compatibility
const ttbgDiv = document.getElementById("ttbg-app");
if (ttbgDiv && ttbgDiv !== document.getElementById("app")) {
  createApp(App).mount("#ttbg-app");
}
