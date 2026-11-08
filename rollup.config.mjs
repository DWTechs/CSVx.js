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

export default config;
