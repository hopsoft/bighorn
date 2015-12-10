var webpack = require("webpack");
var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./lib/tracker",
  target: "web",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bighorn.js"
  },
  module: {
    loaders: [
      { test: require.resolve("./lib/tracker"), loader: "expose?Bighorn" }
    ]
  }
};
