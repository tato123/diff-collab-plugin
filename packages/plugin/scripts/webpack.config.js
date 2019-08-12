const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const babel = require("./babel.config");
const AdobeXdPlugin = require("./webpack.adobexd.plugin");
const Dotenv = require("dotenv-webpack");

const OUTPUT = path.resolve(__dirname, "../dist");
const ENV_FILE = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
console.log("Loading configuration", ENV_FILE);

module.exports = {
  entry: {
    main: "./src/main.js"
  },
  mode: process.env.NODE_ENV || "production",
  output: {
    path: OUTPUT,
    filename: "[name].js",
    libraryTarget: "commonjs2"
  },
  devtool: "none", // prevent webpack from using eval() on my module
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          ...babel
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  externals: {
    scenegraph: "scenegraph",
    application: "application",
    uxp: "uxp"
  },
  plugins: [
    new Dotenv({
      path: ENV_FILE
    }),
    new CopyWebpackPlugin([
      "src/manifest.json",
      { from: "src/images", to: "images" }
    ]),
    new AdobeXdPlugin()
  ]
};
