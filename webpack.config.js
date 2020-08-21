const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/client/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["src/client/scss"],
              },
            },
          },
        ],
      },
    ],
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/client/index.html",
    }),
  ],
  resolve: {
    alias: {
      client: path.resolve(__dirname, "src/client/"),
    },
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:8080",
      secure: false,
      changeOrigin: true,
    },
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
};
