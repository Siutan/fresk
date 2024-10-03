/**
 * @jest-environment jsdom
 */

import FreskWebSDK from "../src/core/index";
import Bowser from "bowser";

const crypto = require("crypto");

Object.defineProperty(globalThis, "crypto", {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
    randomUUID: () => crypto.randomBytes(16).toString("hex"),
  },
});

Object.defineProperty(window, "performance", {
  value: {
    getEntriesByType: jest.fn((type) => {
      if (type === "paint") {
        return [
          { name: "first-paint", startTime: 1234 },
          { name: "first-contentful-paint", startTime: 5678 },
        ];
      }
      if (type === "navigation") {
        return [
          {
            domComplete: 2000,
            loadEventEnd: 2500,
            responseStart: 500,
            domInteractive: 1500,
            startTime: 0,
          },
        ];
      }
      return [];
    }),
  },
  configurable: true, // This allows re-defining the property if necessary
});

jest.mock("Bowser", () => ({
  getParser: jest.fn().mockReturnValue({
    getPlatform: () => ({ type: "desktop" }),
    getBrowser: () => ({ name: "Chrome", version: "91.0.4472.114" }),
    getOS: () => ({ name: "macOS", version: "10.15.7" }),
  }),
}));

describe("FreskWebSDK", () => {
  let sdk;
  const mockConfig = {
    appId: "uo8nnevqicasmfu",
    appKey: "123",
    url: "https://api.example.com",
    appName: "Test App",
    appVersion: "1.0.0",
    appEnvironment: "test",
    buildId: "anjqpzt93ict0dx",
  };
  beforeEach(() => {
    // Mock window.fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true, // Set to false if you want to test error handling
        status: 200, // Mock status code
        json: () => Promise.resolve({}),
      })
    );

    // Mock global objects
    global.window = {
      onerror: null,
      onunhandledrejection: null,
      addEventListener: jest.fn(), // Make sure it's properly mocked
      fetch: jest.fn(),
      performance: {
        getEntriesByType: jest.fn().mockReturnValue([]),
      },
      innerWidth: 1024,
      innerHeight: 768,
    };
    global.document = {
      referrer: "http://example.com",
    };
    global.navigator = {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      language: "en-US",
    };
    global.screen = {
      width: 1920,
      height: 1080,
    };

    // Initialize SDK
    sdk = new FreskWebSDK(mockConfig);
    sdk.init();
    jest.spyOn(window, "addEventListener");
    jest.spyOn(sdk, "pushError").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("constructor initializes with correct config", () => {
    expect(sdk.appId).toBe(mockConfig.appId);
    expect(sdk.appKey).toBe(mockConfig.appKey);
    expect(sdk.appUrl).toBe("https://api.example.com");
  });

  test("hookErrors sets up global error handlers", () => {
    expect(typeof window.onerror).toBe("function");
    expect(window.addEventListener).toHaveBeenCalledWith(
      "error",
      expect.any(Function)
    );
  });

  test("hookUnhandledRejections sets up unhandled rejection handler", () => {
    expect(typeof window.onunhandledrejection).toBe("function");
  });

  test("handleUnhandledError calls pushError with correct data", () => {
    const error = new Error("Test error");
    sdk.handleUnhandledError(
      "test",
      "Test error",
      "http://example.com",
      1,
      1,
      error
    );
    expect(sdk.pushError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Test error",
        url: "http://example.com",
        line: 1,
        column: 1,
        kind: "test",
      })
    );
  });

  test("handleNetworkError calls pushError with correct data", () => {
    sdk.handleNetworkError("xhr", "http://api.example.com", 404);
    expect(sdk.pushError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "XHR request failed",
        url: "http://api.example.com",
        kind: "network_error",
        custom: { type: "xhr", status: 404 },
      })
    );
  });

  test("getStackTrace returns a stack trace", () => {
    const error = new Error("Test error");
    const stackTrace = sdk.getStackTrace(error);
    expect(stackTrace).toContain("Error: Test error");
  });

  test("captureClientInfo gathers correct client information", () => {
    sdk.captureClientInfo();
    expect(sdk.clientInfo).toEqual(
      expect.objectContaining({
        user_agent: expect.any(String), // userAgent may differ
        language: "en-US",
        screen_size: "0x0", // Adjust for JSDOM environment
        viewport_size: "1024x768",
        browser_name: "Chrome",
        browser_version: "91.0.4472.114",
        os_name: "macOS",
        os_version: "10.15.7",
        platform: "desktop",
      })
    );
  });

  test("addBreadcrumb adds breadcrumb to the list", () => {
    sdk.addBreadcrumb("test", "Test breadcrumb", { key: "value" });
    expect(sdk.breadcrumbs).toHaveLength(1);
    expect(sdk.breadcrumbs[0]).toEqual(
      expect.objectContaining({
        category: "test",
        message: "Test breadcrumb",
        data: { key: "value" },
      })
    );
  });

  test("createErrorPayload returns correct payload structure", () => {
    const errorData = {
      message: "Test error",
      kind: "test",
      stacktrace: "Error: Test error\n    at line 1",
    };
    const payload = sdk.createErrorPayload(errorData);
    expect(payload).toEqual(
      expect.objectContaining({
        app_id: mockConfig.appId,
        app_version: mockConfig.appVersion,
        build_id: mockConfig.buildId,
        app_environment: mockConfig.appEnvironment,
        log_type: "test",
        value: "Test error",
        stacktrace: "Error: Test error\n    at line 1",
        breadcrumbs: expect.any(Array),
      })
    );
  });

// test("sendError sends error to the server", async () => {
//   const errorData = {
//     message: "Network error occurred",
//     kind: "network_error",
//     stacktrace: "Error: Network error\n    at line 1",
//   };

//   // Simulate sending an error
//   await sdk.reportError(errorData);

//   // Check if fetch was called with the correct URL and payload
//   expect(global.fetch).toHaveBeenCalledWith(
//     `${mockConfig.url}/sendError`,
//     expect.objectContaining({
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-App-Id": mockConfig.appId,
//         "X-App-Key": mockConfig.appKey,
//       },
//       body: expect.stringContaining(JSON.stringify({
//         ...sdk.createErrorPayload(errorData),
//         time: expect.any(Number), // time should be a number
//       })),
//     })
//   );
// });

});
