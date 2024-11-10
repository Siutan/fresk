import Bowser from "bowser";
import * as rrweb from "rrweb";
import { parse } from "./parser";

/**
 * @type {string}
 */
const SDK_VERSION = "0.3.3"

/**
 * @typedef {Object} Config
 * @property {string} appId
 * @property {string} appKey
 * @property {string} appName
 * @property {string} endpoint
 * @property {string} appName
 * @property {string} version
 * @property {string} environment
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
 * @property {string} bundle_id
 * @property {string} app_version
 * @property {string} app_environment
 * @property {string} session_id
 * @property {string} session_email
 * @property {string} device_type
 * @property {string} browser_name
 * @property {string} browser_version
 * @property {string} os_name
 * @property {string} os_version
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
  appName;
  /** @type {string} */
  bundle_id;
  /** @type {string} */
  appVersion;
  /** @type {string} */
  appEnvironment;
  /** @type {string} */
  appEndpoint;
  /** @type {number} */
  retryLimit;
  /** @type {number} */
  retryCount;
  /** @type {Parser.Parser} */
  browser;
  /** @type {any[]} */
  events;

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
    this.appName = config.appName;
    this.bundle_id = this.getBundleId();
    this.appKey = config.appKey;
    this.appEndpoint = config.endpoint.endsWith("/")
      ? config.endpoint.slice(0, -1)
      : config.endpoint;
    this.appVersion = config.version;
    this.appEnvironment = config.environment;

    this.maxRetries = 5;
    this.retryDelay = 30000;

    this.browser = Bowser.getParser(window.navigator.userAgent);

    this.isHandlingError = false;
    this.errorQueue = [];
    this.maxQueueSize = 10;
    this.retryTimeout = null;

    this.sdkSourceRegex = /@fresk\/web-sdk\/mod\.js/;

    this.breadcrumbs = [];
    this.maxBreadcrumbs = 50;

    this.events = [];
  }

  getBundleId() {
    // get bundle id from (global).__freskBundleId_{APPNAME}
    const globalObject =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
        ? self
        : undefined;

    return globalObject?.[`__freskBundleId_${this.appName}`] || null;
  }

  init() {
    this.hookErrors();
    this.hookUnhandledRejections();
    this.wrapTimers();
    this.wrapXHR();
    this.wrapFetch();
    this.captureClientInfo();
    this.startPerformanceMonitoring();

    // disabling recording for now, maybe we can come back to it later
    // this.startRecording();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Public functions //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * @param {string} email
   * @public
   * @description Identify the user by their email address
   */
  identify(email) {
    if (!email || !email.includes("@")) {
      return;
    }

    sessionStorage.setItem("session_email", email);
  }

  /**
   * @public
   * @description Reset the session
   */
  reset() {
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("session_email");
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Hooks & wrappers //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * @private
   * @description Start recording events
   */
  startRecording() {
    rrweb.record({
      emit: (event) => {
        // Use an arrow function to preserve 'this' context
        this.events.push(event);
      },
    });

    // save recording every 10 seconds
    setInterval(this.saveRecording, 10 * 1000);
  }

  /** Hook errors to the window object */
  hookErrors() {
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      this.handleUnhandledError("onerror", msg, url, lineNo, columnNo, error);
    };

    // Capture errors from event listeners
    window.addEventListener("error", (event) => {
      if (event.error) {
        this.handleUnhandledError(
          "addEventListener",
          event.message,
          event.filename,
          event.lineno,
          event.colno,
          event.error
        );
      }
    });

    // Override console.error to capture console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleConsoleError(...args);
      originalConsoleError.apply(console, args);
    };
  }

  /**
   * @private
   * @description Hook unhandled rejections to the window object
   */
  hookUnhandledRejections() {
    window.onunhandledrejection = (event) => {
      const error = event.reason;
      this.handleUnhandledError(
        "unhandledrejection",
        error.message,
        window.location.href,
        0,
        0,
        error
      );
    };
  }

  /**
   * @private
   * @description Wrap setTimeout and setInterval to catch async errors
   */
  wrapTimers() {
    ["setTimeout", "setInterval"].forEach((fnName) => {
      const original = window[fnName];
      window[fnName] = (fn, ...args) => {
        return original(this.wrapCallback(fn, fnName), ...args);
      };
    });
  }

  /**
   * @param {Function} fn
   * @param {string} source
   * @private
   * @description Wrap callback functions to catch errors
   */
  wrapCallback(fn, source) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleUnhandledError(
          source,
          error.message,
          window.location.href,
          0,
          0,
          error
        );
        throw error;
      }
    };
  }

  /**
   * @private
   * @description Wrap XMLHttpRequest to monitor network errors
   */
  wrapXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
      this.addEventListener("error", () => {
        this.handleNetworkError("xhr", args[1]);
      });
      this.addEventListener("load", () => {
        if (this.status >= 400) {
          this.handleNetworkError("xhr", args[1], this.status);
        }
      });
      return originalOpen.apply(this, args);
    };
  }

  // Wrap fetch to monitor network errors
  wrapFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.handleNetworkError("fetch", args[0], response.status);
        }
        return response;
      } catch (error) {
        this.handleNetworkError("fetch", args[0]);
        throw error;
      }
    };
  }

  /**
   * @param {string} source
   * @param {string} msg
   * @param {string} url
   * @param {number} lineNo
   * @param {number} columnNo
   * @param {Error} error
   * @private
   * @description Handle unhandled errors
   */
  handleUnhandledError(source, msg, url, lineNo, columnNo, error) {
    const stacktrace = this.getStackTrace(error);
    const errorData = {
      message: msg,
      url: url,
      line: lineNo,
      column: columnNo,
      stacktrace: stacktrace,
      kind: source,
    };
    console.debug("Pushing error to queue:", errorData);
    this.pushError(errorData);
  }

  /**
   * @param {string} type
   * @param {string} url
   * @param {number} status
   * @private
   * @description Handle network errors
   */
  handleNetworkError(type, url, status = null) {
    const errorData = {
      message: `${type.toUpperCase()} request failed`,
      url: url,
      kind: "network_error",
      custom: { type, status },
    };
    this.pushError(errorData);
  }

  /**
   *
   * @param  {...any} args
   * @private
   * @description Handle console errors
   */
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

  /**
   * @private
   * @description Start monitoring performance metrics and adds breadcrumbs
   */
  startPerformanceMonitoring() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "largest-contentful-paint") {
            this.addBreadcrumb("performance", "Largest Contentful Paint", {
              value: entry.startTime,
            });
          } else if (entry.entryType === "layout-shift") {
            this.addBreadcrumb("performance", "Cumulative Layout Shift", {
              value: entry.value,
            });
          }
        });
      });
      observer.observe({
        entryTypes: ["largest-contentful-paint", "layout-shift"],
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Data processing //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   *
   * @param {Error} error
   * @returns {string}
   * @private
   * @description Get stack trace from error object
   */
  getStackTrace(error) {
    if (error && error.stack) {
      try {
        return parse(error);
      } catch (error) {
        console.error("Error parsing stacktrace:", error);
        return error.stack;
      }
    } else {
      try {
        throw new Error();
      } catch (e) {
        try {
          return parse(e);
        } catch (error) {
          console.error("Error parsing stacktrace:", error);
          return e.stack;
        }
      }
    }
  }

  // Capture detailed client information
  captureClientInfo() {
    this.clientInfo = {
      user_agent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen_size: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      platform: this.browser.getPlatform().type,
      browser_name: this.browser.getBrowser().name,
      browser_version: this.browser.getBrowser().version,
      os_name: this.browser.getOS().name,
      os_version: this.browser.getOS().version,
    };
  }

  // Add a breadcrumb to track user actions and events
  addBreadcrumb(category, message, data = {}) {
    const breadcrumb = {
      timestamp: new Date().toISOString(),
      category,
      message,
      data,
    };
    this.breadcrumbs.push(breadcrumb);
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  createErrorPayload(errorData) {
    return {
      ...this.clientInfo,
      app_id: this.appId,
      bundle_id: this.bundle_id || null,
      app_version: this.appVersion,
      app_environment: this.appEnvironment,
      value: errorData.message,
      stacktrace: errorData.stacktrace || "",
      session_id: this.getSessionId(),
      session_email: this.getSessionEmail(),
      page_id: this.getPageId(window.location.href),
      page_url: window.location.href,
      memory_usage: this.getMemoryUsage(),
      network_type: this.getNetworkType(),
      referrer: document.referrer || null,
      sdk_version: SDK_VERSION,
      time: Date.now(),
      log_type: errorData.kind,
      custom: errorData.custom || null,
      breadcrumbs: this.breadcrumbs,
      performance_metrics: this.getPerformanceMetrics(),
    };
  }

  /** Push an error to the server */
  pushError(errorData) {
    if (this.isReportingError) {
      return;
    }

    if (this.shouldIgnoreError(errorData)) {
      console.debug("Ignoring error from SDK:", errorData.message);
      return;
    }

    const payload = this.createErrorPayload(errorData);

    this.errorQueue.push(payload);
    this.isReportingError = true;
    this.sendNextError();
  }

  sendNextError() {
    if (this.errorQueue.length === 0) {
      console.debug("Error queue is empty");
      this.isReportingError = false;

      return;
    }

    const payload = this.errorQueue[0];
    this.sendToServer(payload, 0);
  }

  reportError(errorData) {
    if (this.isReportingError) {
      return;
    }

    const payload = this.createErrorPayload(errorData);

    this.sendToServer(payload)
      .then(() => {
        console.debug("Error reported successfully");
      })
      .catch((error) => {
        console.warn("Failed to report error:", error);
        // Don't rethrow the error here
      })
      .finally(() => {
        this.isReportingError = false;
        this.processErrorQueue();
      });
  }

  processErrorQueue() {
    if (this.errorQueue.length > 0 && !this.isReportingError) {
      const nextError = this.errorQueue.shift();
      this.reportError(nextError);
    }
  }

  retryFailedReport() {
    if (this.errorQueue.length > 0 && !this.isReportingError) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = setTimeout(() => {
        this.processErrorQueue();
      }, 5000); // Wait 5 seconds before retrying
    }
  }

  /**
   * @param {PayloadData} payload
   * @param {number} retryCount
   * @private
   * @description Send an error to the server
   */
  sendToServer(payload, retryCount) {
    fetch(`${this.appEndpoint}/error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${this.appId}:${this.appKey}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Success: remove the sent error from the queue
        this.errorQueue.shift();
        this.sendNextError();
      })
      .catch((err) => {
        console.warn(`Failed to send error: ${err.message}`);
        if (retryCount < this.maxRetries) {
          // Retry after a delay
          setTimeout(() => {
            this.sendToServer(payload, retryCount + 1);
          }, this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        } else {
          // Max retries reached: drop this error and move to the next
          console.error("Max retry attempts reached. Error not sent:", payload);
          this.errorQueue.shift();
          this.sendNextError();
        }
      });
  }

  calculateRetryDelay(retryCount) {
    // Exponential backoff with jitter
    const delay = Math.min(
      this.maxRetryDelay,
      this.initialRetryDelay * Math.pow(2, retryCount)
    );
    return delay + Math.random() * 1000; // Add up to 1 second of random jitter
  }

  handleMaxRetriesReached(payload) {
    // ideas for fallback behavior:
    // 1. Store the error locally and try to send it later
    // 2. send the error to a fallback endpoint (will need to implement this)
    console.error("Failed to send error after multiple attempts:", payload);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Helper functions //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * @param {string | ErrorData} message
   * @private
   * @description checks if the error should be ignored
   */
  shouldIgnoreError(errorData) {
    if (
      errorData.stacktrace &&
      this.sdkSourceRegex.test(errorData.stacktrace)
    ) {
      return true;
    }

    return false;
  }

  /**
   * @param {string} url
   * @returns {string}
   * @private
   * @description Get the page id from the URL
   */
  getPageId(url) {
    const urlParts = url.split("/");
    const pageId = urlParts.slice(3).join("/") || "/";
    return pageId;
  }

  /**
   * @returns {string}
   * @private
   * @description Get the session id
   */
  getSessionId() {
    return sessionStorage.getItem("session_id") || this.generateSessionId();
  }

  /**
   * @returns {string}
   * @private
   * @description Get the session email
   */
  getSessionEmail() {
    return sessionStorage.getItem("session_email") || "";
  }

  /**
   * @returns {string}
   * @private
   * @description Generate a new session id
   */
  generateSessionId() {
    const sessionId = crypto.randomUUID();
    sessionStorage.setItem("session_id", sessionId);
    return sessionId;
  }

  /**
   * @returns {string}
   * @private
   * @description Get memory usage of the device
   */
  getMemoryUsage() {
    if ("memory" in performance) {
      return performance.memory.usedJSHeapSize;
    }
    return null;
  }

  /**
   * @returns {string}
   * @private
   * @description Get the network type
   */
  getNetworkType() {
    if ("connection" in navigator && navigator.connection.effectiveType) {
      return navigator.connection.effectiveType;
    }
    return "unknown";
  }

  /**
   * @returns {string}
   * @private
   * @description Get performance metrics, including first paint, first contentful paint, and load time
   */
  getPerformanceMetrics() {
    const metrics = {};
    if ("performance" in window) {
      const paintMetrics = performance.getEntriesByType("paint");
      const navigationTiming = performance.getEntriesByType("navigation")[0];

      metrics.firstPaint = paintMetrics.find(
        ({ name }) => name === "first-paint"
      )?.startTime;
      metrics.firstContentfulPaint = paintMetrics.find(
        ({ name }) => name === "first-contentful-paint"
      )?.startTime;
      metrics.domLoad =
        navigationTiming.domContentLoadedEventEnd -
        navigationTiming.domContentLoadedEventStart;
      metrics.loadTime =
        navigationTiming.loadEventEnd - navigationTiming.loadEventStart;

      // Include Core Web Vitals if available
      if ("PerformanceObserver" in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const lcpEntry = list.getEntries().at(-1);
          metrics.largestContentfulPaint = lcpEntry.startTime;
        });
        lcpObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });

        let cumulativeLayoutShift = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShift += entry.value;
            }
          }
          metrics.cumulativeLayoutShift = cumulativeLayoutShift;
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });

        const fidObserver = new PerformanceObserver((list) => {
          const fidEntry = list.getEntries()[0];
          metrics.firstInputDelay =
            fidEntry.processingStart - fidEntry.startTime;
        });
        fidObserver.observe({ type: "first-input", buffered: true });
      }
    }
    return metrics;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // DOM Recording //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // this function will send events to the backend and reset the events array
  saveRecording = () => {
    if (this.events.length === 0) {
      console.debug("No events to save");
      return;
    }
    const body = JSON.stringify({
      events: this.events,
      session_id: this.getSessionId(),
    });
    this.events = [];
    fetch(`${this.appEndpoint}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": this.appId,
        "X-App-Key": this.appKey,
      },
      body,
    });
  };
}

export default FreskWebSDK;
