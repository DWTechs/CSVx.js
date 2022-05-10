import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";

module.exports = {
  input: "src/build/es6/csvx.js",
  output: {
    name: "CSVx",
    file: "src/build/csvx.iife.js",
    format: "iife"
  },
  external: [], // <-- suppresses the warning
  plugins: [
    resolve(),
    commonjs(),
    babel({
      // exclude: "node_modules/**" // only transpile our source code
    })
  ]
};
