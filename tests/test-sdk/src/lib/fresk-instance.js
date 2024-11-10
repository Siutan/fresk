// init fresk sdk
import FreskWebSDK from "fresk-web-sdk/dist/core";

const freskSDK = new FreskWebSDK({
  appId: "uo8nnevqicasmfu",
  appKey: "123",
  url: "http://127.0.0.1:8090",
  appName: "Test App",
  appVersion: "0.0.1",
  appEnvironment: "development",
});

export default freskSDK;