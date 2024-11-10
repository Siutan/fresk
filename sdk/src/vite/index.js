import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} FreskPluginOptions
 * @property {Object} sdkConfig
 * @property {string} sdkConfig.appId
 * @property {string} sdkConfig.appKey
 * @property {string} sdkConfig.url
 * @property {string} sdkConfig.appEnvironment
 * @property {string} [sourcemapDir]
 * @property {boolean} [deleteMapsAfterBuild]
 */

/**
 * @param {FreskPluginOptions} options
 * @returns {Plugin}
 */
export default function freskPlugin(options) {
  let sourcemapDir;

  // make sure the sdkConfig is available
  if (!options.sdkConfig) {
    throw new Error("sdkConfig is required");
  }

  // loop through sdkConfig and throw error if any required fields are missing
  for (const key in options.sdkConfig) {
    if (!options.sdkConfig[key]) {
      throw new Error(`sdkConfig is missing required field: ${key}`);
    }
  }

  return {
    name: "vite-plugin-fresk",
    apply: "build",
    configResolved(config) {
      sourcemapDir = options.sourcemapDir || config.build.outDir;
      if (config.command !== "build") {
        console.warn(
          "The Fresk Vite plugin is only compatible with the 'build' command. Skipping..."
        );
        return;
      }
    },
    async buildStart() {
      // Read the SDK file
      console.log(__dirname);
      const sdkPath = path.resolve(__dirname, "./core/index.js");
      const sdkContent = await fs.promises.readFile(sdkPath, "utf-8");

      // Add the SDK file to the build pipeline
      this.emitFile({
        type: "asset",
        fileName: "fresk-sdk.js",
        source: sdkContent,
      });
    },
    async writeBundle() {
      const sourcemapFiles = fs
        .readdirSync(sourcemapDir, { withFileTypes: true })
        .flatMap((dirent) =>
          dirent.isDirectory()
            ? fs
                .readdirSync(path.join(sourcemapDir, dirent.name))
                .filter((file) => file.endsWith(".map"))
                .map((file) => path.join(dirent.name, file))
            : dirent.name.endsWith(".map")
            ? [dirent.name]
            : []
        );

      for (const mapFile of sourcemapFiles) {
        const mapPath = path.join(sourcemapDir, mapFile);
        const mapContent = fs.readFileSync(mapPath, "utf-8");
        // store the SourceMapConsumer for each file in the db
        const data = {
          file_name: mapFile,
          map: JSON.parse(mapContent),
        };

        // add the data to the database
        fetch(`${options.sdkConfig.url}/push-source-map`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Id": options.sdkConfig.appId,
            "X-App-Key": options.sdkConfig.appKey,
          },
          body: JSON.stringify(data),
        }).then((response) => {
          if (!response.ok) {
            console.error(
              "Failed to add source map to database:",
              response.status
            );
            return;
          }
          response.json().then((data) => {
            console.log("Source map added to database:", data);
          });
        });
      }

      // Delete source maps after build if specified
      if (options.deleteMapsAfterBuild) {
        for (const mapFile of sourcemapFiles) {
          const mapPath = path.join(sourcemapDir, mapFile);
          fs.unlinkSync(mapPath);
          console.log(`Deleted source map: ${mapPath}`);
        }
      }
    },
  };
}

export { freskPlugin };
