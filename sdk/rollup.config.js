import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default [
  // Configuration for the core SDK
  {
    input: "src/core/index.js",
    output: {
      file: "dist/core/index.js",
      format: "esm", // Immediately Invoked Function Expression
      name: "FreskWebSDK", // Global variable name for the core SDK
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      terser(), // Optional: minify the output
      nodePolyfills(), // Adds polyfills for Node.js APIs
    ],
  },
  // Configuration for the Vite plugin
  {
    input: "src/vite/index.js",
    output: {
      file: "dist/vite/index.js",
      format: "esm", // CommonJS, suitable for Node.js
      exports: "named",
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      terser(), // Optional: minify the output
      nodePolyfills(), // Adds polyfills for Node.js APIs
    ],
  },
  // Configuration for the mod.js
  {
    input: "src/mod.js",
    output: {
      file: "dist/mod.js",
      format: "esm", // ES Module format
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      terser(), // Optional: minify the output
    ],
  },
];
