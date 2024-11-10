# Fresk Web SDK

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- Bun 1.x or higher

### Installation

To install dependencies:

```bash
bun install
```

To test the SDK:

```bash
bun run test
```

To build the SDK:

```bash
bun run build
```

## Usage

### Importing the SDK

Import the SDK in your project:

```javascript
import FreskWebSDK from "fresk-web-sdk/core";
```

### Initializing the SDK

The SDK must be initialized before it can be used.

Initialize the SDK in your project:

```javascript
const freskSDK = new FreskWebSDK({
  appId: "your_app_id",
  appKey: "your_app_key",
  appName: "your_app_name",
  endpoint: "your_fresk_server_url",
  version: "your_app_version",
  environment: "your_app_environment",
});

freskSDK.init();
```

The recommended way is to create a new instance of the SDK, and then initialise it in your main entry point.
Then you can use the SDK anywhere in your application by importing it and calling the `identify` or any other method.
eg.
```javascript
// fresk-instance.js
import FreskWebSDK from "fresk-web-sdk/core";

const freskSDK = new FreskWebSDK({
  appId: "your_app_id",
  appKey: "your_app_key",
  appName: "your_app_name",
  endpoint: "your_fresk_server_url",
  version: "your_app_version",
  environment: "your_app_environment",
});

export default freskSDK;
```

```javascript
// main.js
import freskSDK from "./fresk-instance.js";

freskSDK.init();
```

```javascript
// login.js
import freskSDK from "./fresk-instance.js";

const afterLogin = (email) => {
  freskSDK.identify(email);
};
```

## SSR (Server-Side Rendering)

The SDK depends on the window object, which is not available in server-side rendering (SSR) environments.
Support for SSR is planned for a future release.

## Source Maps

You can configure the SDK to send source maps to the Fresk server for improved debugging experience.
Currently we only support Vite, but we plan to support other frameworks in the future.

Follow these steps to enable source maps:

1. in your `vite.config.js` file, add the following plugin:

```javascript
import { FreskPluginVite } from "fresk-web-sdk/vite";

const freskConfig = {
      appId: "your_app_id",
      appKey: "your_app_key",
      appName: "your_app_name",
      endpoint: "your_fresk_server_url",
      version: "your_app_version",
      environment: "your_app_environment",
      verbose: true, // optional
    }
    
export default defineConfig({
  plugins: [
    FreskPluginVite(freskConfig), // add to vite plugins
  ],
});

```
Then when you build, it will send the source maps to the Fresk server.

### Identifying Users

Identify users by their email address:

```javascript
freskSDK.identify("user@example.com");
```

### Resetting the Session

Reset the session:

```javascript
freskSDK.reset();
```

### Capturing Errors

The SDK automatically captures errors and sends them to the Fresk server for analysis.

