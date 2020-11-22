const commonConfig = require('./webpack.common.js');
const { merge } = require("webpack-merge");

let prodConfig = {
    mode: "production",
    devtool: "cheap-module-source-map"
}

module.exports = merge(commonConfig, prodConfig)