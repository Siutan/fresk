import * as fs from "node:fs";
import * as readline from "node:readline";
import { randomUUID, randomBytes } from "node:crypto";

// generate app id
const appId = randomBytes(4).toString("hex").toUpperCase();

const appKey = randomUUID();

// check if config already exists
if (fs.existsSync("./configs/config.json")) {
  // check if config is valid, if it is, exit
  const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"));
  if (
    config.appName &&
    config.appVersion &&
    config.url &&
    config.appId &&
    config.appKey &&
    config.allowRegistration &&
    config.allowedOrigins
  ) {
    console.log("A valid config file already exists. \nExiting...");
    process.exit(1);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your app name (defaults to my app): ", (appName) => {
  const name = appName || "my app";
  rl.question("Enter your app version (defaults to 1.0.0): ", (appVersion) => {
    const version = appVersion || "1.0.0";
    rl.question(
      "Enter the URL of the Fresk service(defaults to https://example.fresk.dev/): ",
      (url) => {
        const finalUrl = url || "https://example.fresk.dev/";
        rl.question(
          "Enter allowed origins separated by commas (If none are provided, all origins are allowed): ",
          (allowedOrigins) => {
            const finalAllowedOrigins = allowedOrigins || "";
            const config = {
              appName: name,
              appVersion: version,
              url: finalUrl,
              appId: appId,
              appKey: appKey,
              allowRegistration: false,
              allowedOrigins: finalAllowedOrigins ? finalAllowedOrigins.split(",") : [],
            };
            const configString = JSON.stringify(config, null, 2);
            if (!fs.existsSync("./configs")) {
              fs.mkdirSync("./configs", { recursive: true });
            }
            fs.writeFileSync("./configs/config.json", configString);
            console.log("Config file generated successfully!");
            rl.close();
          }
        );
      }
    );
  });
});
