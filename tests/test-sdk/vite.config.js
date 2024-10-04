import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { FreskPluginVite } from "../../sdk/dist/mod";
// import { FreskPluginVite } from "fresk-web-sdk";
const prod = process.env.NODE_ENV === "production";

const freskConfig = {
  sdkConfig: {
    appId: "uo8nnevqicasmfu",
    appKey: "123",
    url: "http://127.0.0.1:8090",
    appEnvironment: prod ? "production" : "development",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), FreskPluginVite(freskConfig)],
  build: {
    sourcemap: "true",
  },
});
