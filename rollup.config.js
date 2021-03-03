import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import versionInjector from 'rollup-plugin-version-injector';
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    output: {
      name: "reorder",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      resolve(),
      commonjs(),
      versionInjector(),
      terser()
    ]
  },
  {
    input: "src/index.js",
    external: ["@sgratzl/science"],
    output: {
      file: pkg.main,
      format: "cjs"
    },
    plugins: [
      versionInjector()
    ]
  },
  {
    input: "src/index.js",
    external: ["@sgratzl/science"],
    output: {
      file: pkg.module,
      format: "es"
    },
    plugins: [
      versionInjector()
    ]
  }
];

