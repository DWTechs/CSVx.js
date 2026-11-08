import dts from "rollup-plugin-dts";

const config = {
  input: "build/es6/csvx.js",
  output: {
    name: "csvx",
    file: "build/csvx.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard"
  ],
  plugins: []
};

const dtsConfig = {
  input: "build/es6/csvx.d.ts",
  output: {
    file: "build/csvx.d.ts",
    format: "es"
  },
  plugins: [dts()]
};

export default [config, dtsConfig];
