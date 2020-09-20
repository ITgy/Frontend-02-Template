module.exports = {
    entry: "./main.js",
    devServer: {
        contentBase:'./dist'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        ["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]
                    ]
                }
            }
        }]
    },
    mode: "development"
}