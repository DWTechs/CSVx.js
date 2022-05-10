
module.exports = {
  input: "src/build/es6/csvx.js",
  output: {
    name: "CSVx",
    file: "src/build/csvx.js",
    format: "es"
  },
  external: [
    "@lcluber/weejs",
    "@dwtechs/checkhard"
  ],
  plugins: [
  
  ]
};
