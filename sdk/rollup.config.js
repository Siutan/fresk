import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
//import { terser } from "rollup-plugin-terser";
//import nodePolyfills from "rollup-plugin-polyfill-node";
import packageJson from "./package.json" assert { type: "json" };

const extensions = [".js"];

export default [
  // configuration for the parser
  {
    input: "src/core/parser.js",
    external: [...Object.keys(packageJson.dependencies)],
    output: [
      {
        file: packageJson.main,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        file: packageJson.parser,
        format: "esm",
        name: "FreskWebSDK", // Global variable name for the core SDK
        exports: "named",
        sourcemap: true,
      },
      {
        file: packageJson.vite,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        file: packageJson.shared,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      babel({
        extensions,
        babelHelpers: "bundled",
        include: ["src/**/*"],
        exclude: [/node_modules/, /test/],
      }),
      json(),
      resolve({
        extensions,
        rootDir: "./src",
        preferBuiltins: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
    ],
  },
];
