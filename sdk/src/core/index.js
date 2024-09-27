import Bowser from "bowser";

const SDK_VERSION = "0.1.38";

/**
 * @typedef {Object} Config
 * @property {string} appId
 * @property {string} appKey
 * @property {string} url
 * @property {string} appName
 * @property {string} appVersion
 * @property {string} appEnvironment
 * @property {string} buildId
 */

/**
 * @typedef {Object} ErrorData
 * @property {string} message
 * @property {string} [url]
 * @property {number} [line]
 * @property {number} [column]
 * @property {string} [stacktrace]
 * @property {string} kind
 * @property {any} [custom]
 */

/**
 * @typedef {Object} PayloadData
 * @property {string} app_id
 * @property {string} app_version
 * @property {string} build_id
 * @property {string} app_environment
 * @property {string} session_id
 * @property {string} session_email
 * @property {string} device_type
 * @property {string} browser_name
 * @property {string} browser_os
 * @property {string} browser_version
 * @property {string} page_id
 * @property {string} page_url
 * @property {string} screen_resolution
 * @property {string} viewport_size
 * @property {number|null} memory_usage
 * @property {string} network_type
 * @property {string} language
 * @property {string} time_zone
 * @property {string|null} referrer
 * @property {Performance|null} performance_metrics
 * @property {string} sdk_version
 * @property {number} time
 * @property {string} kind
 * @property {string} value
 * @property {string} stacktrace
 * @property {any} custom
 */

class FreskWebSDK {
  /** @type {string} */
  appId;
  /** @type {string} */
  appKey;
  /** @type {string} */
  appVersion;
  /** @type {string} */
  appEnvironment;
  /** @type {string} */
  appUrl;
  /** @type {string} */
  buildId;
  /** @type {number} */
  retryLimit;
  /** @type {number} */
  retryCount;
  /** @type {Parser.Parser} */
  browser;
  /** @type {boolean} */
  isHandlingError;

  /**
   * @param {Config} config
   */
  constructor(config) {
    for (const key in config) {
      if (!config[key]) {
        throw new Error(`Config is missing required field: ${key}`);
      }
    }

    this.appId = config.appId;
    this.appKey = config.appKey;
    this.appUrl = config.url.endsWith("/")
      ? config.url.slice(0, -1)
      : config.url;
    this.appVersion = config.appVersion;
    this.appEnvironment = config.appEnvironment;
    this.buildId = config.buildId;

    this.retryLimit = 5; // Max number of retries
    this.retryCount = 0; // Current retry count

    this.browser = Bowser.getParser(window.navigator.userAgent);

    this.isHandlingError = false;
  }

  init() {
    this.hookErrors();
  }

