import { defineCustomElement } from "vue";
import App from "./App.vue";

console.log("Alien RPG Space Travel Tool: Initializing...");

const MyApp = defineCustomElement(App);
customElements.define("alien-rpg-space-travel-tool", MyApp);

console.log("Alien RPG Space Travel Tool: Registered successfully");

