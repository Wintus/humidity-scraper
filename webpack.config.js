// import type { Configuration } from "webpack";

const config = {
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".mjs", ".js"],
  },
};

module.exports = config;