  /** Hook errors to the window object */
  hookErrors() {
    if (typeof window === "undefined") {
      console.error({
        message: "window is undefined",
        kind: "console_error",
        hint: "Fresk needs to be initialized on the client side.",
      });
      return;
    }

    // @ts-ignore
    window.onerror = this.handleUnhandledError.bind(this);
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleConsoleError(...args);
      originalConsoleError.apply(console, args);
    };
  }

  /**
   * @param {string} email
   */
  identify(email) {
    if (!email || !email.includes("@")) {
      return;
    }

    sessionStorage.setItem("session_email", email);
  }

  reset() {
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("session_email");
  }

  /** Handle unhandled errors */
  handleUnhandledError(msg, url, lineNo, columnNo, error) {
    this.pushError({
      message: msg,
      url: url,
      line: lineNo,
      column: columnNo,
      stacktrace: error ? error.stack : "",
      kind: "exception",
    });
  }

  /** Handle console errors */
  handleConsoleError(...args) {
    if (!this.isHandlingError) {
      this.isHandlingError = true;
      this.pushError({
        message: args.join(" "),
        kind: "console_error",
      });
      this.isHandlingError = false;
    }
  }

  /** Push an error to the server */
  pushError(errorData) {
    const payload = this.createErrorPayload(errorData);
    this.sendToServer(payload);
  }

  /**
   * @param {PayloadData} payload
   */
  sendToServer(payload) {
    const sendRequest = () => {
      fetch(`${this.appUrl}/sendError`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Id": this.appId,
          "X-App-Key": this.appKey,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject(
              new Error(`HTTP error! status: ${response.status}`)
            );
          }
          this.retryCount = 0; // Reset retry count on success
        })
        .catch((err) => {
          this.logError(`Failed to send error: ${err.message}`);
          this.retryCount++;
          if (this.retryCount < this.retryLimit) {
            setTimeout(sendRequest, this.retryCount * 1000); // Exponential backoff
          } else {
            this.logError("Max retry attempts reached. Error not sent.");
          }
        });
    };

    sendRequest(); // Initiate the first request
  }

  /**
   * @param {string | ErrorData} message
   */
  logError(message) {
    // Use a native console method to avoid triggering our own error handler
    console.warn("[FreskWebSDK]", message);
  }

  /** Create an error payload */
  createErrorPayload(errorData) {
    return {
      app_id: this.appId,
      app_version: this.appVersion,
      build_id: this.buildId,
      app_environment: this.appEnvironment,
      session_id: this.getSessionId(),
      session_email: this.getSessionEmail(),
      device_type: this.getDeviceType(),
      browser_name: this.getBrowserName(),
      browser_os: this.getBrowserOS(),
      browser_version: this.getBrowserVersion(),
      page_id: this.getPageId(window.location.href),
      page_url: window.location.href,
      screen_resolution: this.getScreenResolution(),
      viewport_size: this.getViewportSize(),
      memory_usage: this.getMemoryUsage(),
      network_type: this.getNetworkType(),
      language: this.getLanguage(),
      time_zone: this.getTimeZone(),
      referrer: document.referrer || null,
      performance_metrics: this.getPerformanceMetrics(),
      sdk_version: SDK_VERSION,
      time: Date.now(),
      log_type: errorData.kind,
      value: errorData.message,
      stacktrace: errorData.stacktrace || "",
      custom: errorData.custom || null,
    };
  }

  /**
   * @param {string} url
   * @returns {string}
   */
  getPageId(url) {
    const urlParts = url.split("/");
    const pageId = urlParts.slice(3).join("/") || "/";
    return pageId;
  }

  /** Get the session id */
  getSessionId() {
    return sessionStorage.getItem("session_id") || this.generateSessionId();
  }

  /** Get the session email */
  getSessionEmail() {
    return sessionStorage.getItem("session_email") || "";
  }

  /** Generate a new session id */
  generateSessionId() {
    const sessionId = crypto.randomUUID();
    sessionStorage.setItem("session_id", sessionId);
    return sessionId;
  }

  /** Get the device type */
  getDeviceType() {
    return this.browser.getPlatform().type || "unknown";
  }

  /** Get the browser name */
  getBrowserName() {
    return this.browser.getBrowser().name || "unknown";
  }

  /** Get the browser version */
  getBrowserVersion() {
    return this.browser.getBrowser().version || "unknown";
  }

  /** Get the browser OS */
  getBrowserOS() {
    return this.browser.getOS().name || "unknown";
  }

  /** Get the screen resolution */
  getScreenResolution() {
    return `${window.screen.width}x${window.screen.height}`;
  }

  /** Get the viewport size */
  getViewportSize() {
    return `${window.innerWidth}x${window.innerHeight}`;
  }

  /** Get the memory usage */
  getMemoryUsage() {
    if ("memory" in performance) {
      return performance.memory.usedJSHeapSize;
    }
    return null;
  }

  /** Get the network type */
  getNetworkType() {
    if ("connection" in navigator && navigator.connection.effectiveType) {
      return navigator.connection.effectiveType;
    }
    return "unknown";
  }

  /** Get the language */
  getLanguage() {
    return navigator.language || "unknown";
  }

  /** Get the time zone */
  getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
  }

  /** Get the performance metrics */
  getPerformanceMetrics() {
    if ("getEntriesByType" in performance) {
      const paintMetrics = performance.getEntriesByType("paint");
      const navigationTiming = performance.getEntriesByType("navigation")[0];

      const resultObj = {
        first_paint: paintMetrics.find(({ name }) => name === "first-paint")
          ?.startTime,
        first_contentful_paint: paintMetrics.find(
          ({ name }) => name === "first-contentful-paint"
        )?.startTime,
        dom_load:
          navigationTiming.domContentLoadedEventEnd -
          navigationTiming.domContentLoadedEventStart,
        load_time:
          navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
      };

      return JSON.stringify(resultObj);
    }
    return null;
  }
}

export default FreskWebSDK;
