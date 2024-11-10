import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import nodePolyfills from "rollup-plugin-polyfill-node";
import packageJson from "./package.json" assert { type: "json" };

// TODO: optimise dependencies
const extensions = [".js"];

export default [
  // configuration for the parser
  {
    input: "src/core/parser.js",
    external: [...Object.keys(packageJson.dependencies)],
    output: {
      file: "core/parser.js",
      format: "esm",
    },
    plugins: [
      commonjs({
        include: /node_modules/,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      resolve({
        extensions,
        rootDir: "./src",
        preferBuiltins: true,
      }),
      terser(),
      nodePolyfills(),
    ],
  },
  // Configuration for the core SDK
  {
    input: "src/core/index.js",
    external: [...Object.keys(packageJson.dependencies)],
    output: {
      file: "core/index.js",
      format: "esm",
      name: "FreskWebSDK", // Global variable name for the core SDK
    },
    plugins: [
      commonjs({
        include: /node_modules/,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      resolve({
        extensions,
        rootDir: "./src",
        preferBuiltins: true,
      }),
      terser(),
      nodePolyfills(),
    ],
  },
  // Configuration for the Vite plugin
  {
    input: "src/vite/index.js",
    external: [...Object.keys(packageJson.dependencies)],
    output: {
      file: "vite/index.js",
      format: "esm",
      exports: "named",
    },
    plugins: [
      commonjs({
        include: /node_modules/,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      resolve({
        extensions,
        rootDir: "./src",
        preferBuiltins: true,
      }),
      terser(),
    ],
  },
  // Configuration for the shared bundler utilities
  {
    input: "src/shared/bundler.js",
    external: [...Object.keys(packageJson.dependencies)],
    output: {
      file: "shared/bundler.js",
      format: "esm",
      exports: "named",
    },
    plugins: [
      commonjs({
        include: /node_modules/,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      json(),
      resolve({
        extensions,
        rootDir: "./src",
        preferBuiltins: true,
      }),
      terser(),
    ],
  },
];
