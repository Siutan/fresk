import crypto from "crypto";
import fs from "fs";
import fetch from "cross-fetch";
import { ansi256 } from "ansis";

/**
 * Uploads a bundle to the Fresk server.
 *
 * @param {Object} options - The options for uploading the bundle.
 * @param {string} options.appId - The application ID for authentication.
 * @param {string} options.appKey - The application key for authentication.
 * @param {string} options.endpoint - The application endpoint to upload the bundle to.
 * @param {string} options.version - The version of the app.
 * @param {string} options.environment - The environment (e.g., production, staging, development, etc).
 * @param {boolean} options.verbose - Whether to log verbose output.
 * @returns {Promise<string | null>} - Returns the bundle id if successful, null otherwise.
 */
export const createBundle = async (options) => {
  const { appKey, appId, endpoint, version, environment, verbose } = options;

  verbose && consoleInfo(`Creating bundle`);
  const response = await fetch(`${endpoint}/bundle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${appId}:${appKey}`,
    },
    body: JSON.stringify({
      version: version,
      environment: environment,
    }),
  });

  if (!response.ok) {
    consoleInfo(
      `Failed to create bundle: ${version} with status: ${response.status}`
    );
    return null;
  }

  // get the body of the response
  const body = await response.json();

  if (options.verbose) {
    consoleInfo(`Created bundle: ${body.bundle_id}`);
  }

  return body.bundle_id;
};

/**
 * Uploads a source map to the specified endpoint.
 *
 * @param {Object} options - The options for uploading the source map.
 * @param {string} options.endpoint - The endpoint to upload the source map to.
 * @param {string} options.appKey - The application key for authentication.
 * @param {string} options.appId - The application ID for authentication.
 * @param {boolean} options.verbose - Whether to log verbose output.
 * @param {string} options.filename - The name of the source map file.
 * @param {string} options.filePath - The path to the source map file.
 * @param {string} options.bundleId - The bundle ID of the application.
 * @returns {Promise<boolean>} - Returns true if the upload was successful, false otherwise.
 */
export const uploadSourceMap = async (options) => {
  const { appKey, appId, endpoint, verbose, filename, filePath, bundleId } =
    options;
  let success = true;
  verbose && consoleInfo(`Uploading ${filename} to Fresk server`);
  const response = await fetch(`${endpoint}/sourcemap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${appId}:${appKey}`,
    },
    body: JSON.stringify({
      file_name: filename,
      map: fs.readFileSync(filePath),
      bundleId: bundleId,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(data);
    success = false;
    consoleInfo(
      `Failed to upload source map: ${filename} with status: ${response.status}`
    );
  }

  if (options.verbose) {
    consoleInfo(`Uploaded ${filename} to Fresk server`);
  }

  return success;
};

/**
 * Generates a snippet of code that assigns the bundle ID to a global variable.
 *
 * @param {string} bundleId - The bundle ID to assign.
 * @param {string} appName - The name of the application.
 * @returns {string} - The generated snippet of code.
 */
export const freskBundleIdSnippet = (bundleId, appName) => {
  appName = appName.replace(/ /g, "_");
  return `(function(){try{var g=typeof window!=="undefined"?window:typeof global!=="undefined"?global:typeof self!=="undefined"?self:{};g["__freskBundleId_${appName}"]="${bundleId}"}catch(l){}})();`;
};

/**
 * Logs a message to the console with a blue color.
 *
 * @param {string} message - The message to log.
 */
export const consoleInfo = (message) =>
  console.info(ansi256(24)`[FRESK] ${message}`);

/**
 * Logs an error to the console with a blue color.
 *
 * @param {string} message - The message to log.
 */
export const consoleError = (message) =>
  console.error(ansi256(31)`[FRESK] ${message}`);
