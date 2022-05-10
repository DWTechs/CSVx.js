module.exports = api => {
  const isTest = api.env("test");
  if (isTest) {
    return {
      presets: [
        [
          "@babel/env",
          {
            targets: {
              node: "current"
            }
          }
        ]
      ]
    };
  } else {
    return {
      presets: [
        [
          "@babel/env",
          {
            useBuiltIns: "usage", // alternative mode: "entry"
            corejs: 3, // default would be 2
            debug: true,
            targets: {
              ie: 11,
              browsers: "cover 99.5%",
              esmodules: false
            },
            loose: true
          }
        ]
      ],
      plugins: []
    };
  }
};
