import MagicString from "magic-string";

import {
  freskBundleIdSnippet,
  createBundle,
  consoleInfoBlue,
  uploadSourceMap,
} from "../shared/bundler";
/**
 * @param {FreskPluginOptions} pluginOptions - The options for the Fresk plugin.
 * @property {string} appId - The application ID for authentication.
 * @property {string} appKey - The application key for authentication.
 * @property {string} appName - The name of the application.
 * @property {string} endpoint - The endpoint to upload the bundle to.
 * @property {string} [environment] - The environment (e.g., production, staging, development, etc).
 * @property {string} [version] - The version of the app.
 * @property {string[]} [outputFiles] - The list of output files.
 * @property {boolean} [deleteMapsAfterBuild] - Whether to delete source maps after the build.
 * @property {boolean} [verbose] - Whether to log verbose output.
 * @returns {Promise<Plugin>}
 */
export default async function freskPlugin(pluginOptions) {
  const {
    endpoint,
    appId,
    appKey,
    appName,
    environment,
    version,
    deleteMapsAfterBuild,
    outputFiles,
    verbose,
  } = pluginOptions;
  if (environment === "development") {
    consoleInfoBlue("Sourcemaps and/or bundles are not created in development");
    return;
  }
  const bundleId = await createBundle({
    appId,
    appKey,
    endpoint,
    environment: environment ? environment : "PROD",
    verbose,
    version: version ? version : "unknown",
  });
  if (!bundleId) {
    consoleInfoBlue("Failed to create bundle, ternimating upload.");
    return;
  }

  return {
    name: "vite-plugin-fresk",
    /**
     * Renders a chunk of code and generates a source map with a bundleId code snippet injected at the end.
     * @param code The original code of the chunk.
     * @param chunk The chunk object containing information about the file.
     * @returns An object with the rendered code and the generated source map, or null if the chunk's file extension does not match the patterns.
     */
    renderChunk(code, chunk) {
      verbose ?? consoleInfoBlue("renderChunk");
      if (chunk.fileName.match(/\.(js|ts|jsx|tsx|mjs|cjs)$/)) {
        const newCode = new MagicString(code);

        newCode.prepend(freskBundleIdSnippet(bundleId, appName));

        const map = newCode.generateMap({
          source: chunk.fileName,
          file: `${chunk.fileName}.map`,
        });

        return {
          code: newCode.toString(),
          map,
        };
      }

      return null;
    },
    async writeBundle(options, bundle) {
      const uploadedSourcemaps = [];

      try {
        const outputPath = options.dir;

        for (let filename in bundle) {
          // only upload sourcemaps or contents in the outputFiles list
          if (
            outputFiles?.length
              ? !outputFiles.map((o) => o + ".map").includes(filename)
              : !filename.endsWith(".map")
          ) {
            continue;
          }
          const result = await uploadSourceMap({
            bundleId,
            appId,
            appKey,
            endpoint,
            filename,
            filePath: `${outputPath}/${filename}`,
            verbose: verbose,
          });

          if (result) {
            uploadedSourcemaps.push(filename);
          }
        }

        // Delete source maps after build if specified
        if (deleteMapsAfterBuild) {
          for (const mapFile of sourcemapFiles) {
            const mapPath = path.join(sourcemapDir, mapFile);
            fs.unlinkSync(mapPath);
            console.log(`Deleted source map: ${mapPath}`);
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (uploadedSourcemaps.length && verbose) {
        consoleInfoBlue(
          `Uploaded sourcemaps: ${uploadedSourcemaps
            .map((map) => map.split("/").pop())
            .join(", ")}`
        );
      }
    },
  };
}
