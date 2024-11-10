import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import packageJson from "./package.json" assert { type: "json" };
// import FreskPluginVite from "fresk-web-sdk/vite/";
import FreskPluginVite from "../../sdk/src/vite/index.js";
// import { FreskPluginVite } from "fresk-web-sdk";
const prod = process.env.NODE_ENV === "production";

const freskConfig = {
  appId: "uo8nnevqicasmfu",
  appKey: "123",
  appName: "Test App",
  endpoint: "http://127.0.0.1:8090",
  version: packageJson.version,
  environment: prod ? "production" : "development",
  verbose: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), FreskPluginVite(freskConfig)],
  build: {
    sourcemap: "true",
  },
});
