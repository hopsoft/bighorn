var webpack = require("webpack");
var path = require("path");

var uglify = process.env.UGLIFY === "true";
var plugins = [];
var filename = "bighorn.js";

if (uglify) {
  filename = "bighorn.min.js";
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
  context: __dirname,
  entry: "./src/tracker",
  target: "web",
  output: {
    path: path.join(__dirname, "dist"),
    filename: filename
  },
  plugins: plugins,
  module: {
    loaders: [
      { test: require.resolve("./src/tracker"), loader: "expose?Bighorn" }
    ]
  }
};
