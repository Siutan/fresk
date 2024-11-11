import MagicString from "magic-string";
import { promises as fs } from 'fs';
import path from 'path';
import {
  freskBundleIdSnippet,
  createBundle,
  consoleInfo,
  consoleError,
  uploadSourceMap,
} from "../shared/bundler";

const FILE_EXTENSION_REGEX = /\.(js|ts|jsx|tsx|mjs|cjs)$/;

/**
 * @typedef {Object} FreskPluginOptions
 * @property {string} appId - The application ID for authentication.
 * @property {string} appKey - The application key for authentication.
 * @property {string} appName - The name of the application.
 * @property {string} endpoint - The endpoint to upload the bundle to.
 * @property {string} [environment] - The environment (e.g., production, staging, development).
 * @property {string} [version] - The version of the app.
 * @property {string[]} [outputFiles] - The list of output files.
 * @property {boolean} [deleteMapsAfterBuild] - Whether to delete source maps after build.
 * @property {boolean} [verbose] - Whether to log verbose output.
 */

/**
 * Validates required plugin options
 * @param {FreskPluginOptions} options 
 * @throws {Error} If required options are missing
 */
function validateOptions(options) {
  const required = ['appId', 'appKey', 'appName', 'endpoint'];
  const missing = required.filter(key => !options[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required options: ${missing.join(', ')}`);
  }
}

/**
 * Creates a Vite plugin for Fresk source map handling
 * @param {FreskPluginOptions} pluginOptions
 * @returns {Promise<import('vite').Plugin>}
 */
export default async function freskPlugin(pluginOptions) {
  validateOptions(pluginOptions);

  const {
    endpoint,
    appId,
    appKey,
    appName,
    environment = 'PROD',
    version = 'unknown',
    deleteMapsAfterBuild = false,
    outputFiles = [],
    verbose = false,
  } = pluginOptions;

  // Return a no-op plugin in development
  if (environment === "development") {
    consoleInfo("Sourcemaps and/or bundles are not created in development");
    return {
      name: "vite-plugin-fresk",
      renderChunk: () => null,
      writeBundle: () => Promise.resolve(),
    };
  }

  const bundleId = await createBundle({
    appId,
    appKey,
    endpoint,
    environment,
    verbose,
    version,
  });

  if (!bundleId) {
    throw new Error("Failed to create bundle");
  }

  const uploadedMaps = new Set();

  return {
    name: "vite-plugin-fresk",
    
    renderChunk(code, chunk) {
      if (!FILE_EXTENSION_REGEX.test(chunk.fileName)) {
        return null;
      }

      const newCode = new MagicString(code);
      newCode.prepend(freskBundleIdSnippet(bundleId, appName));

      const map = newCode.generateMap({
        source: chunk.fileName,
        file: `${chunk.fileName}.map`,
        includeContent: true,
      });

      return {
        code: newCode.toString(),
        map,
      };
    },

    async writeBundle(options, bundle) {
      const outputPath = options.dir;
      const failedUploads = [];

      try {
        for (const [filename, chunk] of Object.entries(bundle)) {
          if (!shouldProcessFile(filename, outputFiles)) {
            continue;
          }

          try {
            const result = await uploadSourceMap({
              bundleId,
              appId,
              appKey,
              endpoint,
              filename,
              filePath: path.join(outputPath, filename),
              verbose,
            });

            if (result) {
              uploadedMaps.add(filename);
            } else {
              failedUploads.push(filename);
            }
          } catch (error) {
            consoleError(`Failed to upload ${filename}: ${error.message}`);
            failedUploads.push(filename);
          }
        }

        if (failedUploads.length > 0) {
          throw new Error(`Failed to upload some sourcemaps: ${failedUploads.join(', ')}`);
        }

        if (deleteMapsAfterBuild) {
          await deleteSourceMaps(outputPath, uploadedMaps);
        }

        if (verbose && uploadedMaps.size > 0) {
          consoleInfo(
            `Uploaded sourcemaps: ${Array.from(uploadedMaps)
              .map((map) => path.basename(map))
              .join(", ")}`
          );
        }
      } catch (error) {
        consoleError(`Bundle processing failed: ${error.message}`);
        throw error; // Re-throw to indicate build failure
      }
    },
  };
}

/**
 * Determines if a file should be processed based on configuration
 * @param {string} filename 
 * @param {string[]} outputFiles 
 * @returns {boolean}
 */
function shouldProcessFile(filename, outputFiles) {
  if (!filename.endsWith('.map')) {
    return false;
  }

  if (outputFiles.length === 0) {
    return true;
  }

  return outputFiles.some(pattern => 
    filename === pattern + '.map' || 
    filename.startsWith(pattern + '/')
  );
}

/**
 * Deletes uploaded source maps
 * @param {string} outputPath 
 * @param {Set<string>} uploadedMaps 
 */
async function deleteSourceMaps(outputPath, uploadedMaps) {
  const deletionPromises = Array.from(uploadedMaps).map(async (mapFile) => {
    const mapPath = path.join(outputPath, mapFile);
    try {
      await fs.unlink(mapPath);
      consoleInfo(`Deleted source map: ${mapPath}`);
    } catch (error) {
      consoleError(`Failed to delete ${mapPath}: ${error.message}`);
    }
  });

  await Promise.all(deletionPromises);
}