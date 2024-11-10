// init fresk sdk
// import FreskWebSDK from "fresk-web-sdk/core";
import FreskWebSDK from "../../../../sdk/src/core/index.js";

const freskSDK = new FreskWebSDK({
  appId: "uo8nnevqicasmfu",
  appKey: "123",
  url: "http://127.0.0.1:8090",
  appName: "Test App",
  version: "0.0.1",
  environment: "development",
});

export default freskSDK;