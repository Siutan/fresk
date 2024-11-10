import "./app.css";
import App from "./App.svelte";
import freskSDK from "./lib/fresk-instance";

freskSDK.init();

const app = new App({
  target: document.getElementById("app"),
});

export default app;
